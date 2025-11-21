/**
 * Servicio para obtener rankings de tenis desde la API externa
 * Esta API tiene endpoints de rankings funcionando
 */
// Nota: El .env ya se carga en server.js, pero lo cargamos aqui tambien por si acaso
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Cargar variables de entorno desde la carpeta server (si no estn ya cargadas)
// Primero intentar desde la raiz del proyecto, luego desde server/
if (!process.env.RAPIDAPI_KEY) {
  dotenv.config({ path: join(__dirname, '../.env') })
  // Si an no est, intentar desde la raiz
  if (!process.env.RAPIDAPI_KEY) {
    dotenv.config({ path: join(__dirname, '../../.env') })
  }
}

// Sistema de cache para evitar rate limiting
const cache = {
  atp: { data: null, timestamp: 0 },
  wta: { data: null, timestamp: 0 }
}

// Tiempo de cache: 5 minutos (300,000 ms) - Aumentado para evitar rate limits
const CACHE_DURATION = 5 * 60 * 1000

// Funcion para obtener la configuracion dinamicamente
function getAPIConfig() {
  // Asegurarse de que las variables de entorno esten cargadas
  const apiKey = process.env.RAPIDAPI_KEY || ''
  const baseURL = process.env.TENNIS_API_URL || 'https://tennisapi1.p.rapidapi.com'
  const host = process.env.TENNIS_API_HOST || 'tennisapi1.p.rapidapi.com'
  
  // Debug: verificar si la API key est disponible (solo mostrar primeros caracteres)
  if (!apiKey) {
    console.log('  getAPIConfig: RAPIDAPI_KEY no encontrada en process.env')
  }
  
  return {
    baseURL,
    apiKey,
    host
  }
}

/**
 * Obtener rankings ATP desde la API
 */
