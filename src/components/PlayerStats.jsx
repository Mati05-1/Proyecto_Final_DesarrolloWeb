import React from 'react'
import './PlayerStats.css'

const PlayerStats = ({ player, type, position }) => {
  const getMockStats = () => {
    if (type === 'atp' || type === 'wta') {
      return {
        matches: Math.floor(Math.random() * 100) + 50,
        wins: Math.floor(Math.random() * 60) + 40,
        losses: Math.floor(Math.random() * 30) + 10,
        winRate: ((Math.random() * 20) + 70).toFixed(1),
        aces: Math.floor(Math.random() * 500) + 200,
        doubleFaults: Math.floor(Math.random() * 100) + 50,
        breakPointsSaved: ((Math.random() * 20) + 60).toFixed(1)
      }
    } else {
      return {
        tournaments: Math.floor(Math.random() * 30) + 15,
        wins: Math.floor(Math.random() * 10) + 3,
        top10: Math.floor(Math.random() * 20) + 10,
        drivingAccuracy: ((Math.random() * 10) + 65).toFixed(1),
        puttingAverage: ((Math.random() * 0.3) + 1.6).toFixed(2),
        greensInRegulation: ((Math.random() * 10) + 65).toFixed(1)
      }
    }
  }

  const stats = getMockStats()

  return (
    <div className="player-stats-card">
      <div className="player-header">
        <div className="player-info">
          <span className="player-flag">{player.country}</span>
          <div>
            <h3 className="player-name">#{position} {player.player}</h3>
            <p className="player-points">{player.points.toLocaleString()} puntos</p>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        {type === 'atp' || type === 'wta' ? (
          <>
            <div className="stat-item">
              <span className="stat-label">Partidos</span>
              <span className="stat-value">{stats.matches}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Victorias</span>
              <span className="stat-value success">{stats.wins}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Derrotas</span>
              <span className="stat-value">{stats.losses}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">% Victorias</span>
              <span className="stat-value success">{stats.winRate}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Aces</span>
              <span className="stat-value">{stats.aces}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Dobles Faltas</span>
              <span className="stat-value">{stats.doubleFaults}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Break Points Salvados</span>
              <span className="stat-value success">{stats.breakPointsSaved}%</span>
            </div>
          </>
        ) : (
          <>
            <div className="stat-item">
              <span className="stat-label">Torneos</span>
              <span className="stat-value">{stats.tournaments}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Victorias</span>
              <span className="stat-value success">{stats.wins}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Top 10</span>
              <span className="stat-value">{stats.top10}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Precisin Driving</span>
              <span className="stat-value">{stats.drivingAccuracy}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Promedio Putting</span>
              <span className="stat-value">{stats.puttingAverage}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Greens en Regulacin</span>
              <span className="stat-value">{stats.greensInRegulation}%</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default PlayerStats

