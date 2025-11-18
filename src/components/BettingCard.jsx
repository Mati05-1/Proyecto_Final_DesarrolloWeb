import React, { useState, useEffect } from 'react'
import { matchService } from '../services/matchService'
import './BettingCard.css'

const BettingCard = ({ match, tournament, type, onPlaceBet, userPoints }) => {
  const [selectedOption, setSelectedOption] = useState(null)
  const [betAmount, setBetAmount] = useState(50)
  const [showBetForm, setShowBetForm] = useState(false)
  const [error, setError] = useState('')
  const [canBet, setCanBet] = useState(true)
  const [timeUntilStart, setTimeUntilStart] = useState('')

  useEffect(() => {
    const checkBetStatus = () => {
      const event = match || tournament
      if (!event) return

      const canBetOnEvent = matchService.canBetOnMatch(event)
      setCanBet(canBetOnEvent)

      if (event.startTime) {
        const startTime = new Date(event.startTime)
        const now = new Date()
        const diff = startTime - now

        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          setTimeUntilStart(`${hours}h ${minutes}m`)
        } else {
          setTimeUntilStart('Ya comenzó')
          setCanBet(false)
        }
      }
    }

    checkBetStatus()
    const interval = setInterval(checkBetStatus, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [match, tournament])

  const handlePlaceBet = () => {
    if (!canBet) {
      setError('No puedes apostar en este partido/torneo. Ya ha comenzado.')
      return
    }

    if (!selectedOption) {
      setError('Selecciona una opción para apostar')
      return
    }

    if (betAmount < 10) {
      setError('La apuesta mínima es 10 puntos')
      return
    }

    if (betAmount > userPoints) {
      setError('No tienes suficientes puntos')
      return
    }

    const betData = {
      type,
      matchId: match?.id || tournament?.id,
      selection: selectedOption,
      amount: betAmount,
      matchName: type === 'tennis' 
        ? `${match.player1.name} vs ${match.player2.name}`
        : tournament.name,
      selectionName: type === 'tennis'
        ? (selectedOption === 1 ? match.player1.name : match.player2.name)
        : (tournament.leaderboard.find(p => p.position === selectedOption)?.player || `Posición #${selectedOption}`),
      startTime: match?.startTime || tournament?.startTime
    }

    if (onPlaceBet(betData)) {
      setShowBetForm(false)
      setSelectedOption(null)
      setBetAmount(50)
      setError('')
      alert('¡Apuesta realizada con éxito!')
    } else {
      setError('No tienes suficientes puntos')
    }
  }

  if (type === 'tennis') {
    return (
      <div className="betting-card">
      <div className="betting-card-header">
        <h3 className="match-title">{match.tournament}</h3>
        {match.status === 'live' ? (
          <span className="live-badge">
            <span className="live-dot"></span>
            EN VIVO
          </span>
        ) : match.startTime ? (
          <span className="scheduled-badge">
            📅 {timeUntilStart || 'Próximamente'}
          </span>
        ) : (
          <span className="scheduled-badge">📅 Próximamente</span>
        )}
      </div>

        <div className="match-options">
          <div
            className={`bet-option ${selectedOption === 1 ? 'selected' : ''}`}
            onClick={() => setSelectedOption(1)}
          >
            <span className="player-flag">{match.player1.country}</span>
            <span className="player-name">{match.player1.name}</span>
            <span className="player-rank">#{match.player1.rank}</span>
            <div className="odds">Odds: 2.0x</div>
          </div>

          <div className="vs-divider">VS</div>

          <div
            className={`bet-option ${selectedOption === 2 ? 'selected' : ''}`}
            onClick={() => setSelectedOption(2)}
          >
            <span className="player-flag">{match.player2.country}</span>
            <span className="player-name">{match.player2.name}</span>
            <span className="player-rank">#{match.player2.rank}</span>
            <div className="odds">Odds: 2.0x</div>
          </div>
        </div>

        {!canBet && (
          <div className="bet-disabled-message">
            ⚠️ No puedes apostar en este partido. Ya ha comenzado o no está disponible.
          </div>
        )}

        {!showBetForm ? (
          <button
            className={`btn-primary btn-bet ${!canBet ? 'disabled' : ''}`}
            onClick={() => canBet && setShowBetForm(true)}
            disabled={!canBet}
          >
            {canBet ? 'Apostar' : 'No disponible'}
          </button>
        ) : (
          <div className="bet-form">
            <div className="bet-amount-input">
              <label>Cantidad de puntos:</label>
              <input
                type="number"
                min="10"
                max={userPoints}
                value={betAmount}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0
                  setBetAmount(Math.min(value, userPoints))
                  setError('')
                }}
              />
              <div className="quick-amounts">
                <button onClick={() => setBetAmount(50)}>50</button>
                <button onClick={() => setBetAmount(100)}>100</button>
                <button onClick={() => setBetAmount(500)}>500</button>
                <button onClick={() => setBetAmount(userPoints)}>Todo</button>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="bet-summary">
              <p>Ganancia potencial: <strong>{betAmount * 2} pts</strong></p>
            </div>

            <div className="bet-actions">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowBetForm(false)
                  setError('')
                }}
              >
                Cancelar
              </button>
              <button
                className="btn-primary"
                onClick={handlePlaceBet}
              >
                Confirmar Apuesta
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Golf betting
  return (
    <div className="betting-card">
      <div className="betting-card-header">
        <h3 className="match-title">{tournament.name}</h3>
        {tournament.status === 'live' ? (
          <span className="live-badge">
            <span className="live-dot"></span>
            EN VIVO
          </span>
        ) : tournament.startTime ? (
          <span className="scheduled-badge">
            📅 {timeUntilStart || 'Próximamente'}
          </span>
        ) : (
          <span className="scheduled-badge">📅 Próximamente</span>
        )}
      </div>

      <div className="golf-options">
        <p className="bet-instruction">Selecciona la posición final del ganador:</p>
        <div className="position-options">
          {tournament.leaderboard.slice(0, 5).map((player, index) => (
            <div
              key={index}
              className={`bet-option ${selectedOption === player.position ? 'selected' : ''}`}
              onClick={() => setSelectedOption(player.position)}
            >
              <span className="position-badge">#{player.position}</span>
              <span className="player-flag">{player.country}</span>
              <span className="player-name">{player.player}</span>
              <span className="player-score">{player.score > 0 ? '+' : ''}{player.score}</span>
              <div className="odds">Odds: 3.0x</div>
            </div>
          ))}
        </div>
      </div>

      {!canBet && (
        <div className="bet-disabled-message">
          ⚠️ No puedes apostar en este torneo. Ya ha comenzado o no está disponible.
        </div>
      )}

      {!showBetForm ? (
        <button
          className={`btn-primary btn-bet ${!canBet ? 'disabled' : ''}`}
          onClick={() => canBet && setShowBetForm(true)}
          disabled={!canBet}
        >
          {canBet ? 'Apostar' : 'No disponible'}
        </button>
      ) : (
        <div className="bet-form">
          <div className="bet-amount-input">
            <label>Cantidad de puntos:</label>
            <input
              type="number"
              min="10"
              max={userPoints}
              value={betAmount}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0
                setBetAmount(Math.min(value, userPoints))
                setError('')
              }}
            />
            <div className="quick-amounts">
              <button onClick={() => setBetAmount(50)}>50</button>
              <button onClick={() => setBetAmount(100)}>100</button>
              <button onClick={() => setBetAmount(500)}>500</button>
              <button onClick={() => setBetAmount(userPoints)}>Todo</button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="bet-summary">
            <p>Ganancia potencial: <strong>{betAmount * 3} pts</strong></p>
          </div>

          <div className="bet-actions">
            <button
              className="btn-secondary"
              onClick={() => {
                setShowBetForm(false)
                setError('')
              }}
            >
              Cancelar
            </button>
            <button
              className="btn-primary"
              onClick={handlePlaceBet}
            >
              Confirmar Apuesta
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BettingCard

