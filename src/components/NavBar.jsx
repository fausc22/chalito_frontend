// src/components/NavBar.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { ROUTES } from '../config/routes';
import logoImg from '../assets/logo-empresa.png';
import './NavBar.css';;

export function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout, userRole } = useAuth();
    const { showSuccess } = useNotification();
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = async () => {
        try {
            await logout();
            showSuccess('Sesión cerrada exitosamente', { duration: 2000 });
            navigate(ROUTES.LOGIN);
        } catch (error) {
            console.error('Error en logout:', error);
        }
        setIsMenuOpen(false);
    };

    const getRoleDisplayName = (role) => {
        const roleNames = {
            'ADMIN': 'Administrador',
            'GERENTE': 'Gerente', 
            'CAJERO': 'Cajero',
            'COCINA': 'Chef'
        };
        return roleNames[role] || role;
    };

    const getRoleIcon = (role) => {
        const roleIcons = {
            'ADMIN': '👑',
            'GERENTE': '👔',
            'CAJERO': '💰',
            'COCINA': '👨‍🍳'
        };
        return roleIcons[role] || '👤';
    };

    return (
        <header className="header">
            <Link to={ROUTES.DASHBOARD} className="logo-link">
                <img 
                    src={logoImg} 
                    alt="Logo El Chalito"
                    className="logo-img"
                />
            </Link>

            {/* Botón hamburguesa - solo visible en móvil */}
            <button 
                className="hamburger-btn"
                onClick={toggleMenu}
                aria-label="Abrir menú"
            >
                <span className={`hamburger-line ${isMenuOpen ? 'active' : ''}`}></span>
                <span className={`hamburger-line ${isMenuOpen ? 'active' : ''}`}></span>
                <span className={`hamburger-line ${isMenuOpen ? 'active' : ''}`}></span>
            </button>

            <nav className={`navbar ${isMenuOpen ? 'navbar-mobile-open' : ''}`}>
                <div className="navbar-content">
                    {/* Enlaces de navegación */}
                    <div className="nav-links">
                        <Link 
                            to={ROUTES.DASHBOARD} 
                            className="nav-link"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            INICIO
                        </Link>
                        
                        {/* Proximamente - Módulos comentados */}
                        <span className="nav-link disabled">
                            MÓDULOS (Próximamente)
                        </span>
                    </div>

                    {/* Información del usuario y logout */}
                    <div className="user-section">
                        <div className="user-info">
                            <div className="user-avatar">
                                {getRoleIcon(userRole)}
                            </div>
                            <div className="user-details">
                                <div className="user-name">{user?.nombre}</div>
                                <div className="user-role">{getRoleDisplayName(userRole)}</div>
                            </div>
                        </div>
                        
                        <button
                            className="logout-btn"
                            onClick={handleLogout}
                            title="Cerrar sesión"
                        >
                            <span className="logout-icon">🚪</span>
                            <span className="logout-text">Cerrar Sesión</span>
                        </button>
                    </div>
                </div>         
            </nav>

            {/* Overlay para cerrar el menú en móvil */}
            {isMenuOpen && (
                <div 
                    className="menu-overlay" 
                    onClick={() => setIsMenuOpen(false)}
                ></div>
            )}
        </header>
    );
}