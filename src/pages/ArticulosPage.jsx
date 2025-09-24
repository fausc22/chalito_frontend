import './styles/ArticulosPage.css'
import { useState, useRef } from 'react'
import { 
  BsPlus, 
  BsSearch, 
  BsTrash, 
  BsFilter,
  BsX,
  BsCheck2,
  BsExclamationTriangle,
  BsPencil
} from 'react-icons/bs'
import useArticulos from '../hooks/useArticulos.js'
import { NavBar } from '../components/NavBar.jsx'

export const ArticulosPage = () => {
  // Hook personalizado - maneja toda la lógica de artículos
  const {
    articulos,
    categorias,
    loading,
    error,
    filtros,
    estadisticas,
    crearArticulo,
    actualizarArticulo,
    eliminarArticulo,
    actualizarFiltros,
    limpiarFiltros,
  } = useArticulos()

  // Estados locales solo para UI
  const toastTimeoutRef = useRef(null)
  const [mostrarFiltros, setMostrarFiltros] = useState(false)
  const [modalAgregar, setModalAgregar] = useState(false)
  const [modalEditar, setModalEditar] = useState(false)
  const [modalEliminar, setModalEliminar] = useState(false)
  const [articuloSeleccionado, setArticuloSeleccionado] = useState(null)
  const [toast, setToast] = useState({ show: false, message: '', type: '' })
  
  // Estado del formulario
  const [formulario, setFormulario] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    tiempoPreparacion: '',
    disponible: true,
    ingredientes: []
  })

  // Funciones auxiliares de UI
  const limpiarFormulario = () => {
    setFormulario({
      codigo: '',
      nombre: '',
      descripcion: '',
      precio: '',
      categoria: '',
      tiempoPreparacion: '',
      disponible: true,
      ingredientes: []
    })
  }

  const mostrarToast = (message, type, duracion = 5000) => {
    // Limpiar timeout anterior si existe
    if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current)
    }
    
    setToast({ show: true, message, type })
    
    // Crear nuevo timeout y guardarlo en ref
    toastTimeoutRef.current = setTimeout(() => {
        setToast({ show: false, message: '', type: '' })
        toastTimeoutRef.current = null
    }, duracion)
    }

    // Handlers que usan el hook
    const handleCrearArticulo = async () => {
        // Validaciones antes de enviar
    if (!formulario.codigo.trim()) {
        mostrarToast('El código es obligatorio', 'error')
        return
    }
    
    if (!formulario.nombre.trim()) {
        mostrarToast('El nombre es obligatorio', 'error')
        return
    }
    
    if (!formulario.precio || parseFloat(formulario.precio) <= 0) {
        mostrarToast('El precio debe ser mayor a 0', 'error')
        return
    }
    
    if (!formulario.tiempoPreparacion || parseInt(formulario.tiempoPreparacion) <= 0) {
        mostrarToast('El tiempo de preparación debe ser mayor a 0', 'error')
        return
    }
    
    if (!formulario.categoria.trim()) {
        mostrarToast('La categoría es obligatoria', 'error')
        return
    }
    const resultado = await crearArticulo(formulario)
    if (resultado.success) {
      setModalAgregar(false)
      limpiarFormulario()
      mostrarToast('Artículo creado exitosamente', 'success')
    } else {
      mostrarToast(resultado.error, 'error')
    }
  }

  const handleActualizarArticulo = async () => {
    const resultado = await actualizarArticulo(articuloSeleccionado.id, formulario)
    if (resultado.success) {
      setModalEditar(false)
      setArticuloSeleccionado(null)
      limpiarFormulario()
      mostrarToast('Artículo actualizado exitosamente', 'success')
    } else {
      mostrarToast(resultado.error, 'error')
    }
  }

  const handleEliminarArticulo = async () => {
    const resultado = await eliminarArticulo(articuloSeleccionado.id)
    if (resultado.success) {
      setModalEliminar(false)
      setArticuloSeleccionado(null)
      mostrarToast('Artículo eliminado exitosamente', 'success')
    } else {
      mostrarToast(resultado.error, 'error')
    }
  }

  const handleEditar = (articulo) => {
    setArticuloSeleccionado(articulo)
    setFormulario({
      codigo: articulo.codigo,
      nombre: articulo.nombre,
      descripcion: articulo.descripcion,
      precio: articulo.precio.toString(),
      categoria: articulo.categoria,
      tiempoPreparacion: articulo.tiempoPreparacion.toString(),
      disponible: articulo.disponible,
      ingredientes: articulo.ingredientes || []
    })
    setModalEditar(true)
  }

  const handleEliminar = (articulo) => {
    setArticuloSeleccionado(articulo)
    setModalEliminar(true)
  }

  // Actualizar filtros usando el hook
  const handleFiltroChange = (campo, valor) => {
    actualizarFiltros({ [campo]: valor })
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="articulos-page">
        <div className="empty-state">
          <h3>Error al cargar artículos</h3>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <>
        <NavBar />
        <main className="articulos-page">
            {/* Header */}
            <div className="articulos-header">
                <div className="header-content">
                <div className="header-title">
                    <h1>Gestión de Artículos</h1>
                    <p>Administra tu menú y productos</p>
                </div>
                
                <button
                    onClick={() => setModalAgregar(true)}
                    className="btn-agregar-articulo"
                >
                    <BsPlus size={20} />
                    Agregar Artículo
                </button>
                </div>
            </div>

            {/* Barra de búsqueda y filtros */}
            <div className="search-filters-container">
                <div className="search-bar">
                <div className="search-main">
                    {/* Búsqueda */}
                    <div className="search-input-container">
                    <BsSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o código..."
                        value={filtros.busqueda}
                        onChange={(e) => handleFiltroChange('busqueda', e.target.value)}
                        className="search-input"
                    />
                    </div>

                    <div className="search-controls">
                    {/* Botón de filtros */}
                    <button
                        onClick={() => setMostrarFiltros(!mostrarFiltros)}
                        className={`btn-filtros ${mostrarFiltros ? 'active' : ''}`}
                    >
                        <BsFilter />
                        Filtros
                    </button>

                    {/* Limpiar filtros */}
                    {(filtros.busqueda || filtros.categoria || filtros.disponible !== 'todos' || filtros.precioMin || filtros.precioMax) && (
                        <button
                        onClick={limpiarFiltros}
                        className="btn-limpiar"
                        >
                        <BsX />
                        Limpiar
                        </button>
                    )}
                    </div>
                </div>

                {/* Panel de filtros expandible */}
                {mostrarFiltros && (
                    <div className="filtros-panel">
                    <div className="filtros-grid">
                        <div className="filtro-group">
                        <label className="filtro-label">Categoría</label>
                        <select
                            value={filtros.categoria}
                            onChange={(e) => handleFiltroChange('categoria', e.target.value)}
                            className="filtro-select"
                        >
                            <option value="">Todas las categorías</option>
                            {categorias.map(categoria => (
                            <option key={categoria} value={categoria}>{categoria}</option>
                            ))}
                        </select>
                        </div>

                        <div className="filtro-group">
                        <label className="filtro-label">Disponibilidad</label>
                        <select
                            value={filtros.disponible}
                            onChange={(e) => handleFiltroChange('disponible', e.target.value)}
                            className="filtro-select"
                        >
                            <option value="todos">Todos</option>
                            <option value="disponible">Disponibles</option>
                            <option value="no_disponible">No disponibles</option>
                        </select>
                        </div>

                        <div className="filtro-group">
                        <label className="filtro-label">Rango de precio</label>
                        <div className="precio-range">
                            <input
                            type="number"
                            placeholder="Min"
                            value={filtros.precioMin}
                            onChange={(e) => handleFiltroChange('precioMin', e.target.value)}
                            className="filtro-input"
                            />
                            <input
                            type="number"
                            placeholder="Max"
                            value={filtros.precioMax}
                            onChange={(e) => handleFiltroChange('precioMax', e.target.value)}
                            className="filtro-input"
                            />
                        </div>
                        </div>
                    </div>
                    </div>
                )}
                </div>
            </div>

            {/* Estadísticas */}
            <div className="estadisticas-grid">
                <div className="estadistica-card azul">
                <div className="estadistica-numero azul">{estadisticas.total}</div>
                <div className="estadistica-label">Total Artículos</div>
                </div>
                <div className="estadistica-card verde">
                <div className="estadistica-numero verde">{estadisticas.disponibles}</div>
                <div className="estadistica-label">Disponibles</div>
                </div>
                <div className="estadistica-card rojo">
                <div className="estadistica-numero rojo">{estadisticas.noDisponibles}</div>
                <div className="estadistica-label">No Disponibles</div>
                </div>
                <div className="estadistica-card purpura">
                <div className="estadistica-numero purpura">{estadisticas.totalCategorias}</div>
                <div className="estadistica-label">Categorías</div>
                </div>
            </div>

            {/* Lista de artículos */}
            <div className="articulos-table-container">
                <table className="articulos-table">
                <thead className="table-header">
                    <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Ingredientes</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Estado</th>
                    <th>Tiempo Prep.</th>
                    <th>Acciones</th>
                    </tr>
                </thead>
                <tbody className="table-body">
                    {articulos.map((articulo) => (
                    <tr key={articulo.id}>
                        <td>
                        <div style={{ 
                            width: '60px', 
                            height: '60px', 
                            overflow: 'hidden', 
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f3f4f6'
                        }}>
                            {articulo.imagen ? (
                            <img 
                                src={`http://localhost:3000${articulo.imagen}`}
                                alt={articulo.nombre}
                                style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover' 
                                }}
                                onError={(e) => {
                                e.target.style.display = 'none'
                                e.target.nextSibling.style.display = 'flex'
                                }}
                            />
                            ) : null}
                            <div style={{ 
                            display: articulo.imagen ? 'none' : 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                            fontSize: '12px',
                            color: '#6b7280',
                            textAlign: 'center'
                            }}>
                            Sin imagen
                            </div>
                        </div>
                        </td>
                        <td>
                        <span className="articulo-nombre">{articulo.nombre}</span>
                        </td>
                        <td>
                        <div className="articulo-info">
                            <div className="articulo-descripcion">{articulo.descripcion}</div>
                        </div>
                        </td>
                        <td>
                        <span className="categoria-badge">{articulo.categoria}</span>
                        </td>
                        <td>
                        <span className="articulo-precio">${articulo.precio}</span>
                        </td>
                        <td>
                        <span className={`estado-badge ${articulo.disponible ? 'disponible' : 'no-disponible'}`}>
                            {articulo.disponible ? (
                            <>
                                <BsCheck2 />
                                Disponible
                            </>
                            ) : (
                            <>
                                <BsX />
                                No disponible
                            </>
                            )}
                        </span>
                        </td>
                        <td>
                        <span className="tiempo-preparacion">{articulo.tiempoPreparacion} min</span>
                        </td>
                        <td className="acciones-cell">
                        <div className="acciones-container">
                            <button
                            onClick={() => handleEditar(articulo)}
                            className="btn-accion btn-eliminar"
                            title="Editar"
                            >
                            <BsPencil size={16} />
                            </button>
                            <button
                            onClick={() => handleEliminar(articulo)}
                            className="btn-accion btn-eliminar"
                            title="Eliminar"
                            >
                            <BsTrash size={16} />
                            </button>
                        </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>

                {articulos.length === 0 && (
                <div className="empty-state">
                    <h3>No se encontraron artículos</h3>
                    <p>Prueba ajustando los filtros o agrega un nuevo artículo</p>
                </div>
                )}
            </div>

            {/* Modal Agregar/Editar */}
            {(modalAgregar || modalEditar) && (
                <div className="modal-overlay">
                <div className="modal-content">
                    <div className="modal-header">
                    <h2 className="modal-title">
                        {modalAgregar ? 'Agregar Artículo' : 'Editar Artículo'}
                    </h2>
                    </div>
                    
                    <div className="modal-body">
                    <div className="form-grid">
                        <div className="form-group">
                        <label className="form-label">Código*</label>
                        <input
                            type="text"
                            value={formulario.codigo}
                            onChange={(e) => setFormulario({...formulario, codigo: e.target.value})}
                            className="form-input"
                            required
                        />
                        </div>
                        <div className="form-group">
                        <label className="form-label">Nombre*</label>
                        <input
                            type="text"
                            value={formulario.nombre}
                            onChange={(e) => setFormulario({...formulario, nombre: e.target.value})}
                            className="form-input"
                            required
                        />
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label className="form-label">Descripción</label>
                        <textarea
                        value={formulario.descripcion}
                        onChange={(e) => setFormulario({...formulario, descripcion: e.target.value})}
                        className="form-textarea"
                        rows="3"
                        />
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                        <label className="form-label">Precio*</label>
                        <input
                            type="number"
                            step="0.01"
                            value={formulario.precio}
                            onChange={(e) => setFormulario({...formulario, precio: e.target.value})}
                            className="form-input"
                            required
                        />
                        </div>
                        <div className="form-group">
                        <label className="form-label">Tiempo Preparación (min)*</label>
                        <input
                            type="number"
                            value={formulario.tiempoPreparacion}
                            onChange={(e) => setFormulario({...formulario, tiempoPreparacion: e.target.value})}
                            className="form-input"
                            required
                        />
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label className="form-label">Categoría*</label>
                        <select
                        value={formulario.categoria}
                        onChange={(e) => setFormulario({...formulario, categoria: e.target.value})}
                        className="form-select"
                        required
                        >
                        <option value="">Seleccionar categoría</option>
                        {categorias.map(categoria => (
                            <option key={categoria} value={categoria}>{categoria}</option>
                        ))}
                        </select>                        
                    </div>

                    <div className="form-checkbox-group">
                        <input
                        type="checkbox"
                        id="disponible"
                        checked={formulario.disponible}
                        onChange={(e) => setFormulario({...formulario, disponible: e.target.checked})}
                        className="form-checkbox"
                        />
                        <label htmlFor="disponible" className="form-label">Disponible</label>
                    </div>
                    </div>

                    <div className="modal-footer">
                    <button
                        onClick={() => {
                        setModalAgregar(false)
                        setModalEditar(false)
                        setArticuloSeleccionado(null)
                        limpiarFormulario()
                        }}
                        className="btn-modal btn-cancelar"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={modalAgregar ? handleCrearArticulo : handleActualizarArticulo}
                        className="btn-modal btn-confirmar"
                    >
                        {modalAgregar ? 'Crear' : 'Actualizar'}
                    </button>
                    </div>
                </div>
                </div>
            )}

            {/* Modal Eliminar */}
            {modalEliminar && (
                <div className="modal-overlay">
                <div className="modal-content">
                    <div className="modal-header">
                    <h2 className="modal-title">Eliminar Artículo</h2>
                    </div>
                    
                    <div className="modal-body">
                    <div className="empty-state">
                        <BsExclamationTriangle size={48} color="#dc2626" />
                        <h3>¿Estás seguro de que quieres eliminar este artículo?</h3>
                        <p>
                        <strong>{articuloSeleccionado?.nombre}</strong> será marcado como inactivo y no estará disponible para nuevos pedidos.
                        </p>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        Esta acción se puede revertir editando el artículo posteriormente.
                        </p>
                    </div>
                    </div>

                    <div className="modal-footer">
                    <button
                        onClick={() => {
                        setModalEliminar(false)
                        setArticuloSeleccionado(null)
                        }}
                        className="btn-modal btn-cancelar"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleEliminarArticulo}
                        className="btn-modal btn-eliminar-modal"
                    >
                        Eliminar
                    </button>
                    </div>
                </div>
                </div>
            )}

            {/* Toast */}
            {toast.show && (
                <div className="toast-container">
                <div className={`toast ${toast.type}`}>
                    {toast.message}
                </div>
                </div>
            )}
        </main>
    </>
  )
}