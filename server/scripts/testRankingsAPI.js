/**
 * Script para probar que los rankings funcionen correctamente
 * Uso: node server/scripts/testRankingsAPI.js
 */

import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { fetchATPRankings, fetchWTARankings } from '../services/tennisRankingsAPI.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Cargar .env
dotenv.config({ path: join(__dirname, '../.env') })

async function testRankings() {
  console.log('\n ==========================================')
  console.log('   PRUEBA DE RANKINGS DE TENIS')
  console.log('==========================================\n')
  
  console.log(' Configuracion:')
  console.log(`   RAPIDAPI_KEY: ${process.env.RAPIDAPI_KEY ? ' Configurada (' + process.env.RAPIDAPI_KEY.substring(0, 15) + '...)' : ' No configurada'}`)
  console.log('')
  
  // Probar ATP Rankings
  console.log(' PROBANDO RANKINGS ATP:')
  try {
    const atpRankings = await fetchATPRankings()
    if (atpRankings && atpRankings.length > 0) {
      console.log(`    EXITO: ${atpRankings.length} jugadores obtenidos`)
      console.log(`    Primeros 5:`)
      atpRankings.slice(0, 5).forEach(p => {
        console.log(`      ${p.rank}. ${p.player} (${p.country}) - ${p.points} pts`)
      })
    } else {
      console.log(`    No se obtuvieron rankings ATP`)
    }
  } catch (error) {
    console.log(`    ERROR: ${error.message}`)
  }
  console.log('')
  
  // Probar WTA Rankings
  console.log(' PROBANDO RANKINGS WTA:')
  try {
    const wtaRankings = await fetchWTARankings()
    if (wtaRankings && wtaRankings.length > 0) {
      console.log(`    EXITO: ${wtaRankings.length} jugadoras obtenidas`)
      console.log(`    Primeras 5:`)
      wtaRankings.slice(0, 5).forEach(p => {
        console.log(`      ${p.rank}. ${p.player} (${p.country}) - ${p.points} pts`)
      })
    } else {
      console.log(`    No se obtuvieron rankings WTA`)
    }
  } catch (error) {
    console.log(`    ERROR: ${error.message}`)
  }
  console.log('')
  
  console.log('==========================================')
  console.log(' Prueba completada\n')
  
  process.exit(0)
}

testRankings()

