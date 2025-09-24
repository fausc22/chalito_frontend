// src/config/routes.js
export const ROUTES = {
  // Rutas públicas
  LOGIN: '/login',
  
  // Rutas privadas
  DASHBOARD: '/dashboard',
  HOME: '/home', // alias para dashboard
  
  // Módulos (por ahora comentados)
  // PEDIDOS: '/pedidos',
  // VENTAS: '/ventas', 
  // ARTICULOS: '/articulos',
  // INVENTARIO: '/inventario',
  // REPORTES: '/reportes',
  // GASTOS: '/gastos',
  // USUARIOS: '/usuarios',
  // AUDITORIA: '/auditoria',
  
  // Rutas de error
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/unauthorized'
};

// Configuración de rutas con metadatos
export const ROUTE_CONFIG = {
  [ROUTES.LOGIN]: {
    title: 'Iniciar Sesión - El Chalito',
    isPublic: true,
    hideNavbar: true
  },
  [ROUTES.DASHBOARD]: {
    title: 'Dashboard - El Chalito',
    isPublic: false,
    requiredRole: null, // null significa que cualquier rol autenticado puede acceder
    hideNavbar: false
  }
};

// Helper para obtener configuración de una ruta
export const getRouteConfig = (path) => {
  return ROUTE_CONFIG[path] || {
    title: 'El Chalito',
    isPublic: false,
    hideNavbar: false
  };
};

// Helper para verificar si una ruta es pública
export const isPublicRoute = (path) => {
  const config = getRouteConfig(path);
  return config.isPublic;
};

// Rutas que requieren autenticación
export const PROTECTED_ROUTES = Object.keys(ROUTE_CONFIG).filter(
  route => !ROUTE_CONFIG[route].isPublic
);