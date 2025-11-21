import React, { useState, useMemo } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isSameDay, addMonths, subMonths, getDay } from 'date-fns'
import './Calendar.css'

const Calendar = ({ events = [], onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const daysInMonth = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  })

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  const monthName = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const today = () => {
    setCurrentDate(new Date())
  }

  const getEventsForDate = (date) => {
    return events.filter(event => {
      if (!event.startTime) return false
      const eventDate = new Date(event.startTime)
      return isSameDay(eventDate, date)
    })
  }

  const getDayClassName = (day) => {
    const classes = ['calendar-day']
    
    if (!isSameMonth(day, currentDate)) {
      classes.push('other-month')
    }
    
    if (isSameDay(day, new Date())) {
      classes.push('today')
    }

    const dayEvents = getEventsForDate(day)
    if (dayEvents.length > 0) {
      classes.push('has-events')
    }

    return classes.join(' ')
  }

  const weekDays = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sb']

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="calendar-nav-btn" onClick={prevMonth}>
          
        </button>
        <h2 className="calendar-month-title">{monthName}</h2>
        <button className="calendar-nav-btn" onClick={nextMonth}>
          
        </button>
      </div>
      
      <button className="calendar-today-btn" onClick={today}>
        Hoy
      </button>

      <div className="calendar-grid">
        {weekDays.map(day => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}
        
        {daysInMonth.map(day => {
          const dayEvents = getEventsForDate(day)
          return (
            <div
              key={day.toISOString()}
              className={getDayClassName(day)}
              onClick={() => onDateClick && onDateClick(day, dayEvents)}
            >
              <span className="calendar-day-number">
                {format(day, 'd')}
              </span>
              {dayEvents.length > 0 && (
                <div className="calendar-day-events">
                  {dayEvents.slice(0, 3).map((event, idx) => (
                    <span key={idx} className={`calendar-event-dot ${event.type || 'default'}`}>
                      {event.type === 'tennis' ? '' : event.type === 'golf' ? '' : ''}
                    </span>
                  ))}
                  {dayEvents.length > 3 && (
                    <span className="calendar-event-more">+{dayEvents.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Calendar

