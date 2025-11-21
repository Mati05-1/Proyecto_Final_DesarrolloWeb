/**
 * Script para probar las APIs de tenis y golf
 * Uso: node server/scripts/testAPIs.js
 */

import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { fetchTennisMatchesFromAPI, fetchGolfTournamentsFromAPI } from '../services/externalAPIs.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Cargar .env desde la carpeta server
dotenv.config({ path: join(__dirname, '../.env') })

async function testAPIs() {
  console.log('\n ==========================================')
  console.log('   PRUEBA DE APIs EXTERNAS')
  console.log('==========================================\n')
  
  console.log(' Configuracion:')
  console.log(`   RAPIDAPI_KEY: ${process.env.RAPIDAPI_KEY ? ' Configurada' : ' No configurada'}`)
  if (process.env.RAPIDAPI_KEY) {
    console.log(`   Key: ${process.env.RAPIDAPI_KEY.substring(0, 10)}...`)
  }
  console.log('')
  
  // Probar API de Golf
  console.log(' PROBANDO API DE GOLF:')
  console.log('   URL: https://live-golf-data.p.rapidapi.com')
  try {
    const golfData = await fetchGolfTournamentsFromAPI()
    if (golfData && golfData.length > 0) {
      console.log(`    EXITO: ${golfData.length} torneos obtenidos`)
      console.log(`    Primer torneo: ${golfData[0].name} - ${golfData[0].location}`)
    } else {
      console.log(`     No se obtuvieron datos de golf`)
    }
  } catch (error) {
    console.log(`    ERROR: ${error.message}`)
  }
  console.log('')
  
  // Probar API de Tenis
  console.log(' PROBANDO API DE TENIS:')
  console.log('   URL: https://tennis-live-data.p.rapidapi.com')
  try {
    const tennisData = await fetchTennisMatchesFromAPI()
    if (tennisData && tennisData.length > 0) {
      console.log(`    EXITO: ${tennisData.length} partidos obtenidos`)
      console.log(`    Primer partido: ${tennisData[0].player1.name} vs ${tennisData[0].player2.name}`)
    } else {
      console.log(`     No se obtuvieron datos de tenis`)
      console.log(`    Posibles causas:`)
      console.log(`      - La API no est suscrita en tu cuenta de RapidAPI`)
      console.log(`      - El host/URL de la API es incorrecto`)
      console.log(`      - Los endpoints no estn disponibles`)
    }
  } catch (error) {
    console.log(`    ERROR: ${error.message}`)
  }
  console.log('')
  
  console.log('==========================================')
  console.log(' Prueba completada\n')
  
  process.exit(0)
}

testAPIs()

