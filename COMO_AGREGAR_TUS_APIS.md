# 🔌 Cómo Agregar tus APIs de Tenis y Golf

## 📋 Opciones

Tienes **3 opciones**:

### ✅ Opción 1: Proporcionar tus APIs (Si las tienes)

**Si ya tienes APIs de tenis y golf**, solo necesito:

1. **URL de la API de Tenis**
2. **API Key** (si la requiere)
3. **URL de la API de Golf**
4. **API Key** (si la requiere)
5. **Formato de respuesta** (un ejemplo de JSON que devuelve)

**Yo ajusto el código** para que funcione con tu formato específico.

### ✅ Opción 2: Buscar APIs Gratuitas

Puedo ayudarte a buscar APIs gratuitas disponibles:
- RapidAPI tiene algunas opciones
- TheSportsDB (gratis pero limitado)
- Otras opciones gratuitas

### ✅ Opción 3: Usar el Simulador (Actual)

El simulador ya está funcionando y actualiza datos automáticamente cada 10 segundos.

## 🚀 Pasos para Agregar tus APIs

### Paso 1: Crear archivo `.env`

```bash
cd server
cp .env.example .env
```

### Paso 2: Editar `.env` con tus APIs

```env
# API de Tenis
TENNIS_API_URL=https://tu-api-tenis.com/endpoint
TENNIS_API_KEY=tu_api_key_aqui
TENNIS_API_PROVIDER=custom

# API de Golf
GOLF_API_URL=https://tu-api-golf.com/endpoint
GOLF_API_KEY=tu_api_key_aqui
GOLF_API_PROVIDER=custom
```

### Paso 3: Darme el formato de respuesta

Envíame un ejemplo de cómo responde tu API, por ejemplo:

```json
{
  "matches": [
    {
      "id": 1,
      "tournament": "...",
      "player1": {...},
      ...
    }
  ]
}
```

Y yo ajusto la función `transformTennisData()` y `transformGolfData()` para que funcione.

## 📝 Formato que Necesito Saber

### Para Tenis:
- ¿Cómo viene el JSON? (estructura)
- ¿Cómo se llaman los campos? (player1, player1Name, homePlayer, etc.)
- ¿Cómo viene el score? (sets, games, etc.)
- ¿Cómo viene el status? (live, in-progress, playing, etc.)

### Para Golf:
- ¿Cómo viene el JSON?
- ¿Cómo se llama el leaderboard? (leaderboard, standings, players, etc.)
- ¿Cómo vienen las posiciones? (position, rank, pos, etc.)

## 💡 ¿Qué Prefieres?

1. **¿Tienes APIs?** → Dámelas y las integro
2. **¿Quieres buscar APIs gratuitas?** → Te ayudo
3. **¿Usar el simulador?** → Ya está funcionando

**Dime qué opción prefieres y lo configuramos juntos** 🚀

