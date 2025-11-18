# ✅ MongoDB Instalado y Configurado

## 🎉 Estado Actual

**MongoDB está instalado y funcionando en tu Mac.**

### ✅ Lo que se instaló:

1. **MongoDB Community Edition 8.2.2**
   - Base de datos: ~255 MB
   - Herramientas: ~129 MB
   - Total: ~384 MB

2. **MongoDB Shell (mongosh)**
   - Consola para interactuar con MongoDB

3. **Servicio iniciado**
   - MongoDB se ejecuta automáticamente al iniciar tu Mac
   - Puerto: `27017`
   - Base de datos: `ace-putt`

### 📊 Datos Iniciales

La base de datos ya está poblada con:
- ✅ **5 partidos de tenis**
- ✅ **3 torneos de golf**
- ✅ **2 apuestas**
- ✅ **3 rankings** (ATP, WTA, PGA)

## 🔍 Verificar que Funciona

### 1. Verificar que MongoDB está corriendo:
```bash
brew services list | grep mongodb
```

Deberías ver: `mongodb-community started`

### 2. Conectar a MongoDB:
```bash
mongosh
```

### 3. Ver tus datos:
```bash
mongosh ace-putt
use ace-putt
show collections
db.matches.find()
db.tournaments.find()
db.bets.find()
db.rankings.find()
```

### 4. Verificar que el servidor se conecta:
```bash
cd server
node server.js
```

Deberías ver:
```
✅ MongoDB conectado: localhost:27017
   Base de datos: ace-putt
```

## 🎯 Comandos Útiles

### Iniciar/Detener MongoDB:
```bash
# Iniciar
brew services start mongodb-community

# Detener
brew services stop mongodb-community

# Reiniciar
brew services restart mongodb-community
```

### Ver estado:
```bash
brew services list
```

### Abrir consola de MongoDB:
```bash
mongosh
# O directamente a tu base de datos:
mongosh ace-putt
```

## 📝 Ubicación de los Datos

Los datos de MongoDB se guardan en:
```
/opt/homebrew/var/mongodb/
```

Los logs se guardan en:
```
/opt/homebrew/var/log/mongodb/
```

## 🔄 Repoblar Base de Datos

Si quieres limpiar y volver a poblar la base de datos:

```bash
cd server
node scripts/seedDatabase.js
```

Esto:
1. Elimina todos los datos existentes
2. Inserta datos frescos desde `mockData.js`

## ✅ Todo Listo

Tu proyecto ahora:
- ✅ Tiene MongoDB instalado y funcionando
- ✅ Base de datos `ace-putt` creada
- ✅ Datos iniciales insertados
- ✅ Servidor configurado para usar MongoDB
- ✅ Fallback a datos mock si MongoDB falla

**¡Puedes empezar a usar tu aplicación con MongoDB!** 🚀

