import { useState, useEffect } from 'react'
import './styles/PedidosPage.css'
import { NavBar } from '../components/NavBar'
import { Modal } from '../components/Modal'
import { Footer } from '../components/Footer'
import { NuevoPedidoForm } from '../components/NuevoPedidoForm'
import { pedidosService } from '../services/pedidosService'


export function PedidosPage() {
    const [estadoActivo, setEstadoActivo] = useState('pendientes')
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [pedidos, setPedidos] = useState([])
    const [contadores, setContadores] = useState({
        pendientes: 0,
        enCurso: 0,
        listos: 0,
        entregados: 0,
        cancelados: 0
    })

    const estados = [
        { 
            key: 'pendientes', 
            label: 'PENDIENTES', 
            count: contadores.pendientes,
            color: 'warning', // Amarillo/naranja
            apiEstado: 'pendiente'
        },
        { 
            key: 'enCurso', 
            label: 'EN CURSO', 
            count: contadores.enCurso,
            color: 'primary', // Azul
            apiEstado: 'en_curso'
        },
        { 
            key: 'listos', 
            label: 'LISTOS', 
            count: contadores.listos,
            color: 'success', // Verde
            apiEstado: 'listo'
        },
        { 
            key: 'entregados', 
            label: 'ENTREGADOS', 
            count: contadores.entregados,
            color: 'secondary', // Gris
            apiEstado: 'entregado'
        },
        { 
            key: 'cancelados', 
            label: 'CANCELADOS', 
            count: contadores.cancelados,
            color: 'danger', // Rojo
            apiEstado: 'cancelado'
        }
    ]

    // Cargar datos iniciales
    useEffect(() => {
        cargarContadores()
        cargarPedidos(estadoActivo)
    }, [])

    // Cargar pedidos cuando cambia el estado activo
    useEffect(() => {
        cargarPedidos(estadoActivo)
    }, [estadoActivo])

    const cargarContadores = async () => {
        setLoading(true)
        try {
            const response = await pedidosService.getContadores()
            if (response.success) {
                setContadores(response.data)
            }
        } catch (error) {
            console.error('Error al cargar contadores:', error)
        } finally {
            setLoading(false)
        }
    }

    const cargarPedidos = async (estado) => {
        setLoading(true)
        try {
            const estadoActual = estados.find(e => e.key === estado)
            const response = await pedidosService.getPedidos({
                estado: estadoActual?.apiEstado,
                limite: 20
            })
            
            if (response.success) {
                setPedidos(response.data)
            }
        } catch (error) {
            console.error('Error al cargar pedidos:', error)
            setPedidos([])
        } finally {
            setLoading(false)
        }
    }

    const handleTabClick = (estado) => {
        setEstadoActivo(estado)
    }
    const handleNuevoPedido = () => {
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }

    const handlePedidoCreado = (nuevoPedido) => {
        setShowModal(false)
        // Recargar contadores y pedidos
        cargarContadores()
        if (estadoActivo === 'pendientes') {
            cargarPedidos(estadoActivo)
        }
        
        // Mostrar mensaje de éxito
        alert(`¡Pedido ${nuevoPedido.numeroPedido} creado!`)
    }

    const cambiarEstadoPedido = async (pedidoId, nuevoEstado) => {
        try {
            const response = await pedidosService.updateEstadoPedido(
                pedidoId, 
                nuevoEstado, 
                1 // Por ahora hardcodeado, después usar usuario logueado
            )
            
            if (response.success) {
                // Recargar datos
                cargarContadores()
                cargarPedidos(estadoActivo)
                alert('Estado actualizado')
            } else {
                alert(response.mensaje || 'Error al actualizar estado')
            }
        } catch (error) {
            console.log(error)
            alert('Error de conexión. Intente nuevamente.')
        }
    }

    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatearTipoEntrega = (tipo) => {
        const tipos = {
            'delivery': '🚚 Delivery',
            'retiro': '🏪 Retiro',
            'salon': '🍽️ Salón'
        }
        return tipos[tipo] || tipo
    }

    const getEstadoSiguiente = (estadoActual) => {
        const flujo = {
            'pendiente': 'en_curso',
            'en_curso': 'listo',
            'listo': 'entregado'
        }
        return flujo[estadoActual]
    }

    const estadoActivoInfo = estados.find(e => e.key === estadoActivo)

    return (
        <>
            <NavBar />
            <main className="pedidos-page">
                <div className="pedidos-header">
                    <div className="header-content">
                        <div className="header-text">
                            <h1>Gestión de Pedidos</h1>
                            <p>Administrá todos los pedidos</p>
                        </div>
                        <button className="btn-nuevo-pedido" onClick={handleNuevoPedido}>
                            <span className="btn-icon">+</span>
                            <span className="btn-text">Nuevo Pedido</span>
                        </button>
                    </div>
                </div>

                {/* Pestañas de estados */}
                <div className="pedidos-tabs">
                    {estados.map(estado => (
                        <button
                            key={estado.key}
                            className={`tab-button ${estado.color} ${estadoActivo === estado.key ? 'active' : ''}`}
                            onClick={() => handleTabClick(estado.key)}
                        >
                            <span className="tab-label">{estado.label}</span>
                            <span className="tab-count">({estado.count})</span>
                        </button>
                    ))}
                </div>

                {/* Contenido del estado activo */}
                <div className="pedidos-content">
                    <div className="estado-header">
                        <h2>
                            {estadoActivoInfo?.label} 
                            <span className="estado-count">
                                ({estadoActivoInfo?.count} pedidos)
                            </span>
                        </h2>
                    </div>

                    {/* Lista de pedidos */}
                    <div className="pedidos-list">
                        {loading ? (
                            <div className="loading-message">
                                <p>Cargando pedidos...</p>
                            </div>
                        ) : pedidos.length === 0 ? (
                            <div className="empty-message">
                                <p>No hay pedidos en estado: <strong>{estadoActivoInfo?.label}</strong></p>
                            </div>
                        ) : (
                            <div className="pedidos-grid">
                                {pedidos.map(pedido => (
                                    <div key={pedido.id} className={`pedido-card ${pedido.estado}`}>
                                        {/* Header del pedido */}
                                        <div className="pedido-header">
                                            <div className="pedido-numero">
                                                <h3>{pedido.numeroPedido}</h3>
                                                <span className={`estado-badge ${pedido.estado}`}>
                                                    {pedido.estado.replace('_', ' ').toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="pedido-fecha">
                                                {formatearFecha(pedido.fechaCreacion)}
                                            </div>
                                        </div>

                                        {/* Información del cliente */}
                                        <div className="pedido-cliente">
                                            <div className="cliente-info">
                                                <strong>👤 {pedido.cliente.nombre}</strong>
                                                {pedido.cliente.telefono && (
                                                    <span>📞 {pedido.cliente.telefono}</span>
                                                )}
                                                {pedido.cliente.direccion && (
                                                    <span>📍 {pedido.cliente.direccion}</span>
                                                )}
                                            </div>
                                            <div className="entrega-info">
                                                <span>{formatearTipoEntrega(pedido.tipoEntrega)}</span>
                                                <span>⏱️ {pedido.tiempoEstimado} min</span>
                                            </div>
                                        </div>

                                        {/* Items del pedido */}
                                        <div className="pedido-items">
                                            <h4>Artículos:</h4>
                                            <ul>
                                                {pedido.items.map((item, index) => (
                                                    <li key={index}>
                                                        <span className="item-cantidad">{item.cantidad}x</span>
                                                        <span className="item-nombre">{item.articuloData.nombre}</span>
                                                        <span className="item-precio">${item.subtotal.toLocaleString()}</span>
                                                        {item.observaciones && (
                                                            <div className="item-obs">💬 {item.observaciones}</div>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Observaciones generales */}
                                        {pedido.observaciones && (
                                            <div className="pedido-observaciones">
                                                <strong>📝 Observaciones:</strong>
                                                <p>{pedido.observaciones}</p>
                                            </div>
                                        )}

                                        {/* Total y acciones */}
                                        <div className="pedido-footer">
                                            <div className="pedido-total">
                                                <strong>Total: ${pedido.total.toLocaleString()}</strong>
                                            </div>
                                            
                                            <div className="pedido-actions">
                                                {getEstadoSiguiente(pedido.estado) && (
                                                    <button
                                                        onClick={() => cambiarEstadoPedido(pedido.id, getEstadoSiguiente(pedido.estado))}
                                                        className="btn-siguiente-estado"
                                                    >
                                                        {getEstadoSiguiente(pedido.estado) === 'en_curso' && 'Iniciar'}
                                                        {getEstadoSiguiente(pedido.estado) === 'listo' && 'Marcar Listo'}
                                                        {getEstadoSiguiente(pedido.estado) === 'entregado' && 'Entregar'}
                                                    </button>
                                                )}
                                                
                                                {pedido.estado !== 'cancelado' && pedido.estado !== 'entregado' && (
                                                    <button
                                                        onClick={() => cambiarEstadoPedido(pedido.id, 'cancelado')}
                                                        className="btn-cancelar-pedido"
                                                    >
                                                        Cancelar
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Modal para Nuevo Pedido */}
            <Modal
                isOpen={showModal}
                onClose={handleCloseModal}
                title="Crear Nuevo Pedido"
                size="medium"
            >
                <NuevoPedidoForm
                    onSuccess={handlePedidoCreado}
                    onCancel={handleCloseModal}
                />
            </Modal>

            <Footer />
        </>
    )
}