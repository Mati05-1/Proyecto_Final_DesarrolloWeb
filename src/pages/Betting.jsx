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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const tennisData = await matchService.getTennisMatches()
        
        // Only show matches that can be bet on (upcoming/scheduled)
        const availableTennis = (tennisData.upcoming || []).filter(match => 
          matchService.canBetOnMatch(match)
        )
        
        setTennisMatches(availableTennis)
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
                // bet.selection es 1 o 2 (player1 o player2)
                // match.winner puede ser 1, 2, o el nombre del jugador
                let winnerId = match.winner
                if (typeof match.winner === 'string') {
                  // Si winner es un string (nombre), determinar el ID
                  winnerId = match.winner === match.player1?.name ? 1 : 2
                } else if (!match.winner) {
                  // Si no hay winner definido, determinar por sets
                  if (match.score && match.score.sets) {
                    const setsWonP1 = match.score.sets.filter(s => s.p1 > s.p2).length
                    const setsWonP2 = match.score.sets.filter(s => s.p2 > s.p1).length
                    winnerId = setsWonP1 > setsWonP2 ? 1 : 2
                  }
                }
                
                const won = winnerId === bet.selection
                
                // Actualizar estado de la apuesta
                updateBetStatus(bet.id, won ? 'won' : 'lost')
                
                if (won) {
                  // Si gana: recupera su apuesta + ganancia igual
                  // Ejemplo: apuesta 100  gana 200 (recupera 100 + gana 100)
                  // Ejemplo: apuesta 50  gana 100 (recupera 50 + gana 50)
                  addPoints(bet.amount * 2) // 100 apuesta  200 total (100 recupera + 100 gana)
                  
                  // Actualizar puntos en el backend tambien
                  try {
                    const token = localStorage.getItem('token')
                    if (token) {
                      // Actualizar apuesta en backend para que actualice puntos en MongoDB
                      await fetch(`http://localhost:5001/api/bets/${bet.id}`, {
                        method: 'PATCH',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ status: 'won' })
                      })
                    }
                  } catch (error) {
                    console.error('Error actualizando apuesta en backend:', error)
                  }
                } else {
                  // Si pierde, actualizar en backend tambien
                  try {
                    const token = localStorage.getItem('token')
                    if (token) {
                      await fetch(`http://localhost:5001/api/bets/${bet.id}`, {
                        method: 'PATCH',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ status: 'lost' })
                      })
                    }
                  } catch (error) {
                    console.error('Error actualizando apuesta en backend:', error)
                  }
                }
                // Si pierde, no se hace nada con los puntos (ya se descontaron al apostar)
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
            <h2>Inicia sesin para apostar</h2>
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
            <span className="points-value"> {points.toLocaleString()} pts</span>
          </div>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
             Apuestas Disponibles
          </button>
          <button
            className={`tab ${activeTab === 'my-bets' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-bets')}
          >
             Mis Apuestas ({bets.length})
          </button>
        </div>

        {activeTab === 'available' && (
          <div className="betting-content">
            <div className="tennis-bets-section">
              <h2 className="section-header">
                 Apuestas de Tenis
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

