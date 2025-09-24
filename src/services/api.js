// src/services/api.js
import axios from 'axios';
import { API_CONFIG } from '../config/api';

// Variable para el contexto de notificaciones (se setea desde el contexto)
let notificationContext = null;

export const setNotificationContext = (context) => {
  notificationContext = context;
};

// Funciones para manejo de tokens
export const tokenManager = {
  getAccessToken: () => localStorage.getItem(API_CONFIG.TOKEN_CONFIG.ACCESS_TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(API_CONFIG.TOKEN_CONFIG.REFRESH_TOKEN_KEY),
  setTokens: (accessToken, refreshToken = null) => {
    localStorage.setItem(API_CONFIG.TOKEN_CONFIG.ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(API_CONFIG.TOKEN_CONFIG.REFRESH_TOKEN_KEY, refreshToken);
    }
  },
  clearTokens: () => {
    localStorage.removeItem(API_CONFIG.TOKEN_CONFIG.ACCESS_TOKEN_KEY);
    localStorage.removeItem(API_CONFIG.TOKEN_CONFIG.REFRESH_TOKEN_KEY);
    localStorage.removeItem(API_CONFIG.TOKEN_CONFIG.USER_KEY);
  },
  getUserData: () => {
    const userData = localStorage.getItem(API_CONFIG.TOKEN_CONFIG.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },
  setUserData: (user) => {
    localStorage.setItem(API_CONFIG.TOKEN_CONFIG.USER_KEY, JSON.stringify(user));
  }
};

// Crear instancia de axios
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Variable para evitar múltiples refresh simultáneos
let isRefreshing = false;
let refreshSubscribers = [];

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

const onRefreshComplete = (token) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

// Interceptor de request - Agregar token automáticamente
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response - Manejo de errores y refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si es error 401 y no es login/refresh
    if (error.response?.status === 401 && 
        !originalRequest._retry && 
        !originalRequest.url.includes('/login') &&
        !originalRequest.url.includes('/refresh-token')) {
      
      const refreshToken = tokenManager.getRefreshToken();
      
      if (!refreshToken) {
        // No hay refresh token, redirigir a login
        tokenManager.clearTokens();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Si ya se está refreshing, esperar
        return new Promise((resolve) => {
          addRefreshSubscriber((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`,
          { refreshToken }
        );

        const { accessToken } = response.data;
        tokenManager.setTokens(accessToken);
        
        onRefreshComplete(accessToken);
        isRefreshing = false;

        // Reintentar request original
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);

      } catch (refreshError) {
        isRefreshing = false;
        tokenManager.clearTokens();
        
        if (notificationContext) {
          notificationContext.showError('Sesión expirada. Por favor inicia sesión nuevamente.');
        }
        
        // Pequeño delay para que se muestre la notificación antes del redirect
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
        
        return Promise.reject(refreshError);
      }
    }

    // Manejar otros errores
    if (error.response?.status >= 500) {
      if (notificationContext) {
        notificationContext.showError('Error del servidor. Intenta nuevamente.');
      }
    }

    return Promise.reject(error);
  }
);

// Función helper para hacer requests
export const apiRequest = {
  get: (url, config = {}) => apiClient.get(url, config),
  post: (url, data = {}, config = {}) => apiClient.post(url, data, config),
  put: (url, data = {}, config = {}) => apiClient.put(url, data, config),
  patch: (url, data = {}, config = {}) => apiClient.patch(url, data, config),
  delete: (url, config = {}) => apiClient.delete(url, config),
};

export default apiClient;