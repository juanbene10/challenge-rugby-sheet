# 🚀 Guía de Deploy - Ficha Digital de Partido Rugby

## 📋 Opciones de Deploy

### 🌟 Opción 1: Vercel (Recomendado - Más Fácil)

#### 1. Preparar el proyecto
```bash
# Instalar Vercel CLI
npm install -g vercel

# Construir el proyecto
npm run build
```

#### 2. Deploy automático
```bash
# Desde la carpeta del proyecto
vercel

# Seguir las instrucciones:
# - Link a proyecto existente o crear nuevo
# - Configurar variables de entorno si es necesario
# - Deploy automático
```

#### 3. Deploy desde GitHub (Recomendado)
1. Subir código a GitHub
2. Conectar repositorio en vercel.com
3. Deploy automático en cada push

---

### 🔥 Opción 2: Netlify

#### 1. Preparar el proyecto
```bash
npm run build
```

#### 2. Deploy manual
1. Ir a netlify.com
2. Arrastrar la carpeta `build/` 
3. ¡Deploy automático!

#### 3. Deploy desde GitHub
1. Conectar repositorio en Netlify
2. Configurar build command: `npm run build`
3. Publish directory: `build`
4. Deploy automático

---

### ☁️ Opción 3: Firebase Hosting

#### 1. Instalar Firebase CLI
```bash
npm install -g firebase-tools
```

#### 2. Inicializar proyecto
```bash
firebase login
firebase init hosting
```

#### 3. Configurar
```
? What do you want to use as your public directory? build
? Configure as a single-page app? Yes
? Set up automatic builds? No
```

#### 4. Deploy
```bash
npm run build
firebase deploy
```

---

### 🐳 Opción 4: Docker (Para servidor propio)

#### 1. Crear Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 2. Construir y ejecutar
```bash
docker build -t rugby-app .
docker run -p 80:80 rugby-app
```

---

## 🔧 Configuración del Backend

### Para deploy completo (Frontend + Backend):

#### Opción A: Railway (Recomendado)
1. Conectar repositorio en railway.app
2. Configurar variables de entorno
3. Deploy automático del backend

#### Opción B: Heroku
1. Crear Procfile en la raíz:
```
web: cd backend && npm start
```
2. Deploy desde GitHub o CLI

#### Opción C: Render
1. Conectar repositorio en render.com
2. Configurar build y start commands
3. Deploy automático

---

## 📝 Pasos Detallados para Vercel (Recomendado)

### 1. Preparar el proyecto
```bash
# Asegurar que el build funciona
npm run build

# Verificar que no hay errores
npm test
```

### 2. Subir a GitHub
```bash
# Inicializar git si no está
git init
git add .
git commit -m "Initial commit"

# Crear repositorio en GitHub y conectar
git remote add origin https://github.com/tu-usuario/rugby-app.git
git push -u origin main
```

### 3. Deploy en Vercel
1. Ir a vercel.com
2. Conectar con GitHub
3. Seleccionar el repositorio
4. Configurar:
   - Framework Preset: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

### 4. Variables de entorno (si es necesario)
En Vercel Dashboard:
- `REACT_APP_API_URL`: URL del backend (si usas backend separado)

### 5. Deploy automático
- Cada push a `main` = deploy automático
- Deploy previews en pull requests

---

## 🌐 URLs de Deploy

### Frontend (Solo)
- **Vercel**: `https://tu-app.vercel.app`
- **Netlify**: `https://tu-app.netlify.app`
- **Firebase**: `https://tu-proyecto.web.app`

### Backend + Frontend
- **Railway**: `https://tu-app.railway.app`
- **Render**: `https://tu-app.onrender.com`
- **Heroku**: `https://tu-app.herokuapp.com`

---

## 🔄 Deploy Automático con GitHub Actions

### Crear `.github/workflows/deploy.yml`
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    - name: Install dependencies
      run: npm install
    - name: Build
      run: npm run build
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🚨 Consideraciones Importantes

### 1. Variables de Entorno
- Configurar todas las variables necesarias
- No subir archivos `.env` con datos sensibles

### 2. Build Optimization
```bash
# Verificar tamaño del build
npm run build
du -sh build/
```

### 3. HTTPS
- Todas las plataformas modernas usan HTTPS automáticamente
- Configurar dominios personalizados si es necesario

### 4. Backend Separado
- Si usas backend separado, configurar CORS
- Actualizar URLs de API en el frontend

---

## 📱 Deploy para Móviles

### PWA (Progressive Web App)
1. Agregar `manifest.json`
2. Service Worker para funcionamiento offline
3. Instalable en dispositivos móviles

### React Native (Futuro)
- Usar Expo para deploy en app stores
- Compartir código con la web app

---

## 🎯 Recomendación Final

**Para empezar rápido:**
1. **Vercel** para el frontend (gratis, fácil, rápido)
2. **Railway** para el backend (gratis, fácil)
3. **GitHub** para control de versiones

**Para producción:**
1. **Vercel Pro** o **Netlify Pro** para el frontend
2. **Railway** o **Render** para el backend
3. **Dominio personalizado**
4. **Monitoreo y analytics**

¿Quieres que te ayude con algún deploy específico?
