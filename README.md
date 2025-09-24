# Sistema El Chalito - Frontend

Sistema de gestión gastronómica moderno construido con React y autenticación robusta.

## 🚀 Características Implementadas

### ✅ Sistema de Autenticación Completo
- Login con JWT y refresh tokens
- Manejo automático de renovación de tokens
- Roles de usuario (ADMIN, GERENTE, CAJERO, COCINA)
- Protección de rutas
- Almacenamiento seguro en localStorage

### ✅ Arquitectura Moderna
- **Contextos**: AuthContext y NotificationContext
- **Hooks personalizados**: useAuth, useNotification
- **Servicios centralizados**: API client con Axios
- **Rutas organizadas**: Configuración centralizada
- **Componentes reutilizables**: Toaster, ProtectedRoute

### ✅ Sistema de Notificaciones
- Toaster moderno con múltiples tipos
- Notificaciones automáticas por errores de API
- Animaciones suaves y responsive

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── auth/                   # Componentes de autenticación
│   │   ├── LoginForm.jsx
│   │   ├── LoginForm.css
│   │   └── ProtectedRoute.jsx
│   ├── common/                 # Componentes reutilizables
│   │   ├── Toaster.jsx
│   │   └── Toaster.css
│   ├── NavBar.jsx             # Navegación principal
│   └── Footer.jsx             # Footer
├── contexts/                   # Contextos de React
│   ├── AuthContext.jsx        # Estado de autenticación
│   └── NotificationContext.jsx # Sistema de notificaciones
├── services/                   # Servicios de API
│   ├── api.js                 # Cliente Axios configurado
│   └── authService.js         # Servicios de autenticación
├── config/                     # Configuraciones
│   ├── api.js                 # URLs y configuración de API
│   └── routes.js              # Definición de rutas
├── routes/                     # Configuración de routing
│   └── AppRoutes.jsx          # Rutas principales
├── pages/                      # Páginas principales
│   ├── LoginPage.jsx
│   ├── DashBoardPage.jsx
│   └── styles/                # Estilos de páginas
└── hooks/                      # Hooks personalizados (futuro)
```

## 🔧 Configuración

### Variables de Entorno
Crear archivo `.env` en la raíz:

```env
REACT_APP_API_URL=http://localhost:3000
NODE_ENV=development
```

### Instalación
```bash
npm install
npm start
```

## 🔐 Sistema de Autenticación

### Roles Disponibles
- **ADMIN**: Acceso completo al sistema
- **GERENTE**: Gestión operativa y reportes
- **CAJERO**: Ventas y pedidos
- **COCINA**: Gestión de cocina y comandas

### Credenciales de Prueba (Desarrollo)
- Admin: `admin` / `admin123`
- Gerente: `gerente` / `gerente123`
- Cajero: `cajero` / `cajero123`
- Chef: `chef` / `cocina123`

## 📡 API Integration

### Cliente Axios
- Interceptores automáticos para tokens
- Renovación automática de tokens expirados
- Manejo centralizado de errores
- Redirección automática en caso de sesión expirada

### Endpoints Configurados
```javascript
// Autenticación
POST /auth/login
POST /auth/logout
POST /auth/refresh-token
GET /auth/verify
GET /auth/profile
```

## 🎨 Sistema de Notificaciones

### Tipos Disponibles
- **Success**: Operaciones exitosas
- **Error**: Errores y fallos
- **Warning**: Advertencias
- **Info**: Información general
- **Loading**: Operaciones en progreso

### Uso
```javascript
const { showSuccess, showError } = useNotification();

showSuccess('¡Operación exitosa!');
showError('Error en la operación', { duration: 7000 });
```

## 🛡️ Seguridad

### Token Management
- Access tokens con expiración corta
- Refresh tokens para sesiones persistentes
- Limpieza automática en logout
- Almacenamiento seguro en localStorage

### Protección de Rutas
```javascript
<ProtectedRoute requiredRole={['ADMIN', 'GERENTE']}>
  <ComponenteProtegido />
</ProtectedRoute>
```

## 🔄 Estados de la Aplicación

### AuthContext
```javascript
const {
  user,           // Datos del usuario
  isAuthenticated,// Estado de autenticación
  isLoading,      // Carga inicial
  userRole,       // Rol del usuario
  login,          // Función de login
  logout,         // Función de logout
  hasRole,        // Verificar rol específico
  isAdmin,        // Helper para admin
  isGerente       // Helper para gerente
} = useAuth();
```

## 📱 Responsive Design

- **Mobile First**: Diseño adaptativo
- **Breakpoints**: 768px, 1024px, 1200px
- **Touch Friendly**: Botones y elementos táctiles optimizados
- **Hamburger Menu**: Navegación móvil

## 🚧 Próximamente

### Módulos en Desarrollo
- 📋 **Pedidos**: Gestión completa de pedidos
- 💳 **Ventas**: Sistema de facturación
- 🍔 **Artículos**: Gestión de menú
- 📊 **Reportes**: Analytics y reportes
- 📦 **Inventario**: Control de stock
- 💰 **Gastos**: Gestión financiera
- 👥 **Usuarios**: Administración de usuarios
- 🔍 **Auditoría**: Registro de actividades

### Funcionalidades Futuras
- **Perfil de Usuario**: Edición de datos personales
- **Configuraciones**: Personalización del sistema
- **Modo Oscuro**: Tema opcional
- **Exportación**: Reportes en PDF/Excel
- **Notificaciones Push**: Alertas en tiempo real
- **Multi-idioma**: Soporte i18n

## 🔧 Scripts Disponibles

```bash
npm start          # Servidor de desarrollo
npm run build      # Build de producción
npm test           # Ejecutar tests
npm run lint       # Linting del código
```

## 🏗️ Arquitectura

### Patrones Implementados
- **Context + Reducer**: Manejo de estado global
- **Custom Hooks**: Lógica reutilizable
- **Service Layer**: Separación de lógica de negocio
- **Component Composition**: Componentes reutilizables
- **Error Boundaries**: Manejo de errores

### Mejores Prácticas
- **TypeScript Ready**: Preparado para migración
- **ESLint + Prettier**: Código consistente
- **Atomic Design**: Estructura de componentes
- **Performance**: Lazy loading y optimizaciones
- **Accessibility**: ARIA y semántica correcta

## 📊 Performance

### Optimizaciones
- **Code Splitting**: Carga bajo demanda
- **Memoization**: React.memo y useMemo
- **Bundle Analysis**: Análisis de tamaño
- **Image Optimization**: Formatos modernos
- **Caching**: Estrategias de cache

## 🧪 Testing (Futuro)

### Stack de Testing
- **Jest**: Framework de testing
- **React Testing Library**: Testing de componentes
- **MSW**: Mock Service Worker
- **Cypress**: E2E testing

## 📈 Métricas y Monitoring

### Analytics (Futuro)
- **User Activity**: Seguimiento de uso
- **Error Tracking**: Monitoreo de errores
- **Performance Monitoring**: Métricas de rendimiento
- **A/B Testing**: Experimentación

## 🤝 Contribución

### Convenciones
- **Commits**: Conventional commits
- **Branches**: feature/*, fix/*, hotfix/*
- **Code Review**: PR obligatorio
- **Documentation**: README actualizado

## 📞 Soporte

Para soporte técnico o consultas:
- 📧 Email: soporte@chalito.com
- 📱 Teléfono: +54 XXX XXX-XXXX
- 💬 Chat: Sistema interno

## 📄 Licencia

© 2025 El Chalito. Todos los derechos reservados.