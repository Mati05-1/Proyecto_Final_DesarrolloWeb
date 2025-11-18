# ¿Para qué sirve la API REST?

## 🎯 ¿Qué es una API REST?

Una **API REST (Application Programming Interface)** es como un "puente" entre el frontend (lo que ves en el navegador) y el backend (el servidor que maneja los datos).

## 📊 ¿Qué hace nuestra API?

Nuestra API REST (`/server/`) es el **backend** que:

1. **Almacena datos**: Partidos de tenis, torneos de golf, rankings, apuestas
2. **Procesa peticiones**: Cuando el frontend necesita datos, la API los entrega
3. **Maneja operaciones**: Crear, leer, actualizar y eliminar datos (CRUD)

## 🔌 Endpoints Disponibles

### 1. **Partidos de Tenis** (`/api/matches`)
- `GET /api/matches` - Obtener todos los partidos
- `GET /api/matches?status=live` - Solo partidos en vivo
- `GET /api/matches/:id` - Un partido específico
- `POST /api/matches` - Crear nuevo partido
- `PATCH /api/matches/:id` - Actualizar partido
- `DELETE /api/matches/:id` - Eliminar partido

### 2. **Torneos de Golf** (`/api/tournaments`)
- `GET /api/tournaments` - Todos los torneos
- `GET /api/tournaments?status=live` - Solo torneos en vivo
- `POST /api/tournaments` - Crear torneo
- `PATCH /api/tournaments/:id` - Actualizar torneo
- `DELETE /api/tournaments/:id` - Eliminar torneo

### 3. **Apuestas** (`/api/bets`)
- `GET /api/bets` - Todas las apuestas
- `GET /api/bets?userId=user123` - Apuestas de un usuario
- `POST /api/bets` - Crear nueva apuesta
- `PATCH /api/bets/:id` - Actualizar apuesta
- `DELETE /api/bets/:id` - Eliminar apuesta

### 4. **Rankings** (`/api/rankings`)
- `GET /api/rankings` - Todos los rankings (ATP, WTA, PGA)
- `GET /api/rankings/atp` - Solo ATP
- `GET /api/rankings/wta` - Solo WTA
- `GET /api/rankings/pga` - Solo PGA

## 🔄 Flujo de Datos

```
Frontend (React/Landing) 
    ↓ (Hace petición HTTP)
API REST (Node.js/Express)
    ↓ (Procesa y responde)
Frontend (Muestra datos)
```

## 💡 Ventajas de usar la API

1. **Datos centralizados**: Todos los datos en un solo lugar
2. **Reutilizable**: Múltiples frontends pueden usar la misma API
3. **Escalable**: Fácil agregar más funcionalidades
4. **Mantenible**: Cambios en un solo lugar afectan a todos

## 🚀 Próximo Paso: Conectar Frontend con API

Actualmente el frontend usa datos "mock" (simulados). Vamos a conectarlo con la API real.

