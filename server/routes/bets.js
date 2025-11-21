/**
 * Rutas para apuestas
 * Endpoints: GET, POST, PATCH, DELETE
 */
import express from 'express'
import jwt from 'jsonwebtoken'
import { Bet } from '../models/Bet.js'
import { bets } from '../data/mockData.js'
import { optionalAuth, JWT_SECRET } from '../middleware/auth.js'

const router = express.Router()

// Funcion para obtener datos (MongoDB o mock)
async function getBetsData() {
  try {
    const dbBets = await Bet.find({})
    if (dbBets && dbBets.length > 0) {
      return dbBets
    }
  } catch (error) {
    console.log('MongoDB no disponible, usando datos en memoria...')
  }
  return bets
}

// GET /api/bets - Obtener todas las apuestas
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { userId, status, type } = req.query
    
    // Intentar obtener de MongoDB
    try {
      const query = {}
      if (userId) query.userId = userId
      if (status) query.status = status
      if (type) query.type = type
      
      const dbBets = await Bet.find(query)
      if (dbBets && dbBets.length > 0) {
        return res.json({
          success: true,
          count: dbBets.length,
          data: dbBets
        })
      }
    } catch (error) {
      console.log('MongoDB no disponible, usando datos en memoria...')
    }
    
    // Si MongoDB falla, usar datos en memoria
    let filteredBets = [...bets]
    
    if (userId) {
      filteredBets = filteredBets.filter(b => b.userId === userId)
    }
    if (status) {
      filteredBets = filteredBets.filter(b => b.status === status)
    }
    if (type) {
      filteredBets = filteredBets.filter(b => b.type === type)
    }
    
    res.json({
      success: true,
      count: filteredBets.length,
      data: filteredBets
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener las apuestas',
      message: error.message
    })
  }
})

// GET /api/bets/:id - Obtener una apuesta por ID
router.get('/:id', async (req, res) => {
  try {
    let bet = null
    
    // Intentar buscar en MongoDB
    try {
      if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        bet = await Bet.findById(req.params.id)
      }
    } catch (error) {
      // Continuar con bsqueda en memoria
    }
    
    // Si no se encontr en MongoDB, buscar en memoria
    if (!bet) {
      const id = parseInt(req.params.id)
      bet = bets.find(b => b.id === id)
    }
    
    if (!bet) {
      return res.status(404).json({
        success: false,
        error: 'Apuesta no encontrada'
      })
    }
    
    res.json({
      success: true,
      data: bet
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener la apuesta',
      message: error.message
    })
  }
})

// POST /api/bets - Crear una nueva apuesta (requiere autenticacion)
router.post('/', async (req, res) => {
  try {
    // Verificar autenticacion
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Autenticacion requerida',
        message: 'Debes iniciar sesin para crear apuestas'
      })
    }

    const { type, matchId, tournamentId, selection, selectionName, amount } = req.body
    
    // Obtener userId del token
    const decoded = jwt.verify(token, JWT_SECRET)
    const userId = decoded.id.toString()
    
    // Validacin bsica (Mongoose tambien validar)
    if (!userId || !type || !selection || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos: userId, type, selection, amount'
      })
    }
    
    if (type === 'tennis' && !matchId) {
      return res.status(400).json({
        success: false,
        error: 'Para apuestas de tenis se requiere matchId'
      })
    }
    
    if (type === 'golf' && !tournamentId) {
      return res.status(400).json({
        success: false,
        error: 'Para apuestas de golf se requiere tournamentId'
      })
    }
    
    if (amount < 10) {
      return res.status(400).json({
        success: false,
        error: 'El monto minimo de apuesta es 10 puntos'
      })
    }
    
    // Intentar guardar en MongoDB
    try {
      // Descontar puntos del usuario al crear la apuesta
      const { User } = await import('../models/User.js')
      const user = await User.findById(userId)
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        })
      }

      // Verificar que el usuario tenga suficientes puntos
      if (user.points < amount) {
        return res.status(400).json({
          success: false,
          error: 'Puntos insuficientes',
          message: `No tienes suficientes puntos. Disponibles: ${user.points}, Requeridos: ${amount}`
        })
      }

      // Descontar puntos del usuario
      const pointsBefore = user.points
      user.points -= amount
      await user.save()
      console.log(` Puntos descontados en MongoDB: Usuario ${user.username}`)
      console.log(`   Antes: ${pointsBefore} pts  Despues: ${user.points} pts (descont ${amount})`)
      
      // Verificar que se guard correctamente
      const verifyUser = await User.findById(userId)
      console.log(`   Verificacin: Usuario tiene ${verifyUser.points} puntos en MongoDB`)

      const newBet = new Bet({
        userId,
        type,
        matchId: matchId || null,
        tournamentId: tournamentId || null,
        selection,
        selectionName: selectionName || `Opcin ${selection}`,
        amount,
        status: 'pending'
      })
      
      const savedBet = await newBet.save()
      
      return res.status(201).json({
        success: true,
        message: 'Apuesta creada exitosamente en MongoDB',
        data: savedBet,
        userPoints: user.points // Incluir puntos actualizados en la respuesta
      })
    } catch (dbError) {
      console.log('MongoDB no disponible, guardando en memoria...')
      
      const newBet = {
        id: bets.length > 0 
          ? Math.max(...bets.map(b => b.id)) + 1 
          : 1,
        userId,
        type,
        matchId: matchId || null,
        tournamentId: tournamentId || null,
        selection,
        selectionName: selectionName || `Opcin ${selection}`,
        amount,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
      
      bets.push(newBet)
      
      return res.status(201).json({
        success: true,
        message: 'Apuesta creada exitosamente (en memoria)',
        data: newBet
      })
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Error al crear la apuesta',
      message: error.message
    })
  }
})

