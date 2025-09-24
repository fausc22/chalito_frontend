import './styles/LoginPage.css'
import logoImg from '../assets/logo-empresa.png'
import { LoginForm } from '../components/LoginForm'

export function LoginPage ({onLoginSuccess}) {
    return (
        <div className="login-container">
            <div className="login-left-side">
                <LoginForm onLoginSuccess={onLoginSuccess}/>
            </div>
            <div className="login-right-side">
                <div className='logo-container'>
                    <img 
                    className='logo'
                    src={logoImg}
                    alt="Logo de la empresa" 
                    />
                </div>
            </div>
        </div>
    )
}