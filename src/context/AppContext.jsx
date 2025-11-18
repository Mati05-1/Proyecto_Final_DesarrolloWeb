import React, { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [points, setPoints] = useState(1000)
  const [bets, setBets] = useState([])
  const [liveMatches, setLiveMatches] = useState([])
  const [liveTournaments, setLiveTournaments] = useState([])

  // Load user data from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    const savedUser = localStorage.getItem('acePutUser')
    const savedPoints = localStorage.getItem('acePutPoints')
    const savedBets = localStorage.getItem('acePutBets')

    // Priorizar datos de JWT si existe token
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        setUser(user.username)
        setPoints(user.points || 1000)
      } catch (error) {
        console.error('Error al cargar usuario:', error)
      }
    } else if (savedUser) {
      // Fallback a datos antiguos
      try {
        const user = JSON.parse(savedUser)
        setUser(user.username || savedUser)
      } catch {
        setUser(savedUser)
      }
    }
    
    if (savedPoints) {
      setPoints(parseInt(savedPoints))
    }
    if (savedBets) {
      setBets(JSON.parse(savedBets))
    }
  }, [])

  // Save points to localStorage
  useEffect(() => {
    localStorage.setItem('acePutPoints', points.toString())
  }, [points])

  // Save bets to localStorage
  useEffect(() => {
    localStorage.setItem('acePutBets', JSON.stringify(bets))
  }, [bets])

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password: password || 'demo123' })
      })

      const data = await response.json()

      if (!response.ok) {
        // Fallback: login simple sin contraseña (para compatibilidad)
        if (!password) {
          const newUser = { username: email, id: Date.now() }
          setUser(newUser)
          localStorage.setItem('acePutUser', JSON.stringify(newUser))
          return { success: true, user: newUser }
        }
        throw new Error(data.error || 'Error al iniciar sesión')
      }

      // Guardar token y datos del usuario
      localStorage.setItem('token', data.data.token)
      localStorage.setItem('user', JSON.stringify(data.data.user))
      localStorage.setItem('acePutUser', data.data.user.username)
      localStorage.setItem('acePutPoints', String(data.data.user.points || 1000))
      
      setUser(data.data.user.username)
      setPoints(data.data.user.points || 1000)
      
      return { success: true, user: data.data.user }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const register = async (username, email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar')
      }

      // Guardar token y datos del usuario
      localStorage.setItem('token', data.data.token)
      localStorage.setItem('user', JSON.stringify(data.data.user))
      localStorage.setItem('acePutUser', data.data.user.username)
      localStorage.setItem('acePutPoints', String(data.data.user.points || 1000))
      
      setUser(data.data.user.username)
      setPoints(data.data.user.points || 1000)
      
      return { success: true, user: data.data.user }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    setUser(null)
    setPoints(0)
    localStorage.removeItem('acePutUser')
    localStorage.removeItem('acePutPoints')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const addPoints = (amount) => {
    setPoints(prev => prev + amount)
  }

  const subtractPoints = (amount) => {
    if (points >= amount) {
      setPoints(prev => prev - amount)
      return true
    }
    return false
  }

  const placeBet = (betData) => {
    const newBet = {
      id: Date.now(),
      ...betData,
      status: 'pending',
      createdAt: new Date().toISOString()
    }
    setBets(prev => [...prev, newBet])
    return newBet
  }

  const updateBetStatus = (betId, status) => {
    setBets(prev => prev.map(bet => 
      bet.id === betId ? { ...bet, status } : bet
    ))
  }

  const value = {
    user,
    points,
    bets,
    liveMatches,
    liveTournaments,
    login,
    logout,
    register,
    addPoints,
    subtractPoints,
    placeBet,
    updateBetStatus,
    setLiveMatches,
    setLiveTournaments
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

