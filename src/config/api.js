// src/config/api.js
export const API_CONFIG = {
  // ✅ CORREGIR: Tu frontend está en puerto 3001, backend en 3000
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://tu-servidor.com' // Cambia por tu URL de producción
    : 'http://localhost:3001', // ✅ Backend está en puerto 3001
  
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh-token',
      PROFILE: '/auth/profile',
      VERIFY: '/auth/verify'
    }
  },
  
  TIMEOUT: 10000, // 10 segundos
  
  // Configuración de tokens - localStorage keys
  TOKEN_CONFIG: {
    ACCESS_TOKEN_KEY: 'chalito_access_token',    // JWT access token
    REFRESH_TOKEN_KEY: 'chalito_refresh_token',  // JWT refresh token (7 días)
    USER_KEY: 'chalito_user_data'                // Datos del usuario
  },
  
  // Headers para requests
  HEADERS: {
    AUTHORIZATION: 'Authorization',
    CONTENT_TYPE: 'application/json',
    X_REFRESH_TOKEN: 'x-refresh-token'
  }
};

export const ROLES = {
  ADMIN: 'ADMIN',
  GERENTE: 'GERENTE', 
  CAJERO: 'CAJERO',
  COCINA: 'COCINA'
};

export const ROLE_HIERARCHY = {
  [ROLES.ADMIN]: 4,
  [ROLES.GERENTE]: 3,
  [ROLES.CAJERO]: 2,
  [ROLES.COCINA]: 1
};