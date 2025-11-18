/**
 * Datos mock para la API
 * Estos datos simulan una base de datos
 */

// Partidos de tenis
export const tennisMatches = [
  {
    id: 1,
    tournament: 'ATP Masters 1000',
    player1: { name: 'Carlos Alcaraz', country: '🇪🇸', rank: 2 },
    player2: { name: 'Novak Djokovic', country: '🇷🇸', rank: 1 },
    score: { sets: [{ p1: 6, p2: 4 }, { p1: 3, p2: 6 }, { p1: 4, p2: 3 }] },
    status: 'live',
    time: '2h 15m',
    startTime: new Date().toISOString(),
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    tournament: 'WTA Finals',
    player1: { name: 'Aryna Sabalenka', country: '🇧🇾', rank: 1 },
    player2: { name: 'Iga Świątek', country: '🇵🇱', rank: 2 },
    score: { sets: [{ p1: 4, p2: 6 }, { p1: 6, p2: 3 }] },
    status: 'live',
    time: '1h 45m',
    startTime: new Date().toISOString(),
    createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    tournament: 'ATP 500',
    player1: { name: 'Jannik Sinner', country: '🇮🇹', rank: 4 },
    player2: { name: 'Daniil Medvedev', country: '🇷🇺', rank: 3 },
    score: { sets: [{ p1: 6, p2: 3 }, { p1: 6, p2: 4 }] },
    status: 'finished',
    winner: 1,
    time: '1h 30m',
    startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 4,
    tournament: 'WTA 1000',
    player1: { name: 'Coco Gauff', country: '🇺🇸', rank: 3 },
    player2: { name: 'Elena Rybakina', country: '🇰🇿', rank: 5 },
    score: { sets: [{ p1: 6, p2: 4 }, { p1: 4, p2: 6 }, { p1: 6, p2: 2 }] },
    status: 'finished',
    winner: 1,
    time: '2h 10m',
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 5,
    tournament: 'ATP Masters 1000',
    player1: { name: 'Rafael Nadal', country: '🇪🇸', rank: 5 },
    player2: { name: 'Stefanos Tsitsipas', country: '🇬🇷', rank: 6 },
    score: { sets: [] },
    status: 'scheduled',
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString()
  }
]

// Torneos de golf
export const golfTournaments = [
  {
    id: 1,
    name: 'PGA Tour Championship',
    location: 'Atlanta, GA',
    status: 'live',
    round: 3,
    totalRounds: 4,
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    leaderboard: [
      { position: 1, player: 'Scottie Scheffler', country: '🇺🇸', score: -18, today: -5 },
      { position: 2, player: 'Rory McIlroy', country: '🇮🇪', score: -16, today: -4 },
      { position: 3, player: 'Jon Rahm', country: '🇪🇸', score: -14, today: -3 }
    ],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    name: 'Masters Tournament',
    location: 'Augusta, GA',
    status: 'live',
    round: 2,
    totalRounds: 4,
    startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    leaderboard: [
      { position: 1, player: 'Tiger Woods', country: '🇺🇸', score: -8, today: -3 },
      { position: 2, player: 'Brooks Koepka', country: '🇺🇸', score: -7, today: -2 }
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    name: 'PGA Championship',
    location: 'Louisville, KY',
    status: 'scheduled',
    round: 1,
    totalRounds: 4,
    startTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    leaderboard: [],
    createdAt: new Date().toISOString()
  }
]

// Apuestas (array mutable)
export const bets = [
  {
    id: 1,
    userId: 'user123',
    type: 'tennis',
    matchId: 1,
    selection: 1,
    selectionName: 'Carlos Alcaraz',
    amount: 100,
    status: 'pending',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    userId: 'user123',
    type: 'golf',
    tournamentId: 1,
    selection: 1,
    selectionName: 'Scottie Scheffler',
    amount: 200,
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  }
]

// Rankings
export const rankings = {
  atp: [
    { rank: 1, player: 'Novak Djokovic', country: '🇷🇸', points: 9795 },
    { rank: 2, player: 'Carlos Alcaraz', country: '🇪🇸', points: 8855 },
    { rank: 3, player: 'Daniil Medvedev', country: '🇷🇺', points: 7600 },
    { rank: 4, player: 'Jannik Sinner', country: '🇮🇹', points: 6490 }
  ],
  wta: [
    { rank: 1, player: 'Aryna Sabalenka', country: '🇧🇾', points: 8935 },
    { rank: 2, player: 'Iga Świątek', country: '🇵🇱', points: 8655 },
    { rank: 3, player: 'Coco Gauff', country: '🇺🇸', points: 6595 },
    { rank: 4, player: 'Elena Rybakina', country: '🇰🇿', points: 5865 }
  ],
  pga: [
    { rank: 1, player: 'Scottie Scheffler', country: '🇺🇸', points: 350.5 },
    { rank: 2, player: 'Rory McIlroy', country: '🇮🇪', points: 320.2 },
    { rank: 3, player: 'Jon Rahm', country: '🇪🇸', points: 298.8 },
    { rank: 4, player: 'Viktor Hovland', country: '🇳🇴', points: 285.3 }
  ]
}

