# 🚀 Cómo Usar la API con el Frontend

## 📋 Resumen

La API REST que creamos sirve para:
- **Centralizar los datos**: Todos los datos (partidos, torneos, rankings, apuestas) están en el servidor
- **Comunicación Frontend-Backend**: El frontend hace peticiones HTTP y recibe datos JSON
- **Operaciones CRUD**: Crear, leer, actualizar y eliminar datos

## 🔧 Configuración

### 1. Iniciar el Servidor de la API

```bash
cd server
npm install  # Solo la primera vez
npm run dev  # Inicia el servidor en http://localhost:5000
```

### 2. El Frontend ya está configurado

El código ya está actualizado para usar la API. Si la API no está disponible, automáticamente usa datos mock como respaldo.

## 📡 Endpoints Disponibles

### Partidos de Tenis
- `GET http://localhost:5000/api/matches` - Todos los partidos
- `GET http://localhost:5000/api/matches?status=live` - Solo en vivo
- `GET http://localhost:5000/api/matches?status=scheduled` - Solo programados
- `GET http://localhost:5000/api/matches/:id` - Un partido específico
- `POST http://localhost:5000/api/matches` - Crear partido
- `PATCH http://localhost:5000/api/matches/:id` - Actualizar partido
- `DELETE http://localhost:5000/api/matches/:id` - Eliminar partido

### Torneos de Golf
- `GET http://localhost:5000/api/tournaments` - Todos los torneos
- `GET http://localhost:5000/api/tournaments?status=live` - Solo en vivo
- `GET http://localhost:5000/api/tournaments/:id` - Un torneo específico
- `POST http://localhost:5000/api/tournaments` - Crear torneo
- `PATCH http://localhost:5000/api/tournaments/:id` - Actualizar torneo
- `DELETE http://localhost:5000/api/tournaments/:id` - Eliminar torneo

### Apuestas
- `GET http://localhost:5000/api/bets` - Todas las apuestas
- `GET http://localhost:5000/api/bets?userId=user123` - Apuestas de un usuario
- `POST http://localhost:5000/api/bets` - Crear apuesta
- `PATCH http://localhost:5000/api/bets/:id` - Actualizar apuesta
- `DELETE http://localhost:5000/api/bets/:id` - Eliminar apuesta

### Rankings
- `GET http://localhost:5000/api/rankings` - Todos los rankings
- `GET http://localhost:5000/api/rankings/atp` - Solo ATP
- `GET http://localhost:5000/api/rankings/wta` - Solo WTA
- `GET http://localhost:5000/api/rankings/pga` - Solo PGA

## 🔄 Flujo de Datos

```
1. Usuario hace acción en el frontend
   ↓
2. Frontend hace petición HTTP a la API
   ↓
3. API procesa la petición y devuelve JSON
   ↓
4. Frontend muestra los datos al usuario
```

## 💻 Ejemplo de Uso

### En React (dataService.js)
```javascript
// Obtener partidos en vivo
const response = await dataService.getLiveMatches()
if (response.success) {
  setMatches(response.data)
}
```

### En Landing Page (landing.html)
```javascript
// Obtener rankings
const response = await fetchAPI('/rankings/atp')
const rankings = response.data
```

## ✅ Ventajas

1. **Datos Reales**: Los datos vienen del servidor, no son simulados
2. **Actualizaciones**: Si cambias datos en el servidor, todos los usuarios los ven
3. **Escalable**: Fácil agregar más funcionalidades
4. **Mantenible**: Un solo lugar para manejar los datos

## 🎯 Próximos Pasos

1. **MongoDB**: Conectar la API con una base de datos real
2. **Autenticación**: Agregar login real con JWT
3. **WebSockets**: Actualizaciones en tiempo real
4. **Validaciones**: Validar datos antes de guardar

