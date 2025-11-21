# API REST - Ace & Putt Backend

Backend desarrollado con **Node.js**, **Express** y **MongoDB + Mongoose** para la plataforma de Tenis y Golf.

##  Base de Datos

Este backend est√ integrado con **MongoDB** usando **Mongoose**:
-  Modelos con validaciones
-  Fallback autom√tico a datos en memoria si MongoDB no est√ disponible
-  Soporte para MongoDB local o MongoDB Atlas

Ver `CONFIGURAR_MONGODB.md` para m√s detalles sobre la configuraci√n.

##  Inicio R√pido

### Instalaci√n

```bash
cd server
npm install
```

### Configurar MongoDB

**Opci√n 1: MongoDB Local**
```bash
# macOS
brew install mongodb-community

# Iniciar MongoDB
brew services start mongodb-community
```

**Opci√n 2: MongoDB Atlas (Gratis)**
1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea una cuenta gratuita
3. Crea un cluster
4. Obt√©n tu connection string
5. Agrega a `server/.env`:
```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/ace-putt
```

**Opci√n 3: Sin MongoDB**
El servidor funcionar√ con datos en memoria (mock) si MongoDB no est√ disponible.

### Ejecutar Servidor

```bash
# Modo desarrollo (con watch)
npm run dev

# Modo producci√n
npm start
```

El servidor se ejecutar√ en: **http://localhost:5000**

##  Documentaci√n de Endpoints

### Base URL
```
http://localhost:5000/api
```

---

##  Partidos de Tenis (`/api/matches`)

### GET `/api/matches`
Obtener todos los partidos de tenis.

**Query Parameters:**
- `status` (opcional): Filtrar por estado (`live`, `finished`, `scheduled`)
- `player` (opcional): Buscar por nombre de jugador

**Ejemplo:**
```bash
GET /api/matches
GET /api/matches?status=live
GET /api/matches?player=Alcaraz
```

**Respuesta:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 1,
      "tournament": "ATP Masters 1000",
      "player1": {
        "name": "Carlos Alcaraz",
        "country": "",
        "rank": 2
      },
      "player2": {
        "name": "Novak Djokovic",
        "country": "",
        "rank": 1
      },
      "score": {
        "sets": [{"p1": 6, "p2": 4}, {"p1": 3, "p2": 6}]
      },
      "status": "live",
      "time": "2h 15m",
      "startTime": "2024-11-18T10:00:00.000Z",
      "createdAt": "2024-11-18T08:00:00.000Z"
    }
  ]
}
```

### GET `/api/matches/:id`
Obtener un partido espec√≠fico por ID.

**Ejemplo:**
```bash
GET /api/matches/1
```

**Respuesta:**
```json
{
  "success": true,
  "data": { ... }
}
```

### POST `/api/matches`
Crear un nuevo partido.

**Body (JSON):**
```json
{
  "tournament": "ATP 500",
  "player1": {
    "name": "Rafael Nadal",
    "country": "",
    "rank": 5
  },
  "player2": {
    "name": "Stefanos Tsitsipas",
    "country": "",
    "rank": 6
  },
  "startTime": "2024-11-20T14:00:00.000Z"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Partido creado exitosamente",
  "data": { ... }
}
```

### PATCH `/api/matches/:id`
Actualizar un partido existente.

**Body (JSON) - Campos permitidos:**
- `status`: Estado del partido
- `score`: Puntuaci√n actual
- `time`: Tiempo transcurrido
- `winner`: Ganador (1 o 2)

**Ejemplo:**
```json
{
  "status": "finished",
  "winner": 1,
  "score": {
    "sets": [{"p1": 6, "p2": 4}, {"p1": 6, "p2": 3}]
  }
}
```

### DELETE `/api/matches/:id`
Eliminar un partido.

**Respuesta:**
```json
{
  "success": true,
  "message": "Partido eliminado exitosamente",
  "data": { ... }
}
```

---

##  Torneos de Golf (`/api/tournaments`)

### GET `/api/tournaments`
Obtener todos los torneos de golf.

**Query Parameters:**
- `status` (opcional): Filtrar por estado (`live`, `scheduled`)

**Ejemplo:**
```bash
GET /api/tournaments
GET /api/tournaments?status=live
```

**Respuesta:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "name": "PGA Tour Championship",
      "location": "Atlanta, GA",
      "status": "live",
      "round": 3,
      "totalRounds": 4,
      "leaderboard": [
        {
          "position": 1,
          "player": "Scottie Scheffler",
          "country": "",
          "score": -18,
          "today": -5
        }
      ],
      "startTime": "2024-11-16T10:00:00.000Z",
      "createdAt": "2024-11-15T10:00:00.000Z"
    }
  ]
}
```

