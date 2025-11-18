import React, { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { matchService } from '../services/matchService'
import TennisMatchCard from '../components/TennisMatchCard'
import GolfTournamentCard from '../components/GolfTournamentCard'
import './LiveResults.css'

const LiveResults = () => {
  const { user, setLiveMatches, setLiveTournaments } = useApp()
  const [activeTab, setActiveTab] = useState('tennis')
  const [tennisMatches, setTennisMatches] = useState([])
  const [golfTournaments, setGolfTournaments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      // Función para recargar datos
      setLoading(true)
      try {
        const tennisData = await matchService.getTennisMatches()
        const golfData = await matchService.getGolfTournaments()
        
        setTennisMatches(tennisData.all || [])
        setGolfTournaments(golfData.all || [])
        setLiveMatches(tennisData.live || [])
        setLiveTournaments(golfData.live || [])
      } catch (error) {
        console.error('Error loading matches:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()

    // Refresh data every 10 seconds para ver actualizaciones del simulador
    const interval = setInterval(loadData, 10000)
    return () => clearInterval(interval)
  }, [setLiveMatches, setLiveTournaments])

  if (!user) {
    return (
      <div className="live-results">
        <div className="container">
          <div className="login-prompt">
            <h2>Inicia sesión para ver resultados en vivo</h2>
            <p>Necesitas estar registrado para acceder a esta sección</p>
          </div>
        </div>
      </div>
    )
  }

  const liveTennisMatches = tennisMatches.filter(m => m.status === 'live')
  const finishedTennisMatches = tennisMatches.filter(m => m.status === 'finished')
  const liveGolfTournaments = golfTournaments.filter(t => t.status === 'live')

  return (
    <div className="live-results">
      <div className="container">
        <h1 className="page-title">Resultados en Tiempo Real</h1>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'tennis' ? 'active' : ''}`}
            onClick={() => setActiveTab('tennis')}
          >
            🎾 Tenis
          </button>
          <button
            className={`tab ${activeTab === 'golf' ? 'active' : ''}`}
            onClick={() => setActiveTab('golf')}
          >
            ⛳ Golf
          </button>
        </div>

        {activeTab === 'tennis' && (
          <div className="tennis-section">
            {liveTennisMatches.length > 0 && (
              <div className="matches-section">
                <h2 className="section-header">
                  <span className="live-indicator">
                    <span className="live-dot"></span>
                    Partidos en Vivo
                  </span>
                </h2>
                <div className="matches-grid">
                  {liveTennisMatches.map(match => (
                    <TennisMatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            )}

            {finishedTennisMatches.length > 0 && (
              <div className="matches-section">
                <h2 className="section-header">Partidos Finalizados</h2>
                <div className="matches-grid">
                  {finishedTennisMatches.map(match => (
                    <TennisMatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            )}

            {loading ? (
              <div className="empty-state">
                <div className="loading">
                  <div className="spinner"></div>
                  <p>Cargando partidos...</p>
                </div>
              </div>
            ) : tennisMatches.length === 0 && (
              <div className="empty-state">
                <p>No hay partidos disponibles en este momento</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'golf' && (
          <div className="golf-section">
            {liveGolfTournaments.length > 0 ? (
              <div className="tournaments-grid">
                {liveGolfTournaments.map(tournament => (
                  <GolfTournamentCard key={tournament.id} tournament={tournament} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No hay torneos en vivo en este momento</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default LiveResults

