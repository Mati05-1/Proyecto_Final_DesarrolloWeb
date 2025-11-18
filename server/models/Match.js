/**
 * Modelo de Partido de Tenis (Mongoose Schema)
 */
import mongoose from 'mongoose'

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del jugador es requerido'],
    trim: true
  },
  country: {
    type: String,
    default: '🌍'
  },
  rank: {
    type: Number,
    min: [1, 'El ranking debe ser mayor a 0'],
    default: 0
  }
}, { _id: false })

const setSchema = new mongoose.Schema({
  p1: { type: Number, default: 0, min: 0 },
  p2: { type: Number, default: 0, min: 0 }
}, { _id: false })

const scoreSchema = new mongoose.Schema({
  sets: {
    type: [setSchema],
    default: []
  }
}, { _id: false })

const matchSchema = new mongoose.Schema({
  tournament: {
    type: String,
    required: [true, 'El nombre del torneo es requerido'],
    trim: true
  },
  player1: {
    type: playerSchema,
    required: [true, 'El jugador 1 es requerido']
  },
  player2: {
    type: playerSchema,
    required: [true, 'El jugador 2 es requerido']
  },
  score: {
    type: scoreSchema,
    default: { sets: [] }
  },
  status: {
    type: String,
    enum: {
      values: ['scheduled', 'live', 'finished'],
      message: 'El estado debe ser: scheduled, live o finished'
    },
    default: 'scheduled'
  },
  time: {
    type: String,
    default: null
  },
  startTime: {
    type: Date,
    required: [true, 'La fecha de inicio es requerida']
  },
  winner: {
    type: Number,
    enum: [1, 2],
    default: null
  },
  originalId: {
    type: Number,
    default: null
  }
}, {
  timestamps: true // Crea automáticamente createdAt y updatedAt
})

// Índices para búsquedas más rápidas
matchSchema.index({ status: 1 })
matchSchema.index({ 'player1.name': 1, 'player2.name': 1 })
matchSchema.index({ startTime: 1 })

// Validación personalizada: no puede haber ganador si el partido no está terminado
matchSchema.pre('save', function(next) {
  if (this.winner && this.status !== 'finished') {
    this.status = 'finished'
  }
  if (this.status === 'finished' && !this.winner) {
    // Si está terminado pero no hay ganador, establecer uno basado en los sets
    if (this.score && this.score.sets) {
      const setsWonP1 = this.score.sets.filter(s => s.p1 > s.p2).length
      const setsWonP2 = this.score.sets.filter(s => s.p2 > s.p1).length
      if (setsWonP1 > setsWonP2) {
        this.winner = 1
      } else if (setsWonP2 > setsWonP1) {
        this.winner = 2
      }
    }
  }
  next()
})

export const Match = mongoose.model('Match', matchSchema)

