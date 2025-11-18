# Documentación de la Aplicación React - Ace & Putt

## ✅ Requisitos Técnicos Cumplidos

### 1. Aplicación React con CLI
- ✅ **Vite CLI**: Proyecto creado con Vite (equivalente a Angular CLI)
- ✅ **React 18**: Versión moderna de React
- ✅ **Estructura de proyecto**: Organizada en carpetas (components, pages, services, utils, context)

### 2. Componentes (Mínimo 4)
La aplicación cuenta con **más de 4 componentes principales**:

#### Páginas (Componentes Principales):
1. **Home** (`src/pages/Home.jsx`) - Página de inicio
2. **LiveResults** (`src/pages/LiveResults.jsx`) - Resultados en tiempo real
3. **Statistics** (`src/pages/Statistics.jsx`) - Estadísticas y rankings
4. **Betting** (`src/pages/Betting.jsx`) - Sistema de apuestas
5. **Calendar** (`src/pages/Calendar.jsx`) - Calendario de eventos

#### Componentes Reutilizables:
- **Navbar** - Barra de navegación
- **TennisMatchCard** - Tarjeta de partido de tenis
- **GolfTournamentCard** - Tarjeta de torneo de golf
- **BettingCard** - Tarjeta de apuesta
- **RankingTable** - Tabla de rankings
- **PlayerStats** - Estadísticas de jugador
- **MyBets** - Lista de apuestas del usuario
- **Calendar** - Componente de calendario

### 3. Routing Funcional
- ✅ **React Router DOM v6**: Implementado correctamente
- ✅ **BrowserRouter**: Router principal
- ✅ **Routes y Route**: Configuración de rutas
- ✅ **Navegación funcional**: Entre todas las vistas

#### Rutas Configuradas:
```javascript
/ → Home
/live-results → LiveResults
/statistics → Statistics
/betting → Betting
/calendar → Calendar
```

### 4. Servicios para Manejar Datos
- ✅ **dataService.js**: Servicio principal para datos
- ✅ **matchService.js**: Servicio para partidos y torneos
- ✅ **mockData.js**: Datos simulados

#### Servicios Implementados:

**dataService.js** - Servicio principal:
- `getTennisMatches()` - Obtener partidos de tenis
- `getGolfTournaments()` - Obtener torneos de golf
- `getRankings(type)` - Obtener rankings (ATP, WTA, PGA)
- `getTennisMatchById(id)` - Obtener partido por ID
- `getGolfTournamentById(id)` - Obtener torneo por ID
- `getLiveMatches()` - Obtener partidos en vivo
- `getLiveTournaments()` - Obtener torneos en vivo
- `searchMatchesByPlayer(name)` - Buscar partidos por jugador
- `getPlayerStats(name, type)` - Obtener estadísticas de jugador

**matchService.js** - Servicio de partidos:
- `getTennisMatches()` - Obtener datos de tenis
- `getGolfTournaments()` - Obtener datos de golf
- `getTennisMatchDetails(id)` - Detalles de partido
- `canBetOnMatch(match)` - Validar si se puede apostar

### 5. Pipes (Funciones de Transformación)

#### Pipes Integrados (Basados en APIs nativas):
1. **formatNumber** - Formatear números con separadores de miles
2. **formatDate** - Formatear fechas (short, long, time)
3. **formatCurrency** - Formatear valores como moneda

#### Pipes Personalizados:
1. **timeAgo** - Tiempo transcurrido ("Hace 2 horas")
2. **formatGolfScore** - Formatear puntuación de golf (+5, -2, E)
3. **formatPercentage** - Formatear porcentajes
4. **truncate** - Abreviar textos largos
5. **capitalize** - Capitalizar primera letra
6. **formatMatchTime** - Formatear tiempo de partido
7. **formatRanking** - Formatear posición de ranking

#### Ubicación:
- `src/utils/pipes.js` - Todas las funciones de transformación
- `src/utils/index.js` - Exportaciones centralizadas

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Navbar.jsx
│   ├── TennisMatchCard.jsx
│   ├── GolfTournamentCard.jsx
│   ├── BettingCard.jsx
│   ├── RankingTable.jsx
│   ├── PlayerStats.jsx
│   ├── MyBets.jsx
│   └── Calendar.jsx
├── pages/              # Páginas principales (Componentes de ruta)
│   ├── Home.jsx
│   ├── LiveResults.jsx
│   ├── Statistics.jsx
│   ├── Betting.jsx
│   └── Calendar.jsx
├── services/           # Servicios de datos
│   ├── dataService.js  # Servicio principal
│   ├── matchService.js # Servicio de partidos
│   └── mockData.js     # Datos simulados
├── utils/              # Utilidades y pipes
│   ├── pipes.js        # Funciones de transformación
│   └── index.js        # Exportaciones
├── context/            # Context API (Estado global)
│   └── AppContext.jsx
├── App.jsx             # Componente principal
└── main.jsx            # Punto de entrada
```

## 🔧 Tecnologías Utilizadas

### Core:
- **React 18.2.0** - Biblioteca de UI
- **React DOM 18.2.0** - Renderizado
- **React Router DOM 6.20.0** - Routing

### Herramientas:
- **Vite 5.0.8** - Build tool y dev server
- **ESLint** - Linter

### Utilidades:
- **date-fns 2.30.0** - Manipulación de fechas
- **axios 1.6.2** - Cliente HTTP (preparado para APIs)

## 📝 Ejemplos de Uso

### Uso de Pipes en Componentes:

```javascript
import { formatNumber, formatPercentage, timeAgo } from '../utils/pipes'

// En el componente
const points = formatNumber(player.points) // "9,795"
const winRate = formatPercentage(75.5) // "75.5%"
const lastUpdate = timeAgo(match.startTime) // "Hace 2 horas"
```

### Uso de Servicios:

```javascript
import { dataService } from '../services/dataService'

// En useEffect
useEffect(() => {
  const loadData = async () => {
    const response = await dataService.getRankings('atp')
    if (response.success) {
      setRankings(response.data)
    }
  }
  loadData()
}, [])
```

### Routing:

```javascript
import { Link, useNavigate } from 'react-router-dom'

// Navegación con Link
<Link to="/statistics">Estadísticas</Link>

// Navegación programática
const navigate = useNavigate()
navigate('/betting')
```

## 🎯 Características Implementadas

### Estado Global:
- **Context API**: AppContext para estado compartido
- **User Management**: Login/logout
- **Points System**: Sistema de puntos virtuales
- **Bets Management**: Gestión de apuestas

### Funcionalidades:
- ✅ Resultados en tiempo real
- ✅ Estadísticas detalladas
- ✅ Sistema de apuestas
- ✅ Calendario interactivo
- ✅ Rankings actualizados
- ✅ Búsqueda y filtrado

## 🚀 Cómo Ejecutar

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview de producción
npm run preview
```

## 📋 Checklist de Requisitos

- [x] Aplicación React con CLI (Vite)
- [x] Mínimo 4 componentes principales (5 páginas + múltiples componentes)
- [x] Routing funcional entre vistas
- [x] Servicios para manejar datos (dataService, matchService)
- [x] Pipes integrados (formatNumber, formatDate, formatCurrency)
- [x] Pipes personalizados (timeAgo, formatGolfScore, formatPercentage, etc.)
- [x] Estructura organizada
- [x] Context API para estado global
- [x] Datos simulados (mockData)

## 🎯 Próximos Pasos

La aplicación React está lista para:
- Integración con backend (Node.js + Express)
- Conexión a MongoDB
- Autenticación real
- APIs REST para datos en tiempo real
- WebSockets para actualizaciones live

