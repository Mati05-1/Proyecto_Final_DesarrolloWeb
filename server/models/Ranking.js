/**
 * Modelo de Ranking (Mongoose Schema)
 */
import mongoose from 'mongoose'

const rankingPlayerSchema = new mongoose.Schema({
  rank: {
    type: Number,
    required: true,
    min: [1, 'El ranking debe ser mayor a 0']
  },
  player: {
    type: String,
    required: [true, 'El nombre del jugador es requerido'],
    trim: true
  },
  country: {
    type: String,
    default: '🌍'
  },
  points: {
    type: Number,
    required: [true, 'Los puntos son requeridos'],
    min: [0, 'Los puntos no pueden ser negativos']
  }
}, { _id: false })

const rankingSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: {
      values: ['atp', 'wta', 'pga'],
      message: 'El tipo debe ser: atp, wta o pga'
    },
    required: [true, 'El tipo de ranking es requerido']
  },
  players: {
    type: [rankingPlayerSchema],
    default: []
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Índice único en type (solo un ranking por tipo)
rankingSchema.index({ type: 1 }, { unique: true })

export const Ranking = mongoose.model('Ranking', rankingSchema)

