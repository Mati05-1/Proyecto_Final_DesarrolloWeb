/**
 * Script para encriptar la contrasena del usuario admin
 * Uso: node server/scripts/fixAdminPassword.js
 */

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { User } from '../models/User.js'
import { connectDB, disconnectDB } from '../config/database.js'

dotenv.config()

async function fixAdminPassword() {
  try {
    await connectDB()
    
    console.log('\n ==========================================')
    console.log('   ENCRIPTANDO CONTRASEA DEL ADMIN')
    console.log('==========================================\n')
    
    // Buscar usuario admin
    const admin = await User.findOne({ email: 'admin@aceputt.com' }).select('+password')
    
    if (!admin) {
      console.log(' Usuario admin no encontrado')
      return
    }
    
    console.log(` Usuario encontrado: ${admin.username} (${admin.email})`)
    console.log(`   Contrasena actual: ${admin.password}`)
    console.log(`   Longitud: ${admin.password.length} caracteres`)
    
    // Si la contrasena no est encriptada (no empieza con $2b$)
    if (!admin.password.startsWith('$2b$')) {
      console.log('\n     La contrasena NO est encriptada')
      console.log('    Encriptando contrasena...')
      
      // Forzar que el campo password sea marcado como modificado
      admin.set('password', 'admin123')
      admin.markModified('password')
      await admin.save()
      
      // Verificar que se encript
      const updatedAdmin = await User.findOne({ email: 'admin@aceputt.com' }).select('+password')
      console.log('    Contrasena encriptada exitosamente')
      console.log(`    Nuevo hash: ${updatedAdmin.password.substring(0, 30)}...`)
      console.log(`    Longitud: ${updatedAdmin.password.length} caracteres`)
    } else {
      console.log('\n    La contrasena ya est encriptada')
      console.log(`    Hash: ${admin.password.substring(0, 30)}...`)
    }
    
    // Tambien verificar y arreglar el usuario demo
    const demo = await User.findOne({ email: 'demo@aceputt.com' }).select('+password')
    
    if (demo && !demo.password.startsWith('$2b$')) {
      console.log('\n Usuario demo encontrado')
      console.log('     La contrasena NO est encriptada')
      console.log('    Encriptando contrasena...')
      
      demo.set('password', 'demo123')
      demo.markModified('password')
      await demo.save()
      
      const updatedDemo = await User.findOne({ email: 'demo@aceputt.com' }).select('+password')
      console.log('    Contrasena encriptada exitosamente')
      console.log(`    Nuevo hash: ${updatedDemo.password.substring(0, 30)}...`)
    }
    
    console.log('\n==========================================')
    console.log(' Proceso completado\n')
    
  } catch (error) {
    console.error(' Error:', error.message)
  } finally {
    await disconnectDB()
    process.exit(0)
  }
}

fixAdminPassword()

