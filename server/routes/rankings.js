/**
 * Rutas para rankings
 * Endpoints: GET
 */
import express from 'express'
import { Ranking } from '../models/Ranking.js'
import { rankings } from '../data/mockData.js'

const router = express.Router()

// GET /api/rankings - Obtener todos los rankings
router.get('/', async (req, res) => {
  try {
    // Intentar obtener de MongoDB
    try {
      const dbRankings = await Ranking.find({})
      if (dbRankings && dbRankings.length > 0) {
        const rankingsData = {
          atp: [],
          wta: [],
          pga: []
        }
        
        dbRankings.forEach(ranking => {
          if (ranking.type === 'atp') rankingsData.atp = ranking.players
          if (ranking.type === 'wta') rankingsData.wta = ranking.players
          if (ranking.type === 'pga') rankingsData.pga = ranking.players
        })
        
        return res.json({
          success: true,
          data: rankingsData
        })
      }
    } catch (error) {
      console.log('MongoDB no disponible, usando datos en memoria...')
    }
    
    // Si MongoDB falla, usar datos en memoria
    res.json({
      success: true,
      data: {
        atp: rankings.atp,
        wta: rankings.wta,
        pga: rankings.pga
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener los rankings',
      message: error.message
    })
  }
})

// GET /api/rankings/:type - Obtener ranking por tipo
router.get('/:type', async (req, res) => {
  try {
    const { type } = req.params
    const validTypes = ['atp', 'wta', 'pga']
    
    if (!validTypes.includes(type.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: 'Tipo de ranking inválido. Use: atp, wta o pga'
      })
    }
    
    // Intentar obtener de MongoDB
    try {
      const dbRanking = await Ranking.findOne({ type: type.toLowerCase() })
      if (dbRanking && dbRanking.players.length > 0) {
        return res.json({
          success: true,
          type: type.toLowerCase(),
          count: dbRanking.players.length,
          data: dbRanking.players
        })
      }
    } catch (error) {
      console.log('MongoDB no disponible, usando datos en memoria...')
    }
    
    // Si MongoDB falla, usar datos en memoria
    const rankingData = rankings[type.toLowerCase()]
    
    res.json({
      success: true,
      type: type.toLowerCase(),
      count: rankingData.length,
      data: rankingData
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener el ranking',
      message: error.message
    })
  }
})

export { router as rankingsRouter }

