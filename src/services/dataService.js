/**
 * Servicio para manejar datos de la aplicación
 * Conectado con la API REST del backend
 */
const API_BASE_URL = 'http://localhost:5000/api'

class DataService {
  /**
   * Hacer petición HTTP a la API
   * @private
   */
  async fetchAPI(endpoint, options = {}) {
    try {
      // Obtener token si existe
      const token = localStorage.getItem('token')
      
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers
      }
      
      // Agregar token de autenticación si existe
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error)
      // Fallback a datos mock si la API no está disponible
      return this.getMockData(endpoint)
    }
  }

  /**
   * Fallback a datos mock si la API falla
   * @private
   */
  async getMockData(endpoint) {
    const { mockTennisMatches, mockGolfTournaments, mockRankings } = await import('./mockData')
    
    if (endpoint.includes('/matches')) {
      return { success: true, data: mockTennisMatches, count: mockTennisMatches.length }
    }
    if (endpoint.includes('/tournaments')) {
      return { success: true, data: mockGolfTournaments, count: mockGolfTournaments.length }
    }
    if (endpoint.includes('/rankings')) {
      return { success: true, data: mockRankings }
    }
    return { success: false, data: [] }
  }

  /**
   * Obtener todos los partidos de tenis
   * @param {string} status - Filtrar por estado (opcional)
   * @returns {Promise<Object>} - Lista de partidos
   */
  async getTennisMatches(status = null) {
    const query = status ? `?status=${status}` : ''
    return await this.fetchAPI(`/matches${query}`)
  }

  /**
   * Obtener todos los torneos de golf
   * @param {string} status - Filtrar por estado (opcional)
   * @returns {Promise<Object>} - Lista de torneos
   */
  async getGolfTournaments(status = null) {
    const query = status ? `?status=${status}` : ''
    return await this.fetchAPI(`/tournaments${query}`)
  }

  /**
   * Obtener rankings
   * @param {string} type - Tipo de ranking ('atp', 'wta', 'pga') o null para todos
   * @returns {Promise<Object>} - Rankings solicitados
   */
  async getRankings(type = null) {
    if (type) {
      return await this.fetchAPI(`/rankings/${type}`)
    }
    return await this.fetchAPI('/rankings')
  }

  /**
   * Obtener un partido específico por ID
   * @param {number} id - ID del partido
   * @returns {Promise<Object>} - Partido encontrado
   */
  async getTennisMatchById(id) {
    return await this.fetchAPI(`/matches/${id}`)
  }

  /**
   * Obtener un torneo específico por ID
   * @param {number} id - ID del torneo
   * @returns {Promise<Object>} - Torneo encontrado
   */
  async getGolfTournamentById(id) {
    return await this.fetchAPI(`/tournaments/${id}`)
  }

  /**
   * Obtener partidos en vivo
   * @returns {Promise<Object>} - Partidos en vivo
   */
  async getLiveMatches() {
    return await this.getTennisMatches('live')
  }

  /**
   * Obtener torneos en vivo
   * @returns {Promise<Object>} - Torneos en vivo
   */
  async getLiveTournaments() {
    return await this.getGolfTournaments('live')
  }

  /**
   * Buscar partidos por jugador
   * @param {string} playerName - Nombre del jugador
   * @returns {Promise<Object>} - Partidos encontrados
   */
  async searchMatchesByPlayer(playerName) {
    return await this.fetchAPI(`/matches?player=${encodeURIComponent(playerName)}`)
  }

  /**
   * Obtener estadísticas de un jugador
   * @param {string} playerName - Nombre del jugador
   * @param {string} type - Tipo de deporte ('tennis' o 'golf')
   * @returns {Promise<Object>} - Estadísticas del jugador
   */
  async getPlayerStats(playerName, type = 'tennis') {
    await this.delay(400)
    // Simular estadísticas
    return {
      success: true,
      data: {
        player: playerName,
        type: type,
        matches: Math.floor(Math.random() * 100) + 50,
        wins: Math.floor(Math.random() * 60) + 40,
        winRate: ((Math.random() * 20) + 70).toFixed(1),
        lastUpdated: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Crear una nueva apuesta
   * @param {Object} betData - Datos de la apuesta
   * @returns {Promise<Object>} - Apuesta creada
   */
  async createBet(betData) {
    return await this.fetchAPI('/bets', {
      method: 'POST',
      body: JSON.stringify(betData)
    })
  }

  /**
   * Obtener apuestas de un usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>} - Apuestas del usuario
   */
  async getUserBets(userId) {
    return await this.fetchAPI(`/bets?userId=${userId}`)
  }

  /**
   * Actualizar una apuesta
   * @param {number} betId - ID de la apuesta
   * @param {Object} updates - Datos a actualizar
   * @returns {Promise<Object>} - Apuesta actualizada
   */
  async updateBet(betId, updates) {
    return await this.fetchAPI(`/bets/${betId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    })
  }

  /**
   * Eliminar una apuesta
   * @param {number} betId - ID de la apuesta
   * @returns {Promise<Object>} - Apuesta eliminada
   */
  async deleteBet(betId) {
    return await this.fetchAPI(`/bets/${betId}`, {
      method: 'DELETE'
    })
  }
}

// Exportar instancia única (Singleton)
export const dataService = new DataService()
export default dataService

