/**
 * Servidor Express para API REST de Ace & Putt
 * Backend para la plataforma de tenis y golf
 */
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/database.js'
import { matchesRouter } from './routes/matches.js'
import { tournamentsRouter } from './routes/tournaments.js'
import { betsRouter } from './routes/bets.js'
import { rankingsRouter } from './routes/rankings.js'
import { authRouter } from './routes/auth.js'
import { adminRouter } from './routes/admin.js'
import { startLiveUpdates } from './utils/liveUpdater.js'
import { getAPIConfig } from './services/externalAPIs.js'

// Cargar variables de entorno
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors()) // Permitir CORS para el frontend
app.use(express.json()) // Parsear JSON en requests

// Rutas
app.use('/api/auth', authRouter)
app.use('/api/admin', adminRouter)
app.use('/api/matches', matchesRouter)
app.use('/api/tournaments', tournamentsRouter)
app.use('/api/bets', betsRouter)
app.use('/api/rankings', rankingsRouter)

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'Ace & Putt API - Backend para plataforma de Tenis y Golf',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      admin: '/api/admin',
      matches: '/api/matches',
      tournaments: '/api/tournaments',
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
  console.log(`📚 Documentación disponible en /api`)
  
  // Conectar a MongoDB
  await connectDB()
  
  // Verificar configuración de APIs
  const apiConfig = getAPIConfig()
  
  if (apiConfig.tennis.enabled || apiConfig.golf.enabled) {
    console.log(`\n✅ APIs Externas Configuradas:`)
    if (apiConfig.rapidapi.enabled) {
      console.log(`   🔑 RapidAPI: Configurada`)
    }
    if (apiConfig.tennis.enabled) {
      console.log(`   🎾 Tenis: ${apiConfig.tennis.provider}`)
    }
    if (apiConfig.golf.enabled) {
      console.log(`   ⛳ Golf: ${apiConfig.golf.provider} (RapidAPI)`)
    }
    console.log(`\n💡 Los datos se obtendrán de APIs reales`)
    console.log(`   Si una API falla, se usará el simulador como respaldo\n`)
  } else {
    console.log(`\n⚠️  NOTA: Este servidor usa datos MOCK (simulados)`)
    console.log(`   Para datos reales, configura RAPIDAPI_KEY en .env`)
    console.log(`   Ver: CONFIGURAR_APIS.md para más información\n`)
  }
  
  // Iniciar simulador de actualizaciones en tiempo real
  // Funciona como respaldo si las APIs fallan
  startLiveUpdates(10000) // 10 segundos
})

