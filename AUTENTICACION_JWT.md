# 🔐 Autenticación JWT - Implementada

## ✅ Sistema de Autenticación Completo

Se ha implementado un sistema de autenticación simulado usando **JWT (JSON Web Tokens)**.

## 🎯 Características Implementadas

### Backend (Node.js/Express)

1. **Rutas de Autenticación** (`/api/auth`)
   - ✅ `POST /api/auth/register` - Registrar nuevo usuario
   - ✅ `POST /api/auth/login` - Iniciar sesión
   - ✅ `GET /api/auth/me` - Obtener información del usuario actual
   - ✅ `GET /api/auth/users` - Listar usuarios (solo admin)

2. **Middleware de Autenticación**
   - ✅ `authenticateToken` - Verifica token JWT
   - ✅ `requireAdmin` - Requiere rol de administrador
   - ✅ `optionalAuth` - Autenticación opcional

3. **Panel de Administración** (`/api/admin`)
   - ✅ `GET /api/admin/dashboard` - Estadísticas del sistema
   - ✅ `DELETE /api/admin/matches/:id` - Eliminar partidos
   - ✅ `DELETE /api/admin/tournaments/:id` - Eliminar torneos

### Frontend (React)

1. **Página de Administración**
   - ✅ Ruta `/admin` con dashboard
   - ✅ Estadísticas en tiempo real
   - ✅ Protegida con autenticación

2. **Integración con Context API**
   - ✅ Login con JWT
   - ✅ Registro de usuarios
   - ✅ Guardado de token en localStorage
   - ✅ Envío automático de token en peticiones

3. **Navbar Actualizado**
   - ✅ Link a panel de admin (solo si está autenticado)

## 🔑 Usuarios de Prueba

### Administrador
- **Email**: `admin@aceputt.com`
- **Password**: `admin123`
- **Rol**: `admin`
- **Puntos**: 10000

### Usuario Normal
- **Email**: `demo@aceputt.com`
- **Password**: `demo123`
- **Rol**: `user`
- **Puntos**: 1000

## 📝 Cómo Usar

### 1. Registrar un Nuevo Usuario

```javascript
const response = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'nuevo_usuario',
    email: 'nuevo@example.com',
    password: 'contraseña123'
  })
})

const data = await response.json()
// Guardar token: localStorage.setItem('token', data.data.token)
```

### 2. Iniciar Sesión

```javascript
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'admin@aceputt.com',
    password: 'admin123'
  })
})

const data = await response.json()
localStorage.setItem('token', data.data.token)
```

### 3. Hacer Peticiones Autenticadas

```javascript
const token = localStorage.getItem('token')

const response = await fetch('http://localhost:5000/api/admin/dashboard', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

### 4. Acceder al Panel de Admin

1. Inicia sesión como administrador (`admin@aceputt.com` / `admin123`)
2. Navega a `/admin` en la aplicación React
3. Verás el dashboard con estadísticas

## 🔒 Protección de Rutas

### Rutas Protegidas

- **`/api/admin/*`**: Requiere autenticación + rol admin
- **`POST /api/bets`**: Requiere autenticación (para crear apuestas)

### Rutas Públicas

- **`GET /api/matches`**: Público
- **`GET /api/tournaments`**: Público
- **`GET /api/rankings`**: Público
- **`GET /api/bets`**: Público (pero filtra por usuario si hay token)

## 🎨 Panel de Administración

El panel de administración (`/admin`) muestra:

- **Estadísticas de Partidos**: Total, en vivo, finalizados, programados
- **Estadísticas de Torneos**: Total, en vivo, programados
- **Estadísticas de Apuestas**: Total, pendientes, ganadas, perdidas
- **Estadísticas de Rankings**: Total de rankings

## 🔐 Seguridad

### Implementado:
- ✅ Tokens JWT con expiración (7 días)
- ✅ Verificación de tokens en cada petición
- ✅ Roles de usuario (admin/user)
- ✅ Protección de rutas sensibles

### Notas:
- ⚠️ Las contraseñas están en texto plano (simulación)
- ⚠️ En producción deberías usar `bcrypt` para hashear contraseñas
- ⚠️ El JWT_SECRET debería estar en variables de entorno

## 📊 Flujo de Autenticación

```
1. Usuario se registra/inicia sesión
   ↓
2. Backend genera token JWT
   ↓
3. Frontend guarda token en localStorage
   ↓
4. Frontend envía token en header Authorization
   ↓
5. Backend verifica token en cada petición
   ↓
6. Si es válido → permite acceso
   Si no → devuelve error 401/403
```

## 🚀 Próximos Pasos (Opcional)

Para producción, considera:
- [ ] Hashear contraseñas con bcrypt
- [ ] Refresh tokens para renovar sesiones
- [ ] Rate limiting para prevenir ataques
- [ ] Validación más estricta de datos
- [ ] Logs de seguridad
- [ ] Integración con MongoDB para usuarios reales

---

**¡Sistema de autenticación JWT completamente funcional!** 🔐✨

