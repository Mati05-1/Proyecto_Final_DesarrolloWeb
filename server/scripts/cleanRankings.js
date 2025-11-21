/**
 * Script para limpiar rankings con datos undefined
 * Uso: node server/scripts/cleanRankings.js
 */

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { Ranking } from '../models/Ranking.js'
import { connectDB, disconnectDB } from '../config/database.js'

dotenv.config()

async function cleanRankings() {
  try {
    await connectDB()
    
    console.log('\n  ==========================================')
    console.log('   LIMPIANDO RANKINGS CON DATOS UNDEFINED')
    console.log('==========================================\n')
    
    // Eliminar todos los rankings
    const result = await Ranking.deleteMany({})
    console.log(` Eliminados ${result.deletedCount} rankings con datos incorrectos`)
    
    console.log('\n Los rankings se regenerarn automticamente cuando:')
    console.log('   1. El rate limit de RapidAPI se resetee')
    console.log('   2. El servidor obtenga datos reales de la API')
    console.log('   3. Los datos se guardarn correctamente en MongoDB')
    
    console.log('\n==========================================')
    console.log(' Limpieza completada\n')
    
  } catch (error) {
    console.error(' Error:', error.message)
  } finally {
    await disconnectDB()
    process.exit(0)
  }
}

cleanRankings()

