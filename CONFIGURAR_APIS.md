# 🔌 Cómo Configurar APIs Externas

## 📋 Opciones

Tienes **3 opciones** para obtener datos reales:

### Opción 1: Proporcionar tus APIs (Recomendado si las tienes)

Si ya tienes APIs de tenis y golf:

1. **Crea un archivo `.env` en la carpeta `server/`:**

```bash
cd server
cp .env.example .env
```

2. **Edita el archivo `.env` con tus APIs:**

```env
# API de Tenis
TENNIS_API_URL=https://tu-api-tenis.com/matches
TENNIS_API_KEY=tu_api_key_aqui
TENNIS_API_PROVIDER=custom

# API de Golf  
GOLF_API_URL=https://tu-api-golf.com/tournaments
GOLF_API_KEY=tu_api_key_aqui
GOLF_API_PROVIDER=custom
```

3. **Habilita las APIs en el código:**

Edita `server/services/externalAPIs.js` y cambia:
```javascript
tennis: {
  enabled: true, // Cambiar a true
  ...
}
```

### Opción 2: Usar APIs Gratuitas

#### APIs Gratuitas de Tenis:
- **RapidAPI Tennis**: https://rapidapi.com/hub
- **TheSportsDB**: https://www.thesportsdb.com/api.php
- **API-Football** (tiene algunos datos de tenis)

#### APIs Gratuitas de Golf:
- Pocas opciones gratuitas disponibles
- La mayoría requieren suscripción

### Opción 3: Usar el Simulador (Actual)

El simulador actual funciona perfectamente para desarrollo/demostración:
- ✅ Actualiza datos automáticamente
- ✅ Simula tiempo real
- ✅ No requiere APIs externas
- ✅ Gratis

## 🚀 Pasos para Configurar

### Si tienes APIs:

1. **Dame la información de tus APIs:**
   - URL base
   - API Key (si la requiere)
   - Formato de respuesta (JSON)
   - Headers necesarios

2. **Yo ajusto el código** para que funcione con tu formato específico

3. **Pruebas** y verificamos que todo funcione

### Si NO tienes APIs:

1. **Buscamos APIs gratuitas** juntos
2. **O usamos el simulador** que ya está funcionando

## 📝 Formato Esperado

### Para Tenis:
```json
{
  "id": 1,
  "tournament": "ATP Masters 1000",
  "player1": { "name": "...", "country": "...", "rank": 1 },
  "player2": { "name": "...", "country": "...", "rank": 2 },
  "score": { "sets": [{"p1": 6, "p2": 4}] },
  "status": "live",
  "startTime": "2024-11-18T10:00:00Z"
}
```

### Para Golf:
```json
{
  "id": 1,
  "name": "PGA Tour Championship",
  "location": "Atlanta, GA",
  "status": "live",
  "round": 3,
  "totalRounds": 4,
  "leaderboard": [
    { "position": 1, "player": "...", "country": "...", "score": -18 }
  ]
}
```

## 💡 ¿Qué Prefieres?

1. **¿Tienes APIs?** → Dámelas y las integro
2. **¿Quieres buscar APIs gratuitas?** → Te ayudo a encontrar
3. **¿Usar el simulador?** → Ya está funcionando

¡Dime qué opción prefieres y lo configuramos!

