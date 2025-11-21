/**
 * Servicio para conectar con APIs externas de tenis y golf
 * Si no hay APIs configuradas, usa datos mock
 */

// Configuracion de APIs externas (puedes agregar tus API keys aqui)
// Para usar APIs externas, crea un archivo .env en la carpeta server/ con:
// RAPIDAPI_KEY=tu_rapidapi_key
// TENNIS_API_URL=tu_url (opcional, si tienes API de tenis)
// TENNIS_API_KEY=tu_key (opcional)
// GOLF_API_URL=tu_url (opcional, si tienes otra API de golf)
// GOLF_API_KEY=tu_key (opcional)

// Funcion para obtener la configuracion dinamicamente (lee process.env cada vez)
function getAPIConfig() {
  return {
    rapidapi: {
      key: process.env.RAPIDAPI_KEY || '',
      enabled: !!process.env.RAPIDAPI_KEY && process.env.RAPIDAPI_KEY !== ''
    },
    tennis: {
      enabled: process.env.RAPIDAPI_KEY && process.env.RAPIDAPI_KEY !== '', // Usar RapidAPI por defecto si hay key
      baseURL: process.env.TENNIS_API_URL || 'https://tennisapi1.p.rapidapi.com', // API de tenis de RapidAPI
      apiKey: process.env.RAPIDAPI_KEY || process.env.TENNIS_API_KEY || '',
      provider: process.env.TENNIS_API_PROVIDER || 'rapidapi', // Usar RapidAPI
      host: process.env.TENNIS_API_HOST || 'tennisapi1.p.rapidapi.com'
    },
    golf: {
      enabled: process.env.RAPIDAPI_KEY && process.env.RAPIDAPI_KEY !== '', // Usar RapidAPI por defecto
      baseURL: process.env.GOLF_API_URL || 'https://live-golf-data.p.rapidapi.com',
      apiKey: process.env.RAPIDAPI_KEY || process.env.GOLF_API_KEY || '',
      provider: 'rapidapi', // Usar RapidAPI
      host: 'live-golf-data.p.rapidapi.com'
    }
  }
}

// Variable para cachear la configuracion (se actualiza cuando se llama)
let API_CONFIG = getAPIConfig()

/**
 * Obtener partidos de tenis desde API externa (RapidAPI)
 */
export async function fetchTennisMatchesFromAPI() {
  // Actualizar configuracion para leer variables de entorno actualizadas
  API_CONFIG = getAPIConfig()
  
  if (!API_CONFIG.tennis.enabled || !API_CONFIG.tennis.apiKey) {
    console.log('  ⚠️  API de tenis no configurada (RAPIDAPI_KEY faltante)')
    return null // Usar datos mock
  }
  
  // NOTA: Esta API (tennisapi1) solo tiene rankings, no partidos en vivo
  // Intentamos obtener rankings y generar partidos simulados con jugadores reales
  try {
    const { fetchATPRankings, fetchWTARankings } = await import('./tennisRankingsAPI.js')
    const atpRankings = await fetchATPRankings()
    const wtaRankings = await fetchWTARankings()
    
    if (atpRankings && atpRankings.length > 0) {
      // Generar partidos simulados usando jugadores reales del ranking
      const matches = generateMatchesFromRankings(atpRankings, wtaRankings)
      if (matches.length > 0) {
        console.log(`✅ Generados ${matches.length} partidos usando rankings reales de la API`)
        return matches
      }
    }
  } catch (error) {
    console.log('⚠️  No se pudieron obtener rankings para generar partidos:', error.message)
  }

  try {
    // Node.js 18+ tiene fetch nativo, si no est disponible usar node-fetch
    let fetchFunction
    try {
      fetchFunction = globalThis.fetch
    } catch {
      const nodeFetch = await import('node-fetch')
      fetchFunction = nodeFetch.default
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'x-rapidapi-key': API_CONFIG.tennis.apiKey,
      'x-rapidapi-host': API_CONFIG.tennis.host
    }

    // Esta API solo tiene rankings, no partidos en vivo
    // Ya intentamos generar partidos desde rankings arriba
    // Si llegamos aqui, no se pudieron generar partidos
    console.log(`  🎾 API de Tenis: Esta API solo proporciona rankings, no partidos en vivo`)
        console.log(`    🎾 Los partidos se generarn usando jugadores reales de los rankings`)
    return null
  } catch (error) {
    console.error('❌ Error critico obteniendo datos de tenis:', error.message)
    return null // Fallback a mock
  }
}

