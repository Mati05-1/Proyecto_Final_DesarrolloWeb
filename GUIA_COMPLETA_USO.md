# 📚 Guía Completa de Uso - Ace & Putt

## 🚀 Inicio Rápido

### 1. Iniciar el Backend (API REST)

```bash
cd server
npm install  # Solo la primera vez
node server.js
```

El servidor se iniciará en: **http://localhost:5000**

Deberías ver:
```
🚀 Servidor corriendo en http://localhost:5000
✅ MongoDB conectado: localhost:27017
   Base de datos: ace-putt
```

### 2. Iniciar el Frontend (React)

En una **nueva terminal**:

```bash
npm install  # Solo la primera vez
npm run dev
```

La aplicación se abrirá en: **http://localhost:5173**

### 3. Abrir la Landing Page (HTML)

En otra terminal:

```bash
python3 -m http.server 3001
```

Abre en el navegador: **http://localhost:3001/landing.html**

---

## 🗄️ MongoDB - Cómo Usar

### Verificar que MongoDB está corriendo:

```bash
brew services list | grep mongodb
```

Deberías ver: `mongodb-community started`

### Si no está corriendo:

```bash
brew services start mongodb-community
```

### Conectarte a MongoDB:

```bash
mongosh ace-putt
```

### Comandos útiles de MongoDB:

```javascript
// Ver todas las colecciones
show collections

// Ver partidos de tenis
db.matches.find().pretty()

// Ver torneos de golf
db.tournaments.find().pretty()

// Ver apuestas
db.bets.find().pretty()

// Ver rankings
db.rankings.find().pretty()

// Contar documentos
db.matches.countDocuments()
db.tournaments.countDocuments()
db.bets.countDocuments()

// Buscar un partido específico
db.matches.findOne({ "player1.name": "Carlos Alcaraz" })

// Ver solo partidos en vivo
db.matches.find({ status: "live" }).pretty()
```

### Poblar la base de datos (si está vacía):

```bash
cd server
node scripts/seedDatabase.js
```

Esto insertará:
- 5 partidos de tenis
- 3 torneos de golf
- 2 apuestas de ejemplo
- 3 rankings (ATP, WTA, PGA)

### Limpiar y repoblar:

```bash
cd server
node scripts/seedDatabase.js
```

Esto elimina todo y vuelve a insertar datos frescos.

---

## 🔌 APIs - Cómo Configurar y Usar

### Opción 1: Usar Datos Mock (Sin configuración)

**No necesitas hacer nada.** El servidor usa datos simulados automáticamente.

### Opción 2: Configurar RapidAPI (Datos Reales)

#### Paso 1: Obtener API Key de RapidAPI

1. Ve a [RapidAPI](https://rapidapi.com/)
2. Crea una cuenta o inicia sesión
3. Suscríbete a:
   - **Live Golf Data** (para golf)
   - **Tennis Live Data** (para tenis)
4. Copia tu **X-RapidAPI-Key**

#### Paso 2: Configurar en el proyecto

```bash
cd server
cp .env.example .env
```

Edita `server/.env` y agrega:

```env
RAPIDAPI_KEY=tu_api_key_aqui
```

#### Paso 3: Reiniciar el servidor

```bash
# Detener el servidor (Ctrl+C)
node server.js
```

Deberías ver:
```
✅ APIs Externas Configuradas:
   🔑 RapidAPI: Configurada
   🎾 Tenis: rapidapi
   ⛳ Golf: rapidapi (RapidAPI)
```

### Verificar que las APIs funcionan:

```bash
# Probar endpoint de partidos
curl http://localhost:5000/api/matches

# Probar endpoint de torneos
curl http://localhost:5000/api/tournaments
```

Si las APIs fallan, automáticamente se usan datos mock.

---

## 🔐 Autenticación JWT - Cómo Usar

### Usuarios de Prueba:

#### Administrador:
- **Email**: `admin@aceputt.com`
- **Password**: `admin123`
- **Rol**: `admin` (puede acceder a `/admin`)

#### Usuario Normal:
- **Email**: `demo@aceputt.com`
- **Password**: `demo123`
- **Rol**: `user`

### Registrar un Nuevo Usuario:

#### Desde el Frontend:
1. Ve a `http://localhost:3001/landing.html`
2. Haz clic en "Crear Cuenta Gratis"
3. Completa el formulario
4. Se iniciará sesión automáticamente

#### Desde la Terminal (curl):

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "nuevo_usuario",
    "email": "nuevo@example.com",
    "password": "contraseña123"
  }'
