# Ace Tennis

## Descripción general

Ace Tennis es una plataforma web completa para seguir tenis en tiempo real, con estadísticas detalladas, rankings actualizados y un sistema de apuestas virtuales. Los usuarios pueden registrarse, ver rankings ATP y WTA, apostar en partidos y competir en un leaderboard global.

## Tecnologías usadas

- **Frontend**: HTML5, CSS3, Bootstrap 5.3.2, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Base de Datos**: MongoDB (MongoDB Atlas)
- **Autenticación**: JWT (JSON Web Tokens)
- **APIs Externas**: RapidAPI (Tennis API)
- **Despliegue**: Vercel (Frontend), Render (Backend)

## Pasos de instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/Mati05-1/Proyecto_Final_DesarrolloWeb.git
cd Proyecto_Final_DesarrolloWeb
```

2. Instalar dependencias del backend:
```bash
cd server
npm install
```

3. Configurar variables de entorno:
Crear archivo `.env` en la carpeta `server/` con:
```
MONGODB_URI=mongodb://localhost:27017/ace-tennis
RAPIDAPI_KEY=tu-rapidapi-key
JWT_SECRET=tu-secret-key
NODE_ENV=development
```

4. Iniciar el servidor backend:
```bash
npm start
```

5. Abrir el frontend:
Abrir `landing.html` en un navegador o usar un servidor HTTP local.

## Endpoints de la API

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual
- `GET /api/auth/leaderboard` - Obtener leaderboard de usuarios

### Partidos
- `GET /api/matches` - Obtener todos los partidos
- `GET /api/matches?status=live` - Obtener partidos en vivo
- `GET /api/matches?status=scheduled` - Obtener partidos programados

### Rankings
- `GET /api/rankings` - Obtener todos los rankings
- `GET /api/rankings/atp` - Obtener ranking ATP
- `GET /api/rankings/wta` - Obtener ranking WTA

### Apuestas
- `POST /api/bets` - Crear nueva apuesta
- `GET /api/bets` - Obtener apuestas del usuario
- `PATCH /api/bets/:id` - Actualizar estado de apuesta

### Health Check
- `GET /api/health` - Verificar estado del servidor
