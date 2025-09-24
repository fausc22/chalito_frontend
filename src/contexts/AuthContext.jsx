// src/contexts/AuthContext.jsx
import { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';
import { setNotificationContext } from '../services/api';
import { useNotification } from './NotificationContext';
import { ROLES, ROLE_HIERARCHY } from '../config/api';

// Estados del contexto de autenticación
const AuthContext = createContext();

// Acciones del reducer
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  LOGOUT: 'LOGOUT',
  VERIFY_START: 'VERIFY_START',
  VERIFY_SUCCESS: 'VERIFY_SUCCESS',
  VERIFY_ERROR: 'VERIFY_ERROR',
  UPDATE_USER: 'UPDATE_USER',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Estado inicial
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isVerifying: false,
  error: null,
  loginAttempts: 0
};

// Reducer para manejar estados de autenticación
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        loginAttempts: 0
      };

    case AUTH_ACTIONS.LOGIN_ERROR:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error,
        loginAttempts: state.loginAttempts + 1
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        loginAttempts: 0
      };

    case AUTH_ACTIONS.VERIFY_START:
      return {
        ...state,
        isVerifying: true
      };

    case AUTH_ACTIONS.VERIFY_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        isVerifying: false,
        error: null
      };

    case AUTH_ACTIONS.VERIFY_ERROR:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isVerifying: false,
        error: null // ✅ No mostrar error de verificación en UI
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload.user }
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

// Provider del contexto
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const notification = useNotification();

  // Configurar notificaciones en el API client
  useEffect(() => {
    setNotificationContext(notification);
  }, [notification]);

  // ✅ ARREGLAR: Verificar autenticación al cargar la app
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔍 Inicializando autenticación...');
      
      // Verificar si hay tokens en localStorage
      if (!authService.isAuthenticated()) {
        console.log('❌ No hay tokens válidos');
        dispatch({ 
          type: AUTH_ACTIONS.VERIFY_ERROR, 
          payload: { error: 'No autenticado' } 
        });
        return;
      }

      console.log('✅ Tokens encontrados, verificando con servidor...');
      dispatch({ type: AUTH_ACTIONS.VERIFY_START });
      
      try {
        const result = await authService.verifyToken();
        
        if (result.success && result.user) {
          console.log('✅ Token válido, usuario autenticado:', result.user.usuario);
          dispatch({ 
            type: AUTH_ACTIONS.VERIFY_SUCCESS, 
            payload: { user: result.user } 
          });
        } else {
          console.log('❌ Token inválido o expirado');
          // Limpiar tokens inválidos
          authService.logout();
          dispatch({ 
            type: AUTH_ACTIONS.VERIFY_ERROR, 
            payload: { error: 'Token inválido' } 
          });
        }
      } catch (error) {
        console.log('❌ Error verificando token:', error.message);
        // Limpiar tokens en caso de error
        authService.logout();
        dispatch({ 
          type: AUTH_ACTIONS.VERIFY_ERROR, 
          payload: { error: 'Error de verificación' } 
        });
      }
    };

    initializeAuth();
  }, []); // ✅ Solo se ejecuta al montar el componente

  // Función de login
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    const result = await authService.login(credentials);

    if (result.success) {
      dispatch({ 
        type: AUTH_ACTIONS.LOGIN_SUCCESS, 
        payload: { user: result.user } 
      });
      
      notification.showSuccess(
        `¡Bienvenido ${result.user.nombre}!`, 
        { duration: 3000 }
      );
      
      return { success: true, user: result.user };
    } else {
      dispatch({ 
        type: AUTH_ACTIONS.LOGIN_ERROR, 
        payload: { error: result.message } 
      });
      
      notification.showError(result.message);
      
      return { success: false, message: result.message };
    }
  };

  // Función de logout
  const logout = async () => {
    await authService.logout();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    notification.showInfo('Sesión cerrada correctamente', { duration: 2000 });
  };

  // Función para actualizar datos del usuario
  const updateUser = (userData) => {
    dispatch({ 
      type: AUTH_ACTIONS.UPDATE_USER, 
      payload: { user: userData } 
    });
  };

  // Función para limpiar errores
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Funciones helper para roles
  const hasRole = (role) => {
    return state.user?.rol === role;
  };

  const hasMinimumRole = (minimumRole) => {
    if (!state.user?.rol || !ROLE_HIERARCHY[minimumRole]) {
      return false;
    }
    
    const userRoleLevel = ROLE_HIERARCHY[state.user.rol];
    const minimumRoleLevel = ROLE_HIERARCHY[minimumRole];
    
    return userRoleLevel >= minimumRoleLevel;
  };

  const isAdmin = () => hasRole(ROLES.ADMIN);
  const isGerente = () => hasRole(ROLES.GERENTE) || isAdmin();
  const isCajero = () => hasRole(ROLES.CAJERO) || isGerente();
  const isCocina = () => hasRole(ROLES.COCINA);

  // Valor del contexto
  const value = {
    // Estado
    ...state,
    
    // Acciones
    login,
    logout,
    updateUser,
    clearError,
    
    // Helpers de roles
    hasRole,
    hasMinimumRole,
    isAdmin,
    isGerente,
    isCajero,
    isCocina,
    
    // Datos adicionales
    userRole: state.user?.rol,
    userName: state.user?.nombre,
    userEmail: state.user?.email
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};