```

### Iniciar Sesión:

#### Desde el Frontend:
1. Ve a `http://localhost:3001/landing.html`
2. Haz clic en "Iniciar Sesión"
3. Ingresa email y contraseña
4. Se guardará el token automáticamente

#### Desde la Terminal:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@aceputt.com",
    "password": "admin123"
  }'
```

Guarda el `token` de la respuesta.

### Usar el Token:

```bash
TOKEN="tu_token_aqui"

# Obtener información del usuario
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# Acceder al dashboard de admin
curl http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

### Acceder al Panel de Admin:

1. Inicia sesión como `admin@aceputt.com` / `admin123`
2. En la aplicación React (`http://localhost:5173`), haz clic en "Admin" en el navbar
3. O ve directamente a: `http://localhost:5173/admin`

---

## 📋 Endpoints de la API

### Base URL: `http://localhost:5000/api`

### Partidos de Tenis

```bash
# Todos los partidos
GET /api/matches

# Solo en vivo
GET /api/matches?status=live

# Solo programados
GET /api/matches?status=scheduled

# Solo finalizados
GET /api/matches?status=finished

# Buscar por jugador
GET /api/matches?player=Alcaraz

# Un partido específico
GET /api/matches/:id

# Crear partido
POST /api/matches
Body: { tournament, player1, player2, startTime }

# Actualizar partido
PATCH /api/matches/:id
Body: { status, score, winner }

# Eliminar partido
DELETE /api/matches/:id
```

### Torneos de Golf

```bash
# Todos los torneos
GET /api/tournaments

# Solo en vivo
GET /api/tournaments?status=live

# Un torneo específico
GET /api/tournaments/:id

# Crear torneo
POST /api/tournaments
Body: { name, location, startTime, totalRounds }

# Actualizar torneo
PATCH /api/tournaments/:id
Body: { status, round, leaderboard }

# Eliminar torneo
DELETE /api/tournaments/:id
```

### Apuestas

```bash
# Todas las apuestas
GET /api/bets

# Apuestas de un usuario
GET /api/bets?userId=user123

# Apuestas pendientes
GET /api/bets?status=pending

# Crear apuesta (requiere token)
POST /api/bets
Headers: Authorization: Bearer <token>
Body: { type, matchId/tournamentId, selection, selectionName, amount }

# Actualizar apuesta
PATCH /api/bets/:id

# Eliminar apuesta
DELETE /api/bets/:id
```

### Rankings

```bash
# Todos los rankings
GET /api/rankings

# Solo ATP
GET /api/rankings/atp

# Solo WTA
GET /api/rankings/wta

# Solo PGA
GET /api/rankings/pga
```

### Autenticación

```bash
# Registrar usuario
POST /api/auth/register
Body: { username, email, password }

# Iniciar sesión
POST /api/auth/login
Body: { email, password }

# Información del usuario actual
GET /api/auth/me
Headers: Authorization: Bearer <token>

# Listar usuarios (solo admin)
GET /api/auth/users
Headers: Authorization: Bearer <admin_token>
```

### Administración (Solo Admin)

```bash
# Dashboard con estadísticas
GET /api/admin/dashboard
Headers: Authorization: Bearer <admin_token>

# Eliminar partido
DELETE /api/admin/matches/:id
Headers: Authorization: Bearer <admin_token>

# Eliminar torneo
DELETE /api/admin/tournaments/:id
Headers: Authorization: Bearer <admin_token>
```

