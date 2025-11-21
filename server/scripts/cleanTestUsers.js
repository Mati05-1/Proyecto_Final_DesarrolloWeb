/**
 * Script para limpiar usuarios de prueba y actualizar puntos de admin
 * Uso: node server/scripts/cleanTestUsers.js
 */

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { User } from '../models/User.js'
import { connectDB, disconnectDB } from '../config/database.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '../.env') })

async function cleanTestUsers() {
  try {
    await connectDB()
    
    console.log('\n ==========================================')
    console.log('   LIMPIANDO USUARIOS DE PRUEBA')
    console.log('==========================================\n')
    
    // Buscar y eliminar usuarios de prueba
    const testUsers = await User.find({
      $or: [
        { username: { $regex: /^test/i } },
        { username: 'test_puerto_5001' },
        { username: { $regex: /^testuser_/ } },
        { email: { $regex: /^test/i } }
      ]
    })
    
    console.log(` Encontrados ${testUsers.length} usuarios de prueba:`)
    testUsers.forEach(user => {
      console.log(`   - ${user.username} (${user.email})`)
    })
    
    if (testUsers.length > 0) {
      const result = await User.deleteMany({
        _id: { $in: testUsers.map(u => u._id) }
      })
      console.log(`\n Eliminados ${result.deletedCount} usuarios de prueba`)
    } else {
      console.log('\n No se encontraron usuarios de prueba para eliminar')
    }
    
    // Actualizar puntos de admin a 1000
    console.log('\n Actualizando puntos de admin...')
    const admin = await User.findOne({ username: 'admin' })
    
    if (admin) {
      console.log(`   Admin encontrado: ${admin.username} (${admin.email})`)
      console.log(`   Puntos actuales: ${admin.points}`)
      
      if (admin.points !== 1000) {
        admin.points = 1000
        await admin.save()
        console.log(`    Puntos actualizados a 1000`)
      } else {
        console.log(`    Admin ya tiene 1000 puntos`)
      }
    } else {
      console.log('     Usuario admin no encontrado')
    }
    
    // Mostrar todos los usuarios restantes
    console.log('\n Usuarios en la base de datos:')
    const allUsers = await User.find().select('-password').sort({ points: -1 })
    
    if (allUsers.length === 0) {
      console.log('   No hay usuarios en la base de datos')
    } else {
      allUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.username} (${user.email}) - ${user.points} pts`)
      })
    }
    
    console.log('\n==========================================')
    console.log(' Limpieza completada\n')
    
  } catch (error) {
    console.error(' Error:', error.message)
  } finally {
    await disconnectDB()
    process.exit(0)
  }
}

cleanTestUsers()

