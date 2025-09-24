import { useState, useEffect } from 'react'
import './styles/VentasPage.css'
import { NavBar } from '../components/NavBar'
import { Modal } from '../components/Modal'
import { 
  BsPlus, 
  BsSearch, 
  BsFilter,
  BsFileEarmarkText,
  BsPrinter,
  BsX,
  BsCalendar,
  BsCreditCard,
  BsReceipt
} from 'react-icons/bs'

export const VentasPage = () => {
  // Estados principales
  const [ventas, setVentas] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Estados de filtros
  const [filtroFecha, setFiltroFecha] = useState('hoy')
  const [filtroMetodoPago, setFiltroMetodoPago] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [mostrarFiltros, setMostrarFiltros] = useState(false)
  
  // Estados de modales
  const [modalNuevaVenta, setModalNuevaVenta] = useState(false)
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null)
  const [modalDetalle, setModalDetalle] = useState(false)
  
  // Datos mock para demostración
  const ventasMock = [
    {
      id: 1,
      numeroFactura: 'A-0001-00000001',
      fecha: new Date(),
      cliente: 'Juan Pérez',
      items: [
        { nombre: 'Hamburguesa Clásica', cantidad: 2, precio: 1500, subtotal: 3000 },
        { nombre: 'Papas Fritas', cantidad: 1, precio: 800, subtotal: 800 }
      ],
      subtotal: 3800,
      impuestos: 798,
      total: 4598,
      tipoFactura: 'A',
      metodoPago: 'efectivo',
      estado: 'completada',
      empleado: 'María García',
      pedidoId: null
    },
    {
      id: 2,
      numeroFactura: 'B-0001-00000002',
      fecha: new Date(Date.now() - 3600000),
      cliente: 'Ana López',
      items: [
        { nombre: 'Pizza Margherita', cantidad: 1, precio: 2000, subtotal: 2000 }
      ],
      subtotal: 2000,
      impuestos: 0,
      total: 2000,
      tipoFactura: 'B',
      metodoPago: 'tarjeta',
      estado: 'completada',
      empleado: 'Carlos Ruiz',
      pedidoId: 15
    }
  ]

  // Estadísticas mock
  const estadisticas = {
    ventasHoy: 8,
    totalFacturado: 25430,
    ticketPromedio: 3179
  }

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setVentas(ventasMock)
      setLoading(false)
    }, 1000)
  }, [])

  const esHoy = (fecha) => {
    const hoy = new Date()
    const fechaVenta = new Date(fecha)
    return fechaVenta.toDateString() === hoy.toDateString()
  }
  // Filtrar ventas
  const ventasFiltradas = ventas.filter(venta => {
    const matchBusqueda = venta.numeroFactura.toLowerCase().includes(busqueda.toLowerCase()) ||
                         venta.cliente.toLowerCase().includes(busqueda.toLowerCase())
    
    const matchMetodoPago = !filtroMetodoPago || venta.metodoPago === filtroMetodoPago
    const matchEstado = !filtroEstado || venta.estado === filtroEstado
    
    // Filtro de fecha (simplificado para demo)
    const matchFecha = filtroFecha === 'todas' || 
                      (filtroFecha === 'hoy' && esHoy(venta.fecha))
    
    return matchBusqueda && matchMetodoPago && matchEstado && matchFecha
  })


  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatearMoneda = (cantidad) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(cantidad)
  }

  const getTipoFacturaColor = (tipo) => {
    const colores = {
      'A': 'tipo-a',
      'B': 'tipo-b', 
      'C': 'tipo-c',
      'X': 'tipo-x'
    }
    return colores[tipo] || 'tipo-default'
  }

  const handleNuevaVenta = () => {
    setModalNuevaVenta(true)
  }

  const handleVerDetalle = (venta) => {
    setVentaSeleccionada(venta)
    setModalDetalle(true)
  }

  const limpiarFiltros = () => {
    setFiltroFecha('hoy')
    setFiltroMetodoPago('')
    setFiltroEstado('')
    setBusqueda('')
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <>
      <NavBar />
      <main className="ventas-page">
        {/* Header */}
        <div className="ventas-header">
          <div className="header-content">
            <div className="header-title">
              <h1>Gestión de Ventas</h1>
              <p>Administra las facturas y ventas del negocio</p>
            </div>
            
            <button
              onClick={handleNuevaVenta}
              className="btn-nueva-venta"
            >
              <BsPlus size={20} />
              Nueva Venta
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="estadisticas-grid">
          <div className="estadistica-card azul">
            <div className="estadistica-icono">
              <BsReceipt size={24} />
            </div>
            <div className="estadistica-info">
              <div className="estadistica-numero">{estadisticas.ventasHoy}</div>
              <div className="estadistica-label">Ventas Hoy</div>
            </div>
          </div>
          
          <div className="estadistica-card verde">
            <div className="estadistica-icono">
              <BsCreditCard size={24} />
            </div>
            <div className="estadistica-info">
              <div className="estadistica-numero">{formatearMoneda(estadisticas.totalFacturado)}</div>
              <div className="estadistica-label">Total Facturado</div>
            </div>
          </div>
          
          <div className="estadistica-card purpura">
            <div className="estadistica-icono">
              <BsCalendar size={24} />
            </div>
            <div className="estadistica-info">
              <div className="estadistica-numero">{formatearMoneda(estadisticas.ticketPromedio)}</div>
              <div className="estadistica-label">Ticket Promedio</div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="filtros-container">
          <div className="filtros-principales">
            {/* Búsqueda */}
            <div className="busqueda-container">
              <BsSearch className="busqueda-icono" />
              <input
                type="text"
                placeholder="Buscar por número de factura o cliente..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="busqueda-input"
              />
            </div>

            {/* Filtros rápidos */}
            <div className="filtros-rapidos">
              <select
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
                className="filtro-select"
              >
                <option value="hoy">Hoy</option>
                <option value="semana">Esta semana</option>
                <option value="mes">Este mes</option>
                <option value="todas">Todas</option>
              </select>

              <button
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                className={`btn-filtros ${mostrarFiltros ? 'activo' : ''}`}
              >
                <BsFilter />
                Más filtros
              </button>

              {(filtroMetodoPago || filtroEstado || busqueda) && (
                <button
                  onClick={limpiarFiltros}
                  className="btn-limpiar-filtros"
                >
                  <BsX />
                  Limpiar
                </button>
              )}
            </div>
          </div>

          {/* Panel de filtros expandible */}
          {mostrarFiltros && (
            <div className="filtros-expandidos">
              <div className="filtros-grid">
                <div className="filtro-grupo">
                  <label>Método de Pago</label>
                  <select
                    value={filtroMetodoPago}
                    onChange={(e) => setFiltroMetodoPago(e.target.value)}
                    className="filtro-select"
                  >
                    <option value="">Todos</option>
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="qr">QR</option>
                  </select>
                </div>

                <div className="filtro-grupo">
                  <label>Estado</label>
                  <select
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    className="filtro-select"
                  >
                    <option value="">Todos</option>
                    <option value="completada">Completada</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="anulada">Anulada</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lista de ventas */}
        <div className="ventas-container">
          <div className="ventas-header-tabla">
            <h2>Facturas y Ventas ({ventasFiltradas.length})</h2>
          </div>

          <div className="ventas-tabla-container">
            <table className="ventas-tabla">
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Tipo</th>
                  <th>Total</th>
                  <th>Pago</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ventasFiltradas.map((venta) => (
                  <tr key={venta.id}>
                    <td>
                      <span className="numero-factura">{venta.numeroFactura}</span>
                    </td>
                    <td>
                      <span className="fecha-venta">{formatearFecha(venta.fecha)}</span>
                    </td>
                    <td>
                      <span className="cliente-nombre">{venta.cliente}</span>
                    </td>
                    <td>
                      <span className={`tipo-factura ${getTipoFacturaColor(venta.tipoFactura)}`}>
                        {venta.tipoFactura}
                      </span>
                    </td>
                    <td>
                      <span className="total-venta">{formatearMoneda(venta.total)}</span>
                    </td>
                    <td>
                      <span className="metodo-pago">{venta.metodoPago}</span>
                    </td>
                    <td>
                      <span className={`estado-badge ${venta.estado}`}>
                        {venta.estado}
                      </span>
                    </td>
                    <td>
                      <div className="acciones-venta">
                        <button
                          onClick={() => handleVerDetalle(venta)}
                          className="btn-accion btn-ver"
                          title="Ver detalle"
                        >
                          <BsFileEarmarkText size={16} />
                        </button>
                        <button
                          className="btn-accion btn-imprimir"
                          title="Imprimir"
                        >
                          <BsPrinter size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {ventasFiltradas.length === 0 && (
              <div className="empty-state">
                <h3>No se encontraron ventas</h3>
                <p>Ajusta los filtros o registra una nueva venta</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Nueva Venta */}
        {modalNuevaVenta && (
          <Modal
            isOpen={modalNuevaVenta}
            onClose={() => setModalNuevaVenta(false)}
            title="Nueva Venta"
            size="large"
          >
            <div className="modal-placeholder">
              <p>Aquí iría el formulario de nueva venta</p>
              <button 
                onClick={() => setModalNuevaVenta(false)}
                className="btn-cerrar"
              >
                Cerrar
              </button>
            </div>
          </Modal>
        )}

        {/* Modal Detalle Venta */}
        {modalDetalle && ventaSeleccionada && (
          <Modal
            isOpen={modalDetalle}
            onClose={() => setModalDetalle(false)}
            title={`Factura ${ventaSeleccionada.numeroFactura}`}
            size="medium"
          >
            <div className="detalle-venta">
              <div className="detalle-header">
                <div className="detalle-info">
                  <p><strong>Cliente:</strong> {ventaSeleccionada.cliente}</p>
                  <p><strong>Fecha:</strong> {formatearFecha(ventaSeleccionada.fecha)}</p>
                  <p><strong>Tipo:</strong> Factura {ventaSeleccionada.tipoFactura}</p>
                  <p><strong>Método de pago:</strong> {ventaSeleccionada.metodoPago}</p>
                </div>
              </div>

              <div className="detalle-items">
                <h4>Items:</h4>
                <table className="items-tabla">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cant.</th>
                      <th>Precio</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ventaSeleccionada.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.nombre}</td>
                        <td>{item.cantidad}</td>
                        <td>{formatearMoneda(item.precio)}</td>
                        <td>{formatearMoneda(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="detalle-totales">
                <div className="total-linea">
                  <span>Subtotal:</span>
                  <span>{formatearMoneda(ventaSeleccionada.subtotal)}</span>
                </div>
                {ventaSeleccionada.impuestos > 0 && (
                  <div className="total-linea">
                    <span>IVA:</span>
                    <span>{formatearMoneda(ventaSeleccionada.impuestos)}</span>
                  </div>
                )}
                <div className="total-linea total-final">
                  <span><strong>Total:</strong></span>
                  <span><strong>{formatearMoneda(ventaSeleccionada.total)}</strong></span>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </main>
    </>
  )
}