---

## 🎯 Flujo de Trabajo Completo

### 1. Desarrollo Local

```bash
# Terminal 1: Backend
cd server
node server.js

# Terminal 2: Frontend React
npm run dev

# Terminal 3: Landing Page (opcional)
python3 -m http.server 3001
```

### 2. Probar la Aplicación

1. **Landing Page**: `http://localhost:3001/landing.html`
   - Registrarse o iniciar sesión
   - Ver contenido dinámico

2. **Aplicación React**: `http://localhost:5173`
   - Navegar entre páginas
   - Ver resultados en vivo
   - Hacer apuestas
   - Ver estadísticas

3. **API REST**: `http://localhost:5000/api`
   - Probar endpoints con curl o Postman
   - Ver documentación en `server/README.md`

### 3. Verificar MongoDB

```bash
mongosh ace-putt
show collections
db.matches.find().pretty()
```

---

## 🔧 Solución de Problemas

### El servidor no inicia (puerto ocupado):

```bash
# Ver qué está usando el puerto 5000
lsof -i :5000

# Matar el proceso
kill -9 <PID>

# O usar otro puerto
PORT=5001 node server.js
```

### MongoDB no se conecta:

```bash
# Verificar que está corriendo
brew services list | grep mongodb

# Iniciar MongoDB
brew services start mongodb-community

# Verificar conexión
mongosh
```

### Las APIs no funcionan:

1. Verifica que `RAPIDAPI_KEY` esté en `server/.env`
2. Verifica que tengas suscripción activa en RapidAPI
3. Revisa los logs del servidor para ver errores
4. El sistema automáticamente usa datos mock como respaldo

### El frontend no se conecta a la API:

1. Verifica que el backend esté corriendo en `http://localhost:5000`
2. Abre la consola del navegador (F12) para ver errores
3. Verifica CORS en el servidor (ya está configurado)

### Token JWT expirado:

1. Vuelve a iniciar sesión
2. Los tokens duran 7 días
3. Si expira, simplemente haz login de nuevo

---

## 📊 Estructura de Datos

### Partido de Tenis:
```json
{
  "id": 1,
  "tournament": "ATP Masters 1000",
  "player1": { "name": "Carlos Alcaraz", "country": "🇪🇸", "rank": 2 },
  "player2": { "name": "Novak Djokovic", "country": "🇷🇸", "rank": 1 },
  "score": { "sets": [{"p1": 6, "p2": 4}] },
  "status": "live",
  "startTime": "2024-11-18T10:00:00.000Z"
}
```

### Torneo de Golf:
```json
{
  "id": 1,
  "name": "PGA Tour Championship",
  "location": "Atlanta, GA",
  "status": "live",
  "round": 3,
  "totalRounds": 4,
  "leaderboard": [
    { "position": 1, "player": "Scottie Scheffler", "score": -18 }
  ]
}
```

---

## 🎓 Recursos Adicionales

- **Documentación de la API**: `server/README.md`
- **Configurar MongoDB**: `CONFIGURAR_MONGODB.md`
- **Configurar APIs**: `CONFIGURAR_APIS.md`
- **Autenticación JWT**: `AUTENTICACION_JWT.md`
- **Landing Page**: `LANDING_PAGE_DOCS.md`
- **React App**: `REACT_APP_DOCS.md`

---

## ✅ Checklist de Inicio

- [ ] MongoDB instalado y corriendo
- [ ] Backend iniciado en `http://localhost:5000`
- [ ] Frontend React iniciado en `http://localhost:5173`
- [ ] Base de datos poblada (opcional, pero recomendado)
- [ ] APIs configuradas (opcional, funciona sin ellas)
- [ ] Usuario de prueba creado o usando `admin@aceputt.com`

---

**¡Todo listo para usar!** 🚀

