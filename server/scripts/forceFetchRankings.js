/**
 * Script para forzar la obtencin de rankings esperando que el rate limit se resetee
 * Uso: node server/scripts/forceFetchRankings.js
 */

import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { fetchATPRankings, fetchWTARankings } from '../services/tennisRankingsAPI.js'
import { connectDB, disconnectDB } from '../config/database.js'
import { Ranking } from '../models/Ranking.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '../.env') })

async function forceFetchRankings() {
  try {
    await connectDB()
    
    console.log('\n ==========================================')
    console.log('   FORZANDO OBTENCIN DE RANKINGS')
    console.log('==========================================\n')
    
    const maxAttempts = 10
    const waitTime = 15 // segundos entre intentos
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(`\n Intento ${attempt}/${maxAttempts}...`)
      
      // Intentar obtener ATP
      console.log(' Intentando obtener rankings ATP...')
      const atpRankings = await fetchATPRankings()
      
      if (atpRankings && atpRankings.length > 100) {
        console.log(` EXITO ATP: ${atpRankings.length} jugadores obtenidos`)
        console.log(` Primeros 3: ${atpRankings.slice(0, 3).map(p => `${p.rank}. ${p.player}`).join(', ')}`)
        
        // Guardar en MongoDB
        await Ranking.findOneAndUpdate(
          { type: 'atp' },
          { type: 'atp', players: atpRankings },
          { upsert: true, new: true }
        )
        console.log(' Rankings ATP guardados en MongoDB')
      } else {
        console.log(`  ATP: ${atpRankings ? atpRankings.length : 0} jugadores (no suficientes)`)
      }
      
      // Intentar obtener WTA
      console.log(' Intentando obtener rankings WTA...')
      const wtaRankings = await fetchWTARankings()
      
      if (wtaRankings && wtaRankings.length > 100) {
        console.log(` EXITO WTA: ${wtaRankings.length} jugadoras obtenidas`)
        console.log(` Primeras 3: ${wtaRankings.slice(0, 3).map(p => `${p.rank}. ${p.player}`).join(', ')}`)
        
        // Guardar en MongoDB
        await Ranking.findOneAndUpdate(
          { type: 'wta' },
          { type: 'wta', players: wtaRankings },
          { upsert: true, new: true }
        )
        console.log(' Rankings WTA guardados en MongoDB')
      } else {
        console.log(`  WTA: ${wtaRankings ? wtaRankings.length : 0} jugadoras (no suficientes)`)
      }
      
      // Si obtuvimos ambos, salir
      if (atpRankings && atpRankings.length > 100 && wtaRankings && wtaRankings.length > 100) {
        console.log('\n EXITO! Rankings obtenidos correctamente')
        break
      }
      
      // Si no es el ltimo intento, esperar
      if (attempt < maxAttempts) {
        console.log(`\n Esperando ${waitTime} segundos antes del siguiente intento...`)
        await new Promise(resolve => setTimeout(resolve, waitTime * 1000))
      }
    }
    
    console.log('\n==========================================')
    console.log(' Proceso completado\n')
    
  } catch (error) {
    console.error(' Error:', error.message)
  } finally {
    await disconnectDB()
    process.exit(0)
  }
}

forceFetchRankings()

