# ✅ APIs Configuradas - RapidAPI

## 🔑 API Key Configurada

Tu RapidAPI Key ya está configurada en `server/.env`:
```
RAPIDAPI_KEY=1eed17060amshcf5c7ba23ab9670p18f15ejsn9b4717e52e26
```

## ⛳ API de Golf - CONFIGURADA

**Endpoint Base:** `https://live-golf-data.p.rapidapi.com`

**Endpoints que se usan:**
- `GET /schedule?orgId=1&year=2024` - Obtiene el calendario de torneos
- `GET /leaderboard?tournamentId={id}` - Obtiene el leaderboard de un torneo

**Headers:**
- `X-RapidAPI-Key`: Tu API key
- `X-RapidAPI-Host`: `live-golf-data.p.rapidapi.com`

## 🎾 API de Tenis - CONFIGURADA

**Endpoint Base:** `https://tennis-live-data.p.rapidapi.com`

**Endpoints que se intentan (en orden):**
1. `/matches/live` - Partidos en vivo
2. `/matches` - Todos los partidos
3. `/schedule` - Calendario
4. `/matches/today` - Partidos de hoy
5. `/live-scores` - Scores en vivo
6. `/matches/upcoming` - Próximos partidos
7. `/scores/live` - Scores en vivo (alternativo)

El sistema intentará cada endpoint hasta encontrar uno que funcione.

**Headers:**
- `X-RapidAPI-Key`: Tu API key
- `X-RapidAPI-Host`: `tennis-live-data.p.rapidapi.com`

## 🔧 Cómo Funciona

1. **Si la API responde correctamente:**
   - Los datos se transforman automáticamente al formato de la aplicación
   - Se muestran en el frontend

2. **Si la API falla o no está disponible:**
   - Automáticamente se usan datos mock (simulados)
   - El simulador sigue funcionando como respaldo
   - No se interrumpe el servicio

## 🚀 Probar las APIs

### 1. Reiniciar el servidor

```bash
cd server
node server.js
```

### 2. Verificar en la consola

Deberías ver:
```
✅ APIs Externas Configuradas:
   🔑 RapidAPI: Configurada
   🎾 Tenis: rapidapi
   ⛳ Golf: rapidapi (RapidAPI)
```

### 3. Probar endpoints

**Golf:**
```bash
curl http://localhost:5000/api/tournaments
```

**Tenis:**
```bash
curl http://localhost:5000/api/matches
```

## 📝 Notas Importantes

- **Misma API Key**: Ambas APIs (golf y tenis) usan la misma `RAPIDAPI_KEY`
- **Fallback Automático**: Si una API falla, se usan datos mock
- **Logs en Consola**: El servidor muestra qué endpoints está intentando
- **Transformación Automática**: Los datos se adaptan al formato de la app

## 🔍 Verificar que Funciona

1. **Inicia el servidor** y revisa los logs
2. **Haz una petición** desde el frontend o con curl
3. **Revisa la consola** para ver qué endpoints funcionaron

## ⚠️ Si una API no funciona

- Verifica que tengas suscripción activa en RapidAPI
- Revisa los logs del servidor para ver qué error da
- El sistema automáticamente usará datos mock como respaldo

¡Todo listo! 🚀

