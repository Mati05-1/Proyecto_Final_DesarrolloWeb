/**
 * Modelo de Apuesta (Mongoose Schema)
 */
import mongoose from 'mongoose'

const betSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'El ID del usuario es requerido'],
    trim: true
  },
  type: {
    type: String,
    enum: {
      values: ['tennis', 'golf'],
      message: 'El tipo debe ser: tennis o golf'
    },
    required: [true, 'El tipo de apuesta es requerido']
  },
  matchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    default: null
  },
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    default: null
  },
  selection: {
    type: Number,
    required: [true, 'La selección es requerida'],
    min: [1, 'La selección debe ser mayor a 0']
  },
  selectionName: {
    type: String,
    required: [true, 'El nombre de la selección es requerido'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'El monto es requerido'],
    min: [10, 'El monto mínimo es 10 puntos']
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'won', 'lost'],
      message: 'El estado debe ser: pending, won o lost'
    },
    default: 'pending'
  }
}, {
  timestamps: true // Crea automáticamente createdAt y updatedAt
})

// Índices
betSchema.index({ userId: 1 })
betSchema.index({ status: 1 })
betSchema.index({ type: 1 })
betSchema.index({ createdAt: -1 })

// Validación: debe tener matchId o tournamentId según el tipo
betSchema.pre('save', function(next) {
  if (this.type === 'tennis' && !this.matchId) {
    return next(new Error('Las apuestas de tenis requieren matchId'))
  }
  if (this.type === 'golf' && !this.tournamentId) {
    return next(new Error('Las apuestas de golf requieren tournamentId'))
  }
  next()
})

export const Bet = mongoose.model('Bet', betSchema)

