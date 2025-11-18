import { mockTennisMatches, mockGolfTournaments } from './mockData'

// Service that uses mock data only
export const matchService = {
  // Get tennis matches (live + upcoming)
  getTennisMatches: async () => {
    return getMockTennisData()
  },

  // Get golf tournaments (live + upcoming)
  getGolfTournaments: async () => {
    return getMockGolfData()
  },

  // Get match details by ID
  getTennisMatchDetails: async (matchId) => {
    return mockTennisMatches.find(m => m.id === matchId) || null
  },

  // Check if can bet on a match
  canBetOnMatch: (match) => {
    if (match.status === 'live' || match.status === 'finished') {
      return false
    }
    
    if (match.startTime) {
      const startTime = new Date(match.startTime)
      const now = new Date()
      return now < startTime
    }
    
    // If no start time, assume it's upcoming if status is scheduled
    return match.status === 'scheduled' || match.status === 'upcoming'
  }
}

// Helper functions for mock data
const getMockTennisData = () => {
  const live = mockTennisMatches.filter(m => m.status === 'live')
  const upcoming = mockTennisMatches.filter(m => m.status === 'scheduled' || !m.status)
  const finished = mockTennisMatches.filter(m => m.status === 'finished')
  
  return {
    live: live,
    upcoming: upcoming,
    finished: finished,
    all: [...live, ...upcoming, ...finished]
  }
}

const getMockGolfData = () => {
  const live = mockGolfTournaments.filter(t => t.status === 'live')
  const upcoming = mockGolfTournaments.filter(t => t.status === 'scheduled' || !t.status)
  
  return {
    live: live,
    upcoming: upcoming,
    all: [...live, ...upcoming]
  }
}

