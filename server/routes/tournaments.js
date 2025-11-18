/**
 * Rutas para torneos de golf
 * Endpoints: GET, POST, PATCH, DELETE
 */
import express from 'express'
import { Tournament } from '../models/Tournament.js'
import { golfTournaments } from '../data/mockData.js'
import { fetchGolfTournamentsFromAPI } from '../services/externalAPIs.js'

const router = express.Router()

// Función para obtener datos (MongoDB, API externa o mock)
async function getTournamentsData() {
  // 1. Intentar obtener de MongoDB primero
  try {
    const dbTournaments = await Tournament.find({})
    if (dbTournaments && dbTournaments.length > 0) {
      return dbTournaments
    }
  } catch (error) {
    console.log('MongoDB no disponible, usando otras fuentes...')
  }
  
  // 2. Intentar obtener de API externa
  const externalData = await fetchGolfTournamentsFromAPI()
  if (externalData && externalData.length > 0) {
    return externalData
  }
  
  // 3. Si no hay MongoDB ni API externa, usar mock
  return golfTournaments
}

// GET /api/tournaments - Obtener todos los torneos
router.get('/', async (req, res) => {
  const { status } = req.query
  
  // Obtener datos (de API externa o mock)
  const allTournaments = await getTournamentsData()
  let filteredTournaments = [...allTournaments]
  
  // Filtrar por estado
  if (status) {
    filteredTournaments = filteredTournaments.filter(t => t.status === status)
  }
  
  res.json({
    success: true,
    count: filteredTournaments.length,
    data: filteredTournaments
  })
})

// GET /api/tournaments/:id - Obtener un torneo por ID
router.get('/:id', async (req, res) => {
  try {
    // Intentar buscar en MongoDB primero
    let tournament = null
    try {
      if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        tournament = await Tournament.findById(req.params.id)
      } else {
        const id = parseInt(req.params.id)
        const allTournaments = await getTournamentsData()
        tournament = allTournaments.find(t => t.id === id || t._id?.toString() === req.params.id)
      }
    } catch (error) {
      const id = parseInt(req.params.id)
      const allTournaments = await getTournamentsData()
      tournament = allTournaments.find(t => t.id === id)
    }
    
    if (!tournament) {
      return res.status(404).json({
        success: false,
        error: 'Torneo no encontrado'
      })
    }
    
    res.json({
      success: true,
      data: tournament
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener el torneo',
      message: error.message
    })
  }
})

// POST /api/tournaments - Crear un nuevo torneo
router.post('/', async (req, res) => {
  try {
    const { name, location, startTime, totalRounds } = req.body
    
    // Validación básica (Mongoose también validará)
    if (!name || !location) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos: name, location'
      })
    }
    
    // Intentar guardar en MongoDB
    try {
      const newTournament = new Tournament({
        name,
        location,
        startTime: startTime || new Date(),
        totalRounds: totalRounds || 4,
        status: 'scheduled',
        round: 1,
        leaderboard: []
      })
      
      const savedTournament = await newTournament.save()
      
      return res.status(201).json({
        success: true,
        message: 'Torneo creado exitosamente en MongoDB',
        data: savedTournament
      })
    } catch (dbError) {
      console.log('MongoDB no disponible, guardando en memoria...')
      
      const newTournament = {
        id: golfTournaments.length > 0 
          ? Math.max(...golfTournaments.map(t => t.id)) + 1 
          : 1,
        name,
        location,
        status: 'scheduled',
        round: 1,
        totalRounds: totalRounds || 4,
        startTime: startTime || new Date().toISOString(),
        leaderboard: [],
        createdAt: new Date().toISOString()
      }
      
      golfTournaments.push(newTournament)
      
      return res.status(201).json({
        success: true,
        message: 'Torneo creado exitosamente (en memoria)',
        data: newTournament
      })
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Error al crear el torneo',
      message: error.message
    })
  }
})

// PATCH /api/tournaments/:id - Actualizar un torneo
router.patch('/:id', async (req, res) => {
  try {
    const allowedFields = ['status', 'round', 'leaderboard', 'name', 'location']
    const updates = {}
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field]
      }
    })
    
    // Intentar actualizar en MongoDB
    try {
      let tournament = null
      if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        tournament = await Tournament.findByIdAndUpdate(
          req.params.id,
          { $set: updates },
          { new: true, runValidators: true }
        )
      }
      
      if (tournament) {
        return res.json({
          success: true,
          message: 'Torneo actualizado exitosamente en MongoDB',
          data: tournament
        })
      }
    } catch (dbError) {
      console.log('MongoDB no disponible, actualizando en memoria...')
    }
    
    // Si MongoDB falla, actualizar en memoria
    const id = parseInt(req.params.id)
    const tournamentIndex = golfTournaments.findIndex(t => t.id === id)
    
    if (tournamentIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Torneo no encontrado'
      })
    }
    
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        golfTournaments[tournamentIndex][field] = updates[field]
      }
    })
    
    res.json({
      success: true,
      message: 'Torneo actualizado exitosamente (en memoria)',
      data: golfTournaments[tournamentIndex]
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Error al actualizar el torneo',
      message: error.message
    })
  }
})

// DELETE /api/tournaments/:id - Eliminar un torneo
router.delete('/:id', async (req, res) => {
  try {
    // Intentar eliminar de MongoDB
    try {
      let deletedTournament = null
      if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        deletedTournament = await Tournament.findByIdAndDelete(req.params.id)
      }
      
      if (deletedTournament) {
        return res.json({
          success: true,
          message: 'Torneo eliminado exitosamente de MongoDB',
          data: deletedTournament
        })
      }
    } catch (dbError) {
      console.log('MongoDB no disponible, eliminando de memoria...')
    }
    
    // Si MongoDB falla, eliminar de memoria
    const id = parseInt(req.params.id)
    const tournamentIndex = golfTournaments.findIndex(t => t.id === id)
    
    if (tournamentIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Torneo no encontrado'
      })
    }
    
    const deletedTournament = golfTournaments.splice(tournamentIndex, 1)[0]
    
    res.json({
      success: true,
      message: 'Torneo eliminado exitosamente (de memoria)',
      data: deletedTournament
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al eliminar el torneo',
      message: error.message
    })
  }
})

export { router as tournamentsRouter }

