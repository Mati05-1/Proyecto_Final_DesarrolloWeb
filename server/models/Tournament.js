/**
 * Modelo de Torneo de Golf (Mongoose Schema)
 */
import mongoose from 'mongoose'

const leaderboardPlayerSchema = new mongoose.Schema({
  position: {
    type: Number,
    required: true,
    min: [1, 'La posicin debe ser mayor a 0']
  },
  player: {
    type: String,
    required: [true, 'El nombre del jugador es requerido'],
    trim: true
  },
  country: {
    type: String,
    default: ''
  },
  score: {
    type: Number,
    default: 0
  },
  today: {
    type: Number,
    default: 0
  }
}, { _id: false })

const tournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del torneo es requerido'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'La ubicacin es requerida'],
    trim: true
  },
  status: {
    type: String,
    enum: {
      values: ['scheduled', 'live', 'finished'],
      message: 'El estado debe ser: scheduled, live o finished'
    },
    default: 'scheduled'
  },
  round: {
    type: Number,
    min: [1, 'La ronda debe ser mayor a 0'],
    default: 1
  },
  totalRounds: {
    type: Number,
    min: [1, 'El total de rondas debe ser mayor a 0'],
    default: 4
  },
  leaderboard: {
    type: [leaderboardPlayerSchema],
    default: []
  },
  startTime: {
    type: Date,
    required: [true, 'La fecha de inicio es requerida']
  },
  originalId: {
    type: Number,
    default: null
  }
}, {
  timestamps: true // Crea automticamente createdAt y updatedAt
})

// ndices
tournamentSchema.index({ status: 1 })
tournamentSchema.index({ startTime: 1 })
tournamentSchema.index({ name: 'text', location: 'text' }) // Bsqueda de texto

// Validacin: la ronda actual no puede ser mayor al total de rondas
tournamentSchema.pre('save', function(next) {
  if (this.round > this.totalRounds) {
    return next(new Error('La ronda actual no puede ser mayor al total de rondas'))
  }
  next()
})

export const Tournament = mongoose.model('Tournament', tournamentSchema)

