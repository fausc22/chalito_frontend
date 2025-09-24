import { NavBar } from "../components/NavBar"
import { ModuleCard } from "../components/ModuleCard"
import { BsBasket3, BsGraphUp, BsShopWindow, BsBoxSeam, BsFileEarmarkBarGraph, BsPersonCheck, BsMenuButtonWide } from 'react-icons/bs'
import './styles/DashBoardPage.css'
import { useNavigate } from 'react-router-dom'
import { Footer } from "../components/Footer"

export function DashBoardPage({ usuario }) {

    const navigate = useNavigate()
    // Funciones para manejar el clic de cada tarjeta
    const handlePedidosClick = () => {
        navigate('/pedidos')
    };

    const handleVentasClick = () => {
        navigate('/ventas')
    };

    const handleComprasClick = () => {
        navigate('/compras')
    };

    const handleInventarioClick = () => {
        navigate('/inventario')
    };

    const handleReportesClick = () => {
        navigate('/reportes')
    };
    
    const handleUsuariosClick = () => {
        navigate('/usuarios')
    };

    const handleArticulosClick = () => {
        navigate('/articulos')
    }
    return (
        <>
            <NavBar />
            <main className="dashboard-main">
                <div className="dashboard-content">
                    <h1>¡Bienvenido al Dashboard, {usuario}!</h1>
                    <p>Has iniciado sesión correctamente.</p>
                </div>
                <div className="module-grid">
                    <ModuleCard 
                        title="PEDIDOS" 
                        description="Modulo de gestión de pedidos."
                        icon={<BsBasket3 size={40} />} 
                        onClick={handlePedidosClick}
                    />
                    <ModuleCard 
                        title="VENTAS" 
                        description="Modulo de ventas y facturación."
                        icon={<BsGraphUp size={40} />} 
                        onClick={handleVentasClick}
                    />
                    <ModuleCard 
                        title="GASTOS" 
                        description="Modulo de gastos de la empresa."
                        icon={<BsShopWindow size={40} />} 
                        onClick={handleComprasClick}
                    />
                    <ModuleCard 
                        title="ARTÍCULOS" 
                        description="Módulo de gestión de menú y productos."
                        icon={<BsMenuButtonWide size={40} />} 
                        onClick={handleArticulosClick}
                    />
                    <ModuleCard 
                        title="INVENTARIO" 
                        description="Modulo de control de stock y pedidos a proveedores."
                        icon={<BsBoxSeam size={40} />} 
                        onClick={handleInventarioClick}
                    />
                    <ModuleCard 
                        title="REPORTES" 
                        description="Modulo de reportes de ventas y generación de informes."
                        icon={<BsFileEarmarkBarGraph size={40} />} 
                        onClick={handleReportesClick}
                    />
                    <ModuleCard 
                        title="EMPLEADOS" 
                        description="Modulo de administracion de empleados."
                        icon={<BsPersonCheck size={40} />} 
                        onClick={handleUsuariosClick}
                    />
                </div>
            </main>
            <Footer />
        </>
    )
}