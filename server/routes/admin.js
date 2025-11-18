/**
 * Rutas de administración
 * Requieren autenticación y rol de administrador
 */
import express from 'express'
import { authenticateToken, requireAdmin } from '../middleware/auth.js'
import { Match } from '../models/Match.js'
import { Tournament } from '../models/Tournament.js'
import { Bet } from '../models/Bet.js'
import { Ranking } from '../models/Ranking.js'

const router = express.Router()

// Todas las rutas requieren autenticación y ser admin
router.use(authenticateToken)
router.use(requireAdmin)

/**
 * GET /api/admin/dashboard
 * Estadísticas del dashboard de administración
 */
router.get('/dashboard', async (req, res) => {
  try {
    // Intentar obtener datos de MongoDB
    let stats = {
      matches: { total: 0, live: 0, finished: 0, scheduled: 0 },
      tournaments: { total: 0, live: 0, scheduled: 0 },
      bets: { total: 0, pending: 0, won: 0, lost: 0 },
      rankings: { total: 0 }
    }

    try {
      // Contar matches
      stats.matches.total = await Match.countDocuments()
      stats.matches.live = await Match.countDocuments({ status: 'live' })
      stats.matches.finished = await Match.countDocuments({ status: 'finished' })
      stats.matches.scheduled = await Match.countDocuments({ status: 'scheduled' })

      // Contar tournaments
      stats.tournaments.total = await Tournament.countDocuments()
      stats.tournaments.live = await Tournament.countDocuments({ status: 'live' })
      stats.tournaments.scheduled = await Tournament.countDocuments({ status: 'scheduled' })

      // Contar bets
      stats.bets.total = await Bet.countDocuments()
      stats.bets.pending = await Bet.countDocuments({ status: 'pending' })
      stats.bets.won = await Bet.countDocuments({ status: 'won' })
      stats.bets.lost = await Bet.countDocuments({ status: 'lost' })

      // Contar rankings
      stats.rankings.total = await Ranking.countDocuments()
    } catch (error) {
      console.log('MongoDB no disponible, usando datos mock...')
      // Si MongoDB no está disponible, usar datos mock
      stats = {
        matches: { total: 5, live: 2, finished: 2, scheduled: 1 },
        tournaments: { total: 3, live: 2, scheduled: 1 },
        bets: { total: 2, pending: 2, won: 0, lost: 0 },
        rankings: { total: 3 }
      }
    }

    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener estadísticas',
      message: error.message
    })
  }
})

/**
 * DELETE /api/admin/matches/:id
 * Eliminar un partido (solo admin)
 */
router.delete('/matches/:id', async (req, res) => {
  try {
    let deletedMatch = null

    try {
      if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        deletedMatch = await Match.findByIdAndDelete(req.params.id)
      }
    } catch (error) {
      // Continuar con fallback
    }

    if (!deletedMatch) {
      return res.status(404).json({
        success: false,
        error: 'Partido no encontrado'
      })
    }

    res.json({
      success: true,
      message: 'Partido eliminado exitosamente',
      data: deletedMatch
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al eliminar partido',
      message: error.message
    })
  }
})

/**
 * DELETE /api/admin/tournaments/:id
 * Eliminar un torneo (solo admin)
 */
router.delete('/tournaments/:id', async (req, res) => {
  try {
    let deletedTournament = null

    try {
      if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        deletedTournament = await Tournament.findByIdAndDelete(req.params.id)
      }
    } catch (error) {
      // Continuar con fallback
    }

    if (!deletedTournament) {
      return res.status(404).json({
        success: false,
        error: 'Torneo no encontrado'
      })
    }

    res.json({
      success: true,
      message: 'Torneo eliminado exitosamente',
      data: deletedTournament
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al eliminar torneo',
      message: error.message
    })
  }
})

export { router as adminRouter }

