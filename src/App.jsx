import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import LiveResults from './pages/LiveResults'
import Statistics from './pages/Statistics'
import Betting from './pages/Betting'
import CalendarPage from './pages/Calendar'
import Admin from './pages/Admin'
import './App.css'

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/live-results" element={<LiveResults />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/betting" element={<Betting />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  )
}

export default App

