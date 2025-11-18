import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import './Navbar.css'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, points, logout } = useApp()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">
          🎾 Ace & Putt
        </Link>
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Inicio</Link></li>
          <li><Link to="/live-results" onClick={() => setIsMenuOpen(false)}>Resultados en Vivo</Link></li>
          <li><Link to="/statistics" onClick={() => setIsMenuOpen(false)}>Estadísticas</Link></li>
          <li><Link to="/betting" onClick={() => setIsMenuOpen(false)}>Apuestas</Link></li>
          <li><Link to="/calendar" onClick={() => setIsMenuOpen(false)}>Calendario</Link></li>
          {localStorage.getItem('token') && (
            <li><Link to="/admin" onClick={() => setIsMenuOpen(false)}>Admin</Link></li>
          )}
        </ul>
        <div className="nav-right">
          {user ? (
            <>
              <div className="user-info">
                <span className="user-name">{typeof user === 'string' ? user : user?.username || 'Usuario'}</span>
                <span className="user-points">💰 {points.toLocaleString()} pts</span>
              </div>
              <button className="btn-secondary nav-btn" onClick={handleLogout}>
                Salir
              </button>
            </>
          ) : (
            <button className="btn-primary nav-btn" onClick={() => navigate('/')}>
              Entrar
            </button>
          )}
          <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

