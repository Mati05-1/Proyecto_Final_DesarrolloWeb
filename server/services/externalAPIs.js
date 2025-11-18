/**
 * Servicio para conectar con APIs externas de tenis y golf
 * Si no hay APIs configuradas, usa datos mock
 */

// Configuración de APIs externas (puedes agregar tus API keys aquí)
// Para usar APIs externas, crea un archivo .env en la carpeta server/ con:
// RAPIDAPI_KEY=tu_rapidapi_key
// TENNIS_API_URL=tu_url (opcional, si tienes API de tenis)
// TENNIS_API_KEY=tu_key (opcional)
// GOLF_API_URL=tu_url (opcional, si tienes otra API de golf)
// GOLF_API_KEY=tu_key (opcional)

const API_CONFIG = {
  rapidapi: {
    key: process.env.RAPIDAPI_KEY || '',
    enabled: !!process.env.RAPIDAPI_KEY && process.env.RAPIDAPI_KEY !== ''
  },
  tennis: {
    enabled: process.env.RAPIDAPI_KEY && process.env.RAPIDAPI_KEY !== '', // Usar RapidAPI por defecto si hay key
    baseURL: process.env.TENNIS_API_URL || 'https://tennis-live-data.p.rapidapi.com', // API de tenis de RapidAPI
    apiKey: process.env.RAPIDAPI_KEY || process.env.TENNIS_API_KEY || '',
    provider: process.env.TENNIS_API_PROVIDER || 'rapidapi', // Usar RapidAPI
    host: process.env.TENNIS_API_HOST || 'tennis-live-data.p.rapidapi.com'
  },
  golf: {
    enabled: process.env.RAPIDAPI_KEY && process.env.RAPIDAPI_KEY !== '', // Usar RapidAPI por defecto
    baseURL: process.env.GOLF_API_URL || 'https://live-golf-data.p.rapidapi.com',
    apiKey: process.env.RAPIDAPI_KEY || process.env.GOLF_API_KEY || '',
    provider: 'rapidapi', // Usar RapidAPI
    host: 'live-golf-data.p.rapidapi.com'
  }
}

/**
 * Obtener partidos de tenis desde API externa (RapidAPI)
 */
export async function fetchTennisMatchesFromAPI() {
  if (!API_CONFIG.tennis.enabled || !API_CONFIG.tennis.apiKey) {
    return null // Usar datos mock
  }

  try {
    // Node.js 18+ tiene fetch nativo, si no está disponible usar node-fetch
    let fetchFunction
    try {
      fetchFunction = globalThis.fetch
    } catch {
      const nodeFetch = await import('node-fetch')
      fetchFunction = nodeFetch.default
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': API_CONFIG.tennis.apiKey,
      'X-RapidAPI-Host': API_CONFIG.tennis.host
    }

    // Intentar diferentes endpoints comunes de APIs de tenis de RapidAPI
    const endpoints = [
      '/matches/live',           // Partidos en vivo
      '/matches',                // Todos los partidos
      '/schedule',               // Calendario
      '/matches/today',          // Partidos de hoy
      '/live-scores',            // Scores en vivo
      '/matches/upcoming',       // Próximos partidos
      '/scores/live'             // Scores en vivo (alternativo)
    ]

    let matches = []
    
    // Intentar cada endpoint hasta encontrar uno que funcione
    for (const endpoint of endpoints) {
      try {
        const url = `${API_CONFIG.tennis.baseURL}${endpoint}`
        console.log(`🎾 Trying tennis endpoint: ${url}`)
        
        const response = await fetchFunction(url, { headers })
        
        if (response.ok) {
          const data = await response.json()
          const transformed = transformTennisData(data)
          if (transformed && transformed.length > 0) {
            matches = transformed
            console.log(`✅ Successfully fetched ${matches.length} tennis matches from ${endpoint}`)
            break
          }
        } else {
          console.log(`⚠️  Endpoint ${endpoint} returned status ${response.status}`)
        }
      } catch (err) {
        console.log(`❌ Endpoint ${endpoint} failed:`, err.message)
        continue
      }
    }

    // Si no encontramos datos, intentar endpoint genérico (raíz)
    if (matches.length === 0) {
      try {
        console.log(`🎾 Trying generic endpoint: ${API_CONFIG.tennis.baseURL}`)
        const response = await fetchFunction(API_CONFIG.tennis.baseURL, { headers })
        if (response.ok) {
          const data = await response.json()
          matches = transformTennisData(data)
          if (matches && matches.length > 0) {
            console.log(`✅ Successfully fetched ${matches.length} tennis matches from generic endpoint`)
          }
        }
      } catch (err) {
        console.log('❌ Generic endpoint also failed:', err.message)
      }
    }

    return matches.length > 0 ? matches : null
  } catch (error) {
    console.error('Error fetching tennis data from external API:', error)
    return null // Fallback a mock
  }
}

