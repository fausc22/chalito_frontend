// src/contexts/NotificationContext.jsx
import { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification debe ser usado dentro de NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const generateId = () => Date.now() + Math.random();

  const addNotification = useCallback((notification) => {
    const id = generateId();
    const newNotification = {
      id,
      ...notification,
      createdAt: Date.now()
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remover después del tiempo especificado
    if (notification.duration !== 0) { // 0 significa que no se auto-remueve
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5000);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Métodos de conveniencia
  const showSuccess = useCallback((message, options = {}) => {
    return addNotification({
      type: 'success',
      message,
      ...options
    });
  }, [addNotification]);

  const showError = useCallback((message, options = {}) => {
    return addNotification({
      type: 'error',
      message,
      duration: options.duration || 7000, // Errores duran más tiempo
      ...options
    });
  }, [addNotification]);

  const showWarning = useCallback((message, options = {}) => {
    return addNotification({
      type: 'warning',
      message,
      ...options
    });
  }, [addNotification]);

  const showInfo = useCallback((message, options = {}) => {
    return addNotification({
      type: 'info',
      message,
      ...options
    });
  }, [addNotification]);

  const showLoading = useCallback((message = 'Procesando...', options = {}) => {
    return addNotification({
      type: 'loading',
      message,
      duration: 0, // No se auto-remueve
      ...options
    });
  }, [addNotification]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};