/**
 * Obtener torneos de golf desde API externa (RapidAPI)
 */
export async function fetchGolfTournamentsFromAPI() {
  // Actualizar configuracion para leer variables de entorno actualizadas
  API_CONFIG = getAPIConfig()
  
  if (!API_CONFIG.golf.enabled || !API_CONFIG.golf.apiKey) {
    console.log('  ⚠️  API de golf no configurada (RAPIDAPI_KEY faltante)')
    return null // Usar datos mock
  }

  try {
    // Node.js 18+ tiene fetch nativo, si no est disponible usar node-fetch
    let fetchFunction
    try {
      fetchFunction = globalThis.fetch
    } catch {
      const nodeFetch = await import('node-fetch')
      fetchFunction = nodeFetch.default
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'x-rapidapi-key': API_CONFIG.golf.apiKey,
      'x-rapidapi-host': API_CONFIG.golf.host
    }

    // Obtener schedule de torneos
    const currentYear = new Date().getFullYear()
    const scheduleURL = `${API_CONFIG.golf.baseURL}/schedule?orgId=1&year=${currentYear}`
    
    console.log(`⛳ Obteniendo torneos de golf desde: ${scheduleURL}`)
    const scheduleResponse = await fetchFunction(scheduleURL, { headers })
    
    if (!scheduleResponse.ok) {
      const errorText = await scheduleResponse.text().catch(() => '')
      console.log(`    ⚠️  Error HTTP ${scheduleResponse.status}: ${errorText.substring(0, 200)}`)
      throw new Error(`API error: ${scheduleResponse.status} - ${errorText.substring(0, 100)}`)
    }

    const scheduleData = await scheduleResponse.json()
    console.log(`    📋 Schedule recibido, transformando datos...`)
    
    // Transformar schedule a nuestro formato
    const tournaments = await transformGolfScheduleData(scheduleData, fetchFunction, headers)
    
    if (tournaments && tournaments.length > 0) {
      console.log(`✅ API de Golf: ${tournaments.length} torneos obtenidos exitosamente`)
      return tournaments
    } else {
      console.log(`  ⚠️  API de Golf: No se pudieron transformar los datos, usando fallback`)
      return null
    }
  } catch (error) {
    console.error(`❌ Error critico obteniendo datos de golf:`, error.message)
    if (error.stack) {
      console.error(`   Stack:`, error.stack.substring(0, 200))
    }
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
      console.log(`    Formato de datos recibido:`, Object.keys(scheduleData))
      if (scheduleData.schedule) {
        tournaments = Array.isArray(scheduleData.schedule) ? scheduleData.schedule : []
      }
      if (tournaments.length === 0) {
        console.log(`     No se encontr array de torneos en el formato esperado`)
        return []
      }
    }
    
    console.log(`    Encontrados ${tournaments.length} torneos en el schedule`)

    // Transformar cada torneo
    const transformedTournaments = await Promise.all(
      tournaments.slice(0, 10).map(async (tournament, index) => {
        // Intentar obtener leaderboard si el torneo est en vivo
        let leaderboard = []
        let status = 'scheduled'
        
        // Si el torneo tiene un ID, intentar obtener datos en vivo
        // La API usa tournId como identificador
        const tournamentId = tournament.tournId || tournament.id || tournament.tournamentId || tournament.eventId
        
        if (tournamentId) {
          try {
            // Intentar diferentes formatos de endpoint
            const leaderboardEndpoints = [
              `${API_CONFIG.golf.baseURL}/leaderboard?tournamentId=${tournamentId}`,
              `${API_CONFIG.golf.baseURL}/leaderboard/${tournamentId}`,
              `${API_CONFIG.golf.baseURL}/tournament/${tournamentId}/leaderboard`
            ]
            
            for (const leaderboardURL of leaderboardEndpoints) {
              try {
                const leaderboardResponse = await fetchFunction(leaderboardURL, { headers })
                if (leaderboardResponse.ok) {
                  const leaderboardData = await leaderboardResponse.json()
                  leaderboard = transformLeaderboard(leaderboardData.leaderboard || leaderboardData.data || leaderboardData || [])
                  if (leaderboard && leaderboard.length > 0) {
                    status = 'live'
                    console.log(`    Leaderboard obtenido para torneo ${tournamentId}: ${leaderboard.length} jugadores`)
                    break
                  }
                } else if (leaderboardResponse.status === 429) {
                  console.log(`     Rate limit al obtener leaderboard para ${tournamentId}`)
                  break
                }
              } catch (err) {
                // Continuar con el siguiente endpoint
                continue
              }
            }
          } catch (err) {
            console.log(`Could not fetch leaderboard for tournament ${tournamentId || index}:`, err.message)
          }
        }

        // Manejar diferentes formatos de fecha
        let startTime = new Date().toISOString()
        if (tournament.date) {
          if (tournament.date.start) {
            if (tournament.date.start.$date) {
              startTime = new Date(parseInt(tournament.date.start.$date.$numberLong || tournament.date.start.$date)).toISOString()
            } else if (typeof tournament.date.start === 'string' || typeof tournament.date.start === 'number') {
              startTime = new Date(tournament.date.start).toISOString()
            }
          } else if (tournament.date.$date) {
            startTime = new Date(parseInt(tournament.date.$date.$numberLong || tournament.date.$date)).toISOString()
          }
        }
        
        return {
          id: tournament.tournId || tournament.id || tournament.tournamentId || tournament.eventId || (Date.now() + index),
          name: tournament.name || tournament.tournamentName || tournament.eventName || tournament.title || 'Torneo de Golf',
          location: tournament.location || tournament.venue || tournament.city || tournament.venueName || tournament.course || 'Ubicacin',
          status: status,
          round: tournament.round || tournament.currentRound || tournament.roundNumber || 1,
          totalRounds: tournament.totalRounds || tournament.rounds || 4,
          leaderboard: leaderboard,
          startTime: tournament.startTime || startTime,
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
 * Transformar datos de API externa al formato de nuestra aplicacin
 * Esta API puede devolver eventos, partidos, o rankings
 */
function transformTennisData(apiData) {
  // Si la API devuelve eventos (event/live)
  if (apiData.events && Array.isArray(apiData.events)) {
    const matches = []
    apiData.events.forEach(event => {
      // Si el evento tiene partidos/matches
      if (event.matches && Array.isArray(event.matches)) {
        event.matches.forEach(match => {
          matches.push(transformMatchData(match, event))
        })
      } else if (event.homeTeam && event.awayTeam) {
        // Si el evento es directamente un partido
        matches.push(transformMatchData(event, event))
      }
    })
    return matches
  }
  
  // Si es un array directo de partidos
  if (Array.isArray(apiData)) {
    return apiData.map(match => transformMatchData(match))
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
  
  // Si tiene eventos
  if (apiData.events) {
    return transformTennisData(apiData)
  }
  
  return []
}

/**
 * Transformar un partido individual al formato de nuestra aplicacin
 */
function transformMatchData(match, event = null) {
  // Mapear equipos/jugadores
  const player1 = match.homeTeam || match.player1 || match.team1 || {}
  const player2 = match.awayTeam || match.player2 || match.team2 || {}
  
  // Obtener nombre del torneo
  const tournament = event?.tournament?.name || 
                    event?.tournamentName || 
                    match.tournament?.name || 
                    match.tournamentName || 
                    match.event?.name ||
                    'Torneo'
  
  // Mapear score
  let score = { sets: [] }
  if (match.score) {
    if (match.score.sets && Array.isArray(match.score.sets)) {
      score.sets = match.score.sets.map(set => ({
        p1: set.home || set.player1 || set.p1 || 0,
        p2: set.away || set.player2 || set.p2 || 0
      }))
    } else if (match.score.home !== undefined && match.score.away !== undefined) {
      score.sets = [{ p1: match.score.home, p2: match.score.away }]
    }
  }
  
  return {
    id: match.id || match.matchId || match.eventId || (Date.now() + Math.random()),
    tournament: tournament,
    player1: {
      name: player1.name || player1.shortName || 'Jugador 1',
      country: getCountryFlag(player1.country?.alpha2 || player1.country?.name || player1.country) || '',
      rank: player1.ranking || player1.rank || 0
    },
    player2: {
      name: player2.name || player2.shortName || 'Jugador 2',
      country: getCountryFlag(player2.country?.alpha2 || player2.country?.name || player2.country) || '',
      rank: player2.ranking || player2.rank || 0
    },
    score: score,
    status: mapStatus(match.status || match.state || match.statusType || 'scheduled'),
    time: match.time || match.duration || match.elapsedTime,
    startTime: match.startTime || match.startDate || match.scheduledTime || match.date || new Date().toISOString(),
    createdAt: match.createdAt || new Date().toISOString()
  }
}

/**
 * Obtener bandera de pais desde cdigo ISO
 */
function getCountryFlag(countryCode) {
  if (!countryCode) return ''
  
  // Mapeo bsico de cdigos de pais a banderas
  const countryFlags = {
    'ES': '', 'US': '', 'RS': '', 'FR': '', 'IT': '',
    'RU': '', 'GB': '', 'DE': '', 'PL': '', 'BY': '',
    'KZ': '', 'IE': '', 'NO': '', 'GR': ''
  }
  
  if (countryFlags[countryCode]) {
    return countryFlags[countryCode]
  }
  
  // Si es un nombre de pais, intentar mapear
  const countryName = countryCode.toLowerCase()
  if (countryName.includes('spain')) return ''
  if (countryName.includes('usa') || countryName.includes('united states')) return ''
  if (countryName.includes('serbia')) return ''
  if (countryName.includes('france')) return ''
  if (countryName.includes('italy')) return ''
  if (countryName.includes('russia')) return ''
  if (countryName.includes('poland')) return ''
  if (countryName.includes('belarus')) return ''
  
  return ''
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
      location: tournament.location || tournament.venue || tournament.city || 'Ubicacin',
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
    country: player.country || player.nationality || '',
    score: player.score || player.totalScore || player.toPar || 0,
    today: player.today || player.roundScore || 0
  }))
}

/**
 * Generar partidos simulados usando rankings reales
 * IMPORTANTE: Solo genera partidos hombre vs hombre (ATP) o mujer vs mujer (WTA)
 */
function generateMatchesFromRankings(atpRankings, wtaRankings) {
  const matches = []
  const atpTournaments = ['ATP Masters 1000', 'ATP 500', 'ATP 250', 'Grand Slam']
  const wtaTournaments = ['WTA Finals', 'WTA 1000', 'WTA 500', 'Grand Slam']
  
  // Generar partidos ATP (hombres vs hombres) usando top 10
  if (atpRankings && atpRankings.length >= 4) {
    const topPlayers = atpRankings.slice(0, 10)
    for (let i = 0; i < Math.min(3, topPlayers.length - 1); i += 2) {
      if (i + 1 < topPlayers.length) {
        matches.push({
          id: Date.now() + i,
          tournament: atpTournaments[i % atpTournaments.length], // Solo torneos ATP
          player1: {
            name: topPlayers[i].player,
            country: topPlayers[i].country,
            rank: topPlayers[i].rank
          },
          player2: {
            name: topPlayers[i + 1].player,
            country: topPlayers[i + 1].country,
            rank: topPlayers[i + 1].rank
          },
          score: { sets: i === 0 ? [{ p1: 6, p2: 4 }, { p1: 3, p2: 6 }] : [] },
          status: i === 0 ? 'live' : 'scheduled',
          time: i === 0 ? '1h 30m' : undefined,
          startTime: new Date(Date.now() + (i * 2 * 60 * 60 * 1000)).toISOString(),
          createdAt: new Date().toISOString()
        })
      }
    }
  }
  
  // Generar partidos WTA (mujeres vs mujeres) usando top 10
  if (wtaRankings && wtaRankings.length >= 4) {
    const topPlayers = wtaRankings.slice(0, 10)
    for (let i = 0; i < Math.min(2, topPlayers.length - 1); i += 2) {
      if (i + 1 < topPlayers.length) {
        matches.push({
          id: Date.now() + 100 + i,
          tournament: wtaTournaments[i % wtaTournaments.length], // Solo torneos WTA
          player1: {
            name: topPlayers[i].player,
            country: topPlayers[i].country,
            rank: topPlayers[i].rank
          },
          player2: {
            name: topPlayers[i + 1].player,
            country: topPlayers[i + 1].country,
            rank: topPlayers[i + 1].rank
          },
          score: { sets: i === 0 ? [{ p1: 4, p2: 6 }, { p1: 6, p2: 3 }] : [] },
          status: i === 0 ? 'live' : 'scheduled',
          time: i === 0 ? '1h 15m' : undefined,
          startTime: new Date(Date.now() + ((i + 1) * 2 * 60 * 60 * 1000)).toISOString(),
          createdAt: new Date().toISOString()
        })
      }
    }
  }
  
  return matches
}

/**
 * Obtener configuracion de APIs (sin exponer keys)
 */
export function getAPIConfigStatus() {
  API_CONFIG = getAPIConfig() // Actualizar antes de retornar
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

