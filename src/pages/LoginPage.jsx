// src/pages/LoginPage.jsx
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoginForm } from '../components/auth/LoginForm';
import logoImg from '../assets/logo-empresa.png';
import './styles/LoginPage.css';

export default function LoginPage() {
  const { clearError } = useAuth();

  // Limpiar errores al entrar a la página de login
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Configurar título de la página
  useEffect(() => {
    document.title = 'Iniciar Sesión - El Chalito';
    
    return () => {
      document.title = 'El Chalito';
    };
  }, []);

  return (
    <div className="login-container">
      <div className="login-left-side">
        <LoginForm />
      </div>
      <div className="login-right-side">
        <div className="logo-container">
          <img 
            className="logo"
            src={logoImg}
            alt="Logo El Chalito" 
          />
          <div className="welcome-text">
            <h1>¡Bienvenido a El Chalito!</h1>
            <p>Sistema de gestión gastronómica</p>
          </div>
        </div>
      </div>
    </div>
  );
}