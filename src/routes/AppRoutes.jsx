// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../config/routes';

// Páginas
import LoginPage from '../pages/LoginPage';
import DashBoardPage from '../pages/DashBoardPage';

// Componentes de protección
import ProtectedRoute from '../components/auth/ProtectedRoute';

const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando aplicación...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Ruta raíz - redirige según autenticación */}
      <Route 
        path="/" 
        element={
          <Navigate 
            to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN} 
            replace 
          />
        } 
      />

      {/* Ruta de login */}
      <Route 
        path={ROUTES.LOGIN} 
        element={
          isAuthenticated ? (
            <Navigate to={ROUTES.DASHBOARD} replace />
          ) : (
            <LoginPage />
          )
        } 
      />

      {/* Rutas protegidas */}
      <Route 
        path={ROUTES.DASHBOARD} 
        element={
          <ProtectedRoute>
            <DashBoardPage />
          </ProtectedRoute>
        } 
      />

      {/* Alias para dashboard */}
      <Route 
        path={ROUTES.HOME} 
        element={<Navigate to={ROUTES.DASHBOARD} replace />} 
      />

      {/* Ruta 404 - cualquier otra ruta */}
      <Route 
        path="*" 
        element={
          <div className="error-page">
            <div className="error-container">
              <h1>404</h1>
              <h2>Página no encontrada</h2>
              <p>La página que buscas no existe.</p>
              <button 
                onClick={() => window.history.back()}
                className="btn-back"
              >
                Volver
              </button>
            </div>
          </div>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;