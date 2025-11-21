# 🚀 Guía de Despliegue - Ace Tennis

Esta guía te ayudará a desplegar tu proyecto completo:
- **Frontend** (landing.html) → **Vercel**
- **Backend** (server/) → **Render**

---

## 📋 PASO 1: Preparar el Backend para Render

### 1.1 Verificar que tienes MongoDB Atlas

Si no tienes MongoDB Atlas configurado:
1. Ve a https://www.mongodb.com/cloud/atlas
2. Crea una cuenta gratuita
3. Crea un cluster gratuito
4. Obtén tu connection string (ejemplo: `mongodb+srv://usuario:password@cluster.mongodb.net/ace-tennis?retryWrites=true&w=majority`)

### 1.2 Variables de Entorno Necesarias

Necesitarás estas variables en Render:
- `MONGODB_URI` - Tu connection string de MongoDB Atlas
- `RAPIDAPI_KEY` - Tu clave de RapidAPI (la que ya tienes)
- `JWT_SECRET` - Una clave secreta aleatoria (puede ser cualquier string largo)
- `NODE_ENV` - Debe ser `production`

---

## 📋 PASO 2: Desplegar Backend en Render

### 2.1 Crear cuenta en Render
1. Ve a https://render.com
2. Crea una cuenta (puedes usar GitHub para login rápido)

### 2.2 Crear nuevo Web Service
1. En el dashboard de Render, click en **"New +"** → **"Web Service"**
2. Conecta tu repositorio de GitHub: `Mati05-1/Proyecto_Final_DesarrolloWeb`
3. Configura el servicio:
   - **Name**: `ace-tennis-backend` (o el nombre que prefieras)
   - **Region**: Elige la más cercana a ti
   - **Branch**: `main`
   - **Root Directory**: `server` ⚠️ **IMPORTANTE: Debe ser `server`**
   - **Runtime**: `Node`
   - **Build Command**: `npm install` (o déjalo vacío, Render lo detecta automáticamente)
   - **Start Command**: `npm start`

### 2.3 Configurar Variables de Entorno en Render
En la sección **"Environment Variables"** de tu servicio, agrega:

```
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/ace-tennis?retryWrites=true&w=majority
RAPIDAPI_KEY=1eed17060amshcf5c7ba23ab9670p18f15ejsn9b4717e52e26
JWT_SECRET=tu-clave-secreta-super-segura-aqui-cambiala
NODE_ENV=production
```

⚠️ **IMPORTANTE**: 
- Reemplaza `MONGODB_URI` con tu connection string real de MongoDB Atlas
- Reemplaza `JWT_SECRET` con una clave secreta aleatoria (puede ser cualquier string largo)

### 2.4 Desplegar
1. Click en **"Create Web Service"**
2. Render comenzará a desplegar tu backend
3. Espera 2-5 minutos hasta que veas "Your service is live"
4. **Copia la URL** que Render te da (ejemplo: `https://ace-tennis-backend.onrender.com`)

---

## 📋 PASO 3: Actualizar Frontend con URL del Backend

### 3.1 Actualizar landing.html
Necesitas actualizar la línea 1272 de `landing.html` con la URL de tu backend de Render.

**Busca esta línea:**
```javascript
const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5001/api'
    : (window.API_BASE_URL || 'https://tu-backend-url.railway.app/api')
```

**Cámbiala por:**
```javascript
const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5001/api'
    : 'https://TU-BACKEND-URL.onrender.com/api' // Reemplaza TU-BACKEND-URL con tu URL real
```

Ejemplo si tu backend es `https://ace-tennis-backend.onrender.com`:
```javascript
const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5001/api'
    : 'https://ace-tennis-backend.onrender.com/api'
```

### 3.2 Hacer commit y push
```bash
git add landing.html
git commit -m "Update backend URL for production"
git push
```

---

## 📋 PASO 4: Desplegar Frontend en Vercel

### 4.1 Crear cuenta en Vercel
1. Ve a https://vercel.com
2. Crea una cuenta (puedes usar GitHub para login rápido)

### 4.2 Importar Proyecto
1. En el dashboard de Vercel, click en **"Add New..."** → **"Project"**
2. Importa tu repositorio: `Mati05-1/Proyecto_Final_DesarrolloWeb`
3. Configura el proyecto:
   - **Project Name**: `ace-tennis` (o el nombre que prefieras, solo minúsculas, números, guiones y puntos)
   - **Framework Preset**: Deja en "Other" o "Other"
   - **Root Directory**: `.` (raíz del proyecto)
   - **Build Command**: Déjalo vacío (no necesitas build)
   - **Output Directory**: `.` (raíz del proyecto)

### 4.3 Verificar vercel.json
Asegúrate de que `vercel.json` existe y tiene este contenido:
```json
{
  "buildCommand": null,
  "outputDirectory": ".",
  "cleanUrls": false,
  "rewrites": [
    {
      "source": "/",
      "destination": "/landing.html"
    }
  ]
}
```

### 4.4 Desplegar
1. Click en **"Deploy"**
2. Vercel comenzará a desplegar tu frontend
3. Espera 1-2 minutos hasta que veas "Ready"
4. **Copia la URL** que Vercel te da (ejemplo: `https://ace-tennis.vercel.app`)

---

## ✅ PASO 5: Verificar que Todo Funciona

### 5.1 Verificar Backend
1. Abre en tu navegador: `https://TU-BACKEND-URL.onrender.com/api/health`
2. Deberías ver: `{"status":"OK","timestamp":"...","uptime":...}`

### 5.2 Verificar Frontend
1. Abre en tu navegador: `https://TU-FRONTEND-URL.vercel.app`
2. Deberías ver tu landing page
3. Intenta registrarte o hacer login
4. Verifica que los rankings, apuestas, etc. funcionen

### 5.3 Si hay errores CORS
Si ves errores de CORS en la consola del navegador:
1. Ve a Render → Tu servicio → Settings → Environment Variables
2. Asegúrate de que `NODE_ENV=production` está configurado
3. Reinicia el servicio en Render (Manual Deploy → Clear build cache & deploy)

---

## 🔧 Troubleshooting

### Backend no inicia en Render
- Verifica que `Root Directory` está configurado como `server`
- Verifica que todas las variables de entorno están configuradas
- Revisa los logs en Render para ver el error específico

### Frontend no carga
- Verifica que `vercel.json` existe y está correcto
- Verifica que `landing.html` está en la raíz del proyecto
- Revisa los logs en Vercel

### CORS errors
- Asegúrate de que `NODE_ENV=production` está en Render
- Verifica que la URL del backend en `landing.html` es correcta (sin `/api` al final en la base URL)

### MongoDB connection errors
- Verifica que tu connection string de MongoDB Atlas es correcto
- Asegúrate de que tu IP está en la whitelist de MongoDB Atlas (o permite todas las IPs: `0.0.0.0/0`)

---

## 📝 Resumen de URLs

Después del despliegue, tendrás:
- **Frontend**: `https://TU-PROYECTO.vercel.app`
- **Backend**: `https://TU-BACKEND.onrender.com`
- **API Base URL**: `https://TU-BACKEND.onrender.com/api`

¡Listo! Tu proyecto estará completamente desplegado y funcionando. 🎉

