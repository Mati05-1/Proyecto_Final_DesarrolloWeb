/**
 * Script para poblar la base de datos con datos iniciales
 * Ejecutar: node scripts/seedDatabase.js
 */
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { Match } from '../models/Match.js'
import { Tournament } from '../models/Tournament.js'
import { Bet } from '../models/Bet.js'
import { Ranking } from '../models/Ranking.js'
import { User } from '../models/User.js'
import { tennisMatches, golfTournaments, bets, rankings } from '../data/mockData.js'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ace-putt'

async function seedDatabase() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(MONGODB_URI)
    console.log(' Conectado a MongoDB')
    
    // Limpiar colecciones existentes
    await Match.deleteMany({})
    await Tournament.deleteMany({})
    await Bet.deleteMany({})
    await Ranking.deleteMany({})
    await User.deleteMany({})
    console.log('  Colecciones limpiadas')
    
    // Insertar partidos de tenis
    const matches = await Match.insertMany(
      tennisMatches.map((match, index) => ({
        tournament: match.tournament,
        player1: match.player1,
        player2: match.player2,
        score: match.score,
        status: match.status,
        time: match.time,
        startTime: new Date(match.startTime),
        winner: match.winner,
        // Guardar el ID original para referencia
        originalId: match.id || index + 1
      }))
    )
    console.log(` ${matches.length} partidos de tenis insertados`)
    
    // Insertar torneos de golf
    const tournaments = await Tournament.insertMany(
      golfTournaments.map((tournament, index) => ({
        name: tournament.name,
        location: tournament.location,
        status: tournament.status,
        round: tournament.round,
        totalRounds: tournament.totalRounds,
        leaderboard: tournament.leaderboard,
        startTime: new Date(tournament.startTime),
        // Guardar el ID original para referencia
        originalId: tournament.id || index + 1
      }))
    )
    console.log(` ${tournaments.length} torneos de golf insertados`)
    
    // Insertar apuestas (necesitan ObjectIds de matches/tournaments)
    const betsToInsert = []
    for (const bet of bets) {
      const betData = {
        userId: bet.userId,
        type: bet.type,
        selection: bet.selection,
        selectionName: bet.selectionName,
        amount: bet.amount,
        status: bet.status
      }
      
      // Si es apuesta de tenis, buscar el match por ID numerico y usar su ObjectId
      if (bet.type === 'tennis' && bet.matchId) {
        // Buscar match por originalId o por indice
        const match = matches.find(m => m.originalId === bet.matchId) || matches[bet.matchId - 1]
        if (match && match._id) {
          betData.matchId = match._id
        } else if (matches.length > 0) {
          // Si no se encuentra, usar el primer match
          betData.matchId = matches[0]._id
        }
      }
      
      // Si es apuesta de golf, buscar el tournament por ID numerico y usar su ObjectId
      if (bet.type === 'golf' && bet.tournamentId) {
        // Buscar tournament por originalId o por indice
        const tournament = tournaments.find(t => t.originalId === bet.tournamentId) || tournaments[bet.tournamentId - 1]
        if (tournament && tournament._id) {
          betData.tournamentId = tournament._id
        } else if (tournaments.length > 0) {
          // Si no se encuentra, usar el primer tournament
          betData.tournamentId = tournaments[0]._id
        }
      }
      
      betsToInsert.push(betData)
    }
    
    const betsData = await Bet.insertMany(betsToInsert)
    console.log(` ${betsData.length} apuestas insertadas`)
    
    // Insertar rankings
    const rankingsData = [
      { type: 'atp', players: rankings.atp },
      { type: 'wta', players: rankings.wta },
      { type: 'pga', players: rankings.pga }
    ]
    
    const rankingsInserted = await Ranking.insertMany(rankingsData)
    console.log(` ${rankingsInserted.length} rankings insertados`)
    
    // Insertar usuarios iniciales
    const usersData = [
      {
        username: 'admin',
        email: 'admin@aceputt.com',
        password: 'admin123', // Se hashear automticamente
        role: 'admin',
        points: 1000
      },
      {
        username: 'demo',
        email: 'demo@aceputt.com',
        password: 'demo123', // Se hashear automticamente
        role: 'user',
        points: 1000
      }
    ]
    
    const usersInserted = await User.insertMany(usersData)
    console.log(` ${usersInserted.length} usuarios insertados`)
    console.log('    Usuarios de prueba:')
    console.log('      - admin@aceputt.com / admin123 (admin)')
    console.log('      - demo@aceputt.com / demo123 (usuario)')
    
    console.log('\n Base de datos poblada exitosamente!')
    process.exit(0)
  } catch (error) {
    console.error(' Error poblando la base de datos:', error)
    process.exit(1)
  }
}

seedDatabase()

