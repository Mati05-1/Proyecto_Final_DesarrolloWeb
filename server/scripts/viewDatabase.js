/**
 * Script para visualizar el contenido de la base de datos MongoDB
 * Uso: node server/scripts/viewDatabase.js
 */

import mongoose from 'mongoose'
import { Match } from '../models/Match.js'
import { Tournament } from '../models/Tournament.js'
import { Bet } from '../models/Bet.js'
import { Ranking } from '../models/Ranking.js'
import { User } from '../models/User.js'
import { connectDB, disconnectDB } from '../config/database.js'

async function viewDatabase() {
  try {
    // Conectar a la base de datos
    await connectDB()
    
    console.log('\n ==========================================')
    console.log('   VISUALIZACIN DE BASE DE DATOS')
    console.log('==========================================\n')
    
    // Contar documentos
    const matchesCount = await Match.countDocuments()
    const tournamentsCount = await Tournament.countDocuments()
    const betsCount = await Bet.countDocuments()
    const rankingsCount = await Ranking.countDocuments()
    const usersCount = await User.countDocuments()
    
    console.log(' ESTADSTICAS:')
    console.log(`    Usuarios: ${usersCount}`)
    console.log(`    Partidos de Tenis: ${matchesCount}`)
    console.log(`    Torneos de Golf: ${tournamentsCount}`)
    console.log(`    Apuestas: ${betsCount}`)
    console.log(`    Rankings: ${rankingsCount}`)
    console.log('')
    
    // Mostrar algunos partidos
    if (matchesCount > 0) {
      console.log(' PARTIDOS DE TENIS (ltimos 3):')
      const matches = await Match.find().limit(3).sort({ createdAt: -1 })
      matches.forEach((match, index) => {
        console.log(`\n   ${index + 1}. ${match.tournament}`)
        console.log(`      ${match.player1.name} vs ${match.player2.name}`)
        console.log(`      Estado: ${match.status}`)
        if (match.score && match.score.sets) {
          const sets = match.score.sets.map(s => `${s.p1}-${s.p2}`).join(', ')
          console.log(`      Sets: ${sets}`)
        }
        console.log(`      ID: ${match._id}`)
      })
      console.log('')
    }
    
    // Mostrar algunos torneos
    if (tournamentsCount > 0) {
      console.log(' TORNEOS DE GOLF (ltimos 2):')
      const tournaments = await Tournament.find().limit(2).sort({ createdAt: -1 })
      tournaments.forEach((tournament, index) => {
        console.log(`\n   ${index + 1}. ${tournament.name}`)
        console.log(`      Ubicacin: ${tournament.location}`)
        console.log(`      Estado: ${tournament.status}`)
        console.log(`      Ronda: ${tournament.round}/${tournament.totalRounds}`)
        if (tournament.leaderboard && tournament.leaderboard.length > 0) {
          console.log(`      Lider: ${tournament.leaderboard[0].player} (${tournament.leaderboard[0].score})`)
        }
        console.log(`      ID: ${tournament._id}`)
      })
      console.log('')
    }
    
    // Mostrar algunas apuestas
    if (betsCount > 0) {
      console.log(' APUESTAS (ltimas 3):')
      const bets = await Bet.find().limit(3).sort({ createdAt: -1 })
      bets.forEach((bet, index) => {
        console.log(`\n   ${index + 1}. ${bet.type === 'tennis' ? '' : ''} ${bet.selectionName}`)
        console.log(`      Monto: $${bet.amount}`)
        console.log(`      Estado: ${bet.status}`)
        console.log(`      Usuario: ${bet.userId}`)
        console.log(`      ID: ${bet._id}`)
      })
      console.log('')
    }
    
    // Mostrar rankings
    if (rankingsCount > 0) {
      console.log(' RANKINGS:')
      const rankings = await Ranking.find()
      rankings.forEach((ranking) => {
        console.log(`\n   ${ranking.type.toUpperCase()}:`)
        if (ranking.players && ranking.players.length > 0) {
          ranking.players.slice(0, 5).forEach((player, idx) => {
            console.log(`      ${idx + 1}. ${player.name} - ${player.points} pts`)
          })
          if (ranking.players.length > 5) {
            console.log(`      ... y ${ranking.players.length - 5} ms`)
          }
        }
      })
      console.log('')
    }
    
    // Mostrar usuarios
    if (usersCount > 0) {
      console.log(' USUARIOS (ltimos 5):')
      const users = await User.find().limit(5).sort({ createdAt: -1 }).select('+password')
      users.forEach((user, index) => {
        console.log(`\n   ${index + 1}. ${user.username} (${user.email})`)
        console.log(`      Rol: ${user.role}`)
        console.log(`      Puntos: ${user.points}`)
        console.log(`      Creado: ${user.createdAt.toLocaleDateString()}`)
        // Mostrar preview del hash de la contrasena (primeros 20 caracteres)
        const passwordPreview = user.password ? `${user.password.substring(0, 20)}...` : 'N/A'
        console.log(`       Contrasena (encriptada): ${passwordPreview}`)
        console.log(`       Hash completo: ${user.password ? user.password.length : 0} caracteres`)
        console.log(`      ID: ${user._id}`)
      })
      console.log('')
      console.log('     Las contrasenas estn encriptadas con bcrypt (hash seguro)')
      console.log('     El hash tiene ~60 caracteres y es irreversible')
      console.log('')
    }
    
    console.log('==========================================')
    console.log(' Visualizacin completada\n')
    
  } catch (error) {
    console.error(' Error:', error.message)
  } finally {
    await disconnectDB()
    process.exit(0)
  }
}

viewDatabase()