/**
 * Obtener torneos de golf desde API externa (RapidAPI)
 */
export async function fetchGolfTournamentsFromAPI() {
  if (!API_CONFIG.golf.enabled || !API_CONFIG.golf.apiKey) {
    return null // Usar datos mock
  }

  try {
    // Node.js 18+ tiene fetch nativo, si no está disponible usar node-fetch
    let fetchFunction
    try {
      fetchFunction = globalThis.fetch
    } catch {
      const nodeFetch = await import('node-fetch')
      fetchFunction = nodeFetch.default
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': API_CONFIG.golf.apiKey,
      'X-RapidAPI-Host': API_CONFIG.golf.host
    }

    // Obtener schedule de torneos
    const currentYear = new Date().getFullYear()
    const scheduleURL = `${API_CONFIG.golf.baseURL}/schedule?orgId=1&year=${currentYear}`
    
    console.log('Fetching golf tournaments from RapidAPI...')
    const scheduleResponse = await fetchFunction(scheduleURL, { headers })
    
    if (!scheduleResponse.ok) {
      throw new Error(`API error: ${scheduleResponse.status}`)
    }

    const scheduleData = await scheduleResponse.json()
    
    // Transformar schedule a nuestro formato
    const tournaments = await transformGolfScheduleData(scheduleData, fetchFunction, headers)
    
    return tournaments
  } catch (error) {
    console.error('Error fetching golf data from external API:', error)
    return null // Fallback a mock
  }
}

/**
 * Transformar schedule de RapidAPI y obtener datos detallados
 */
async function transformGolfScheduleData(scheduleData, fetchFunction, headers) {
  try {
    // El schedule puede venir en diferentes formatos
    let tournaments = []
    
    if (Array.isArray(scheduleData)) {
      tournaments = scheduleData
    } else if (scheduleData.data && Array.isArray(scheduleData.data)) {
      tournaments = scheduleData.data
    } else if (scheduleData.schedule && Array.isArray(scheduleData.schedule)) {
      tournaments = scheduleData.schedule
    } else if (scheduleData.tournaments && Array.isArray(scheduleData.tournaments)) {
      tournaments = scheduleData.tournaments
    } else {
      // Si no es un array, intentar obtener propiedades del objeto
      console.log('Schedule data format:', Object.keys(scheduleData))
      return []
    }

    // Transformar cada torneo
    const transformedTournaments = await Promise.all(
      tournaments.slice(0, 10).map(async (tournament, index) => {
        // Intentar obtener leaderboard si el torneo está en vivo
        let leaderboard = []
        let status = 'scheduled'
        
        // Si el torneo tiene un ID, intentar obtener datos en vivo
        if (tournament.id || tournament.tournamentId || tournament.eventId) {
          try {
            const tournamentId = tournament.id || tournament.tournamentId || tournament.eventId
            const leaderboardURL = `${API_CONFIG.golf.baseURL}/leaderboard?tournamentId=${tournamentId}`
            
            const leaderboardResponse = await fetchFunction(leaderboardURL, { headers })
            if (leaderboardResponse.ok) {
              const leaderboardData = await leaderboardResponse.json()
              leaderboard = transformLeaderboard(leaderboardData.leaderboard || leaderboardData.data || leaderboardData || [])
              status = 'live'
            }
          } catch (err) {
            console.log(`Could not fetch leaderboard for tournament ${tournament.id || index}:`, err.message)
          }
        }

        return {
          id: tournament.id || tournament.tournamentId || tournament.eventId || (Date.now() + index),
          name: tournament.name || tournament.tournamentName || tournament.eventName || tournament.title || 'Torneo de Golf',
          location: tournament.location || tournament.venue || tournament.city || tournament.venueName || 'Ubicación',
          status: status,
          round: tournament.round || tournament.currentRound || tournament.roundNumber || 1,
          totalRounds: tournament.totalRounds || tournament.rounds || 4,
          leaderboard: leaderboard,
          startTime: tournament.startTime || tournament.startDate || tournament.date || tournament.scheduledTime || new Date().toISOString(),
          createdAt: tournament.createdAt || new Date().toISOString()
        }
      })
    )

    return transformedTournaments
  } catch (error) {
    console.error('Error transforming golf schedule:', error)
    return []
  }
}

