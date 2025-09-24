// src/services/authService.js
import { apiRequest, tokenManager } from './api';
import { API_CONFIG } from '../config/api';

export const authService = {
  // Login
  login: async (credentials) => {
    try {
      const { data } = await apiRequest.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
        username: credentials.usuario,
        password: credentials.password,
        remember: credentials.remember || false
      });

      if (data.token) {
        // Guardar tokens y datos del usuario
        tokenManager.setTokens(data.token, data.refreshToken);
        tokenManager.setUserData(data.usuario);
        
        return {
          success: true,
          user: data.usuario,
          hasRefreshToken: data.hasRefreshToken,
          expiresIn: data.expiresIn
        };
      }

      return {
        success: false,
        message: 'Respuesta inválida del servidor'
      };
      
    } catch (error) {
      console.error('Error en login:', error);
      
      const message = error.response?.data?.message || 
                     'Error de conexión. Intenta nuevamente.';
      
      return {
        success: false,
        message
      };
    }
  },

  // Logout
  logout: async () => {
    try {
      await apiRequest.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      // Siempre limpiar tokens localmente
      tokenManager.clearTokens();
    }
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: () => {
    const token = tokenManager.getAccessToken();
    const user = tokenManager.getUserData();
    return !!(token && user);
  },

  // Obtener datos del usuario actual
  getCurrentUser: () => {
    return tokenManager.getUserData();
  },

  // Verificar token con el servidor
  verifyToken: async () => {
    try {
      const { data } = await apiRequest.get(API_CONFIG.ENDPOINTS.AUTH.VERIFY);
      
      if (data.valid && data.usuario) {
        // Actualizar datos del usuario si han cambiado
        tokenManager.setUserData(data.usuario);
        return {
          success: true,
          user: data.usuario
        };
      }
      
      return { success: false };
      
    } catch (error) {
      console.error('Error verificando token:', error);
      return { success: false };
    }
  },

  // Obtener perfil actualizado
  getProfile: async () => {
    try {
      const { data } = await apiRequest.get(API_CONFIG.ENDPOINTS.AUTH.PROFILE);
      
      if (data.usuario) {
        tokenManager.setUserData(data.usuario);
        return {
          success: true,
          user: data.usuario
        };
      }
      
      return {
        success: false,
        message: 'Error obteniendo perfil'
      };
      
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Error de conexión'
      };
    }
  },

  // Cambiar contraseña
  changePassword: async (passwords) => {
    try {
      const { data } = await apiRequest.put(API_CONFIG.ENDPOINTS.AUTH.CHANGE_PASSWORD, {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });

      return {
        success: true,
        message: data.message || 'Contraseña actualizada exitosamente'
      };
      
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Error cambiando contraseña'
      };
    }
  },

  // Refresh token manual (normalmente se hace automáticamente)
  refreshToken: async () => {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const { data } = await apiRequest.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH, {
        refreshToken
      });

      if (data.accessToken) {
        tokenManager.setTokens(data.accessToken);
        
        if (data.usuario) {
          tokenManager.setUserData(data.usuario);
        }

        return {
          success: true,
          user: data.usuario
        };
      }

      return { success: false };
      
    } catch (error) {
      console.error('Error refreshing token:', error);
      tokenManager.clearTokens();
      return { success: false };
    }
  }
};