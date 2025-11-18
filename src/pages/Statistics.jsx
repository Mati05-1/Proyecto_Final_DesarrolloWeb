import React, { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { dataService } from '../services/dataService'
import { formatNumber, formatPercentage } from '../utils/pipes'
import RankingTable from '../components/RankingTable'
import PlayerStats from '../components/PlayerStats'
import './Statistics.css'

const Statistics = () => {
  const { user } = useApp()
  const [activeTab, setActiveTab] = useState('atp')
  const [rankings, setRankings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRankings = async () => {
      setLoading(true)
      try {
        const response = await dataService.getRankings(activeTab)
        if (response.success) {
          setRankings(response.data)
        }
      } catch (error) {
        console.error('Error loading rankings:', error)
      } finally {
        setLoading(false)
      }
    }

    loadRankings()
  }, [activeTab])

  if (!user) {
    return (
      <div className="statistics">
        <div className="container">
          <div className="login-prompt">
            <h2>Inicia sesión para ver estadísticas</h2>
            <p>Necesitas estar registrado para acceder a esta sección</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="statistics">
      <div className="container">
        <h1 className="page-title">Estadísticas Detalladas</h1>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'atp' ? 'active' : ''}`}
            onClick={() => setActiveTab('atp')}
          >
            🎾 ATP Rankings
          </button>
          <button
            className={`tab ${activeTab === 'wta' ? 'active' : ''}`}
            onClick={() => setActiveTab('wta')}
          >
            🎾 WTA Rankings
          </button>
          <button
            className={`tab ${activeTab === 'pga' ? 'active' : ''}`}
            onClick={() => setActiveTab('pga')}
          >
            ⛳ PGA Rankings
          </button>
        </div>

        <div className="statistics-content">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Cargando estadísticas...</p>
            </div>
          ) : (
            <>
              <div className="rankings-section">
                <RankingTable rankings={rankings} type={activeTab} />
              </div>

              <div className="player-stats-section">
                <h2 className="section-title">Estadísticas de Jugadores Destacados</h2>
                <div style={{ 
                  background: '#fef3c7', 
                  padding: '1rem', 
                  borderRadius: '8px', 
                  marginBottom: '1.5rem',
                  textAlign: 'center',
                  fontSize: '0.9rem',
                  color: '#92400e'
                }}>
                  <strong>ℹ️ Nota:</strong> Las estadísticas de jugadores son datos simulados.
                </div>
                <div className="player-stats-grid">
                  {rankings.slice(0, 3).map((player, index) => (
                    <PlayerStats
                      key={player.rank || index}
                      player={player}
                      type={activeTab}
                      position={player.rank || index + 1}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Statistics

