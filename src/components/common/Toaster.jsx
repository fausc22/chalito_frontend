// src/components/common/Toaster.jsx
import { useNotification } from '../../contexts/NotificationContext';
import './Toaster.css';

const Toaster = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'loading':
        return '⏳';
      default:
        return '📢';
    }
  };

  const getProgressWidth = (notification) => {
    if (notification.duration === 0) return '100%'; // No progress for persistent notifications
    
    const elapsed = Date.now() - notification.createdAt;
    const progress = Math.max(0, 100 - (elapsed / notification.duration) * 100);
    return `${progress}%`;
  };

  return (
    <div className="toaster-container">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`toast-notification ${notification.type}`}
          onClick={() => removeNotification(notification.id)}
        >
          <div className="toast-content">
            <span className="toast-icon">
              {notification.type === 'loading' ? (
                <div className="loading-spinner"></div>
              ) : (
                getIcon(notification.type)
              )}
            </span>
            
            <div className="toast-message">
              <div className="toast-text">{notification.message}</div>
              {notification.subtitle && (
                <div className="toast-subtitle">{notification.subtitle}</div>
              )}
            </div>
            
            {notification.type !== 'loading' && (
              <button 
                className="toast-close"
                onClick={(e) => {
                  e.stopPropagation();
                  removeNotification(notification.id);
                }}
                aria-label="Cerrar notificación"
              >
                ×
              </button>
            )}
          </div>
          
          {notification.duration > 0 && (
            <div 
              className="toast-progress"
              style={{ 
                width: getProgressWidth(notification),
                animationDuration: `${notification.duration}ms`
              }}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Toaster;