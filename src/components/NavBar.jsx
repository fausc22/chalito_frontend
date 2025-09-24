
import { useState } from 'react'
import logoImg from '../assets/logo-empresa.png'
import './NavBar.css'
import { Link } from 'react-router-dom'

export function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    return (
        <header className="header">
            <Link to="/dashboard">
                <img 
                    src={logoImg} 
                    alt="Logo"
                    style={{height: '60px', width: 'auto'}}
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
                <div className="navbar-right">
                    <Link to="/dashboard" className="nav-link">INICIO</Link>
                    <a href="#" className="nav-link" onClick={() => setIsMenuOpen(false)}>SOPORTE</a>
                    <a href="#" className="nav-user" onClick={() => setIsMenuOpen(false)}>USUARIO</a>
                </div>            
            </nav>

            {/* Overlay para cerrar el menú en móvil */}
            {isMenuOpen && <div className="menu-overlay" onClick={() => setIsMenuOpen(false)}></div>}
        </header>
    )
}