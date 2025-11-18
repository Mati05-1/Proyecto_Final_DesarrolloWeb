/**
 * Rutas de autenticación
 * Endpoints: POST /api/auth/register, POST /api/auth/login, GET /api/auth/me
 */
import express from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../middleware/auth.js'

const router = express.Router()

// Simulación de base de datos de usuarios (en producción sería MongoDB)
// En memoria para esta simulación
let users = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@aceputt.com',
    password: 'admin123', // En producción debería estar hasheado
    role: 'admin',
    points: 10000,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    username: 'demo',
    email: 'demo@aceputt.com',
    password: 'demo123',
    role: 'user',
    points: 1000,
    createdAt: new Date().toISOString()
  }
]

/**
 * POST /api/auth/register
 * Registrar un nuevo usuario
 */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Validación básica
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos',
        message: 'Se requiere: username, email y password'
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Contraseña muy corta',
        message: 'La contraseña debe tener al menos 6 caracteres'
      })
    }

    // Verificar si el usuario ya existe
    const existingUser = users.find(u => u.email === email || u.username === username)
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Usuario ya existe',
        message: 'El email o nombre de usuario ya está registrado'
      })
    }

    // Crear nuevo usuario
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      username,
      email,
      password, // En producción: bcrypt.hash(password, 10)
      role: 'user',
      points: 1000, // Puntos iniciales
      createdAt: new Date().toISOString()
    }

    users.push(newUser)

    // Generar token JWT
    const token = jwt.sign(
      {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      },
      JWT_SECRET,
      { expiresIn: '7d' } // Token válido por 7 días
    )

    // Respuesta sin la contraseña
    const { password: _, ...userWithoutPassword } = newUser

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: userWithoutPassword,
        token
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al registrar usuario',
      message: error.message
    })
  }
})

/**
 * POST /api/auth/login
 * Iniciar sesión
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Validación básica
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos',
        message: 'Se requiere: email y password'
      })
    }

    // Buscar usuario
    const user = users.find(u => u.email === email || u.username === email)
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas',
        message: 'Email o contraseña incorrectos'
      })
    }

    // Verificar contraseña (en producción: bcrypt.compare(password, user.password))
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas',
        message: 'Email o contraseña incorrectos'
      })
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Respuesta sin la contraseña
    const { password: _, ...userWithoutPassword } = user

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        user: userWithoutPassword,
        token
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al iniciar sesión',
      message: error.message
    })
  }
})

/**
 * GET /api/auth/me
 * Obtener información del usuario actual (requiere autenticación)
 */
router.get('/me', async (req, res) => {
  try {
    // Obtener token del header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token requerido'
      })
    }

    // Verificar token
    const decoded = jwt.verify(token, JWT_SECRET)
    
    // Buscar usuario
    const user = users.find(u => u.id === decoded.id)
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      })
    }

    // Respuesta sin la contraseña
    const { password: _, ...userWithoutPassword } = user

    res.json({
      success: true,
      data: userWithoutPassword
    })
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expirado'
      })
    }
    
    res.status(401).json({
      success: false,
      error: 'Token inválido'
    })
  }
})

/**
 * GET /api/auth/users
 * Obtener todos los usuarios (solo administradores)
 */
router.get('/users', async (req, res) => {
  try {
    // Verificar autenticación
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token requerido'
      })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    
    // Verificar que sea admin
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Acceso denegado',
        message: 'Solo administradores pueden ver todos los usuarios'
      })
    }

    // Retornar usuarios sin contraseñas
    const usersWithoutPasswords = users.map(({ password, ...user }) => user)

    res.json({
      success: true,
      count: usersWithoutPasswords.length,
      data: usersWithoutPasswords
    })
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Token inválido'
    })
  }
})

export { router as authRouter }

