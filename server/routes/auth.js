/**
 * Rutas de autenticacion
 * Endpoints: POST /api/auth/register, POST /api/auth/login, GET /api/auth/me
 */
import express from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../middleware/auth.js'
import { User } from '../models/User.js'

const router = express.Router()

// Fallback: usuarios en memoria si MongoDB no est disponible
let usersInMemory = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@aceputt.com',
    password: 'admin123',
    role: 'admin',
    points: 1000,
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

// Funcion helper para verificar si MongoDB est disponible
async function isMongoAvailable() {
  try {
    // Verificar si mongoose est conectado
    const mongoose = await import('mongoose')
    const connectionState = mongoose.default.connection.readyState
    // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    if (connectionState !== 1) {
      console.log(`  ⚠️  MongoDB no conectado (estado: ${connectionState}), usando fallback en memoria`)
      return false
    }
    // Intentar una consulta simple para asegurar que funciona
    await User.findOne().limit(1)
    return true
  } catch (error) {
    console.log('  ⚠️  Error verificando MongoDB, usando fallback en memoria:', error.message)
    return false
  }
}

/**
 * POST /api/auth/register
 * Registrar un nuevo usuario
 */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Validacin bsica
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
        error: 'Contrasena muy corta',
        message: 'La contrasena debe tener al menos 6 caracteres'
      })
    }

    const mongoAvailable = await isMongoAvailable()

    if (mongoAvailable) {
      // Usar MongoDB
      console.log(`📝 Registrando usuario en MongoDB: ${email}`)
      
      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({
        $or: [{ email }, { username }]
      })

      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Usuario ya existe',
          message: 'El email o nombre de usuario ya est registrado'
        })
      }

      // Crear nuevo usuario (la contrasena se hashea automticamente en el pre-save hook)
      const newUser = new User({
        username,
        email,
        password,
        role: 'user',
        points: 1000
      })

      await newUser.save()
      console.log(`✅ Usuario registrado exitosamente en MongoDB: ${newUser._id}`)

      // Generar token JWT
      const token = jwt.sign(
        {
          id: newUser._id.toString(),
          username: newUser.username,
          email: newUser.email,
          role: newUser.role
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      )

      // Preparar datos del usuario para la respuesta (formato estandarizado)
      const userData = {
        id: newUser._id.toString(),
        _id: newUser._id.toString(),
        username: newUser.username || '',
        email: newUser.email || '',
        role: newUser.role || 'user',
        points: newUser.points !== undefined ? newUser.points : 1000,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
      }

      console.log('✅ Registro exitoso para:', userData.username)
      console.log('   📋 Datos del usuario:', JSON.stringify(userData, null, 2))

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: {
          user: userData,
          token
        }
      })
    } else {
      // Fallback: usar memoria
      const existingUser = usersInMemory.find(u => u.email === email || u.username === username)
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Usuario ya existe',
          message: 'El email o nombre de usuario ya est registrado'
        })
      }

      const newUser = {
        id: usersInMemory.length > 0 ? Math.max(...usersInMemory.map(u => u.id)) + 1 : 1,
        username,
        email,
        password,
        role: 'user',
        points: 1000,
        createdAt: new Date().toISOString()
      }

      usersInMemory.push(newUser)

      const token = jwt.sign(
        {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      )

      const { password: _, ...userWithoutPassword } = newUser

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: {
          user: userWithoutPassword,
          token
        }
      })
    }
  } catch (error) {
    // Manejar errores de validacin de Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message).join(', ')
      return res.status(400).json({
        success: false,
        error: 'Error de validacin',
        message: messages
      })
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Usuario ya existe',
        message: 'El email o nombre de usuario ya est registrado'
      })
    }

    res.status(500).json({
      success: false,
      error: 'Error al registrar usuario',
      message: error.message
    })
  }
})

/**
 * POST /api/auth/login
 * Iniciar sesin
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Validacin bsica
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos',
        message: 'Se requiere: email y password'
      })
    }

    const mongoAvailable = await isMongoAvailable()

    if (mongoAvailable) {
      // Usar MongoDB
      // Buscar usuario (incluir password para comparar)
      const user = await User.findOne({
        $or: [{ email }, { username: email }]
      }).select('+password')

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Credenciales invlidas',
          message: 'Email o contrasena incorrectos'
        })
      }

      // Verificar contrasena
      const isPasswordValid = await user.comparePassword(password)
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: 'Credenciales invlidas',
          message: 'Email o contrasena incorrectos'
        })
      }

      // Generar token JWT
      const token = jwt.sign(
        {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      )

      // Preparar datos del usuario para la respuesta (sin password)
      const userData = {
        id: user._id.toString(),
        _id: user._id.toString(),
        username: user.username || '',
        email: user.email || '',
        role: user.role || 'user',
        points: user.points !== undefined ? user.points : 1000,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
      
      // Asegurar que todos los campos esten presentes
      if (!userData.username || !userData.email) {
        console.error(' Error: Usuario sin username o email:', userData)
        return res.status(500).json({
          success: false,
          error: 'Error al procesar datos del usuario',
          message: 'Datos del usuario incompletos'
        })
      }

      console.log('🔑 Login exitoso para:', userData.username)
      console.log('   📋 Datos del usuario:', JSON.stringify(userData, null, 2))

      res.json({
        success: true,
        message: 'Inicio de sesin exitoso',
        data: {
          user: userData,
          token
        }
      })
    } else {
      // Fallback: usar memoria
      const user = usersInMemory.find(u => u.email === email || u.username === email)
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Credenciales invlidas',
          message: 'Email o contrasena incorrectos'
        })
      }

      if (user.password !== password) {
        return res.status(401).json({
          success: false,
          error: 'Credenciales invlidas',
          message: 'Email o contrasena incorrectos'
        })
      }

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

      const { password: _, ...userWithoutPassword } = user

      res.json({
        success: true,
        message: 'Inicio de sesin exitoso',
        data: {
          user: userWithoutPassword,
          token
        }
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al iniciar sesin',
      message: error.message
    })
  }
})

/**
 * GET /api/auth/me
 * Obtener informacion del usuario actual (requiere autenticacion)
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
    
    const mongoAvailable = await isMongoAvailable()

    if (mongoAvailable) {
      // Usar MongoDB
      const user = await User.findById(decoded.id)
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        })
      }

      res.json({
        success: true,
        data: user.toJSON()
      })
    } else {
      // Fallback: usar memoria
      const user = usersInMemory.find(u => u.id === decoded.id)
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        })
      }

      const { password: _, ...userWithoutPassword } = user

      res.json({
        success: true,
        data: userWithoutPassword
      })
    }
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expirado'
      })
    }
    
    res.status(401).json({
      success: false,
      error: 'Token invlido'
    })
  }
})

/**
 * GET /api/auth/users
 * Obtener todos los usuarios (solo administradores)
 */
