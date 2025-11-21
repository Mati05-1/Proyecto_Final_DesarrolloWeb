import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import './Home.css'

const Home = () => {
  const [username, setUsername] = useState('')
  const { login, user } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/live-results')
    }
  }, [user, navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    const email = username.trim()
    if (email) {
      const result = await login(email, 'demo123')
      if (result.success) {
        navigate('/live-results')
      } else {
        alert(result.error || 'Error al iniciar sesin')
      }
    }
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="sports-animations">
          <div className="tennis-ball"></div>
          <div className="tennis-ball ball-2"></div>
          <div className="golf-ball"></div>
          <div className="tennis-racket"></div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            Tu Plataforma Completa de <span className="highlight">Tenis y Golf</span>
          </h1>
          <p className="hero-subtitle">
            Resultados en tiempo real, estadisticas detalladas y apuestas virtuales. 
            Sigue a tus jugadores favoritos y demuestra quien es el mejor predictor.
          </p>
          
          {!user && (
            <form onSubmit={handleLogin} className="login-form">
              <input
                type="text"
                placeholder="Ingresa tu nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="login-input"
                required
              />
              <button type="submit" className="btn-primary btn-large">
                Empezar Ahora
              </button>
            </form>
          )}

          {user && (
            <div className="hero-buttons">
              <button 
                className="btn-primary btn-large" 
                onClick={() => navigate('/live-results')}
              >
                Ver Resultados en Vivo
              </button>
              <button 
                className="btn-secondary btn-large" 
                onClick={() => navigate('/betting')}
              >
                Ir a Apuestas
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Caracteristicas Principales</h2>
          <p className="section-subtitle">
            Todo lo que necesitas para estar al dia con el mundo del tenis y golf
          </p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"></div>
              <h3>Resultados en Tiempo Real</h3>
              <p>Marcadores live de partidos de tenis y torneos de golf. Nunca te pierdas una actualizacin.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"></div>
              <h3>Estadisticas Detalladas</h3>
              <p>Porcentajes de saque, winners, errores, driving accuracy, putting y mucho ms.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"></div>
              <h3>Rankings Actualizados</h3>
              <p>ATP, WTA, PGA Tour y World Golf Rankings siempre actualizados en tiempo real.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"></div>
              <h3>Sistema de Apuestas</h3>
              <p>Pronostica ganadores y compite por puntos virtuales con tus amigos.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

