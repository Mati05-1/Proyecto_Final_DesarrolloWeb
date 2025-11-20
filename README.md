# Ace Tennis - Plataforma de Tenis

Aplicación web completa para seguir resultados en tiempo real, estadísticas detalladas y sistema de apuestas virtuales para tenis.

## Descripción General

Plataforma full-stack que permite a los usuarios:
- Ver rankings ATP y WTA en tiempo real
- Seguir partidos en vivo
- Realizar apuestas virtuales con sistema de puntos
- Competir en un leaderboard global

## Tecnologías Usadas

**Frontend:**
- HTML5, CSS3, Bootstrap 5.3.2
- JavaScript (Vanilla)
- React 18 + Vite
- React Router DOM

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT para autenticación
- RapidAPI para datos de tenis

## Pasos de Instalación

1. **Instalar dependencias del frontend:**
```bash
npm install
```

2. **Instalar dependencias del backend:**
```bash
cd server
npm install
```

3. **Configurar MongoDB:**
```bash
# Opción 1: MongoDB Local (macOS)
brew install mongodb-community
brew services start mongodb-community

# Opción 2: MongoDB Atlas (gratis)
# Crear cuenta en https://www.mongodb.com/cloud/atlas
# Agregar MONGODB_URI en server/.env
```

4. **Configurar API Key (opcional):**
```bash
# Crear archivo server/.env
RAPIDAPI_KEY=tu_api_key_aqui
MONGODB_URI=mongodb://localhost:27017/ace-putt
JWT_SECRET=tu_secret_key
```

5. **Iniciar servidor backend:**
```bash
cd server
npm start
# Servidor en http://localhost:5001
```

6. **Iniciar frontend:**
```bash
# Para React app
npm run dev
# App en http://localhost:3000

# Para landing page
# Abrir landing.html en navegador o usar servidor HTTP
# Ejemplo: python3 -m http.server 3001
```

## Endpoints de la API

**Base URL:** `http://localhost:5001/api`

### Autenticación (`/api/auth`)
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual (requiere token)
- `GET /api/auth/leaderboard` - Obtener ranking de usuarios

### Partidos (`/api/matches`)
- `GET /api/matches` - Obtener todos los partidos
- `GET /api/matches?status=live` - Filtrar por estado
- `GET /api/matches/:id` - Obtener partido por ID

### Rankings (`/api/rankings`)
- `GET /api/rankings` - Obtener todos los rankings (ATP, WTA)
- `GET /api/rankings/atp` - Obtener ranking ATP
- `GET /api/rankings/wta` - Obtener ranking WTA

### Apuestas (`/api/bets`)
- `GET /api/bets` - Obtener todas las apuestas
- `GET /api/bets?userId=id` - Filtrar por usuario
- `POST /api/bets` - Crear nueva apuesta (requiere token)
- `PATCH /api/bets/:id` - Actualizar apuesta (requiere token)
- `DELETE /api/bets/:id` - Eliminar apuesta (requiere token)
