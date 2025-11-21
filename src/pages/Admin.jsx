import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import './Admin.css'

const Admin = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { user } = useApp()

  useEffect(() => {
    // Verificar si hay token
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/')
      return
    }
    loadDashboard()
  }, [navigate])

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        navigate('/')
        return
      }

      const response = await fetch('http://localhost:5000/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setError('No tienes permisos de administrador')
          localStorage.removeItem('token')
          setTimeout(() => navigate('/'), 2000)
          return
        }
        throw new Error(data.error || 'Error al cargar dashboard')
      }

      setStats(data.data)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading">Cargando dashboard...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="error-message">{error}</div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1> Panel de Administracin</h1>
        <p>Gestin y estadisticas de la plataforma</p>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <h3> Partidos de Tenis</h3>
          <div className="stat-details">
            <div className="stat-item">
              <span className="stat-label">Total:</span>
              <span className="stat-value">{stats?.matches?.total || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">En Vivo:</span>
              <span className="stat-value live">{stats?.matches?.live || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Finalizados:</span>
              <span className="stat-value">{stats?.matches?.finished || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Programados:</span>
              <span className="stat-value">{stats?.matches?.scheduled || 0}</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <h3> Torneos de Golf</h3>
          <div className="stat-details">
            <div className="stat-item">
              <span className="stat-label">Total:</span>
              <span className="stat-value">{stats?.tournaments?.total || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">En Vivo:</span>
              <span className="stat-value live">{stats?.tournaments?.live || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Programados:</span>
              <span className="stat-value">{stats?.tournaments?.scheduled || 0}</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <h3> Apuestas</h3>
          <div className="stat-details">
            <div className="stat-item">
              <span className="stat-label">Total:</span>
              <span className="stat-value">{stats?.bets?.total || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Pendientes:</span>
              <span className="stat-value pending">{stats?.bets?.pending || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Ganadas:</span>
              <span className="stat-value success">{stats?.bets?.won || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Perdidas:</span>
              <span className="stat-value danger">{stats?.bets?.lost || 0}</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <h3> Rankings</h3>
          <div className="stat-details">
            <div className="stat-item">
              <span className="stat-label">Total:</span>
              <span className="stat-value">{stats?.rankings?.total || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Tipos:</span>
              <span className="stat-value">ATP, WTA, PGA</span>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-actions">
        <h2>Acciones de Administracin</h2>
        <div className="actions-grid">
          <button className="action-btn" onClick={() => navigate('/live-results')}>
            Ver Resultados en Vivo
          </button>
          <button className="action-btn" onClick={() => navigate('/statistics')}>
            Ver Estadisticas
          </button>
          <button className="action-btn" onClick={() => navigate('/betting')}>
            Ver Apuestas
          </button>
        </div>
      </div>
    </div>
  )
}

export default Admin

