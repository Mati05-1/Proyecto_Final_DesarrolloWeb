# 💾 MongoDB - Espacio en Disco Requerido

## 📊 Espacio de Instalación

### MongoDB Community Edition
- **Instalación base**: ~200-300 MB
- **Dependencias**: ~100-200 MB
- **Total instalación**: **~300-500 MB**

## 💾 Espacio para Datos

### Tu Proyecto (Ace & Putt)

**Estimación de datos por entidad:**

#### 1. Partidos de Tenis (Match)
- Cada partido: ~1-2 KB
- 100 partidos: ~100-200 KB
- 1,000 partidos: ~1-2 MB

#### 2. Torneos de Golf (Tournament)
- Cada torneo: ~2-5 KB (incluye leaderboard)
- 50 torneos: ~100-250 KB
- 500 torneos: ~1-2.5 MB

#### 3. Apuestas (Bet)
- Cada apuesta: ~0.5-1 KB
- 1,000 apuestas: ~500 KB - 1 MB
- 10,000 apuestas: ~5-10 MB

#### 4. Rankings (Ranking)
- Cada ranking (ATP/WTA/PGA): ~5-10 KB
- 3 rankings: ~15-30 KB

### 📈 Estimación Total para tu Proyecto

**Escenario Conservador (Desarrollo):**
- 100 partidos: ~200 KB
- 50 torneos: ~250 KB
- 1,000 apuestas: ~1 MB
- Rankings: ~30 KB
- **Total: ~1.5 MB**

**Escenario Realista (Uso Normal):**
- 1,000 partidos: ~2 MB
- 500 torneos: ~2.5 MB
- 10,000 apuestas: ~10 MB
- Rankings: ~30 KB
- **Total: ~15 MB**

**Escenario Extenso (Mucho uso):**
- 10,000 partidos: ~20 MB
- 5,000 torneos: ~25 MB
- 100,000 apuestas: ~100 MB
- Rankings: ~30 KB
- **Total: ~145 MB**

## 🎯 Resumen

| Componente | Espacio |
|-----------|---------|
| **Instalación MongoDB** | ~300-500 MB |
| **Datos (desarrollo)** | ~1-2 MB |
| **Datos (uso normal)** | ~10-20 MB |
| **Datos (extenso)** | ~100-150 MB |
| **Total mínimo** | **~300-500 MB** |
| **Total realista** | **~350-550 MB** |
| **Total máximo** | **~450-650 MB** |

## 💡 Comparación con Otras Apps

Para que tengas referencia:
- **WhatsApp**: ~200-500 MB
- **Spotify**: ~300-500 MB
- **Chrome**: ~500 MB - 2 GB
- **MongoDB**: ~300-500 MB (instalación) + datos

## 📊 Espacio Adicional que MongoDB Usa

MongoDB también reserva espacio para:
- **Índices**: ~10-20% del tamaño de datos
- **Logs**: ~50-100 MB (puedes limpiarlos)
- **Cache**: Se libera automáticamente

**Total adicional**: ~50-200 MB dependiendo del uso

## 🧹 Cómo Limpiar Espacio

### Limpiar logs de MongoDB:
```bash
# Los logs se guardan en:
# /opt/homebrew/var/log/mongodb/

# Puedes eliminarlos manualmente o configurar rotación
```

### Eliminar datos antiguos:
```bash
# Desde mongosh
mongosh
use ace-putt
db.matches.deleteMany({ status: "finished", createdAt: { $lt: new Date("2024-01-01") } })
```

## 📈 Crecimiento Estimado

**Por mes (uso normal):**
- ~500 partidos nuevos: ~1 MB
- ~100 torneos nuevos: ~500 KB
- ~5,000 apuestas nuevas: ~5 MB
- **Total mensual**: ~6.5 MB

**En 1 año**: ~80 MB adicionales

## ✅ Conclusión

**Para tu proyecto:**
- **Instalación**: ~400 MB (una sola vez)
- **Datos iniciales**: ~2-5 MB
- **Datos después de 1 año**: ~80-100 MB
- **Total después de 1 año**: ~500 MB

**Es muy poco espacio** comparado con otras aplicaciones. MongoDB es muy eficiente con el almacenamiento.

## 🎯 Recomendación

- **Mínimo necesario**: 500 MB libres
- **Recomendado**: 1 GB libres (para crecimiento)
- **Ideal**: 2 GB libres (sin preocupaciones)

Si tienes menos de 500 MB libres, considera:
1. Liberar espacio en tu Mac
2. Usar MongoDB Atlas (en la nube, no ocupa espacio local)
3. Limpiar logs periódicamente

---

**En resumen**: MongoDB ocupa ~400 MB para instalarse y tus datos ocuparán ~2-100 MB dependiendo del uso. Es muy poco espacio. 💾

