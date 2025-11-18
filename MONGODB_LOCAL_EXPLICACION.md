# 🗄️ MongoDB Local - Explicación Completa

## ¿Qué es MongoDB Local?

**MongoDB Local** significa instalar MongoDB directamente en tu computadora (tu Mac), en lugar de usar un servicio en la nube como MongoDB Atlas.

## 📊 Comparación

| Aspecto | MongoDB Local | MongoDB Atlas |
|--------|---------------|---------------|
| **Ubicación** | Tu computadora | Internet (nube) |
| **Instalación** | Requiere instalar | Solo crear cuenta |
| **Costo** | Gratis | Gratis (hasta 512MB) |
| **Velocidad** | Muy rápida (sin internet) | Depende de internet |
| **Configuración** | Más compleja | Más simple |
| **Ideal para** | Desarrollo local | Producción/Desarrollo |

## 🚀 Cómo Instalar MongoDB Local en macOS

### Paso 1: Instalar Homebrew (si no lo tienes)

```bash
# Verificar si tienes Homebrew
brew --version

# Si no lo tienes, instálalo:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Paso 2: Instalar MongoDB

```bash
# Instalar MongoDB Community Edition
brew tap mongodb/brew
brew install mongodb-community
```

### Paso 3: Iniciar MongoDB

```bash
# Iniciar MongoDB como servicio (se inicia automáticamente al encender tu Mac)
brew services start mongodb-community

# O iniciar manualmente (solo esta vez)
mongod --config /opt/homebrew/etc/mongod.conf
```

### Paso 4: Verificar que Funciona

```bash
# Abrir la consola de MongoDB
mongosh

# Deberías ver algo como:
# Current Mongosh Log ID: ...
# Connecting to: mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000
# Using MongoDB: 7.x.x
# Using Mongosh: x.x.x
```

## 🔧 Cómo Funciona

1. **MongoDB se ejecuta en tu Mac** en el puerto `27017` (por defecto)
2. **Los datos se guardan** en tu disco duro (normalmente en `/opt/homebrew/var/mongodb`)
3. **Tu aplicación Node.js** se conecta a `mongodb://localhost:27017/ace-putt`
4. **No necesitas internet** para que funcione

## ✅ Ventajas de MongoDB Local

1. **Rápido**: No depende de internet
2. **Gratis**: Sin límites de almacenamiento
3. **Privado**: Todos los datos están en tu computadora
4. **Control total**: Puedes configurarlo como quieras
5. **Ideal para desarrollo**: Pruebas rápidas sin esperar conexión

## ⚠️ Desventajas

1. **Solo en tu Mac**: No puedes acceder desde otros dispositivos
2. **Requiere instalación**: Más pasos que Atlas
3. **Mantenimiento**: Tú debes actualizarlo y mantenerlo
4. **No para producción**: No es ideal para apps que otros usan

## 📝 Configuración en tu Proyecto

Una vez instalado MongoDB local, tu servidor se conectará automáticamente a:

```
mongodb://localhost:27017/ace-putt
```

**No necesitas agregar nada a `.env`** porque esta es la URL por defecto.

Si quieres cambiarla, agrega a `server/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/ace-putt
```

## 🎯 Comandos Útiles

```bash
# Iniciar MongoDB
brew services start mongodb-community

# Detener MongoDB
brew services stop mongodb-community

# Ver estado de MongoDB
brew services list

# Abrir consola de MongoDB
mongosh

# Ver bases de datos
show dbs

# Usar tu base de datos
use ace-putt

# Ver colecciones (tablas)
show collections

# Ver documentos en una colección
db.matches.find()
```

## 🔍 Verificar que tu App se Conecta

Cuando inicies tu servidor (`node server.js`), deberías ver:

```
✅ MongoDB conectado: localhost:27017
   Base de datos: ace-putt
```

Si ves esto, ¡todo está funcionando! 🎉

## 🆚 ¿Cuándo Usar Local vs Atlas?

### Usa MongoDB Local si:
- ✅ Estás desarrollando en tu computadora
- ✅ Quieres velocidad máxima
- ✅ No necesitas compartir datos con otros
- ✅ Quieres aprender MongoDB

### Usa MongoDB Atlas si:
- ✅ Quieres desplegar tu app en producción
- ✅ Necesitas acceso desde múltiples lugares
- ✅ No quieres instalar nada en tu Mac
- ✅ Quieres que otros puedan usar tu app

## 💡 Recomendación

Para tu proyecto:
- **Desarrollo**: Usa MongoDB Local (más rápido, gratis, sin límites)
- **Producción**: Usa MongoDB Atlas (accesible desde internet)

## 🐛 Solución de Problemas

### Error: "MongoDB no se conecta"
```bash
# Verificar que MongoDB está corriendo
brew services list

# Si no está corriendo:
brew services start mongodb-community
```

### Error: "Puerto 27017 en uso"
```bash
# Ver qué está usando el puerto
lsof -i :27017

# Detener MongoDB
brew services stop mongodb-community
```

### Error: "mongosh no encontrado"
```bash
# Reinstalar MongoDB
brew reinstall mongodb-community
```

## 📚 Recursos

- [Documentación oficial de MongoDB](https://docs.mongodb.com/)
- [MongoDB Community Edition](https://www.mongodb.com/try/download/community)
- [Guía de instalación en macOS](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)

---

**En resumen**: MongoDB Local es instalar MongoDB en tu Mac para desarrollo rápido y sin depender de internet. Es la mejor opción para aprender y desarrollar. 🚀

