// Mock data for tennis matches
export const mockTennisMatches = [
  {
    id: 1,
    tournament: 'ATP Masters 1000',
    player1: { name: 'Carlos Alcaraz', country: '', rank: 2 },
    player2: { name: 'Novak Djokovic', country: '', rank: 1 },
    score: { sets: [{ p1: 6, p2: 4 }, { p1: 3, p2: 6 }, { p1: 4, p2: 3 }] },
    status: 'live',
    time: '2h 15m',
    startTime: new Date().toISOString(), // Hoy
    statistics: {
      aces: { p1: 12, p2: 8 },
      doubleFaults: { p1: 3, p2: 2 },
      winners: { p1: 28, p2: 22 },
      errors: { p1: 15, p2: 18 },
      serve1st: { p1: 68, p2: 72 },
      breakPoints: { p1: '2/5', p2: '1/3' }
    }
  },
  {
    id: 2,
    tournament: 'WTA Finals',
    player1: { name: 'Aryna Sabalenka', country: '', rank: 1 },
    player2: { name: 'Iga witek', country: '', rank: 2 },
    score: { sets: [{ p1: 4, p2: 6 }, { p1: 6, p2: 3 }] },
    status: 'live',
    time: '1h 45m',
    startTime: new Date().toISOString(), // Hoy
    statistics: {
      aces: { p1: 5, p2: 3 },
      doubleFaults: { p1: 4, p2: 2 },
      winners: { p1: 18, p2: 15 },
      errors: { p1: 12, p2: 10 },
      serve1st: { p1: 65, p2: 70 },
      breakPoints: { p1: '1/4', p2: '2/3' }
    }
  },
  {
    id: 3,
    tournament: 'ATP 500',
    player1: { name: 'Jannik Sinner', country: '', rank: 4 },
    player2: { name: 'Daniil Medvedev', country: '', rank: 3 },
    score: { sets: [{ p1: 6, p2: 3 }, { p1: 6, p2: 4 }] },
    status: 'finished',
    winner: 1,
    time: '1h 30m',
    startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // Ayer
  },
  {
    id: 4,
    tournament: 'WTA 1000',
    player1: { name: 'Coco Gauff', country: '', rank: 3 },
    player2: { name: 'Elena Rybakina', country: '', rank: 5 },
    score: { sets: [{ p1: 6, p2: 4 }, { p1: 4, p2: 6 }, { p1: 6, p2: 2 }] },
    status: 'finished',
    winner: 1,
    time: '2h 10m',
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // Hace 2 dias
  },
  {
    id: 5,
    tournament: 'ATP Masters 1000',
    player1: { name: 'Rafael Nadal', country: '', rank: 5 },
    player2: { name: 'Stefanos Tsitsipas', country: '', rank: 6 },
    score: { sets: [] },
    status: 'scheduled',
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 horas desde ahora
    time: null
  },
  {
    id: 6,
    tournament: 'WTA Finals',
    player1: { name: 'Jessica Pegula', country: '', rank: 4 },
    player2: { name: 'Maria Sakkari', country: '', rank: 7 },
    score: { sets: [] },
    status: 'scheduled',
    startTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 horas desde ahora
    time: null
  },
  {
    id: 7,
    tournament: 'ATP 250',
    player1: { name: 'Casper Ruud', country: '', rank: 8 },
    player2: { name: 'Taylor Fritz', country: '', rank: 9 },
    score: { sets: [] },
    status: 'scheduled',
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Manana
    time: null
  },
  {
    id: 8,
    tournament: 'WTA 500',
    player1: { name: 'Ons Jabeur', country: '', rank: 6 },
    player2: { name: 'Petra Kvitov', country: '', rank: 8 },
    score: { sets: [] },
    status: 'scheduled',
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // En 2 dias
    time: null
  },
  {
    id: 9,
    tournament: 'ATP Masters 1000',
    player1: { name: 'Holger Rune', country: '', rank: 7 },
    player2: { name: 'Andrey Rublev', country: '', rank: 10 },
    score: { sets: [] },
    status: 'scheduled',
    startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // En 5 dias
    time: null
  },
  {
    id: 10,
    tournament: 'WTA 1000',
    player1: { name: 'Caroline Garcia', country: '', rank: 9 },
    player2: { name: 'Beatriz Haddad Maia', country: '', rank: 11 },
    score: { sets: [] },
    status: 'scheduled',
    startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // En una semana
    time: null
  },
  {
    id: 11,
    tournament: 'ATP 500',
    player1: { name: 'Tommy Paul', country: '', rank: 12 },
    player2: { name: 'Lorenzo Musetti', country: '', rank: 13 },
    score: { sets: [] },
    status: 'scheduled',
    startTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // En 10 dias
    time: null
  },
  {
    id: 12,
    tournament: 'WTA 250',
    player1: { name: 'Donna Veki', country: '', rank: 14 },
    player2: { name: 'Anastasia Potapova', country: '', rank: 15 },
    score: { sets: [] },
    status: 'scheduled',
    startTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // En 2 semanas
    time: null
  }
]

