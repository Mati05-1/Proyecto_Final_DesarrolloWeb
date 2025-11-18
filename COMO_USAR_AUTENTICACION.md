# 🔐 Cómo Usar la Autenticación JWT

## ✅ Sistema Implementado

Tu proyecto ahora tiene un sistema completo de autenticación con JWT.

## 🚀 Cómo Probar

### 1. Iniciar el Servidor

```bash
cd server
node server.js
```

### 2. Usuarios de Prueba

#### Administrador
- **Email**: `admin@aceputt.com`
- **Password**: `admin123`
- **Rol**: `admin` (puede acceder a `/admin`)

#### Usuario Normal
- **Email**: `demo@aceputt.com`
- **Password**: `demo123`
- **Rol**: `user`

### 3. Probar desde el Frontend

1. **Inicia la aplicación React:**
   ```bash
   npm run dev
   ```

2. **Inicia sesión:**
   - Ve a la página principal
   - Usa el email y contraseña de los usuarios de prueba
   - El token se guarda automáticamente

3. **Acceder al Panel de Admin:**
   - Inicia sesión como `admin@aceputt.com` / `admin123`
   - Verás el link "Admin" en el navbar
   - Haz clic para ver el dashboard

### 4. Probar desde la Terminal (curl)

#### Registrar un usuario:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "test123"
  }'
```

#### Iniciar sesión:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@aceputt.com",
    "password": "admin123"
  }'
```

#### Acceder al dashboard de admin:
```bash
# Primero obtén el token del login anterior
TOKEN="tu_token_aqui"

curl http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

## 📋 Endpoints Disponibles

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Información del usuario actual
- `GET /api/auth/users` - Listar usuarios (solo admin)

### Administración (requiere admin)
- `GET /api/admin/dashboard` - Estadísticas del sistema
- `DELETE /api/admin/matches/:id` - Eliminar partido
- `DELETE /api/admin/tournaments/:id` - Eliminar torneo

## 🔒 Protección de Rutas

### Rutas Protegidas:
- ✅ `/api/admin/*` - Requiere autenticación + rol admin
- ✅ `POST /api/bets` - Requiere autenticación

### Rutas Públicas:
- ✅ `GET /api/matches` - Público
- ✅ `GET /api/tournaments` - Público
- ✅ `GET /api/rankings` - Público
- ✅ `GET /api/bets` - Público (filtra por usuario si hay token)

## 🎯 Panel de Administración

El panel de administración (`/admin`) muestra:
- Estadísticas de partidos (total, en vivo, finalizados, programados)
- Estadísticas de torneos (total, en vivo, programados)
- Estadísticas de apuestas (total, pendientes, ganadas, perdidas)
- Estadísticas de rankings

**Solo accesible para usuarios con rol `admin`**

## 💡 Notas Importantes

1. **Tokens JWT**: Válidos por 7 días
2. **Almacenamiento**: Los tokens se guardan en `localStorage`
3. **Envío automático**: El frontend envía el token automáticamente en todas las peticiones
4. **Fallback**: Si no hay token, algunas rutas funcionan sin autenticación

---

**¡Sistema de autenticación completamente funcional!** 🔐✨

