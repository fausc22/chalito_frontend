import { useState, useEffect, useCallback } from 'react'
import articulosService from '../services/articulosService'

const useArticulos = () => {
  // Estados principales
  const [articulos, setArticulos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Estados de filtros
  const [filtros, setFiltros] = useState({
    categoria: '',
    disponible: 'todos',
    precioMin: '',
    precioMax: '',
    busqueda: ''
  })

  // Cargar artículos
  const cargarArticulos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await articulosService.obtenerArticulos()
      
      if (response.success) {
        setArticulos(response.data)
      } else {
        throw new Error(response.mensaje || 'Error al cargar artículos')
      }
    } catch (err) {
      setError(err.message)
      console.error('Error al cargar artículos:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Cargar categorías
  const cargarCategorias = useCallback(async () => {
    try {
      const response = await articulosService.obtenerCategorias()
      
      if (response.success) {
        setCategorias(response.data)
      }
    } catch (err) {
      console.error('Error al cargar categorías:', err)
    }
  }, [])

  // Crear artículo
  const crearArticulo = async (articuloData) => {
    try {
      setError(null)
      const response = await articulosService.crearArticulo(articuloData)
      
      if (response.success) {
        await cargarArticulos()
        await cargarCategorias()
        return { success: true, data: response.data }
      } else {
        throw new Error(response.mensaje)
      }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  // Actualizar artículo
  const actualizarArticulo = async (id, articuloData) => {
    try {
      setError(null)
      const response = await articulosService.actualizarArticulo(id, articuloData)
      
      if (response.success) {
        await cargarArticulos()
        await cargarCategorias()
        return { success: true, data: response.data }
      } else {
        throw new Error(response.mensaje)
      }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  // Eliminar artículo
  const eliminarArticulo = async (id) => {
    try {
      setError(null)
      const response = await articulosService.eliminarArticulo(id)
      
      if (response.success) {
        await cargarArticulos()
        return { success: true }
      } else {
        throw new Error(response.mensaje)
      }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  // Cambiar disponibilidad
  const cambiarDisponibilidad = async (id, disponible) => {
    try {
      setError(null)
      const response = await articulosService.cambiarDisponibilidad(id, disponible)
      
      if (response.success) {
        await cargarArticulos()
        return { success: true }
      } else {
        throw new Error(response.mensaje)
      }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  // Filtrar artículos
  const articulosFiltrados = articulos.filter(articulo => {
    // Filtro por búsqueda
    const matchBusqueda = !filtros.busqueda || 
      articulo.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      articulo.codigo.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      articulo.descripcion.toLowerCase().includes(filtros.busqueda.toLowerCase())

    // Filtro por categoría
    const matchCategoria = !filtros.categoria || articulo.categoria === filtros.categoria

    // Filtro por disponibilidad
    const matchDisponible = filtros.disponible === 'todos' ||
      (filtros.disponible === 'disponible' && articulo.disponible) ||
      (filtros.disponible === 'no_disponible' && !articulo.disponible)

    // Filtro por precio
    const matchPrecio = (!filtros.precioMin || articulo.precio >= parseFloat(filtros.precioMin)) &&
      (!filtros.precioMax || articulo.precio <= parseFloat(filtros.precioMax))

    return matchBusqueda && matchCategoria && matchDisponible && matchPrecio
  })

  // Actualizar filtros
  const actualizarFiltros = (nuevosFiltros) => {
    setFiltros(prev => ({
      ...prev,
      ...nuevosFiltros
    }))
  }

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({
      categoria: '',
      disponible: 'todos',
      precioMin: '',
      precioMax: '',
      busqueda: ''
    })
  }

  // Estadísticas
  const estadisticas = {
    total: articulos.length,
    disponibles: articulos.filter(a => a.disponible).length,
    noDisponibles: articulos.filter(a => !a.disponible).length,
    totalCategorias: categorias.length,
    promedioPrecios: articulos.length > 0 
      ? (articulos.reduce((sum, a) => sum + a.precio, 0) / articulos.length).toFixed(2)
      : 0
  }

  // Obtener artículo por ID
  const obtenerArticuloPorId = (id) => {
    return articulos.find(a => a.id === parseInt(id))
  }

  // Efectos
  useEffect(() => {
    cargarArticulos()
    cargarCategorias()
  }, [cargarArticulos, cargarCategorias])

  return {
    // Estados
    articulos: articulosFiltrados,
    articulosCompletos: articulos,
    categorias,
    loading,
    error,
    filtros,
    estadisticas,

    // Acciones CRUD
    crearArticulo,
    actualizarArticulo,
    eliminarArticulo,
    cambiarDisponibilidad,
    cargarArticulos,
    obtenerArticuloPorId,

    // Acciones de filtros
    actualizarFiltros,
    limpiarFiltros,

    // Utilidades
    setError: (mensaje) => setError(mensaje),
    clearError: () => setError(null)
  }
}

export default useArticulos