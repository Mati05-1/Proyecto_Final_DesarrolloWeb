/**
 * Rutas para rankings
 * Endpoints: GET
 */
import express from 'express'
import { Ranking } from '../models/Ranking.js'
import { rankings } from '../data/mockData.js'
import { fetchATPRankings, fetchWTARankings } from '../services/tennisRankingsAPI.js'

const router = express.Router()

// GET /api/rankings - Obtener todos los rankings
router.get('/', async (req, res) => {
  try {
    let atpRankings = null
    let wtaRankings = null
    
    // 1. PRIORIDAD: Intentar obtener rankings de tenis desde API externa (datos en tiempo real)
    console.log(' Intentando obtener rankings desde API externa...')
    try {
      atpRankings = await fetchATPRankings()
      wtaRankings = await fetchWTARankings()
      console.log(`📊 Resultados API: ATP=${atpRankings ? atpRankings.length : 0}, WTA=${wtaRankings ? wtaRankings.length : 0}`)
    } catch (apiError) {
      console.log('  Error obteniendo rankings de API externa:', apiError.message)
    }
    
    // Si obtenemos datos reales (ms de 100 jugadores), usarlos y guardarlos
    if ((atpRankings && atpRankings.length > 100) || (wtaRankings && wtaRankings.length > 100)) {
      console.log(`✅ Usando rankings de API externa (tiempo real)`)
      
      // Guardar en MongoDB en background
      try {
        if (atpRankings && atpRankings.length > 100) {
          await Ranking.findOneAndUpdate(
            { type: 'atp' },
            { type: 'atp', players: atpRankings },
            { upsert: true, new: true }
          )
          console.log(`💾 Rankings ATP guardados en MongoDB (${atpRankings.length} jugadores)`)
        }
        if (wtaRankings && wtaRankings.length > 100) {
          await Ranking.findOneAndUpdate(
            { type: 'wta' },
            { type: 'wta', players: wtaRankings },
            { upsert: true, new: true }
          )
          console.log(`💾 Rankings WTA guardados en MongoDB (${wtaRankings.length} jugadoras)`)
        }
      } catch (error) {
        console.log('  Error guardando en MongoDB:', error.message)
      }
      
      return res.json({
        success: true,
        data: {
          atp: atpRankings || [],
          wta: wtaRankings || []
        }
      })
    }
    
    // 2. Si no hay datos de API, intentar obtener de MongoDB (puede tener datos reales guardados)
    try {
      const dbRankings = await Ranking.find({})
      if (dbRankings && dbRankings.length > 0) {
        const rankingsData = {
          atp: [],
          wta: []
        }
        
        let hasRealData = false
        
        dbRankings.forEach(ranking => {
          if (ranking.type === 'atp' && ranking.players && ranking.players.length > 0) {
            rankingsData.atp = ranking.players
            if (ranking.players.length > 100) hasRealData = true
          }
          if (ranking.type === 'wta' && ranking.players && ranking.players.length > 0) {
            rankingsData.wta = ranking.players
            if (ranking.players.length > 100) hasRealData = true
          }
        })
        
        // Si tenemos datos reales en MongoDB, usarlos
        if (hasRealData || (rankingsData.atp.length > 0 || rankingsData.wta.length > 0)) {
          console.log(`🗄️  Usando rankings de MongoDB (ATP: ${rankingsData.atp.length}, WTA: ${rankingsData.wta.length})`)
          return res.json({
            success: true,
            data: rankingsData
          })
        }
      }
    } catch (error) {
      console.log('  MongoDB no disponible o sin datos:', error.message)
    }
    
    // 3. Fallback: usar datos en memoria (mock)
    console.log('  Usando datos mock (simulados)')
    res.json({
      success: true,
      data: {
        atp: rankings.atp,
        wta: rankings.wta
      }
    })
  } catch (error) {
    console.error(' Error al obtener los rankings:', error)
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
    const validTypes = ['atp', 'wta']
    
    if (!validTypes.includes(type.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: 'Tipo de ranking invlido. Use: atp o wta'
      })
    }
    
    // 1. PRIORIDAD: Intentar obtener desde API externa (solo para ATP y WTA)
    if (type.toLowerCase() === 'atp') {
      try {
        const atpRankings = await fetchATPRankings()
        if (atpRankings && atpRankings.length > 100) {
          console.log(`✅ Usando ${atpRankings.length} rankings ATP de API externa (tiempo real)`)
          
          // Guardar en MongoDB en background para tenerlos disponibles despues
          try {
            await Ranking.findOneAndUpdate(
              { type: 'atp' },
              { type: 'atp', players: atpRankings },
              { upsert: true, new: true }
            )
            console.log(`💾 Rankings ATP guardados en MongoDB`)
          } catch (error) {
            console.log('  No se pudieron guardar rankings ATP en MongoDB:', error.message)
          }
          
          return res.json({
            success: true,
            type: 'atp',
            count: atpRankings.length,
            data: atpRankings
          })
        } else if (atpRankings && atpRankings.length > 0) {
          // Si hay datos pero menos de 100, tambien guardarlos (pueden ser datos parciales)
          console.log(` Rankings ATP obtenidos pero pocos datos (${atpRankings.length}), guardando en MongoDB...`)
          try {
            await Ranking.findOneAndUpdate(
              { type: 'atp' },
              { type: 'atp', players: atpRankings },
              { upsert: true, new: true }
            )
          } catch (error) {
            console.log('  Error guardando rankings ATP:', error.message)
          }
        }
      } catch (apiError) {
        console.log('  Error obteniendo rankings ATP de API:', apiError.message)
      }
    }
    
    if (type.toLowerCase() === 'wta') {
      try {
        const wtaRankings = await fetchWTARankings()
        if (wtaRankings && wtaRankings.length > 100) {
          console.log(`✅ Usando ${wtaRankings.length} rankings WTA de API externa (tiempo real)`)
          
          // Guardar en MongoDB en background para tenerlos disponibles despues
          try {
            await Ranking.findOneAndUpdate(
              { type: 'wta' },
              { type: 'wta', players: wtaRankings },
              { upsert: true, new: true }
            )
            console.log(`💾 Rankings WTA guardados en MongoDB`)
          } catch (error) {
            console.log('  No se pudieron guardar rankings WTA en MongoDB:', error.message)
          }
          
          return res.json({
            success: true,
            type: 'wta',
            count: wtaRankings.length,
            data: wtaRankings
          })
        } else if (wtaRankings && wtaRankings.length > 0) {
          // Si hay datos pero menos de 100, tambien guardarlos
          console.log(` Rankings WTA obtenidos pero pocos datos (${wtaRankings.length}), guardando en MongoDB...`)
          try {
            await Ranking.findOneAndUpdate(
              { type: 'wta' },
              { type: 'wta', players: wtaRankings },
              { upsert: true, new: true }
            )
          } catch (error) {
            console.log('  Error guardando rankings WTA:', error.message)
          }
        }
      } catch (apiError) {
        console.log('  Error obteniendo rankings WTA de API:', apiError.message)
      }
    }
    
    // 2. Intentar obtener de MongoDB (puede tener datos reales guardados)
    try {
      const dbRanking = await Ranking.findOne({ type: type.toLowerCase() })
      if (dbRanking && dbRanking.players && dbRanking.players.length > 0) {
        // Para ATP/WTA, ms de 100 jugadores indica datos reales de API
        const isRealData = dbRanking.players.length > 100
        
        if (isRealData) {
          console.log(`🗄️  Usando ${dbRanking.players.length} rankings ${type.toUpperCase()} de MongoDB (datos reales)`)
        } else {
          console.log(`🗄️  Usando ${dbRanking.players.length} rankings ${type.toUpperCase()} de MongoDB`)
        }
        return res.json({
          success: true,
          type: type.toLowerCase(),
          count: dbRanking.players.length,
          data: dbRanking.players
        })
      }
    } catch (error) {
      console.log('  MongoDB no disponible o sin datos:', error.message)
    }
    
    // 3. Fallback: usar datos en memoria
    console.log('  Usando datos mock (simulados)')
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