// Mock data for golf tournaments
export const mockGolfTournaments = [
  {
    id: 1,
    name: 'PGA Tour Championship',
    location: 'Atlanta, GA',
    status: 'live',
    round: 3,
    totalRounds: 4,
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Hace 2 dias (torneo en curso)
    leaderboard: [
      { position: 1, player: 'Scottie Scheffler', country: '', score: -18, today: -5 },
      { position: 2, player: 'Rory McIlroy', country: '', score: -16, today: -4 },
      { position: 3, player: 'Jon Rahm', country: '', score: -14, today: -3 },
      { position: 4, player: 'Viktor Hovland', country: '', score: -12, today: -2 }
    ],
    statistics: {
      drivingAccuracy: 72.5,
      averagePutting: 1.68,
      greensInRegulation: 68.3,
      averageDistance: 298.5
    }
  },
  {
    id: 2,
    name: 'Masters Tournament',
    location: 'Augusta, GA',
    status: 'live',
    round: 2,
    totalRounds: 4,
    startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Ayer (torneo en curso)
    leaderboard: [
      { position: 1, player: 'Tiger Woods', country: '', score: -8, today: -3 },
      { position: 2, player: 'Brooks Koepka', country: '', score: -7, today: -2 },
      { position: 3, player: 'Collin Morikawa', country: '', score: -6, today: -1 }
    ],
    statistics: {
      drivingAccuracy: 75.2,
      averagePutting: 1.72,
      greensInRegulation: 70.1,
      averageDistance: 295.8
    }
  },
  {
    id: 3,
    name: 'PGA Championship',
    location: 'Louisville, KY',
    status: 'scheduled',
    round: 1,
    totalRounds: 4,
    startTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 horas desde ahora
    leaderboard: [],
    statistics: null
  },
  {
    id: 4,
    name: 'US Open',
    location: 'Pinehurst, NC',
    status: 'scheduled',
    round: 1,
    totalRounds: 4,
    startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // En 3 dias
    leaderboard: [],
    statistics: null
  },
  {
    id: 5,
    name: 'The Open Championship',
    location: 'Troon, Scotland',
    status: 'scheduled',
    round: 1,
    totalRounds: 4,
    startTime: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(), // En 8 dias
    leaderboard: [],
    statistics: null
  },
  {
    id: 6,
    name: 'WGC Championship',
    location: 'Memphis, TN',
    status: 'scheduled',
    round: 1,
    totalRounds: 4,
    startTime: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(), // En 12 dias
    leaderboard: [],
    statistics: null
  },
  {
    id: 7,
    name: 'BMW Championship',
    location: 'Castle Rock, CO',
    status: 'scheduled',
    round: 1,
    totalRounds: 4,
    startTime: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // En 15 dias
    leaderboard: [],
    statistics: null
  }
]

// Mock rankings
export const mockRankings = {
  atp: [
    { rank: 1, player: 'Novak Djokovic', country: '', points: 9795 },
    { rank: 2, player: 'Carlos Alcaraz', country: '', points: 8855 },
    { rank: 3, player: 'Daniil Medvedev', country: '', points: 7600 },
    { rank: 4, player: 'Jannik Sinner', country: '', points: 6490 }
  ],
  wta: [
    { rank: 1, player: 'Aryna Sabalenka', country: '', points: 8935 },
    { rank: 2, player: 'Iga witek', country: '', points: 8655 },
    { rank: 3, player: 'Coco Gauff', country: '', points: 6595 },
    { rank: 4, player: 'Elena Rybakina', country: '', points: 5865 }
  ],
  pga: [
    { rank: 1, player: 'Scottie Scheffler', country: '', points: 350.5 },
    { rank: 2, player: 'Rory McIlroy', country: '', points: 320.2 },
    { rank: 3, player: 'Jon Rahm', country: '', points: 298.8 },
    { rank: 4, player: 'Viktor Hovland', country: '', points: 285.3 }
  ]
}

// Simulate live updates
export const simulateLiveUpdate = (matchId, type) => {
  if (type === 'tennis') {
    const match = mockTennisMatches.find(m => m.id === matchId && m.status === 'live')
    if (match) {
      // Simulate score update
      const currentSet = match.score.sets.length - 1
      const newScore = { ...match.score }
      if (Math.random() > 0.5) {
        newScore.sets[currentSet] = {
          p1: (newScore.sets[currentSet].p1 || 0) + 1,
          p2: newScore.sets[currentSet].p2 || 0
        }
      } else {
        newScore.sets[currentSet] = {
          p1: newScore.sets[currentSet].p1 || 0,
          p2: (newScore.sets[currentSet].p2 || 0) + 1
        }
      }
      return { ...match, score: newScore }
    }
  }
  return null
}

