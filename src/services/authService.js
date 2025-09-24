const API_BASE_URL = 'http://localhost:3000'

export const authService = {
    // Función para hacer login
    login: async (usuario, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ usuario, password })
            })

            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error en login:', error)
            return { 
                success: false, 
                mensaje: 'Error de conexión con el servidor' 
            }
        }
    },

    // Función para logout (por ahora simple, después podemos mejorar)
    logout: () => {
        // Aquí podrías limpiar tokens, localStorage, etc.
        console.log('Usuario deslogueado')
    }
}