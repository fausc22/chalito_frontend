// src/components/auth/LoginForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../config/routes';
import './LoginForm.css';

export function LoginForm() {
  const [formData, setFormData] = useState({
    usuario: '',
    password: '',
    remember: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Limpiar errores cuando el componente se monta o los campos cambian
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (error && (name === 'usuario' || name === 'password')) {
      clearError();
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.usuario.trim()) {
      return;
    }
    
    if (!formData.password.trim()) {
      return;
    }

    const result = await login(formData);
    
    if (result.success) {
      // Obtener la ruta a la que se quería acceder originalmente
      const from = location.state?.from || ROUTES.DASHBOARD;
      navigate(from, { replace: true });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-form-container">
      <div className="login-form-box">
        <div className="form-header">
          <h2>Iniciar Sesión</h2>
          <p>Ingresa tus credenciales para acceder al sistema</p>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="usuario">Usuario</label>
            <input 
              type="text" 
              id="usuario"
              name="usuario"
              placeholder="Ingresa tu usuario"
              value={formData.usuario}
              onChange={handleInputChange}
              disabled={isLoading}
              required
              autoComplete="username"
              className={error ? 'error' : ''}
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-input-container">
              <input 
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Ingresa tu contraseña"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                required
                autoComplete="current-password"
                className={error ? 'error' : ''}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                disabled={isLoading}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="checkbox-group">
            <input 
              type="checkbox" 
              id="remember"
              name="remember"
              checked={formData.remember}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <label htmlFor="remember" className="checkbox-label">
              Recordar sesión (7 días)
            </label>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={isLoading || !formData.usuario.trim() || !formData.password.trim()}
            className={`submit-btn ${isLoading ? 'loading' : ''}`}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        {/* Información de prueba - solo en desarrollo */}
        {process.env.NODE_ENV === 'development' && (
          <div className="demo-credentials">
            <h4>Credenciales de prueba:</h4>
            <div className="credential-item">
              <strong>Admin:</strong> admin / admin123
            </div>
            <div className="credential-item">
              <strong>Gerente:</strong> gerente / gerente123
            </div>
            <div className="credential-item">
              <strong>Cajero:</strong> cajero / cajero123
            </div>
            <div className="credential-item">
              <strong>Chef:</strong> chef / cocina123
            </div>
          </div>
        )}
      </div>
    </div>
  );
}