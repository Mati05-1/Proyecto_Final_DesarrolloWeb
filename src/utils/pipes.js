/**
 * Funciones de transformacin de datos (Pipes)
 * Equivalente a los pipes de Angular, pero implementado como funciones JavaScript
 */

/**
 * Pipe integrado: Formatear nmeros con separadores de miles
 * @param {number} value - Valor numerico a formatear
 * @returns {string} - Nmero formateado con separadores
 */
export const formatNumber = (value) => {
  if (value === null || value === undefined) return '0'
  return new Intl.NumberFormat('es-ES').format(value)
}

/**
 * Pipe integrado: Formatear fechas
 * @param {string|Date} date - Fecha a formatear
 * @param {string} format - Formato deseado ('short', 'long', 'time')
 * @returns {string} - Fecha formateada
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) return ''
  
  const options = {
    short: { year: 'numeric', month: '2-digit', day: '2-digit' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    time: { hour: '2-digit', minute: '2-digit' }
  }
  
  return new Intl.DateTimeFormat('es-ES', options[format] || options.short).format(dateObj)
}

/**
 * Pipe integrado: Formatear moneda
 * @param {number} value - Valor a formatear
 * @param {string} currency - Cdigo de moneda (EUR, USD, etc.)
 * @returns {string} - Valor formateado como moneda
 */
export const formatCurrency = (value, currency = 'EUR') => {
  if (value === null || value === undefined) return '0,00 '
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency
  }).format(value)
}

/**
 * Pipe personalizado: Formatear tiempo transcurrido
 * @param {string|Date} date - Fecha a comparar
 * @returns {string} - Tiempo transcurrido en formato legible
 */
export const timeAgo = (date) => {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now - dateObj) / 1000)
  
  if (diffInSeconds < 60) return 'Hace unos segundos'
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `Hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `Hace ${days} ${days === 1 ? 'dia' : 'dias'}`
  }
  
  return formatDate(dateObj, 'short')
}

/**
 * Pipe personalizado: Formatear puntuacin de golf
 * @param {number} score - Puntuacin del golfista
 * @returns {string} - Puntuacin formateada con signo + o -
 */
export const formatGolfScore = (score) => {
  if (score === null || score === undefined) return 'E'
  if (score === 0) return 'E'
  return score > 0 ? `+${score}` : `${score}`
}

/**
 * Pipe personalizado: Formatear porcentaje
 * @param {number} value - Valor a formatear (0-100)
 * @param {number} decimals - Nmero de decimales
 * @returns {string} - Porcentaje formateado
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%'
  return `${Number(value).toFixed(decimals)}%`
}

/**
 * Pipe personalizado: Abreviar nombres largos
 * @param {string} text - Texto a abreviar
 * @param {number} maxLength - Longitud mxima
 * @returns {string} - Texto abreviado con "..."
 */
export const truncate = (text, maxLength = 50) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
}

/**
 * Pipe personalizado: Capitalizar primera letra
 * @param {string} text - Texto a capitalizar
 * @returns {string} - Texto con primera letra en mayscula
 */
export const capitalize = (text) => {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

/**
 * Pipe personalizado: Formatear tiempo de partido
 * @param {string} timeString - Tiempo en formato "2h 15m"
 * @returns {string} - Tiempo formateado
 */
export const formatMatchTime = (timeString) => {
  if (!timeString) return 'No disponible'
  return timeString
}

/**
 * Pipe personalizado: Formatear ranking con posicin
 * @param {number} rank - Posicin en el ranking
 * @returns {string} - Ranking formateado
 */
export const formatRanking = (rank) => {
  if (!rank) return 'N/A'
  const suffixes = { 1: 'st', 2: 'nd', 3: 'rd' }
  const suffix = suffixes[rank] || 'th'
  return `#${rank}${suffix}`
}

