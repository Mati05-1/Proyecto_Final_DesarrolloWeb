import React, { useState } from 'react'
import './GolfTournamentCard.css'

const GolfTournamentCard = ({ tournament }) => {
  const [showStats, setShowStats] = useState(false)

  return (
    <div className="golf-tournament-card">
      <div className="tournament-header">
        <div>
          <h3 className="tournament-name">{tournament.name}</h3>
          <p className="tournament-location">📍 {tournament.location}</p>
        </div>
        <span className="live-badge">
          <span className="live-dot"></span>
          EN VIVO
        </span>
      </div>

      <div className="tournament-round">
        Ronda {tournament.round} de {tournament.totalRounds}
      </div>

      <div className="leaderboard">
        <h4 className="leaderboard-title">Tabla de Posiciones</h4>
        <div className="leaderboard-list">
          {tournament.leaderboard.map((player, index) => (
            <div
              key={index}
              className={`leaderboard-item ${index < 3 ? 'top-three' : ''}`}
            >
              <span className="position">#{player.position}</span>
              <span className="player-flag">{player.country}</span>
              <span className="player-name">{player.player}</span>
              <span className={`player-score ${player.score < 0 ? 'negative' : ''}`}>
                {player.score > 0 ? '+' : ''}{player.score}
              </span>
              <span className="player-today">({player.today > 0 ? '+' : ''}{player.today})</span>
            </div>
          ))}
        </div>
      </div>

      {tournament.statistics && (
        <>
          <button
            className="stats-toggle"
            onClick={() => setShowStats(!showStats)}
          >
            {showStats ? 'Ocultar' : 'Ver'} Estadísticas del Torneo
          </button>

          {showStats && (
            <div className="tournament-statistics">
              <div className="stat-row">
                <span>Precisión de driving</span>
                <span className="stat-value">{tournament.statistics.drivingAccuracy}%</span>
              </div>
              <div className="stat-row">
                <span>Promedio de putting</span>
                <span className="stat-value">{tournament.statistics.averagePutting}</span>
              </div>
              <div className="stat-row">
                <span>Greens en regulación</span>
                <span className="stat-value">{tournament.statistics.greensInRegulation}%</span>
              </div>
              <div className="stat-row">
                <span>Distancia promedio</span>
                <span className="stat-value">{tournament.statistics.averageDistance} yds</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default GolfTournamentCard

