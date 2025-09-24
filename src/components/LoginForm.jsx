import { useState, useEffect } from 'react'
import './LoginForm.css'
//import { useUsers } from '../hooks/useUsers.js'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService.js'
import { Toast } from './Toast.jsx'

export function LoginForm ({onLoginSuccess}) {

    const [usuario, setUsuario] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [showToast, setShowToast] = useState(false)
    //const { users } = useUsers()
    const navigate = useNavigate()

    useEffect(() => {
        if (error) { // Si hay un error...
            setShowToast(true)
            const timer = setTimeout(() => {
                setShowToast(false)
                setError(null) // ...ocúltalo después de 5 segundos
            }, 5000) // 5000 milisegundos = 5 segundos

            return () => {
                clearTimeout(timer) // Esta es una "función de limpieza"
            }
        }
    }, [error])


    const handleUserChange = (e) => {
        setUsuario(e.target.value)
    }
    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }
    const handleSubmit = async (e) => {
        /*e.preventDefault()

        if (!users || users.length === 0) {
            console.log('Usuarios aún no cargados')
            return
        }

        const userFound = users.find(user => 
            user.usuario === usuario && user.password === password
        )

        if(userFound){
            //console.log('Exito')
            onLoginSuccess()
            navigate("/dashboard")
            setError(null)
        } else {
            //console.log('Fracaso')
            setError('Usuario o contraseña incorrectos')
            setUsuario('')
            setPassword('')
        }
        */
        e.preventDefault()
        setLoading(true)

        const result = await authService.login(usuario, password)
        if (result.success) {
            onLoginSuccess(usuario)
            navigate('/dashboard')
            setError(null)
        } else {
            setError(result.mensaje)
            //setUsuario('')
            //setPassword('')
        }
        setLoading(false)
    }


    // return (
    //     <div className="login-form-container">
    //         <div className="login-form-box">
    //             <h2>Inicio de Sesión</h2>
    //             {error && <div className="error-popup">{error}</div>}                    
    //             <form className="login-form" onSubmit={handleSubmit}>
    //                 <label htmlFor="usuario">Usuario:</label>
    //                 <input 
    //                     type="text" 
    //                     id="usuario"
    //                     placeholder="Ingresar usuario"
    //                     value={usuario}
    //                     onChange={handleUserChange}
    //                     disabled={loading}
    //                 />
                    
    //                 <label htmlFor="password">Contraseña:</label>
    //                 <input 
    //                     type="password" 
    //                     id="password"
    //                     placeholder="Ingresar contraseña"
    //                     value={password}
    //                     onChange={handlePasswordChange}
    //                     disabled={loading}
    //                 />
                    
    //                 <button type="submit" disabled={loading}>{loading ? 'Iniciando...' : 'Iniciar Sesion'}</button>
    //             </form>
    //         </div>
    //     </div>        
    // )
    return (
        <>
            <div className="login-form-container">
                <div className="login-form-box">
                    <div className="form-header">
                        <h2>Iniciar Sesión</h2>
                        <p>Ingresá tus credenciales</p>
                    </div>
                    
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="usuario">Usuario</label>
                            <input 
                                type="text" 
                                id="usuario"
                                placeholder="Ingresa tu usuario"
                                value={usuario}
                                onChange={handleUserChange}
                                disabled={loading}
                                required
                            />
                        </div>
                        
                        <div className="input-group">
                            <label htmlFor="password">Contraseña</label>
                            <input 
                                type="password" 
                                id="password"
                                placeholder="Ingresa tu contraseña"
                                value={password}
                                onChange={handlePasswordChange}
                                disabled={loading}
                                required
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`submit-btn ${loading ? 'loading' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Iniciando...
                                </>
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </button>
                    </form>
                </div>
            </div>
            
            {error && (
                <Toast 
                    message={error}
                    type="error"
                    show={showToast}
                    onClose={() => setShowToast(false)}
                />
            )}
        </>
    )
}