### GET `/api/tournaments/:id`
Obtener un torneo espec√≠fico por ID.

### POST `/api/tournaments`
Crear un nuevo torneo.

**Body (JSON):**
```json
{
  "name": "US Open",
  "location": "Pinehurst, NC",
  "startTime": "2024-12-01T08:00:00.000Z",
  "totalRounds": 4
}
```

### PATCH `/api/tournaments/:id`
Actualizar un torneo.

**Campos permitidos:**
- `status`: Estado del torneo
- `round`: Ronda actual
- `leaderboard`: Tabla de posiciones
- `name`: Nombre del torneo
- `location`: Ubicaci√n

### DELETE `/api/tournaments/:id`
Eliminar un torneo.

---

##  Apuestas (`/api/bets`)

### GET `/api/bets`
Obtener todas las apuestas.

**Query Parameters:**
- `userId` (opcional): Filtrar por usuario
- `status` (opcional): Filtrar por estado (`pending`, `won`, `lost`)
- `type` (opcional): Filtrar por tipo (`tennis`, `golf`)

**Ejemplo:**
```bash
GET /api/bets
GET /api/bets?userId=user123
GET /api/bets?status=pending&type=tennis
```

**Respuesta:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "userId": "user123",
      "type": "tennis",
      "matchId": 1,
      "selection": 1,
      "selectionName": "Carlos Alcaraz",
      "amount": 100,
      "status": "pending",
      "createdAt": "2024-11-18T10:00:00.000Z"
    }
  ]
}
```

### GET `/api/bets/:id`
Obtener una apuesta espec√≠fica por ID.

### POST `/api/bets`
Crear una nueva apuesta.

**Body (JSON) - Apuesta de Tenis:**
```json
{
  "userId": "user123",
  "type": "tennis",
  "matchId": 1,
  "selection": 1,
  "selectionName": "Carlos Alcaraz",
  "amount": 100
}
```

**Body (JSON) - Apuesta de Golf:**
```json
{
  "userId": "user123",
  "type": "golf",
  "tournamentId": 1,
  "selection": 1,
  "selectionName": "Scottie Scheffler",
  "amount": 200
}
```

**Validaciones:**
- Monto m√≠nimo: 10 puntos
- Para tenis: requiere `matchId`
- Para golf: requiere `tournamentId`

### PATCH `/api/bets/:id`
Actualizar una apuesta.

**Campos permitidos:**
- `status`: Estado de la apuesta
- `amount`: Monto (solo si est√ pendiente)

### DELETE `/api/bets/:id`
Eliminar una apuesta (solo si est√ pendiente).

---

##  Rankings (`/api/rankings`)

### GET `/api/rankings`
Obtener todos los rankings (ATP, WTA, PGA).

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "atp": [...],
    "wta": [...],
    "pga": [...]
  }
}
```

### GET `/api/rankings/:type`
Obtener ranking por tipo.

**Tipos v√lidos:** `atp`, `wta`, `pga`

**Ejemplo:**
```bash
GET /api/rankings/atp
GET /api/rankings/wta
GET /api/rankings/pga
```

**Respuesta:**
```json
{
  "success": true,
  "type": "atp",
  "count": 4,
  "data": [
    {
      "rank": 1,
      "player": "Novak Djokovic",
      "country": "",
      "points": 9795
    }
  ]
}
```

---

##  Autenticaci√n (`/api/auth`)

### POST `/api/auth/register`
Registrar un nuevo usuario.

