/**
 * Script de demostracin: Encriptacin de Contrasenas
 * Muestra cmo funcionan las contrasenas encriptadas en la base de datos
 * Uso: node server/scripts/demoPasswordEncryption.js
 */

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { User } from '../models/User.js'
import { connectDB, disconnectDB } from '../config/database.js'

dotenv.config()

async function demoPasswordEncryption() {
  try {
    await connectDB()
    
    console.log('\n ==========================================')
    console.log('   DEMOSTRACIN: ENCRIPTACIN DE CONTRASEAS')
    console.log('==========================================\n')
    
    // 1. Mostrar cmo se ve una contrasena antes de encriptar
    const plainPassword = 'miPassword123'
    console.log('1  CONTRASEA ORIGINAL (texto plano):')
    console.log(`   "${plainPassword}"`)
    console.log(`   Longitud: ${plainPassword.length} caracteres\n`)
    
    // 2. Simular el proceso de encriptacin (como lo hace el modelo User)
    console.log('2  PROCESO DE ENCRIPTACIN:')
    console.log('   a) Generando salt (valor aleatorio)...')
    const salt = await bcrypt.genSalt(10)
    console.log(`      Salt generado: ${salt.substring(0, 20)}...`)
    
    console.log('   b) Hasheando contrasena con bcrypt...')
    const hashedPassword = await bcrypt.hash(plainPassword, salt)
    console.log(`      Hash generado: ${hashedPassword.substring(0, 30)}...`)
    console.log(`      Longitud del hash: ${hashedPassword.length} caracteres\n`)
    
    // 3. Mostrar cmo se guarda en la base de datos
    console.log('3  CMO SE GUARDA EN MONGODB:')
    console.log('   La contrasena se guarda como:')
    console.log(`   "${hashedPassword}"`)
    console.log('    La contrasena original NUNCA se guarda\n')
    
    // 4. Demostrar verificacin de contrasena
    console.log('4  VERIFICACIN DE CONTRASEA:')
    console.log('   Cuando un usuario intenta iniciar sesin:')
    console.log(`   - Usuario ingresa: "${plainPassword}"`)
    
    const isValid = await bcrypt.compare(plainPassword, hashedPassword)
    console.log(`   - Sistema compara con hash guardado: ${isValid ? ' CORRECTO' : ' INCORRECTO'}`)
    
    const wrongPassword = 'passwordIncorrecta'
    const isWrong = await bcrypt.compare(wrongPassword, hashedPassword)
    console.log(`   - Si ingresa "${wrongPassword}": ${isWrong ? ' CORRECTO' : ' INCORRECTO'}\n`)
    
    // 5. Mostrar usuarios reales de la base de datos
    console.log('5  USUARIOS EN LA BASE DE DATOS:')
    const users = await User.find().limit(3).select('+password')
    
    if (users.length === 0) {
      console.log('   No hay usuarios en la base de datos')
      console.log('    Crea un usuario desde http://localhost:3001/landing.html\n')
    } else {
      for (let index = 0; index < users.length; index++) {
        const user = users[index]
        console.log(`\n   Usuario ${index + 1}: ${user.username} (${user.email})`)
        console.log(`    Contrasena encriptada: ${user.password.substring(0, 30)}...`)
        console.log(`    Longitud del hash: ${user.password.length} caracteres`)
        console.log(`    Formato: bcrypt (salt rounds: 10)`)
        
        // Intentar verificar con contrasenas comunes (solo para demo)
        const commonPasswords = ['admin123', 'demo123', 'password123']
        console.log(`    Prueba de verificacin:`)
        for (const pwd of commonPasswords) {
          const matches = await bcrypt.compare(pwd, user.password)
          if (matches) {
            console.log(`       "${pwd}" coincide con este usuario`)
          }
        }
      }
      console.log('')
    }
    
    // 6. Explicacin de seguridad
    console.log('6  SEGURIDAD:')
    console.log('    Las contrasenas estn encriptadas con bcrypt')
    console.log('    bcrypt es un algoritmo de hash unidireccional')
    console.log('    Es imposible recuperar la contrasena original del hash')
    console.log('    Cada hash incluye un "salt" nico para mayor seguridad')
    console.log('    Incluso contrasenas identicas producen hashes diferentes\n')
    
    console.log('==========================================')
    console.log(' Demostracin completada\n')
    
  } catch (error) {
    console.error(' Error:', error.message)
  } finally {
    await disconnectDB()
    process.exit(0)
  }
}

demoPasswordEncryption()

