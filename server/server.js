/**
 * Servidor Express para API REST de Ace Tennis
 * Backend para la plataforma de tenis
 */
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/database.js'
import { matchesRouter } from './routes/matches.js'
import { betsRouter } from './routes/bets.js'
import { rankingsRouter } from './routes/rankings.js'
import { authRouter } from './routes/auth.js'
import { adminRouter } from './routes/admin.js'
import { startLiveUpdates } from './utils/liveUpdater.js'
import { getAPIConfigStatus } from './services/externalAPIs.js'

// Cargar variables de entorno
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

// Middleware CORS - Configuracion mas especifica
// En producción, permite todas las URLs de Vercel
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? true // Permitir todos los orígenes en producción (Vercel usa múltiples dominios)
  : ['http://localhost:3001', 'http://localhost:3000', 'http://127.0.0.1:3001', 'http://127.0.0.1:3000']

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json()) // Parsear JSON en requests

// Rutas
app.use('/api/auth', authRouter)
app.use('/api/admin', adminRouter)
app.use('/api/matches', matchesRouter)
app.use('/api/bets', betsRouter)
app.use('/api/rankings', rankingsRouter)

// Ruta raiz
app.get('/', (req, res) => {
  res.json({
    message: 'Ace Tennis API - Backend para plataforma de Tenis',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      admin: '/api/admin',
      matches: '/api/matches',
      bets: '/api/bets',
      rankings: '/api/rankings'
    }
  })
})

// Ruta de salud del servidor
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    path: req.path,
    method: req.method
  })
})

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message
  })
})

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
  console.log(`📚 Documentacion disponible en /api`)
  
  // Conectar a MongoDB
  await connectDB()
  
  // Verificar configuracion de APIs
  const apiConfig = getAPIConfigStatus()
  
  if (apiConfig.tennis.enabled || apiConfig.golf.enabled) {
    console.log(`\n🌍 APIs Externas Configuradas:`)
    if (apiConfig.rapidapi.enabled) {
      console.log(`   ✅ RapidAPI: Configurada`)
    }
    if (apiConfig.tennis.enabled) {
      console.log(`   🎾 Tenis: ${apiConfig.tennis.provider}`)
    }
    if (apiConfig.golf.enabled) {
      console.log(`   ⛳ Golf: ${apiConfig.golf.provider} (RapidAPI)`)
    }
    console.log(`\n✅ Los datos se obtendran de APIs reales`)
    console.log(`   ⚠️  Si una API falla, se usara el simulador como respaldo\n`)
  } else {
    console.log(`\n⚠️  NOTA: Este servidor usa datos MOCK (simulados)`)
    console.log(`   💡 Para datos reales, configura RAPIDAPI_KEY en .env`)
    console.log(`   📝 Ver: CONFIGURAR_APIS.md para mas informacion\n`)
  }
  
  // Iniciar simulador de actualizaciones en tiempo real
  // Funciona como respaldo si las APIs fallan
  startLiveUpdates(10000) // 10 segundos
  
  // Precargar rankings en background con reintentos automaticos
  // Esto ayuda a tener datos disponibles incluso si hay rate limiting
  let retryCount = 0
  const maxRetries = 12 // Intentar durante 2 minutos (12 * 10 segundos)
  
  const preloadRankings = async () => {
    if (retryCount === 0) {
      console.log('\n📊 Precargando rankings en background...')
    }
    
    try {
      const { fetchATPRankings, fetchWTARankings } = await import('./services/tennisRankingsAPI.js')
      const atp = await fetchATPRankings()
      const wta = await fetchWTARankings()
      
      if (atp && atp.length > 0) {
        console.log(`✅ Rankings ATP precargados: ${atp.length} jugadores (en cache)`)
        return true // Exito
      }
      if (wta && wta.length > 0) {
        console.log(`✅ Rankings WTA precargados: ${wta.length} jugadoras (en cache)`)
        return true // Exito
      }
      
      // Si no hay datos y aun tenemos reintentos
      if (retryCount < maxRetries) {
        retryCount++
        console.log(`⏳ Rate limit activo, reintentando en 10 segundos... (intento ${retryCount}/${maxRetries})`)
        setTimeout(preloadRankings, 10000) // Reintentar en 10 segundos
      } else {
        console.log('⚠️  No se pudieron precargar rankings despues de varios intentos')
      }
      return false
    } catch (error) {
      if (retryCount < maxRetries) {
        retryCount++
        console.log(`⚠️  Error al precargar, reintentando en 10 segundos... (intento ${retryCount}/${maxRetries})`)
        setTimeout(preloadRankings, 10000)
      } else {
        console.log('❌ No se pudieron precargar rankings:', error.message)
      }
      return false
    }
  }
  
  // Iniciar precarga despues de 5 segundos
  setTimeout(preloadRankings, 5000)
})

