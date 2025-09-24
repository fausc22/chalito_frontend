const API_BASE_URL = 'http://localhost:3000/api'

class ArticulosService {
  
  // Obtener todos los artículos
  async obtenerArticulos(filtros = {}) {
    try {
      const params = new URLSearchParams()
      
      if (filtros.categoria) params.append('categoria', filtros.categoria)
      if (filtros.disponible !== undefined) params.append('disponible', filtros.disponible)
      
      const url = `${API_BASE_URL}/articulos${params.toString() ? `?${params.toString()}` : ''}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error al obtener artículos:', error)
      throw error
    }
  }

  // Obtener artículo por ID
  async obtenerArticuloPorId(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/articulos/${id}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error al obtener artículo:', error)
      throw error
    }
  }

  // Obtener categorías disponibles
  async obtenerCategorias() {
    try {
      const response = await fetch(`${API_BASE_URL}/articulos/categorias`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error al obtener categorías:', error)
      throw error
    }
  }

  // Crear nuevo artículo
  async crearArticulo(articuloData) {
    try {
      const response = await fetch(`${API_BASE_URL}/articulos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...articuloData,
          precio: parseFloat(articuloData.precio),
          tiempoPreparacion: parseInt(articuloData.tiempoPreparacion)
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.mensaje || `HTTP error! status: ${response.status}`)
      }
      
      return data
    } catch (error) {
      console.error('Error al crear artículo:', error)
      throw error
    }
  }

  // Actualizar artículo existente
  async actualizarArticulo(id, articuloData) {
    try {
      const response = await fetch(`${API_BASE_URL}/articulos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...articuloData,
          precio: parseFloat(articuloData.precio),
          tiempoPreparacion: parseInt(articuloData.tiempoPreparacion)
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.mensaje || `HTTP error! status: ${response.status}`)
      }
      
      return data
    } catch (error) {
      console.error('Error al actualizar artículo:', error)
      throw error
    }
  }

  // Eliminar artículo (marcar como inactivo)
  async eliminarArticulo(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/articulos/${id}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.mensaje || `HTTP error! status: ${response.status}`)
      }
      
      return data
    } catch (error) {
      console.error('Error al eliminar artículo:', error)
      throw error
    }
  }

  // Cambiar disponibilidad de un artículo
  async cambiarDisponibilidad(id, disponible) {
    try {
      const response = await fetch(`${API_BASE_URL}/articulos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ disponible })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.mensaje || `HTTP error! status: ${response.status}`)
      }
      
      return data
    } catch (error) {
      console.error('Error al cambiar disponibilidad:', error)
      throw error
    }
  }

  // Buscar artículos por término
  async buscarArticulos(termino, filtros = {}) {
    try {
      const articulos = await this.obtenerArticulos(filtros)
      
      if (!articulos.success) {
        throw new Error('Error al obtener artículos')
      }
      
      // Filtrar localmente por término de búsqueda
      const articulosFiltrados = articulos.data.filter(articulo => 
        articulo.nombre.toLowerCase().includes(termino.toLowerCase()) ||
        articulo.codigo.toLowerCase().includes(termino.toLowerCase()) ||
        articulo.descripcion.toLowerCase().includes(termino.toLowerCase())
      )
      
      return {
        success: true,
        data: articulosFiltrados
      }
    } catch (error) {
      console.error('Error al buscar artículos:', error)
      throw error
    }
  }

  // Obtener estadísticas de artículos
  async obtenerEstadisticas() {
    try {
      const response = await this.obtenerArticulos()
      
      if (!response.success) {
        throw new Error('Error al obtener artículos')
      }
      
      const articulos = response.data
      const categorias = await this.obtenerCategorias()
      
      return {
        success: true,
        data: {
          total: articulos.length,
          disponibles: articulos.filter(a => a.disponible).length,
          noDisponibles: articulos.filter(a => !a.disponible).length,
          totalCategorias: categorias.success ? categorias.data.length : 0,
          promedioPrecios: articulos.length > 0 
            ? (articulos.reduce((sum, a) => sum + a.precio, 0) / articulos.length).toFixed(2)
            : 0,
          promedioTiempoPrep: articulos.length > 0
            ? Math.round(articulos.reduce((sum, a) => sum + a.tiempoPreparacion, 0) / articulos.length)
            : 0
        }
      }
    } catch (error) {
      console.error('Error al obtener estadísticas:', error)
      throw error
    }
  }
}

// Crear instancia única del servicio
const articulosService = new ArticulosService()

export default articulosService