router.get('/users', async (req, res) => {
  try {
    // Verificar autenticacion
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

    const mongoAvailable = await isMongoAvailable()

    if (mongoAvailable) {
      // Usar MongoDB
      const users = await User.find().select('-password').sort({ createdAt: -1 })

      res.json({
        success: true,
        count: users.length,
        data: users
      })
    } else {
      // Fallback: usar memoria
      const usersWithoutPasswords = usersInMemory.map(({ password, ...user }) => user)

      res.json({
        success: true,
        count: usersWithoutPasswords.length,
        data: usersWithoutPasswords
      })
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Token invlido'
    })
  }
})

/**
 * GET /api/auth/leaderboard
 * Obtener ranking de usuarios por puntos (pblico, no requiere autenticacion)
 * Ordenado desde el que ms puntos tiene hasta el que menos
 */
router.get('/leaderboard', async (req, res) => {
  try {
    const mongoAvailable = await isMongoAvailable()

    if (mongoAvailable) {
      console.log('📊 Obteniendo leaderboard desde MongoDB...')
      
      // Usar MongoDB - ordenar por puntos descendente (de mayor a menor)
      const users = await User.find()
        .select('-password')
        .sort({ points: -1 }) // -1 = descendente (mayor a menor)
        .limit(100)
      
      console.log(`✅ Obtenidos ${users.length} usuarios desde MongoDB`)
      if (users.length > 0) {
        console.log(`   🏆 Top 3: ${users.slice(0, 3).map(u => `${u.username} (${u.points || 0} pts)`).join(', ')}`)
        console.log(`   👥 Todos los usuarios: ${users.map(u => `${u.username} (${u.points || 0} pts)`).join(', ')}`)
      } else {
        console.log('     ⚠️  No hay usuarios en MongoDB')
      }

      res.json({
        success: true,
        count: users.length,
        data: users.map((user, index) => ({
          rank: index + 1,
          username: user.username,
          email: user.email,
          points: user.points || 0,
          role: user.role
        }))
      })
    } else {
      console.log('  ⚠️  MongoDB no disponible, usando datos en memoria...')
      
      // Fallback: usar memoria
      const usersWithoutPasswords = usersInMemory
        .map(({ password, ...user }) => user)
        .sort((a, b) => (b.points || 0) - (a.points || 0)) // Ordenar descendente
        .slice(0, 100)
        .map((user, index) => ({
          rank: index + 1,
          username: user.username,
          email: user.email,
          points: user.points || 0,
          role: user.role
        }))

      res.json({
        success: true,
        count: usersWithoutPasswords.length,
        data: usersWithoutPasswords
      })
    }
  } catch (error) {
    console.error(' Error obteniendo leaderboard:', error)
    res.status(500).json({
      success: false,
      error: 'Error al obtener el leaderboard',
      message: error.message
    })
  }
})

/**
 * PATCH /api/auth/users/:id
 * Actualizar puntos de un usuario (requiere autenticacion)
 */
router.patch('/users/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { points } = req.body

    // Verificar autenticacion
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Autenticacion requerida'
      })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const userId = decoded.id.toString()

    // Solo el usuario puede actualizar sus propios puntos
    if (userId !== id) {
      return res.status(403).json({
        success: false,
        error: 'No autorizado',
        message: 'Solo puedes actualizar tus propios puntos'
      })
    }

    if (points === undefined || points === null) {
      return res.status(400).json({
        success: false,
        error: 'Campo requerido',
        message: 'Se requiere el campo "points"'
      })
    }

    const mongoAvailable = await isMongoAvailable()

    if (mongoAvailable) {
      const user = await User.findByIdAndUpdate(
        id,
        { $set: { points } },
        { new: true, runValidators: true }
      )

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        })
      }

      return res.json({
        success: true,
        message: 'Puntos actualizados exitosamente',
        data: {
          username: user.username,
          points: user.points
        }
      })
    } else {
      // Fallback: usar memoria
      const userIndex = usersInMemory.findIndex(u => u.id.toString() === id)
      
      if (userIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        })
      }

      usersInMemory[userIndex].points = points

      return res.json({
        success: true,
        message: 'Puntos actualizados exitosamente (en memoria)',
        data: {
          username: usersInMemory[userIndex].username,
          points: usersInMemory[userIndex].points
        }
      })
    }
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Token invlido'
      })
    }
    
    res.status(500).json({
      success: false,
      error: 'Error al actualizar puntos',
      message: error.message
    })
  }
})

export { router as authRouter }