// PATCH /api/bets/:id - Actualizar una apuesta
router.patch('/:id', async (req, res) => {
  try {
    const allowedFields = ['status', 'amount']
    const updates = {}
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field]
      }
    })
    
    // Buscar la apuesta primero (en MongoDB o memoria)
    let bet = null
    let updatedUser = null
    
    // Intentar buscar en MongoDB
    try {
      if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        bet = await Bet.findById(req.params.id)
      }
    } catch (dbError) {
      // Continuar con bsqueda en memoria
    }
    
    // Si no se encontr en MongoDB, buscar en memoria
    if (!bet) {
      const id = parseInt(req.params.id)
      bet = bets.find(b => b.id === id)
    }
    
    if (!bet) {
      return res.status(404).json({
        success: false,
        error: 'Apuesta no encontrada'
      })
    }
    
    // Si se est actualizando el status a 'won' o 'lost', actualizar puntos del usuario
    if ((updates.status === 'won' || updates.status === 'lost') && bet.status === 'pending') {
      const { User } = await import('../models/User.js')
      
      try {
        const user = await User.findById(bet.userId)
        if (user) {
            const pointsBefore = user.points
            if (updates.status === 'won') {
              // Si gana: recupera su apuesta + ganancia igual
              // Ejemplo: apuesta 100  gana 200 (recupera 100 + gana 100)
              user.points += (bet.amount * 2)
              await user.save()
              console.log(` Usuario ${user.username} gan ${bet.amount * 2} puntos en MongoDB`)
              console.log(`   Antes: ${pointsBefore} pts  Despues: ${user.points} pts (gan ${bet.amount * 2})`)
              
              // Verificar que se guard correctamente
              const verifyUser = await User.findById(bet.userId)
              console.log(`   Verificacin: Usuario tiene ${verifyUser.points} puntos en MongoDB`)
            } else if (updates.status === 'lost') {
              // Si pierde, no se hace nada (ya se descontaron los puntos al apostar)
              await user.save()
              console.log(` Usuario ${user.username} perdi ${bet.amount} puntos. Total en MongoDB: ${user.points} pts`)
              
              // Verificar que se guard correctamente
              const verifyUser = await User.findById(bet.userId)
              console.log(`   Verificacin: Usuario tiene ${verifyUser.points} puntos en MongoDB`)
            }
            updatedUser = user
        }
      } catch (dbError) {
        console.log('Error actualizando puntos del usuario:', dbError.message)
      }
    }
    
    // Actualizar la apuesta en MongoDB
    try {
      let updatedBet = null
      if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        updatedBet = await Bet.findByIdAndUpdate(
          req.params.id,
          { $set: updates },
          { new: true, runValidators: true }
        )
      }
      
      if (updatedBet) {
        // Si se actualiz un usuario, incluir sus puntos actualizados en la respuesta
        const responseData = {
          success: true,
          message: 'Apuesta actualizada exitosamente en MongoDB',
          data: updatedBet
        }
        
        // SIEMPRE incluir puntos actualizados del usuario (recargar desde DB para asegurar datos frescos)
        if (updatedUser) {
          // Recargar usuario desde DB para asegurar puntos ms actualizados
          const { User } = await import('../models/User.js')
          const freshUser = await User.findById(bet.userId)
          if (freshUser) {
            responseData.userPoints = freshUser.points
            responseData.userId = freshUser._id.toString()
            console.log(` Puntos del usuario incluidos en respuesta: ${freshUser.points}`)
          } else {
            responseData.userPoints = updatedUser.points
            responseData.userId = updatedUser._id.toString()
            console.log(` Puntos del usuario incluidos en respuesta: ${updatedUser.points}`)
          }
        }
        
        return res.json(responseData)
      }
    } catch (dbError) {
      console.log('MongoDB no disponible, actualizando en memoria...', dbError.message)
    }
    
    // Si MongoDB falla, actualizar en memoria
    const id = parseInt(req.params.id)
    const betIndex = bets.findIndex(b => b.id === id)
    
    if (betIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Apuesta no encontrada'
      })
    }
    
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        bets[betIndex][field] = updates[field]
      }
    })
    
    res.json({
      success: true,
      message: 'Apuesta actualizada exitosamente (en memoria)',
      data: bets[betIndex]
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Error al actualizar la apuesta',
      message: error.message
    })
  }
})

// DELETE /api/bets/:id - Eliminar una apuesta
router.delete('/:id', async (req, res) => {
  try {
    // Intentar eliminar de MongoDB
    try {
      let bet = null
      if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        bet = await Bet.findById(req.params.id)
        if (bet && bet.status !== 'pending') {
          return res.status(400).json({
            success: false,
            error: 'Solo se pueden eliminar apuestas pendientes'
          })
        }
        if (bet) {
          const deletedBet = await Bet.findByIdAndDelete(req.params.id)
          return res.json({
            success: true,
            message: 'Apuesta eliminada exitosamente de MongoDB',
            data: deletedBet
          })
        }
      }
    } catch (dbError) {
      console.log('MongoDB no disponible, eliminando de memoria...')
    }
    
    // Si MongoDB falla, eliminar de memoria
    const id = parseInt(req.params.id)
    const betIndex = bets.findIndex(b => b.id === id)
    
    if (betIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Apuesta no encontrada'
      })
    }
    
    if (bets[betIndex].status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Solo se pueden eliminar apuestas pendientes'
      })
    }
    
    const deletedBet = bets.splice(betIndex, 1)[0]
    
    res.json({
      success: true,
      message: 'Apuesta eliminada exitosamente (de memoria)',
      data: deletedBet
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al eliminar la apuesta',
      message: error.message
    })
  }
})

export { router as betsRouter }