/**
 * Transformar datos de API externa al formato de nuestra aplicación
 * Ajusta esto según el formato que devuelva tu API
 * 
 * FORMATO ESPERADO DE TU API:
 * - Array de partidos, o
 * - Objeto con propiedad 'data' o 'matches' que contenga el array
 * 
 * Cada partido debe tener (o mapear a):
 * - id, tournament, player1 {name, country, rank}, player2 {name, country, rank}
 * - score {sets: [{p1, p2}]}, status, startTime
 */
function transformTennisData(apiData) {
  // Si es un array directo
  if (Array.isArray(apiData)) {
    return apiData.map(match => ({
      id: match.id || match.matchId || Date.now() + Math.random(),
      tournament: match.tournament || match.tournamentName || match.event || 'Torneo',
      player1: {
        name: match.player1?.name || match.player1Name || match.homePlayer?.name || 'Jugador 1',
        country: match.player1?.country || match.player1Country || '🌍',
        rank: match.player1?.rank || match.player1Rank || 0
      },
      player2: {
        name: match.player2?.name || match.player2Name || match.awayPlayer?.name || 'Jugador 2',
        country: match.player2?.country || match.player2Country || '🌍',
        rank: match.player2?.rank || match.player2Rank || 0
      },
      score: match.score || { sets: [] },
      status: mapStatus(match.status || match.state || 'scheduled'),
      time: match.time || match.duration || match.elapsedTime,
      startTime: match.startTime || match.startDate || match.scheduledTime || new Date().toISOString(),
      createdAt: match.createdAt || new Date().toISOString()
    }))
  }
  
  // Si la API devuelve un objeto con una propiedad 'data' o 'matches'
  if (apiData.data) {
    return transformTennisData(apiData.data)
  }
  
  if (apiData.matches) {
    return transformTennisData(apiData.matches)
  }
  
  if (apiData.results) {
    return transformTennisData(apiData.results)
  }
  
  return []
}

/**
 * Mapear estados de diferentes APIs a nuestro formato
 */
function mapStatus(status) {
  const statusLower = (status || '').toLowerCase()
  
  if (statusLower.includes('live') || statusLower.includes('in-progress') || statusLower === 'playing') {
    return 'live'
  }
  if (statusLower.includes('finished') || statusLower.includes('completed') || statusLower === 'final') {
    return 'finished'
  }
  if (statusLower.includes('scheduled') || statusLower.includes('upcoming') || statusLower === 'not-started') {
    return 'scheduled'
  }
  
  return 'scheduled' // Default
}

/**
 * Transformar datos de golf de API externa
 */
function transformGolfData(apiData) {
  if (Array.isArray(apiData)) {
    return apiData.map(tournament => ({
      id: tournament.id || tournament.tournamentId || Date.now() + Math.random(),
      name: tournament.name || tournament.tournamentName || tournament.event || 'Torneo',
      location: tournament.location || tournament.venue || tournament.city || 'Ubicación',
      status: mapStatus(tournament.status || tournament.state),
      round: tournament.round || tournament.currentRound || tournament.roundNumber || 1,
      totalRounds: tournament.totalRounds || tournament.rounds || 4,
      leaderboard: transformLeaderboard(tournament.leaderboard || tournament.standings || tournament.players || []),
      startTime: tournament.startTime || tournament.startDate || tournament.scheduledTime || new Date().toISOString(),
      createdAt: tournament.createdAt || new Date().toISOString()
    }))
  }
  
  if (apiData.data) {
    return transformGolfData(apiData.data)
  }
  
  if (apiData.tournaments) {
    return transformGolfData(apiData.tournaments)
  }
  
  if (apiData.results) {
    return transformGolfData(apiData.results)
  }
  
  return []
}

/**
 * Transformar leaderboard de diferentes formatos
 */
function transformLeaderboard(leaderboard) {
  if (!Array.isArray(leaderboard)) {
    return []
  }
  
  return leaderboard.map((player, index) => ({
    position: player.position || player.rank || player.pos || (index + 1),
    player: player.player || player.name || player.playerName || 'Jugador',
    country: player.country || player.nationality || '🌍',
    score: player.score || player.totalScore || player.toPar || 0,
    today: player.today || player.roundScore || 0
  }))
}

/**
 * Obtener configuración de APIs (sin exponer keys)
 */
export function getAPIConfig() {
  return {
    rapidapi: {
      enabled: API_CONFIG.rapidapi.enabled
    },
    tennis: {
      enabled: API_CONFIG.tennis.enabled,
      provider: API_CONFIG.tennis.provider
    },
    golf: {
      enabled: API_CONFIG.golf.enabled,
      provider: API_CONFIG.golf.provider
    }
  }
}

