/**
 * Rutas para partidos de tenis
 * Endpoints: GET, POST, PATCH, DELETE
 */
import express from 'express'
import { Match } from '../models/Match.js'
import { tennisMatches } from '../data/mockData.js'
import { fetchTennisMatchesFromAPI } from '../services/externalAPIs.js'

const router = express.Router()

// Función para obtener datos (MongoDB, API externa o mock)
async function getMatchesData() {
  // 1. Intentar obtener de MongoDB primero
  try {
    const dbMatches = await Match.find({})
    if (dbMatches && dbMatches.length > 0) {
      return dbMatches
    }
  } catch (error) {
    console.log('MongoDB no disponible, usando otras fuentes...')
  }
  
  // 2. Intentar obtener de API externa
  const externalData = await fetchTennisMatchesFromAPI()
  if (externalData && externalData.length > 0) {
    return externalData
  }
  
  // 3. Si no hay MongoDB ni API externa, usar mock
  return tennisMatches
}

// GET /api/matches - Obtener todos los partidos
router.get('/', async (req, res) => {
  const { status, player } = req.query
  
  // Obtener datos (de API externa o mock)
  const allMatches = await getMatchesData()
  let filteredMatches = [...allMatches]
  
  // Filtrar por estado
  if (status) {
    filteredMatches = filteredMatches.filter(m => m.status === status)
  }
  
  // Filtrar por jugador
  if (player) {
    filteredMatches = filteredMatches.filter(m =>
      m.player1.name.toLowerCase().includes(player.toLowerCase()) ||
      m.player2.name.toLowerCase().includes(player.toLowerCase())
    )
  }
  
  res.json({
    success: true,
    count: filteredMatches.length,
    data: filteredMatches
  })
})

// GET /api/matches/:id - Obtener un partido por ID
router.get('/:id', async (req, res) => {
  try {
    // Intentar buscar en MongoDB primero
    let match = null
    try {
      // Verificar si es un ObjectId válido de MongoDB
      if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        match = await Match.findById(req.params.id)
      } else {
        // Si no es ObjectId, buscar por ID numérico (compatibilidad con mock)
        const id = parseInt(req.params.id)
        const allMatches = await getMatchesData()
        match = allMatches.find(m => m.id === id || m._id?.toString() === req.params.id)
      }
    } catch (error) {
      // Si MongoDB falla, buscar en datos mock
      const id = parseInt(req.params.id)
      const allMatches = await getMatchesData()
      match = allMatches.find(m => m.id === id)
    }
    
    if (!match) {
      return res.status(404).json({
        success: false,
        error: 'Partido no encontrado'
      })
    }
    
    res.json({
      success: true,
      data: match
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener el partido',
      message: error.message
    })
  }
})

// POST /api/matches - Crear un nuevo partido
router.post('/', async (req, res) => {
  try {
    const { tournament, player1, player2, startTime } = req.body
    
    // Validación básica (Mongoose también validará)
    if (!tournament || !player1 || !player2) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos: tournament, player1, player2'
      })
    }
    
    // Intentar guardar en MongoDB
    try {
      const newMatch = new Match({
        tournament,
        player1,
        player2,
        startTime: startTime || new Date(),
        score: { sets: [] },
        status: 'scheduled'
      })
      
      const savedMatch = await newMatch.save()
      
      return res.status(201).json({
        success: true,
        message: 'Partido creado exitosamente en MongoDB',
        data: savedMatch
      })
    } catch (dbError) {
      // Si MongoDB falla, guardar en memoria (mock)
      console.log('MongoDB no disponible, guardando en memoria...')
      
      const newMatch = {
        id: tennisMatches.length > 0 
          ? Math.max(...tennisMatches.map(m => m.id)) + 1 
          : 1,
        tournament,
        player1,
        player2,
        score: { sets: [] },
        status: 'scheduled',
        startTime: startTime || new Date().toISOString(),
        createdAt: new Date().toISOString()
      }
      
      tennisMatches.push(newMatch)
      
      return res.status(201).json({
        success: true,
        message: 'Partido creado exitosamente (en memoria)',
        data: newMatch
      })
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Error al crear el partido',
      message: error.message
    })
  }
})

// PATCH /api/matches/:id - Actualizar un partido
router.patch('/:id', async (req, res) => {
  try {
    const allowedFields = ['status', 'score', 'time', 'winner']
    const updates = {}
    
    // Filtrar solo campos permitidos
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field]
      }
    })
    
    // Intentar actualizar en MongoDB
    try {
      let match = null
      if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        match = await Match.findByIdAndUpdate(
          req.params.id,
          { $set: updates },
          { new: true, runValidators: true }
        )
      }
      
      if (match) {
        return res.json({
          success: true,
          message: 'Partido actualizado exitosamente en MongoDB',
          data: match
        })
      }
    } catch (dbError) {
      console.log('MongoDB no disponible, actualizando en memoria...')
    }
    
    // Si MongoDB falla, actualizar en memoria
    const id = parseInt(req.params.id)
    const matchIndex = tennisMatches.findIndex(m => m.id === id)
    
    if (matchIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Partido no encontrado'
      })
    }
    
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        tennisMatches[matchIndex][field] = updates[field]
      }
    })
    
    res.json({
      success: true,
      message: 'Partido actualizado exitosamente (en memoria)',
      data: tennisMatches[matchIndex]
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Error al actualizar el partido',
      message: error.message
    })
  }
})

// DELETE /api/matches/:id - Eliminar un partido
router.delete('/:id', async (req, res) => {
  try {
    // Intentar eliminar de MongoDB
    try {
      let deletedMatch = null
      if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        deletedMatch = await Match.findByIdAndDelete(req.params.id)
      }
      
      if (deletedMatch) {
        return res.json({
          success: true,
          message: 'Partido eliminado exitosamente de MongoDB',
          data: deletedMatch
        })
      }
    } catch (dbError) {
      console.log('MongoDB no disponible, eliminando de memoria...')
    }
    
    // Si MongoDB falla, eliminar de memoria
    const id = parseInt(req.params.id)
    const matchIndex = tennisMatches.findIndex(m => m.id === id)
    
    if (matchIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Partido no encontrado'
      })
    }
    
    const deletedMatch = tennisMatches.splice(matchIndex, 1)[0]
    
    res.json({
      success: true,
      message: 'Partido eliminado exitosamente (de memoria)',
      data: deletedMatch
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al eliminar el partido',
      message: error.message
    })
  }
})

export { router as matchesRouter }

