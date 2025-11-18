import React, { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { matchService } from '../services/matchService'
import BettingCard from '../components/BettingCard'
import MyBets from '../components/MyBets'
import './Betting.css'

const Betting = () => {
  const { user, points, placeBet, subtractPoints, addPoints, bets, updateBetStatus } = useApp()
  const [activeTab, setActiveTab] = useState('available')
  const [tennisMatches, setTennisMatches] = useState([])
  const [golfTournaments, setGolfTournaments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const tennisData = await matchService.getTennisMatches()
        const golfData = await matchService.getGolfTournaments()
        
        // Only show matches that can be bet on (upcoming/scheduled)
        const availableTennis = (tennisData.upcoming || []).filter(match => 
          matchService.canBetOnMatch(match)
        )
        const availableGolf = (golfData.upcoming || []).filter(tournament => 
          matchService.canBetOnMatch(tournament)
        )
        
        setTennisMatches(availableTennis)
        setGolfTournaments(availableGolf)
      } catch (error) {
        console.error('Error loading betting data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()

    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  // Check and update bet results when matches finish
  useEffect(() => {
    const checkBets = async () => {
      for (const bet of bets) {
        if (bet.status === 'pending') {
          try {
            if (bet.type === 'tennis') {
              const match = await matchService.getTennisMatchDetails(bet.matchId)
              if (match && match.status === 'finished') {
                const won = match.winner === bet.selection
                updateBetStatus(bet.id, won ? 'won' : 'lost')
                if (won) {
                  addPoints(bet.type === 'tennis' ? bet.amount * 2 : bet.amount * 3)
                }
              }
            }
          } catch (error) {
            console.error('Error checking bet:', error)
          }
        }
      }
    }

    const interval = setInterval(checkBets, 10000) // Check every 10 seconds
    return () => clearInterval(interval)
  }, [bets, updateBetStatus, addPoints])

  const handlePlaceBet = (betData) => {
    if (points >= betData.amount) {
      if (subtractPoints(betData.amount)) {
        placeBet(betData)
        return true
      }
    }
    return false
  }

  if (!user) {
    return (
      <div className="betting">
        <div className="container">
          <div className="login-prompt">
            <h2>Inicia sesión para apostar</h2>
            <p>Necesitas estar registrado para acceder al sistema de apuestas</p>
          </div>
        </div>
      </div>
    )
  }

  const pendingBets = bets.filter(b => b.status === 'pending')
  const wonBets = bets.filter(b => b.status === 'won')
  const lostBets = bets.filter(b => b.status === 'lost')

  return (
    <div className="betting">
      <div className="container">
        <div className="betting-header">
          <h1 className="page-title">Sistema de Apuestas</h1>
          <div className="points-display">
            <span className="points-label">Tus puntos:</span>
            <span className="points-value">💰 {points.toLocaleString()} pts</span>
          </div>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            🎯 Apuestas Disponibles
          </button>
          <button
            className={`tab ${activeTab === 'my-bets' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-bets')}
          >
            📋 Mis Apuestas ({bets.length})
          </button>
        </div>

        {activeTab === 'available' && (
          <div className="betting-content">
            <div className="tennis-bets-section">
              <h2 className="section-header">
                🎾 Apuestas de Tenis
              </h2>
              {loading ? (
                <div className="empty-state">
                  <div className="loading">
                    <div className="spinner"></div>
                    <p>Cargando partidos...</p>
                  </div>
                </div>
              ) : tennisMatches.length > 0 ? (
                <div className="bets-grid">
                  {tennisMatches.map(match => (
                    <BettingCard
                      key={match.id}
                      match={match}
                      type="tennis"
                      onPlaceBet={handlePlaceBet}
                      userPoints={points}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No hay partidos disponibles para apostar en este momento</p>
                  <p className="empty-subtitle">Solo puedes apostar antes de que empiece el partido</p>
                </div>
              )}
            </div>

            <div className="golf-bets-section">
              <h2 className="section-header">
                ⛳ Apuestas de Golf
              </h2>
              {loading ? (
                <div className="empty-state">
                  <div className="loading">
                    <div className="spinner"></div>
                    <p>Cargando torneos...</p>
                  </div>
                </div>
              ) : golfTournaments.length > 0 ? (
                <div className="bets-grid">
                  {golfTournaments.map(tournament => (
                    <BettingCard
                      key={tournament.id}
                      tournament={tournament}
                      type="golf"
                      onPlaceBet={handlePlaceBet}
                      userPoints={points}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No hay torneos disponibles para apostar en este momento</p>
                  <p className="empty-subtitle">Solo puedes apostar antes de que empiece el torneo</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'my-bets' && (
          <MyBets
            pendingBets={pendingBets}
            wonBets={wonBets}
            lostBets={lostBets}
          />
        )}
      </div>
    </div>
  )
}

export default Betting

