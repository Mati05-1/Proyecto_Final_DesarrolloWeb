/**
 * Configuracion de conexion a MongoDB
 */
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ace-putt'

/**
 * Conectar a MongoDB
 */
export async function connectDB() {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      // Opciones para evitar warnings
      // useNewUrlParser y useUnifiedTopology ya no son necesarias en versiones recientes
    })
    
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`)
    console.log(`   📊 Base de datos: ${conn.connection.name}`)
    
    return conn
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message)
    console.error('\n💡 Opciones:')
    console.error('   1. Instalar MongoDB localmente: brew install mongodb-community')
    console.error('   2. Usar MongoDB Atlas (gratis): https://www.mongodb.com/cloud/atlas')
    console.error('   3. Configurar MONGODB_URI en .env')
    console.error('\n⚠️  El servidor seguira funcionando con datos en memoria\n')
    return null
  }
}

/**
 * Desconectar de MongoDB
 */
export async function disconnectDB() {
  try {
    await mongoose.disconnect()
    console.log('🔌 MongoDB desconectado')
  } catch (error) {
    console.error('❌ Error desconectando MongoDB:', error)
  }
}

