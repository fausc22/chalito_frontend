// src/pages/DashBoardPage.jsx
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import './styles/DashBoardPage.css';

export default function DashBoardPage() {
    const { user, userRole, userName } = useAuth();

    // Configurar título de la página
    useEffect(() => {
        document.title = 'Dashboard - El Chalito';
        
        return () => {
            document.title = 'El Chalito';
        };
    }, []);

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

    const getCurrentTimeGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Buenos días';
        if (hour < 18) return 'Buenas tardes';
        return 'Buenas noches';
    };

    return (
        <>
            <NavBar />
            <main className="dashboard-main">
                <div className="dashboard-content">
                    <div className="welcome-section">
                        <div className="greeting">
                            <h1>
                                {getCurrentTimeGreeting()}, {userName}! 
                                <span className="role-badge">
                                    {getRoleIcon(userRole)} {getRoleDisplayName(userRole)}
                                </span>
                            </h1>
                            <p>Has iniciado sesión correctamente en el sistema El Chalito</p>
                        </div>
                        
                        <div className="user-info-card">
                            <div className="user-avatar">
                                {getRoleIcon(userRole)}
                            </div>
                            <div className="user-details">
                                <h3>{user?.nombre}</h3>
                                <p className="user-email">{user?.email}</p>
                                <p className="user-username">@{user?.usuario}</p>
                                <span className={`role-tag role-${userRole?.toLowerCase()}`}>
                                    {getRoleDisplayName(userRole)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="stats-section">
                        <h2>Sistema en funcionamiento</h2>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">🏪</div>
                                <div className="stat-info">
                                    <h3>Sistema Activo</h3>
                                    <p>Funcionando correctamente</p>
                                </div>
                            </div>
                            
                            <div className="stat-card">
                                <div className="stat-icon">🔐</div>
                                <div className="stat-info">
                                    <h3>Autenticación</h3>
                                    <p>Sesión segura iniciada</p>
                                </div>
                            </div>
                            
                            <div className="stat-card">
                                <div className="stat-icon">⏰</div>
                                <div className="stat-info">
                                    <h3>Última conexión</h3>
                                    <p>{new Date().toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Información temporal sobre módulos */}
                    <div className="modules-info">
                        <h2>Próximamente</h2>
                        <p>Los módulos de gestión estarán disponibles próximamente:</p>
                        <div className="modules-preview">
                            <span className="module-preview">📋 Pedidos</span>
                            <span className="module-preview">💳 Ventas</span>
                            <span className="module-preview">🍔 Artículos</span>
                            <span className="module-preview">📊 Reportes</span>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}