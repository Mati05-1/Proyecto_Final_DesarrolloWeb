import React from 'react'
import { format } from 'date-fns'
import './MyBets.css'

const MyBets = ({ pendingBets, wonBets, lostBets }) => {
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm')
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="badge badge-warning">Pendiente</span>
      case 'won':
        return <span className="badge badge-success">Ganada</span>
      case 'lost':
        return <span className="badge badge-danger">Perdida</span>
      default:
        return <span className="badge">{status}</span>
    }
  }

  const renderBet = (bet) => (
    <div key={bet.id} className={`bet-item ${bet.status}`}>
      <div className="bet-header">
        <div className="bet-info">
          <h3 className="bet-match">{bet.matchName}</h3>
          <p className="bet-selection">
            Apuesta: <strong>{bet.selectionName}</strong>
          </p>
        </div>
        {getStatusBadge(bet.status)}
      </div>

      <div className="bet-details">
        <div className="bet-detail-item">
          <span className="detail-label">Cantidad:</span>
          <span className="detail-value">{bet.amount} pts</span>
        </div>
        <div className="bet-detail-item">
          <span className="detail-label">Ganancia potencial:</span>
          <span className="detail-value success">
            {bet.type === 'tennis' ? bet.amount * 2 : bet.amount * 3} pts
          </span>
        </div>
        {bet.status === 'won' && (
          <div className="bet-detail-item">
            <span className="detail-label">Ganancia:</span>
            <span className="detail-value success">
              +{bet.type === 'tennis' ? bet.amount * 2 : bet.amount * 3} pts
            </span>
          </div>
        )}
        <div className="bet-detail-item">
          <span className="detail-label">Fecha:</span>
          <span className="detail-value">{formatDate(bet.createdAt)}</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="my-bets">
      <div className="bets-summary">
        <div className="summary-card">
          <h3>Pendientes</h3>
          <p className="summary-count">{pendingBets.length}</p>
        </div>
        <div className="summary-card success">
          <h3>Ganadas</h3>
          <p className="summary-count">{wonBets.length}</p>
        </div>
        <div className="summary-card danger">
          <h3>Perdidas</h3>
          <p className="summary-count">{lostBets.length}</p>
        </div>
        <div className="summary-card">
          <h3>Total</h3>
          <p className="summary-count">{pendingBets.length + wonBets.length + lostBets.length}</p>
        </div>
      </div>

      {pendingBets.length > 0 && (
        <div className="bets-section">
          <h2 className="section-title">Apuestas Pendientes</h2>
          <div className="bets-list">
            {pendingBets.map(renderBet)}
          </div>
        </div>
      )}

      {wonBets.length > 0 && (
        <div className="bets-section">
          <h2 className="section-title">Apuestas Ganadas</h2>
          <div className="bets-list">
            {wonBets.map(renderBet)}
          </div>
        </div>
      )}

      {lostBets.length > 0 && (
        <div className="bets-section">
          <h2 className="section-title">Apuestas Perdidas</h2>
          <div className="bets-list">
            {lostBets.map(renderBet)}
          </div>
        </div>
      )}

      {pendingBets.length === 0 && wonBets.length === 0 && lostBets.length === 0 && (
        <div className="empty-bets">
          <p>No tienes apuestas todavia</p>
          <p className="empty-subtitle">Ve a "Apuestas Disponibles" para comenzar a apostar</p>
        </div>
      )}
    </div>
  )
}

export default MyBets