**Body (JSON):**
```json
{
  "username": "usuario123",
  "email": "usuario@example.com",
  "password": "contrase√±a123"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": 1,
      "username": "usuario123",
      "email": "usuario@example.com",
      "role": "user",
      "points": 1000
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### POST `/api/auth/login`
Iniciar sesi√n.

**Body (JSON):**
```json
{
  "email": "usuario@example.com",
  "password": "contrase√±a123"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Inicio de sesi√n exitoso",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### GET `/api/auth/me`
Obtener informaci√n del usuario actual (requiere token).

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "usuario123",
    "email": "usuario@example.com",
    "role": "user",
    "points": 1000
  }
}
```

### GET `/api/auth/users`
Obtener todos los usuarios (solo administradores).

**Headers:**
```
Authorization: Bearer <admin_token>
```

---

##  Panel de Administraci√n (`/api/admin`)

Todas las rutas requieren autenticaci√n y rol de administrador.

### GET `/api/admin/dashboard`
Obtener estad√≠sticas del dashboard.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "matches": {
      "total": 5,
      "live": 2,
      "finished": 2,
      "scheduled": 1
    },
    "tournaments": {
      "total": 3,
      "live": 2,
      "scheduled": 1
    },
    "bets": {
      "total": 2,
      "pending": 2,
      "won": 0,
      "lost": 0
    },
    "rankings": {
      "total": 3
    }
  }
}
```

### DELETE `/api/admin/matches/:id`
Eliminar un partido (solo admin).

### DELETE `/api/admin/tournaments/:id`
Eliminar un torneo (solo admin).

**Usuarios de prueba:**
- **Admin**: `admin@aceputt.com` / `admin123`
- **Usuario**: `demo@aceputt.com` / `demo123`

---

##  Endpoints Adicionales

### GET `/`
Informaci√n general de la API.

**Respuesta:**
```json
{
  "message": "Ace & Putt API - Backend para plataforma de Tenis y Golf",
  "version": "1.0.0",
  "endpoints": {
    "matches": "/api/matches",
    "tournaments": "/api/tournaments",
    "bets": "/api/bets",
    "rankings": "/api/rankings"
  }
}
```

### GET `/api/health`
Estado de salud del servidor.

**Respuesta:**
```json
{
  "status": "OK",
  "timestamp": "2024-11-18T12:00:00.000Z",
  "uptime": 3600
}
```

---

##  Estructura de Datos

### Partido de Tenis
```typescript
{
  id: number
  tournament: string
  player1: { name: string, country: string, rank: number }
  player2: { name: string, country: string, rank: number }
  score: { sets: Array<{p1: number, p2: number}> }
  status: 'live' | 'finished' | 'scheduled'
  time?: string
  startTime: string (ISO)
  winner?: number (1 o 2)
  createdAt: string (ISO)
}
```

### Torneo de Golf
```typescript
{
  id: number
  name: string
  location: string
  status: 'live' | 'scheduled'
  round: number
  totalRounds: number
  leaderboard: Array<{
    position: number
    player: string
    country: string
    score: number
    today: number
  }>
  startTime: string (ISO)
  createdAt: string (ISO)
}
```

### Apuesta
```typescript
{
  id: number
  userId: string
  type: 'tennis' | 'golf'
  matchId?: number
  tournamentId?: number
  selection: number
  selectionName: string
  amount: number
  status: 'pending' | 'won' | 'lost'
  createdAt: string (ISO)
}
```

---

##  C√digos de Estado HTTP

- `200` - OK (Operaci√n exitosa)
- `201` - Created (Recurso creado)
- `400` - Bad Request (Datos inv√lidos)
- `404` - Not Found (Recurso no encontrado)
- `500` - Internal Server Error (Error del servidor)

---

##  Notas

- Todos los endpoints devuelven respuestas en formato JSON
- **MongoDB integrado**: Los datos se guardan en MongoDB si est√ disponible
- **Fallback autom√tico**: Si MongoDB no est√ disponible, usa datos en memoria
- El servidor incluye CORS habilitado para permitir peticiones del frontend
- **Validaciones**: Todos los modelos tienen validaciones de campos requeridos y formatos

---

##  Integraci√n con Frontend

Para conectar el frontend React con esta API, actualiza las URLs en los servicios:

```javascript
// En src/services/dataService.js
const API_BASE_URL = 'http://localhost:5000/api'

// Ejemplo de uso
const response = await fetch(`${API_BASE_URL}/matches`)
const data = await response.json()
```

---

##  Licencia

Este proyecto es de uso educativo.

