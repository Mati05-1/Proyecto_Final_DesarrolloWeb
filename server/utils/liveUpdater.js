/**
 * Simulador de actualizaciones en tiempo real
 * Actualiza los datos mock para simular un sistema en tiempo real
 */
import { tennisMatches, golfTournaments } from '../data/mockData.js'

let updateInterval = null

/**
 * Simular actualizacin de scores en partidos en vivo
 */
function updateLiveMatches() {
  tennisMatches.forEach(match => {
    if (match.status === 'live' && match.score && match.score.sets) {
      // Simular que el partido avanza
      const lastSet = match.score.sets[match.score.sets.length - 1]
      
      // Incrementar score aleatoriamente
      if (Math.random() > 0.5) {
        lastSet.p1 = Math.min(lastSet.p1 + 1, 7)
      } else {
        lastSet.p2 = Math.min(lastSet.p2 + 1, 7)
      }
      
      // Si un set termina (alguien llega a 6 o 7), crear nuevo set
      if ((lastSet.p1 >= 6 && lastSet.p1 - lastSet.p2 >= 2) || 
          (lastSet.p2 >= 6 && lastSet.p2 - lastSet.p1 >= 2) ||
          (lastSet.p1 === 7 || lastSet.p2 === 7)) {
        // Set terminado, agregar nuevo set si no hay ganador
        const setsWonP1 = match.score.sets.filter(s => s.p1 > s.p2).length
        const setsWonP2 = match.score.sets.filter(s => s.p2 > s.p1).length
        
        if (setsWonP1 < 2 && setsWonP2 < 2) {
          match.score.sets.push({ p1: 0, p2: 0 })
        } else {
          // Partido terminado
          match.status = 'finished'
          match.winner = setsWonP1 > setsWonP2 ? 1 : 2
        }
      }
      
      // Actualizar tiempo transcurrido
      if (match.time) {
        const [hours, minutes] = match.time.split('h ')[0].split('h')
        const newMinutes = parseInt(minutes) + 1
        if (newMinutes >= 60) {
          match.time = `${parseInt(hours) + 1}h 0m`
        } else {
          match.time = `${hours}h ${newMinutes}m`
        }
      }
    }
  })
}

/**
 * Simular actualizacin de leaderboard en torneos de golf
 */
function updateGolfTournaments() {
  golfTournaments.forEach(tournament => {
    if (tournament.status === 'live' && tournament.leaderboard) {
      tournament.leaderboard.forEach(player => {
        // Simular cambios pequenos en el score
        if (Math.random() > 0.7) {
          player.score += Math.random() > 0.5 ? -1 : 0
          player.today = Math.floor(Math.random() * 5) - 2
        }
      })
      
      // Reordenar leaderboard
      tournament.leaderboard.sort((a, b) => b.score - a.score)
      tournament.leaderboard.forEach((player, index) => {
        player.position = index + 1
      })
    }
  })
}

/**
 * Cambiar partidos programados a "en vivo" cuando llegue su hora
 */
function checkScheduledMatches() {
  const now = new Date()
  
  tennisMatches.forEach(match => {
    if (match.status === 'scheduled' && match.startTime) {
      const startTime = new Date(match.startTime)
      const diff = startTime - now
      
      // Si ya pas la hora de inicio, poner en vivo
      if (diff <= 0 && diff > -3600000) { // Dentro de la ltima hora
        match.status = 'live'
        match.score = { sets: [{ p1: 0, p2: 0 }] }
        match.time = '0h 0m'
      }
    }
  })
  
  golfTournaments.forEach(tournament => {
    if (tournament.status === 'scheduled' && tournament.startTime) {
      const startTime = new Date(tournament.startTime)
      const diff = startTime - now
      
      if (diff <= 0 && diff > -86400000) { // Dentro de las ltimas 24 horas
        tournament.status = 'live'
        if (!tournament.leaderboard || tournament.leaderboard.length === 0) {
          // Crear leaderboard inicial simulado
          tournament.leaderboard = [
            { position: 1, player: 'Player 1', country: '', score: -5, today: -2 },
            { position: 2, player: 'Player 2', country: '', score: -4, today: -1 },
            { position: 3, player: 'Player 3', country: '', score: -3, today: -1 }
          ]
        }
      }
    }
  })
}

/**
 * Iniciar simulador de tiempo real
 * @param {number} interval - Intervalo en milisegundos (default: 10 segundos)
 */
export function startLiveUpdates(interval = 10000) {
  if (updateInterval) {
    stopLiveUpdates()
  }
  
  console.log(' Iniciando simulador de actualizaciones en tiempo real...')
  
  updateInterval = setInterval(() => {
    updateLiveMatches()
    updateGolfTournaments()
    checkScheduledMatches()
    console.log(' Datos actualizados:', new Date().toLocaleTimeString())
  }, interval)
}

/**
 * Detener simulador de tiempo real
 */
export function stopLiveUpdates() {
  if (updateInterval) {
    clearInterval(updateInterval)
    updateInterval = null
    console.log(' Simulador de actualizaciones detenido')
  }
}