export async function fetchATPRankings() {
  // Verificar cache primero
  const now = Date.now()
  if (cache.atp.data && (now - cache.atp.timestamp) < CACHE_DURATION) {
    console.log(` Usando rankings ATP desde cache (${Math.floor((now - cache.atp.timestamp) / 1000)}s antiguos)`)
    return cache.atp.data
  }
  
  const config = getAPIConfig()
  
  if (!config.apiKey) {
    console.log('  fetchATPRankings: No hay API key configurada')
    // Si hay datos en cache aunque sean viejos, usarlos
    if (cache.atp.data) {
      console.log(' Usando datos en cache (aunque sean antiguos)')
      return cache.atp.data
    }
    return null
  }

  try {
    let fetchFunction = globalThis.fetch
    if (!fetchFunction) {
      const nodeFetch = await import('node-fetch')
      fetchFunction = nodeFetch.default
    }
    
    const headers = {
      'x-rapidapi-key': config.apiKey,
      'x-rapidapi-host': config.host
    }

    const url = `${config.baseURL}/api/tennis/rankings/atp/live`
    console.log(`🎾 Obteniendo rankings ATP desde: ${url}`)
    
    const response = await fetchFunction(url, { headers })
    
    if (!response.ok) {
      if (response.status === 429) {
        console.log(`⚠️  Rate limit alcanzado (429). Usando datos en cache si estn disponibles.`)
        // Si hay datos en cache, usarlos aunque sean viejos
        if (cache.atp.data) {
          console.log(`📦 Usando rankings ATP desde cache (rate limit)`)
          return cache.atp.data
        }
      }
      console.log(` Error HTTP ${response.status} al obtener rankings ATP`)
      // Si hay datos en cache, usarlos
      if (cache.atp.data) {
        console.log(` Usando rankings ATP desde cache (error HTTP)`)
        return cache.atp.data
      }
      return null
    }

    const data = await response.json()
    
    // Debug: mostrar estructura de la respuesta (solo primeros 500 caracteres)
    if (data.rankings && data.rankings.length > 0) {
      console.log(' Estructura de respuesta ATP (primer item):', JSON.stringify(data.rankings[0]).substring(0, 300))
    }
    
    if (data.rankings && Array.isArray(data.rankings)) {
      const rankings = data.rankings.map((item, index) => {
        // La estructura real es: item.team.name, item.team.ranking, item.points
        const team = item.team || {}
        const rank = team.ranking || item.ranking || item.rank || (index + 1)
        const points = item.points || team.points || item.rankingPoints || 0
        
        // Extraer nombre del jugador - la estructura real es team.name
        const playerName = team.name || 
                          item.name || 
                          item.playerName || 
                          item.player?.name ||
                          team.playerName ||
                          (team.player && (team.player.name || team.player.fullName)) ||
                          item.fullName ||
                          (item.firstName && item.lastName ? `${item.firstName} ${item.lastName}` : null) ||
                          'Jugador Desconocido'
        
        // Validar que no sea undefined
        if (playerName === null || playerName === undefined || String(playerName) === 'undefined') {
          console.warn(`  Ranking ${index + 1}: nombre invlido, estructura:`, JSON.stringify({team: team.name, item: item.name}).substring(0, 100))
        }
        
        // Extraer pais de mltiples posibles ubicaciones
        const countryCode = team.country?.alpha2 || 
                           item.country?.alpha2 || 
                           team.country?.name ||
                           item.country?.name ||
                           team.country ||
                           item.country ||
                           item.nationality
        
        const ranking = {
          rank: rank,
          player: playerName,
          country: getCountryFlag(countryCode),
          points: points
        }
        
        // Validar que el nombre no sea undefined
        if (!ranking.player || ranking.player === 'undefined' || ranking.player === 'Jugador Desconocido') {
          console.warn(`  Ranking ${index + 1} tiene nombre invlido:`, JSON.stringify(item).substring(0, 200))
        }
        
        return ranking
      }).filter(r => r.player && r.player !== 'undefined') // Filtrar rankings invlidos
      
      // Guardar en cache
      cache.atp.data = rankings
      cache.atp.timestamp = Date.now()
      
      console.log(`✅ Rankings ATP obtenidos: ${rankings.length} jugadores (guardados en cache)`)
      if (rankings.length > 0) {
        console.log(`   🏆 Primer jugador: ${rankings[0].rank}. ${rankings[0].player} - ${rankings[0].points} pts`)
      }
      return rankings
    }
    
    console.log('  fetchATPRankings: No se encontraron rankings en la respuesta')
    // Si hay datos en cache, usarlos
    if (cache.atp.data) {
      console.log(` Usando rankings ATP desde cache (respuesta invlida)`)
      return cache.atp.data
    }
    return null
  } catch (error) {
    console.error(' Error fetching ATP rankings:', error.message)
    // Si hay datos en cache, usarlos
    if (cache.atp.data) {
      console.log(` Usando rankings ATP desde cache (error de red)`)
      return cache.atp.data
    }
    return null
  }
}

/**
 * Obtener rankings WTA desde la API
 */
