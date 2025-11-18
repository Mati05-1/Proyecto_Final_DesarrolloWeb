import React from 'react'
import { formatNumber } from '../utils/pipes'
import './RankingTable.css'

const RankingTable = ({ rankings, type }) => {
  const getTypeLabel = () => {
    switch (type) {
      case 'atp':
        return 'ATP World Rankings'
      case 'wta':
        return 'WTA World Rankings'
      case 'pga':
        return 'PGA Tour Rankings'
      default:
        return 'Rankings'
    }
  }

  return (
    <div className="ranking-table">
      <h2 className="ranking-title">{getTypeLabel()}</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Posición</th>
              <th>Jugador</th>
              <th>País</th>
              <th>Puntos</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((player) => (
              <tr key={player.rank} className={player.rank <= 3 ? 'top-three' : ''}>
                <td className="rank-cell">
                  <span className={`rank-badge ${player.rank === 1 ? 'gold' : player.rank === 2 ? 'silver' : player.rank === 3 ? 'bronze' : ''}`}>
                    {player.rank}
                  </span>
                </td>
                <td className="player-cell">
                  <span className="player-flag">{player.country}</span>
                  <span className="player-name">{player.player}</span>
                </td>
                <td className="country-cell">{player.country}</td>
                <td className="points-cell">
                  <strong>{formatNumber(player.points)}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RankingTable

