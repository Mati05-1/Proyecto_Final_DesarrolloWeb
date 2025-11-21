/**
 * Script para resetear todas las apuestas de MongoDB
 */
import mongoose from 'mongoose'
import { Bet } from '../models/Bet.js'
import { connectDB, disconnectDB } from '../config/database.js'

async function resetAllBets() {
  try {
    await connectDB()
    console.log('\n ==========================================')
    console.log('   RESETEANDO TODAS LAS APUESTAS')
    console.log('==========================================\n')

    const deleteResult = await Bet.deleteMany({})
    console.log(` Eliminadas ${deleteResult.deletedCount} apuestas de MongoDB`)

    console.log('\n==========================================')
    console.log(' Reset completado\n')

  } catch (error) {
    console.error(' Error reseteando apuestas:', error.message)
  } finally {
    await disconnectDB()
    process.exit(0)
  }
}

resetAllBets()

