/**
 * Modelo de Usuario (Mongoose Schema)
 */
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'El nombre de usuario es requerido'],
    trim: true,
    minlength: [3, 'El nombre de usuario debe tener al menos 3 caracteres'],
    maxlength: [30, 'El nombre de usuario no puede exceder 30 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor ingresa un email vlido']
  },
  password: {
    type: String,
    required: [true, 'La contrasena es requerida'],
    minlength: [6, 'La contrasena debe tener al menos 6 caracteres'],
    select: false // No incluir password por defecto en las consultas
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'admin'],
      message: 'El rol debe ser: user o admin'
    },
    default: 'user'
  },
  points: {
    type: Number,
    default: 1000,
    min: [0, 'Los puntos no pueden ser negativos']
  }
}, {
  timestamps: true // Crea automticamente createdAt y updatedAt
})

// ndices (unique para email y username)
userSchema.index({ email: 1 }, { unique: true })
userSchema.index({ username: 1 }, { unique: true })
userSchema.index({ role: 1 })

// Hash de contrasena antes de guardar
userSchema.pre('save', async function(next) {
  // Solo hashear si la contrasena fue modificada
  if (!this.isModified('password')) {
    return next()
  }
  
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Metodo para comparar contrasenas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// Metodo para obtener datos del usuario sin la contrasena
userSchema.methods.toJSON = function() {
  const userObject = this.toObject()
  delete userObject.password
  return userObject
}

export const User = mongoose.model('User', userSchema)