export async function fetchWTARankings() {
  // Verificar cache primero
  const now = Date.now()
  if (cache.wta.data && (now - cache.wta.timestamp) < CACHE_DURATION) {
    console.log(` Usando rankings WTA desde cache (${Math.floor((now - cache.wta.timestamp) / 1000)}s antiguos)`)
    return cache.wta.data
  }
  
  const config = getAPIConfig()
  
  if (!config.apiKey) {
    console.log('  fetchWTARankings: No hay API key configurada')
    // Si hay datos en cache aunque sean viejos, usarlos
    if (cache.wta.data) {
      console.log(' Usando datos en cache (aunque sean antiguos)')
      return cache.wta.data
    }
    return null
  }

  try {
    let fetchFunction = globalThis.fetch
    if (!fetchFunction) {
      const nodeFetch = await import('node-fetch')
      fetchFunction = nodeFetch.default
    }
    
    const headers = {
      'x-rapidapi-key': config.apiKey,
      'x-rapidapi-host': config.host
    }

    const url = `${config.baseURL}/api/tennis/rankings/wta/live`
    console.log(`🎾 Obteniendo rankings WTA desde: ${url}`)
    
    const response = await fetchFunction(url, { headers })
    
    if (!response.ok) {
      if (response.status === 429) {
        console.log(`⚠️  Rate limit alcanzado (429). Usando datos en cache si estn disponibles.`)
        // Si hay datos en cache, usarlos aunque sean viejos
        if (cache.wta.data) {
          console.log(`📦 Usando rankings WTA desde cache (rate limit)`)
          return cache.wta.data
        }
      }
      console.log(` Error HTTP ${response.status} al obtener rankings WTA`)
      // Si hay datos en cache, usarlos
      if (cache.wta.data) {
        console.log(` Usando rankings WTA desde cache (error HTTP)`)
        return cache.wta.data
      }
      return null
    }

    const data = await response.json()
    
    // Debug: mostrar estructura de la respuesta (solo primeros 500 caracteres)
    if (data.rankings && data.rankings.length > 0) {
      console.log(' Estructura de respuesta WTA (primer item):', JSON.stringify(data.rankings[0]).substring(0, 300))
    }
    
    if (data.rankings && Array.isArray(data.rankings)) {
      const rankings = data.rankings.map((item, index) => {
        // La estructura real es: item.team.name, item.team.ranking, item.points
        const team = item.team || {}
        const rank = team.ranking || item.ranking || item.rank || (index + 1)
        const points = item.points || team.points || item.rankingPoints || 0
        
        // Extraer nombre del jugador - la estructura real es team.name
        const playerName = team.name || 
                          item.name || 
                          item.playerName || 
                          item.player?.name ||
                          team.playerName ||
                          (team.player && (team.player.name || team.player.fullName)) ||
                          item.fullName ||
                          (item.firstName && item.lastName ? `${item.firstName} ${item.lastName}` : null) ||
                          'Jugadora Desconocida'
        
        // Validar que no sea undefined
        if (playerName === null || playerName === undefined || String(playerName) === 'undefined') {
          console.warn(`  Ranking ${index + 1}: nombre invlido, estructura:`, JSON.stringify({team: team.name, item: item.name}).substring(0, 100))
        }
        
        // Extraer pais de mltiples posibles ubicaciones
        const countryCode = team.country?.alpha2 || 
                           item.country?.alpha2 || 
                           team.country?.name ||
                           item.country?.name ||
                           team.country ||
                           item.country ||
                           item.nationality
        
        const ranking = {
          rank: rank,
          player: playerName,
          country: getCountryFlag(countryCode),
          points: points
        }
        
        // Validar que el nombre no sea undefined
        if (!ranking.player || ranking.player === 'undefined' || ranking.player === 'Jugadora Desconocida') {
          console.warn(`  Ranking ${index + 1} tiene nombre invlido:`, JSON.stringify(item).substring(0, 200))
        }
        
        return ranking
      }).filter(r => r.player && r.player !== 'undefined') // Filtrar rankings invlidos
      
      // Guardar en cache
      cache.wta.data = rankings
      cache.wta.timestamp = Date.now()
      
      console.log(`✅ Rankings WTA obtenidos: ${rankings.length} jugadoras (guardados en cache)`)
      if (rankings.length > 0) {
        console.log(`   🏆 Primera jugadora: ${rankings[0].rank}. ${rankings[0].player} - ${rankings[0].points} pts`)
      }
      return rankings
    }
    
    console.log('  fetchWTARankings: No se encontraron rankings en la respuesta')
    // Si hay datos en cache, usarlos
    if (cache.wta.data) {
      console.log(` Usando rankings WTA desde cache (respuesta invlida)`)
      return cache.wta.data
    }
    return null
  } catch (error) {
    console.error(' Error fetching WTA rankings:', error.message)
    // Si hay datos en cache, usarlos
    if (cache.wta.data) {
      console.log(` Usando rankings WTA desde cache (error de red)`)
      return cache.wta.data
    }
    return null
  }
}

/**
 * Obtener bandera de pais desde cdigo ISO
 */
function getCountryFlag(countryCode) {
  if (!countryCode) return ''
  
  const countryFlags = {
    'ES': '', 'US': '', 'RS': '', 'FR': '', 'IT': '',
    'RU': '', 'GB': '', 'DE': '', 'PL': '', 'BY': '',
    'KZ': '', 'IE': '', 'NO': '', 'GR': '', 'AU': '',
    'CA': '', 'CH': '', 'AR': '', 'BR': '', 'JP': ''
  }
  
  return countryFlags[countryCode] || ''
}

