// src/components/auth/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../config/routes';

const LoadingScreen = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    flexDirection: 'column',
    gap: '1rem'
  }}>
    <div style={{
      width: '3rem',
      height: '3rem',
      border: '3px solid #e5e7eb',
      borderTop: '3px solid #315e92',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}></div>
    <p style={{ color: '#666', fontSize: '1rem' }}>Verificando autenticación...</p>
  </div>
);

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, isLoading, user, hasRole, hasMinimumRole } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={ROUTES.LOGIN} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Si se requiere un rol específico y el usuario no lo tiene
  if (requiredRole) {
    const hasPermission = Array.isArray(requiredRole)
      ? requiredRole.some(role => hasRole(role))
      : hasRole(requiredRole);

    if (!hasPermission) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: '1rem',
          textAlign: 'center',
          padding: '2rem'
        }}>
          <div style={{ fontSize: '4rem' }}>🚫</div>
          <h2 style={{ color: '#dc2626', margin: 0 }}>Acceso Denegado</h2>
          <p style={{ color: '#666', maxWidth: '400px' }}>
            No tienes los permisos necesarios para acceder a esta página.
            <br />
            <strong>Tu rol:</strong> {user?.rol}
            <br />
            <strong>Rol requerido:</strong> {Array.isArray(requiredRole) ? requiredRole.join(' o ') : requiredRole}
          </p>
          <button
            onClick={() => window.history.back()}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#315e92',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Volver
          </button>
        </div>
      );
    }
  }

  // Si todo está bien, mostrar el contenido
  return children;
};

export default ProtectedRoute;