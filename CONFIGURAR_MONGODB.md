# 🗄️ Configurar MongoDB

## ✅ MongoDB + Mongoose Integrado

He integrado MongoDB con Mongoose en tu proyecto. Ahora los datos se guardan en una base de datos real.

## 🚀 Opciones para MongoDB

### Opción 1: MongoDB Local (Recomendado para desarrollo)

**Instalar MongoDB:**
```bash
# macOS
brew install mongodb-community

# Iniciar MongoDB
brew services start mongodb-community
```

**Verificar que funciona:**
```bash
mongosh
# Deberías ver: "Current Mongosh Log ID: ..."
```

**Configurar en `.env`:**
```env
MONGODB_URI=mongodb://localhost:27017/ace-putt
```

### Opción 2: MongoDB Atlas (Gratis - Recomendado para producción)

1. **Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)**
   - Es gratis hasta 512MB
   - No requiere tarjeta de crédito

2. **Crear un Cluster**
   - Elige la opción gratuita (M0)
   - Selecciona la región más cercana

3. **Configurar acceso:**
   - Database Access: Crea un usuario y contraseña
   - Network Access: Agrega `0.0.0.0/0` (permite desde cualquier IP)

4. **Obtener Connection String:**
   - Click en "Connect" → "Connect your application"
   - Copia la URL, ejemplo:
   ```
   mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/ace-putt?retryWrites=true&w=majority
   ```

5. **Agregar a `server/.env`:**
   ```env
   MONGODB_URI=mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/ace-putt?retryWrites=true&w=majority
   ```

### Opción 3: Sin MongoDB (Fallback)

Si no configuras MongoDB, el servidor funcionará con datos en memoria (mock). Los datos se perderán al reiniciar el servidor.

## 📋 Modelos Creados (con Validaciones)

### 1. **Match** (Partidos de Tenis)
- `tournament`: String (requerido)
- `player1`: Object con name, country, rank (requerido)
- `player2`: Object con name, country, rank (requerido)
- `score`: Object con sets array
- `status`: Enum ['scheduled', 'live', 'finished']
- `startTime`: Date (requerido)
- `winner`: Number [1, 2] (opcional)

**Validaciones:**
- ✅ Nombre del torneo requerido
- ✅ Jugadores requeridos
- ✅ Ranking mínimo: 1
- ✅ Estado válido
- ✅ Ganador solo si está terminado

### 2. **Tournament** (Torneos de Golf)
- `name`: String (requerido)
- `location`: String (requerido)
- `status`: Enum ['scheduled', 'live', 'finished']
- `round`: Number (mínimo 1)
- `totalRounds`: Number (mínimo 1, default 4)
- `leaderboard`: Array de jugadores
- `startTime`: Date (requerido)

**Validaciones:**
- ✅ Nombre y ubicación requeridos
- ✅ Ronda no puede ser mayor al total de rondas
- ✅ Estado válido

### 3. **Bet** (Apuestas)
- `userId`: String (requerido)
- `type`: Enum ['tennis', 'golf'] (requerido)
- `matchId`: ObjectId (requerido si type='tennis')
- `tournamentId`: ObjectId (requerido si type='golf')
- `selection`: Number (requerido, mínimo 1)
- `selectionName`: String (requerido)
- `amount`: Number (requerido, mínimo 10)
- `status`: Enum ['pending', 'won', 'lost']

**Validaciones:**
- ✅ Usuario requerido
- ✅ Tipo válido
- ✅ matchId requerido para tenis
- ✅ tournamentId requerido para golf
- ✅ Monto mínimo: 10 puntos

### 4. **Ranking** (Rankings)
- `type`: Enum ['atp', 'wta', 'pga'] (requerido, único)
- `players`: Array de jugadores con rank, player, country, points
- `lastUpdated`: Date

**Validaciones:**
- ✅ Tipo único (solo un ranking por tipo)
- ✅ Jugadores con puntos no negativos

## 🔧 Cómo Funciona

1. **Prioridad de datos:**
   - 1️⃣ MongoDB (si está conectado)
   - 2️⃣ API Externa (RapidAPI)
   - 3️⃣ Datos Mock (en memoria)

2. **Fallback automático:**
   - Si MongoDB falla → usa API externa
   - Si API externa falla → usa datos mock
   - El servidor nunca se cae

## 🚀 Poblar Base de Datos

Para llenar la base de datos con datos iniciales:

```bash
cd server
node scripts/seedDatabase.js
```

Esto insertará:
- Partidos de tenis
- Torneos de golf
- Apuestas de ejemplo
- Rankings (ATP, WTA, PGA)

## 📝 Verificar que Funciona

1. **Inicia el servidor:**
   ```bash
   cd server
   node server.js
   ```

2. **Deberías ver:**
   ```
   ✅ MongoDB conectado: localhost:27017
      Base de datos: ace-putt
   ```

3. **O si no hay MongoDB:**
   ```
   ❌ Error conectando a MongoDB: ...
   ⚠️  El servidor seguirá funcionando con datos en memoria
   ```

## 🎯 Próximos Pasos

1. **Configura MongoDB** (local o Atlas)
2. **Agrega `MONGODB_URI` a `server/.env`**
3. **Reinicia el servidor**
4. **Opcional: Ejecuta `seedDatabase.js` para datos iniciales**

¡Listo! 🚀

