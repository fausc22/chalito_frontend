// services/pedidosService.js
const API_BASE_URL = 'http://localhost:3000'

export const pedidosService = {
    // ==================
    // ARTÍCULOS
    // ==================
    
    // Obtener todos los artículos
    getArticulos: async (filtros = {}) => {
        try {
            const params = new URLSearchParams()
            if (filtros.categoria) params.append('categoria', filtros.categoria)
            if (filtros.disponible !== undefined) params.append('disponible', filtros.disponible)
            
            const url = `${API_BASE_URL}/api/articulos${params.toString() ? `?${params.toString()}` : ''}`
            const response = await fetch(url)
            const data = await response.json()
            
            if (!response.ok) {
                throw new Error(data.mensaje || 'Error al obtener artículos')
            }
            
            return data
        } catch (error) {
            console.error('Error al obtener artículos:', error)
            return { 
                success: false, 
                mensaje: 'Error de conexión con el servidor' 
            }
        }
    },

    // Obtener categorías
    getCategorias: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/articulos/categorias`)
            const data = await response.json()
            
            if (!response.ok) {
                throw new Error(data.mensaje || 'Error al obtener categorías')
            }
            
            return data
        } catch (error) {
            console.error('Error al obtener categorías:', error)
            return { 
                success: false, 
                mensaje: 'Error de conexión con el servidor' 
            }
        }
    },

    // ==================
    // PEDIDOS
    // ==================
    
    // Crear nuevo pedido
    createPedido: async (pedidoData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/pedidos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pedidoData)
            })

            const data = await response.json()
            
            if (!response.ok) {
                throw new Error(data.mensaje || 'Error al crear pedido')
            }
            
            return data
        } catch (error) {
            console.error('Error al crear pedido:', error)
            return { 
                success: false, 
                mensaje: error.message || 'Error de conexión con el servidor' 
            }
        }
    },

    // Obtener pedidos con filtros
    getPedidos: async (filtros = {}) => {
        try {
            const params = new URLSearchParams()
            if (filtros.estado) params.append('estado', filtros.estado)
            if (filtros.fecha) params.append('fecha', filtros.fecha)
            if (filtros.tipoEntrega) params.append('tipoEntrega', filtros.tipoEntrega)
            if (filtros.limite) params.append('limite', filtros.limite)
            if (filtros.pagina) params.append('pagina', filtros.pagina)
            
            const url = `${API_BASE_URL}/api/pedidos${params.toString() ? `?${params.toString()}` : ''}`
            const response = await fetch(url)
            const data = await response.json()
            
            if (!response.ok) {
                throw new Error(data.mensaje || 'Error al obtener pedidos')
            }
            
            return data
        } catch (error) {
            console.error('Error al obtener pedidos:', error)
            return { 
                success: false, 
                mensaje: 'Error de conexión con el servidor' 
            }
        }
    },

    // Obtener contadores por estado
    getContadores: async (fecha = null) => {
        try {
            const params = new URLSearchParams()
            if (fecha) params.append('fecha', fecha)
            
            const url = `${API_BASE_URL}/api/pedidos/contadores${params.toString() ? `?${params.toString()}` : ''}`
            const response = await fetch(url)
            const data = await response.json()
            
            if (!response.ok) {
                throw new Error(data.mensaje || 'Error al obtener contadores')
            }
            
            return data
        } catch (error) {
            console.error('Error al obtener contadores:', error)
            return { 
                success: false, 
                mensaje: 'Error de conexión con el servidor' 
            }
        }
    },

    // Actualizar estado de pedido
    updateEstadoPedido: async (pedidoId, nuevoEstado, empleadoId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/pedidos/${pedidoId}/estado`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    estado: nuevoEstado,
                    empleado: empleadoId 
                })
            })

            const data = await response.json()
            
            if (!response.ok) {
                throw new Error(data.mensaje || 'Error al actualizar estado')
            }
            
            return data
        } catch (error) {
            console.error('Error al actualizar estado:', error)
            return { 
                success: false, 
                mensaje: error.message || 'Error de conexión con el servidor' 
            }
        }
    },

    // Obtener pedido por ID
    getPedidoById: async (pedidoId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/pedidos/${pedidoId}`)
            const data = await response.json()
            
            if (!response.ok) {
                throw new Error(data.mensaje || 'Error al obtener pedido')
            }
            
            return data
        } catch (error) {
            console.error('Error al obtener pedido:', error)
            return { 
                success: false, 
                mensaje: 'Error de conexión con el servidor' 
            }
        }
    }
}