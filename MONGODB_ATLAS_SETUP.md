# 🗄️ Cómo Obtener tu Connection String de MongoDB Atlas

## 📋 PASO 1: Crear Cuenta en MongoDB Atlas

1. Ve a https://www.mongodb.com/cloud/atlas
2. Click en **"Try Free"** o **"Sign Up"**
3. Crea una cuenta (puedes usar Google, GitHub, o email)
4. Completa el registro

---

## 📋 PASO 2: Crear un Cluster Gratuito

1. Una vez dentro de MongoDB Atlas, verás un botón **"Build a Database"**
2. Elige el plan **FREE (M0)** - Es completamente gratuito
3. Selecciona un **Cloud Provider** (AWS, Google Cloud, o Azure)
4. Selecciona una **Region** (elige la más cercana a ti, ej: `us-east-1`)
5. Click en **"Create"**
6. Espera 1-3 minutos mientras se crea el cluster

---

## 📋 PASO 3: Configurar Usuario de Base de Datos

1. En la pantalla de "Security Quickstart", crea un usuario:
   - **Username**: (elige uno, ej: `ace-tennis-user`)
   - **Password**: (genera una contraseña segura o usa la que Atlas genera)
   - ⚠️ **IMPORTANTE**: Guarda esta contraseña, la necesitarás después
2. Click en **"Create Database User"**

---

## 📋 PASO 4: Configurar Network Access (Whitelist de IPs)

1. En la sección "Network Access", click en **"Add IP Address"**
2. Para desarrollo/producción, puedes:
   - **Opción 1**: Click en **"Allow Access from Anywhere"** (más fácil)
     - Esto agrega `0.0.0.0/0` a la whitelist
     - ⚠️ Menos seguro, pero funciona para todo
   - **Opción 2**: Agregar IPs específicas (más seguro)
     - Tu IP local para desarrollo
     - La IP de Render para producción
3. Click en **"Confirm"**

---

## 📋 PASO 5: Obtener el Connection String

1. En el dashboard de MongoDB Atlas, click en **"Connect"** (botón verde)
2. Elige **"Connect your application"**
3. Selecciona:
   - **Driver**: `Node.js`
   - **Version**: `5.5 or later` (o la más reciente)
4. Verás un connection string que se ve así:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Copia este connection string**

---

## 📋 PASO 6: Personalizar el Connection String

El connection string que copiaste tiene `<username>` y `<password>` como placeholders.

**Reemplázalos con:**
- `<username>` → El username que creaste en el PASO 3
- `<password>` → La contraseña que creaste en el PASO 3

**Ejemplo:**
Si tu connection string es:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

Y tu usuario es `ace-tennis-user` y tu contraseña es `MiPassword123!`, entonces será:
```
mongodb+srv://ace-tennis-user:MiPassword123!@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**Además, agrega el nombre de tu base de datos:**
```
mongodb+srv://ace-tennis-user:MiPassword123!@cluster0.xxxxx.mongodb.net/ace-tennis?retryWrites=true&w=majority
```

Nota: `/ace-tennis` es el nombre de la base de datos. Puedes usar cualquier nombre, pero usa `ace-tennis` para mantener consistencia.

---

## 📋 PASO 7: Probar la Conexión (Opcional)

Puedes probar que tu connection string funciona ejecutando:

```bash
cd server
node -e "
import('mongoose').then(async ({ default: mongoose }) => {
  try {
    await mongoose.connect('TU-CONNECTION-STRING-AQUI');
    console.log('✅ Conexión exitosa!');
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
});
"
```

---

## ✅ Resumen

Tu **MONGODB_URI** final debería verse así:
```
mongodb+srv://TU-USUARIO:TU-PASSWORD@cluster0.xxxxx.mongodb.net/ace-tennis?retryWrites=true&w=majority
```

**Componentes:**
- `TU-USUARIO` → El username que creaste
- `TU-PASSWORD` → La contraseña que creaste (si tiene caracteres especiales, puede que necesites codificarlos con URL encoding)
- `cluster0.xxxxx.mongodb.net` → Tu cluster de MongoDB Atlas
- `ace-tennis` → Nombre de tu base de datos

---

## 🔒 Seguridad

⚠️ **NUNCA compartas tu connection string públicamente** (no lo subas a GitHub sin usar variables de entorno).

En Render, usa **Environment Variables** para guardarlo de forma segura.

---

## 🆘 Si tienes problemas

### Error: "Authentication failed"
- Verifica que el username y password son correctos
- Asegúrate de que no hay espacios extra en el connection string

### Error: "IP not whitelisted"
- Ve a Network Access en MongoDB Atlas
- Agrega `0.0.0.0/0` para permitir todas las IPs (o agrega la IP específica de Render)

### Error: "Connection timeout"
- Verifica que tu cluster está activo (no en pausa)
- Verifica que la whitelist de IPs está configurada correctamente

