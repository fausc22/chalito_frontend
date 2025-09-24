import { useEffect } from 'react'
import './Toast.css'

export function Toast({ message, type = 'error', show, onClose }) {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose()
            }, 4000)
            
            return () => clearTimeout(timer)
        }
    }, [show, onClose])

    const getIcon = () => {
        switch (type) {
            case 'error':
                return '❌'
            case 'success':
                return '✅'
            case 'warning':
                return '⚠️'
            case 'info':
                return 'ℹ️'
            default:
                return '❌'
        }
    }

    return (
        <div className={`toast ${type} ${show ? 'show' : ''}`}>
            <div className="toast-content">
                <span className="toast-icon">{getIcon()}</span>
                <span className="toast-message">{message}</span>
                <button className="toast-close" onClick={onClose}>
                    ×
                </button>
            </div>
        </div>
    )
}