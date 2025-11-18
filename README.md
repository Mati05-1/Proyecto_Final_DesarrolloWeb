# Ace & Putt - Plataforma de Tenis y Golf

Aplicación web completa para seguir resultados en tiempo real, estadísticas detalladas y sistema de apuestas virtuales para tenis y golf.

## 🚀 Características

- **Resultados en Tiempo Real**: Visualiza partidos de tenis y torneos de golf en vivo
- **Estadísticas Detalladas**: Rankings ATP, WTA y PGA con estadísticas completas de jugadores
- **Sistema de Apuestas**: Apuesta puntos virtuales en partidos y torneos
- **Interfaz Moderna**: Diseño responsive y atractivo con React

## 🛠️ Tecnologías

- **React 18** - Framework de UI
- **Vite** - Build tool y dev server
- **React Router** - Navegación
- **Context API** - Manejo de estado global
- **CSS3** - Estilos modernos y responsive

## 📦 Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Inicia el servidor de desarrollo:
```bash
npm run dev
```

3. Abre tu navegador en `http://localhost:3000`

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Navbar.jsx
│   ├── TennisMatchCard.jsx
│   ├── GolfTournamentCard.jsx
│   ├── BettingCard.jsx
│   ├── MyBets.jsx
│   ├── RankingTable.jsx
│   └── PlayerStats.jsx
├── pages/              # Páginas principales
│   ├── Home.jsx
│   ├── LiveResults.jsx
│   ├── Statistics.jsx
│   └── Betting.jsx
├── context/            # Context API
│   └── AppContext.jsx
├── services/           # Servicios y datos mock
│   └── mockData.js
├── App.jsx             # Componente principal
├── main.jsx            # Punto de entrada
└── index.css           # Estilos globales
```

## 🎯 Funcionalidades Principales

### Resultados en Tiempo Real
- Visualización de partidos de tenis en vivo
- Torneos de golf con leaderboards actualizados
- Actualización automática de scores cada 5 segundos
- Estadísticas detalladas por partido/torneo

### Estadísticas Detalladas
- Rankings ATP, WTA y PGA
- Estadísticas individuales de jugadores
- Métricas de rendimiento (aces, winners, driving accuracy, etc.)

### Sistema de Apuestas
- Apuesta en partidos de tenis y torneos de golf
- Sistema de puntos virtuales
- Historial de apuestas
- Seguimiento de ganancias y pérdidas

## 🎮 Uso

1. **Iniciar Sesión**: Ingresa un nombre de usuario en la página principal
2. **Ver Resultados**: Navega a "Resultados en Vivo" para ver partidos y torneos
3. **Consultar Estadísticas**: Ve a "Estadísticas" para rankings y datos de jugadores
4. **Apostar**: Dirígete a "Apuestas" para realizar apuestas en eventos en vivo

### Nota sobre Apuestas

- **Solo puedes apostar ANTES de que empiece un partido/torneo**
- Una vez que el evento comienza, las apuestas se deshabilitan automáticamente
- Los partidos programados muestran el tiempo restante hasta el inicio

## 📝 Notas

- La aplicación usa datos simulados (mock data) para demostración
- Los puntos y apuestas se guardan en localStorage
- Las actualizaciones en tiempo real se refrescan cada 30 segundos
- Todos los datos mostrados son simulados para fines educativos

## 🚧 Futuras Mejoras

- Sistema de usuarios más robusto con autenticación
- Chat en tiempo real
- Notificaciones push
- Sistema de amigos y rankings sociales
- Historial de apuestas más detallado
- Integración con APIs reales para datos en tiempo real

## 📄 Licencia

Este proyecto es de uso educativo.
