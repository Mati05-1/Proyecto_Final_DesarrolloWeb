import React, { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { matchService } from '../services/matchService'
import TennisMatchCard from '../components/TennisMatchCard'
import './LiveResults.css'

const LiveResults = () => {
  const { user, setLiveMatches } = useApp()
  const [tennisMatches, setTennisMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      // Funcin para recargar datos
      setLoading(true)
      try {
        const tennisData = await matchService.getTennisMatches()
        
        setTennisMatches(tennisData.all || [])
        setLiveMatches(tennisData.live || [])
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
  }, [setLiveMatches])

  if (!user) {
    return (
      <div className="live-results">
        <div className="container">
          <div className="login-prompt">
            <h2>Inicia sesin para ver resultados en vivo</h2>
            <p>Necesitas estar registrado para acceder a esta seccin</p>
          </div>
        </div>
      </div>
    )
  }

  const liveTennisMatches = tennisMatches.filter(m => m.status === 'live')
  const finishedTennisMatches = tennisMatches.filter(m => m.status === 'finished')

  return (
    <div className="live-results">
      <div className="container">
        <h1 className="page-title">Resultados en Tiempo Real</h1>

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
      </div>
    </div>
  )
}

export default LiveResults

