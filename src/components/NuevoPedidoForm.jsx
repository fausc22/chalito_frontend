// components/NuevoPedidoForm.jsx
import { useState, useEffect } from 'react'
import { pedidosService } from '../services/pedidosService'
import './NuevoPedidoForm.css'

export function NuevoPedidoForm({ onSuccess, onCancel }) {
    // Estados del formulario
    const [loading, setLoading] = useState(false)
    const [articulos, setArticulos] = useState([])
    const [categorias, setCategorias] = useState([])
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('')
    
    // Estado del pedido
    const [cliente, setCliente] = useState({
        nombre: '',
        telefono: '',
        direccion: ''
    })
    
    const [tipoEntrega, setTipoEntrega] = useState('retiro')
    const [fechaEntrega, setFechaEntrega] = useState('')
    const [observaciones, setObservaciones] = useState('')
    const [items, setItems] = useState([])

    // Estados calculados
    const [total, setTotal] = useState(0)

    // Cargar datos iniciales
    useEffect(() => {
        cargarArticulos()
        cargarCategorias()
        
        // Establecer fecha mínima (hoy)
        const hoy = new Date()
        const fechaMinima = hoy.toISOString().slice(0, 16)
        setFechaEntrega(fechaMinima)
    }, [])

    // Filtrar artículos por categoría
    const articulosFiltrados = categoriaSeleccionada 
        ? articulos.filter(art => art.categoria === categoriaSeleccionada)
        : articulos

    // Calcular total cuando cambian los items
    useEffect(() => {
        const nuevoTotal = items.reduce((sum, item) => sum + item.subtotal, 0)
        setTotal(nuevoTotal)
    }, [items])

    const cargarArticulos = async () => {
        const response = await pedidosService.getArticulos({ disponible: true })
        if (response.success) {
            setArticulos(response.data)
        }
    }

    const cargarCategorias = async () => {
        const response = await pedidosService.getCategorias()
        if (response.success) {
            setCategorias(response.data)
        }
    }

    const agregarItem = (articulo) => {
        const itemExistente = items.find(item => item.articulo === articulo.id)
        
        if (itemExistente) {
            // Si ya existe, incrementar cantidad
            actualizarCantidad(articulo.id, itemExistente.cantidad + 1)
        } else {
            // Agregar nuevo item
            const nuevoItem = {
                articulo: articulo.id,
                articuloData: articulo,
                cantidad: 1,
                precio: articulo.precio,
                subtotal: articulo.precio,
                observaciones: ''
            }
            setItems([...items, nuevoItem])
        }
    }

    const actualizarCantidad = (articuloId, nuevaCantidad) => {
        if (nuevaCantidad <= 0) {
            eliminarItem(articuloId)
            return
        }

        setItems(items.map(item => {
            if (item.articulo === articuloId) {
                return {
                    ...item,
                    cantidad: nuevaCantidad,
                    subtotal: item.precio * nuevaCantidad
                }
            }
            return item
        }))
    }

    const eliminarItem = (articuloId) => {
        setItems(items.filter(item => item.articulo !== articuloId))
    }

    const actualizarObservacionItem = (articuloId, observaciones) => {
        setItems(items.map(item => {
            if (item.articulo === articuloId) {
                return { ...item, observaciones }
            }
            return item
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // Validaciones básicas
        if (!cliente.nombre.trim()) {
            alert('El nombre del cliente es requerido')
            return
        }
        
        if (items.length === 0) {
            alert('Debe agregar al menos un artículo al pedido')
            return
        }

        if (!fechaEntrega) {
            alert('La fecha de entrega es requerida')
            return
        }

        if (tipoEntrega === 'delivery' && !cliente.direccion.trim()) {
            alert('La dirección es requerida para delivery')
            return
        }

        setLoading(true)

        // Preparar datos del pedido
        const pedidoData = {
            cliente,
            items: items.map(item => ({
                articulo: item.articulo,
                cantidad: item.cantidad,
                observaciones: item.observaciones
            })),
            tipoEntrega,
            fechaEntrega,
            observaciones,
            empleado: 1 // Por ahora hardcodeado, después usar el usuario logueado
        }

        try {
            const response = await pedidosService.createPedido(pedidoData)
            
            if (response.success) {
                alert('¡Pedido creado exitosamente!')
                onSuccess(response.data)
            } else {
                alert(response.mensaje || 'Error al crear el pedido')
            }
        } catch (error) {
            alert('Error de conexión. Intente nuevamente.')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="nuevo-pedido-form">
            {/* Datos del Cliente */}
            <div className="form-section">
                <h3>👤 Datos del Cliente</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Nombre *</label>
                        <input
                            type="text"
                            value={cliente.nombre}
                            onChange={(e) => setCliente({...cliente, nombre: e.target.value})}
                            placeholder="Nombre completo del cliente"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Teléfono</label>
                        <input
                            type="tel"
                            value={cliente.telefono}
                            onChange={(e) => setCliente({...cliente, telefono: e.target.value})}
                            placeholder="Número de teléfono"
                        />
                    </div>
                    
                    <div className="form-group full-width">
                        <label>Dirección {tipoEntrega === 'delivery' && '*'}</label>
                        <input
                            type="text"
                            value={cliente.direccion}
                            onChange={(e) => setCliente({...cliente, direccion: e.target.value})}
                            placeholder="Dirección completa"
                            required={tipoEntrega === 'delivery'}
                        />
                    </div>
                </div>
            </div>

            {/* Tipo de Entrega y Fecha */}
            <div className="form-section">
                <h3>🚚 Entrega</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Tipo de Entrega *</label>
                        <select
                            value={tipoEntrega}
                            onChange={(e) => setTipoEntrega(e.target.value)}
                            required
                        >
                            <option value="retiro">Retiro en Local</option>
                            <option value="delivery">Delivery</option>
                            <option value="salon">Consumo en Salón</option>
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label>Fecha y Hora de Entrega *</label>
                        <input
                            type="datetime-local"
                            value={fechaEntrega}
                            onChange={(e) => setFechaEntrega(e.target.value)}
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Selección de Artículos */}
            <div className="form-section">
                <h3>🍔 Artículos</h3>
                
                {/* Filtro por categoría */}
                <div className="categoria-filter">
                    <button 
                        type="button"
                        className={`filter-btn ${categoriaSeleccionada === '' ? 'active' : ''}`}
                        onClick={() => setCategoriaSeleccionada('')}
                    >
                        Todos
                    </button>
                    {categorias.map(categoria => (
                        <button
                            key={categoria}
                            type="button"
                            className={`filter-btn ${categoriaSeleccionada === categoria ? 'active' : ''}`}
                            onClick={() => setCategoriaSeleccionada(categoria)}
                        >
                            {categoria}
                        </button>
                    ))}
                </div>

                {/* Lista de artículos */}
                <div className="articulos-grid">
                    {articulosFiltrados.map(articulo => {
                        const itemEnPedido = items.find(item => item.articulo === articulo.id)
                        return (
                            <div key={articulo.id} className="articulo-card">
                                <div className="articulo-info">
                                    <h4>{articulo.nombre}</h4>
                                    <p>{articulo.descripcion}</p>
                                    <div className="articulo-precio">${articulo.precio.toLocaleString()}</div>
                                    <div className="articulo-tiempo">⏱️ {articulo.tiempoPreparacion} min</div>
                                </div>
                                
                                <div className="articulo-actions">
                                    {itemEnPedido ? (
                                        <div className="cantidad-controls">
                                            <button
                                                type="button"
                                                onClick={() => actualizarCantidad(articulo.id, itemEnPedido.cantidad - 1)}
                                                className="btn-cantidad"
                                            >
                                                -
                                            </button>
                                            <span className="cantidad">{itemEnPedido.cantidad}</span>
                                            <button
                                                type="button"
                                                onClick={() => actualizarCantidad(articulo.id, itemEnPedido.cantidad + 1)}
                                                className="btn-cantidad"
                                            >
                                                +
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => agregarItem(articulo)}
                                            className="btn-agregar"
                                        >
                                            Agregar
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Resumen del Pedido */}
            {items.length > 0 && (
                <div className="form-section">
                    <h3>📋 Resumen del Pedido</h3>
                    <div className="pedido-resumen">
                        {items.map(item => (
                            <div key={item.articulo} className="item-resumen">
                                <div className="item-info">
                                    <span className="item-nombre">{item.articuloData.nombre}</span>
                                    <span className="item-cantidad">x{item.cantidad}</span>
                                    <span className="item-precio">${item.subtotal.toLocaleString()}</span>
                                </div>
                                
                                <input
                                    type="text"
                                    placeholder="Observaciones (opcional)"
                                    value={item.observaciones}
                                    onChange={(e) => actualizarObservacionItem(item.articulo, e.target.value)}
                                    className="item-observaciones"
                                />
                                
                                <button
                                    type="button"
                                    onClick={() => eliminarItem(item.articulo)}
                                    className="btn-eliminar"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        
                        <div className="total-pedido">
                            <strong>Total: ${total.toLocaleString()}</strong>
                        </div>
                    </div>
                </div>
            )}

            {/* Observaciones Generales */}
            <div className="form-section">
                <h3>📝 Observaciones</h3>
                <textarea
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    placeholder="Observaciones generales del pedido..."
                    rows="3"
                />
            </div>

            {/* Botones */}
            <div className="form-actions">
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn-cancelar"
                    disabled={loading}
                >
                    Cancelar
                </button>
                
                <button
                    type="submit"
                    className="btn-crear"
                    disabled={loading || items.length === 0}
                >
                    {loading ? 'Creando...' : `Crear Pedido ($${total.toLocaleString()})`}
                </button>
            </div>
        </form>
    )
}