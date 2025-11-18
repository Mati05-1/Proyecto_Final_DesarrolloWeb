import React, { useState, useEffect, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { matchService } from '../services/matchService'
import { format, isSameDay } from 'date-fns'
import Calendar from '../components/Calendar'
import TennisMatchCard from '../components/TennisMatchCard'
import GolfTournamentCard from '../components/GolfTournamentCard'
import './Calendar.css'

const CalendarPage = () => {
  const { user } = useApp()
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedEvents, setSelectedEvents] = useState([])
  const [tennisMatches, setTennisMatches] = useState([])
  const [golfTournaments, setGolfTournaments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const tennisData = await matchService.getTennisMatches()
        const golfData = await matchService.getGolfTournaments()
        
        setTennisMatches(tennisData.all || [])
        setGolfTournaments(golfData.all || [])
      } catch (error) {
        console.error('Error loading calendar data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Combine all events with type information
  const allEvents = useMemo(() => {
    const tennisEvents = tennisMatches.map(match => ({
      ...match,
      type: 'tennis',
      name: match.tournament || `${match.player1?.name} vs ${match.player2?.name}`
    }))
    
    const golfEvents = golfTournaments.map(tournament => ({
      ...tournament,
      type: 'golf',
      name: tournament.name
    }))
    
    return [...tennisEvents, ...golfEvents]
  }, [tennisMatches, golfTournaments])

  const handleDateClick = (date, events) => {
    setSelectedDate(date)
    setSelectedEvents(events)
  }

  const getSelectedDateEvents = () => {
    if (!selectedDate) return []
    
    const tennis = tennisMatches.filter(match => {
      if (!match.startTime) return false
      return isSameDay(new Date(match.startTime), selectedDate)
    })
    
    const golf = golfTournaments.filter(tournament => {
      if (!tournament.startTime) return false
      return isSameDay(new Date(tournament.startTime), selectedDate)
    })
    
    return { tennis, golf }
  }

  const { tennis, golf } = getSelectedDateEvents()

  if (!user) {
    return (
      <div className="calendar-page">
        <div className="container">
          <div className="login-prompt">
            <h2>Inicia sesión para ver el calendario</h2>
            <p>Necesitas estar registrado para acceder a esta sección</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="calendar-page">
      <div className="container">
        <h1 className="page-title">Calendario Interactivo</h1>
        <p className="page-subtitle">
          Visualiza todos los torneos y partidos programados. Haz clic en una fecha para ver los eventos del día.
        </p>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Cargando calendario...</p>
          </div>
        ) : (
          <>
            <Calendar events={allEvents} onDateClick={handleDateClick} />

            {selectedDate && (
              <div className="selected-date-events">
                <h2 className="selected-date-title">
                  Eventos del {selectedDate.getDate()} de {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'][selectedDate.getMonth()]}, {selectedDate.getFullYear()}
                </h2>
                
                {tennis.length === 0 && golf.length === 0 ? (
                  <div className="empty-events">
                    <p>No hay eventos programados para esta fecha</p>
                  </div>
                ) : (
                  <div className="events-content">
                    {tennis.length > 0 && (
                      <div className="events-section">
                        <h3 className="events-section-title">
                          🎾 Partidos de Tenis ({tennis.length})
                        </h3>
                        <div className="events-grid">
                          {tennis.map(match => (
                            <TennisMatchCard key={match.id} match={match} />
                          ))}
                        </div>
                      </div>
                    )}

                    {golf.length > 0 && (
                      <div className="events-section">
                        <h3 className="events-section-title">
                          ⛳ Torneos de Golf ({golf.length})
                        </h3>
                        <div className="events-grid">
                          {golf.map(tournament => (
                            <GolfTournamentCard key={tournament.id} tournament={tournament} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {!selectedDate && (
              <div className="calendar-info">
                <p>💡 Haz clic en cualquier fecha del calendario para ver los eventos programados</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default CalendarPage

