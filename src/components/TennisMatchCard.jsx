import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './TennisMatchCard.css'

const TennisMatchCard = ({ match }) => {
  const [showStats, setShowStats] = useState(false)

  const formatScore = (score) => {
    return score.sets.map((set, idx) => (
      <span key={idx} className="set-score">
        {set.p1}-{set.p2}
      </span>
    ))
  }

  return (
    <div className={`tennis-match-card ${match.status}`}>
      <div className="match-header">
        <span className="tournament-name">{match.tournament}</span>
        {match.status === 'live' && (
          <span className="live-badge">
            <span className="live-dot"></span>
            EN VIVO
          </span>
        )}
        {match.status === 'finished' && (
          <span className="finished-badge">FINALIZADO</span>
        )}
      </div>

      <div className="match-players">
        <div className={`player ${match.winner === 1 ? 'winner' : ''}`}>
          <div className="player-info">
            <span className="player-country">{match.player1.country}</span>
            <span className="player-name">{match.player1.name}</span>
            <span className="player-rank">#{match.player1.rank}</span>
          </div>
        </div>

        <div className="vs-divider">VS</div>

        <div className={`player ${match.winner === 2 ? 'winner' : ''}`}>
          <div className="player-info">
            <span className="player-country">{match.player2.country}</span>
            <span className="player-name">{match.player2.name}</span>
            <span className="player-rank">#{match.player2.rank}</span>
          </div>
        </div>
      </div>

      <div className="match-score">
        {formatScore(match.score)}
      </div>

      {match.time && (
        <div className="match-time">
          Tiempo: {match.time}
        </div>
      )}

      {match.statistics && (
        <>
          <button
            className="stats-toggle"
            onClick={() => setShowStats(!showStats)}
          >
            {showStats ? 'Ocultar' : 'Ver'} Estadísticas
          </button>

          {showStats && (
            <div className="match-statistics">
              <div className="stat-row">
                <span>Saques directos (Aces)</span>
                <span className="stat-values">
                  {match.statistics.aces.p1} - {match.statistics.aces.p2}
                </span>
              </div>
              <div className="stat-row">
                <span>Dobles faltas</span>
                <span className="stat-values">
                  {match.statistics.doubleFaults.p1} - {match.statistics.doubleFaults.p2}
                </span>
              </div>
              <div className="stat-row">
                <span>Winners</span>
                <span className="stat-values">
                  {match.statistics.winners.p1} - {match.statistics.winners.p2}
                </span>
              </div>
              <div className="stat-row">
                <span>Errores no forzados</span>
                <span className="stat-values">
                  {match.statistics.errors.p1} - {match.statistics.errors.p2}
                </span>
              </div>
              <div className="stat-row">
                <span>1er servicio</span>
                <span className="stat-values">
                  {match.statistics.serve1st.p1}% - {match.statistics.serve1st.p2}%
                </span>
              </div>
              <div className="stat-row">
                <span>Break points</span>
                <span className="stat-values">
                  {match.statistics.breakPoints.p1} - {match.statistics.breakPoints.p2}
                </span>
              </div>
            </div>
          )}
        </>
      )}

      <div className="match-actions">
        <Link to="/betting" className="btn-primary btn-small">
          Apostar
        </Link>
      </div>
    </div>
  )
}

export default TennisMatchCard

