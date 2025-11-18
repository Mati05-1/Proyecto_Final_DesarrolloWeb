# 🔌 Configurar RapidAPI para Golf

## ✅ API de Golf Integrada

He integrado la API de **Live Golf Data** de RapidAPI que viste en la imagen.

## 🚀 Pasos para Configurar

### 1. Obtener tu RapidAPI Key

1. Ve a [RapidAPI](https://rapidapi.com/)
2. Crea una cuenta o inicia sesión
3. Suscríbete a **Live Golf Data** (puede tener plan gratuito)
4. Copia tu **X-RapidAPI-Key** desde el dashboard

### 2. Crear archivo `.env`

```bash
cd server
cp .env.example .env
```

### 3. Agregar tu API Key

Edita el archivo `server/.env` y agrega:

```env
RAPIDAPI_KEY=tu_rapidapi_key_aqui
```

**Ejemplo:**
```env
RAPIDAPI_KEY=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

### 4. Reiniciar el servidor

```bash
cd server
node server.js
```

## 📋 Endpoints que se Usan

La API está configurada para usar:

1. **Schedule**: `GET /schedule?orgId=1&year=2024`
   - Obtiene la lista de torneos programados

2. **Leaderboard**: `GET /leaderboard?tournamentId={id}`
   - Obtiene el leaderboard de un torneo en vivo (si está disponible)

## 🔍 Verificar que Funciona

Cuando inicies el servidor, deberías ver:

```
✅ APIs Externas Configuradas:
   🔑 RapidAPI: Configurada
   ⛳ Golf: rapidapi (RapidAPI)
```

## ⚠️ Notas Importantes

- **Plan Gratuito**: Algunas APIs de RapidAPI tienen límites en el plan gratuito
- **Rate Limits**: Respeta los límites de peticiones por minuto/hora
- **Fallback**: Si la API falla, automáticamente se usan datos mock
- **Tenis**: Si también tienes una API de tenis, puedes agregarla en `.env`

## 🎾 ¿Y la API de Tenis?

Si también tienes una API de tenis de RapidAPI o de otro proveedor, puedo integrarla de la misma manera. Solo necesito:
- La URL del endpoint
- Los headers necesarios
- Un ejemplo de la respuesta JSON

## 💡 Próximos Pasos

1. **Agrega tu RAPIDAPI_KEY** en `server/.env`
2. **Reinicia el servidor**
3. **Prueba los endpoints** en el frontend

¡Listo! 🚀

