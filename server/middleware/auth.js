/**
 * Middleware de autenticación JWT
 */
import jwt from 'jsonwebtoken'

// Clave secreta para JWT (en producción debería estar en .env)
const JWT_SECRET = process.env.JWT_SECRET || 'ace-putt-secret-key-change-in-production'

/**
 * Middleware para verificar token JWT
 */
export const authenticateToken = (req, res, next) => {
  // Obtener token del header Authorization
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Formato: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Token de acceso requerido',
      message: 'Debes iniciar sesión para acceder a este recurso'
    })
  }

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, JWT_SECRET)
    
    // Agregar información del usuario al request
    req.user = decoded
    
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expirado',
        message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente'
      })
    }
    
    return res.status(403).json({
      success: false,
      error: 'Token inválido',
      message: 'El token proporcionado no es válido'
    })
  }
}

/**
 * Middleware opcional: verifica si hay token pero no falla si no existe
 */
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      req.user = decoded
    } catch (error) {
      // Si el token es inválido, simplemente continuar sin usuario
      req.user = null
    }
  }

  next()
}

/**
 * Middleware para verificar si el usuario es administrador
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Autenticación requerida'
    })
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Acceso denegado',
      message: 'Solo los administradores pueden acceder a este recurso'
    })
  }

  next()
}

export { JWT_SECRET }

