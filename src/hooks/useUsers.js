import { useState, useEffect } from "react";

export function useUsers() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // En lugar de fetch('/users.json'), ahora hacemos petición al backend
                const response = await fetch('http://localhost:3000/api/users')
                const data = await response.json()
                setUsers(data)
            } catch(error) {
                console.error('Error al obtener usuarios:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [])                   

    return { users, loading }
}

// Aca tenia un error cuando retornaba users ya que lo retornaba directamente como un array
// de usuarios. Y en LoginForm.jsx estaba tratando de desestructurar un objeto aca:
// const { users } = useUsers()