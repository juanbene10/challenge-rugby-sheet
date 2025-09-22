# 🏉 Ficha Digital de Partido - Rugby

Una aplicación web moderna para la gestión digital de partidos de rugby, desarrollada con React, TypeScript y Node.js.

## ✨ Características

### 🏃‍♂️ Gestión de Equipos
- **2 equipos**: AZUL y ROJO
- **15 jugadores titulares + 10 suplentes** por equipo
- **Máximo 5 cambios** por equipo durante el partido
- Gestión visual de jugadores con sus posiciones

### ⏱️ Temporizador de Partido
- **2 tiempos de 40 minutos** cada uno
- **15 minutos de descanso** entre tiempos
- Temporizador visual con barra de progreso
- **Alarmas sonoras** al finalizar cada tiempo
- Controles de pausa/reanudación
- Estado del partido en tiempo real

### 🏆 Sistema de Puntuación
- **Try**: 5 puntos
- **Conversión**: 2 puntos (solo disponible tras un try reciente)
- **Penal**: 3 puntos
- Marcador en tiempo real con desglose por tipo de puntuación
- Historial de acciones recientes

### 🟨🟥 Sistema de Tarjetas
- **Tarjeta Amarilla**: 10 minutos de expulsión temporal
- **Tarjeta Roja**: Expulsión permanente
- Temporizador visual para tarjetas amarillas
- Alarma cuando expira una tarjeta amarilla
- Gestión por jugador individual

### 💾 Almacenamiento y Persistencia
- **Almacenamiento local** con JSON (localStorage)
- **Backend API** para persistencia en servidor
- **Exportar/Importar** partidos
- **Historial** de partidos guardados
- **Sincronización** automática con servidor

### 📱 Interfaz Moderna
- **Diseño responsivo** para móviles y escritorio
- **Interfaz intuitiva** y fácil de usar
- **Animaciones suaves** y transiciones
- **Tema visual** profesional para rugby

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### 1. Clonar el Repositorio
\`\`\`bash
git clone <url-del-repositorio>
cd ficha-partido-rugby
\`\`\`

### 2. Instalar Dependencias del Frontend
\`\`\`bash
npm install
\`\`\`

### 3. Instalar Dependencias del Backend
\`\`\`bash
cd backend
npm install
cd ..
\`\`\`

### 4. Configurar Variables de Entorno
Crear un archivo `.env` en la raíz del proyecto:
\`\`\`env
REACT_APP_API_URL=http://localhost:3001/api
\`\`\`

### 5. Iniciar el Backend
\`\`\`bash
cd backend
npm run dev
# O para producción:
npm start
\`\`\`

### 6. Iniciar el Frontend
En una nueva terminal:
\`\`\`bash
npm start
\`\`\`

La aplicación estará disponible en:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api

## 📖 Uso de la Aplicación

### 🎮 Iniciar un Nuevo Partido
1. Haz clic en "🆕 Nuevo Partido"
2. Los equipos se crearán automáticamente con jugadores predeterminados
3. Haz clic en "▶️ Iniciar" para comenzar el cronómetro

### ⏰ Control del Temporizador
- **▶️ Iniciar**: Comienza el cronómetro del partido
- **⏸️ Pausar**: Pausa el cronómetro
- **Comenzar 2do Tiempo**: Avanza al segundo tiempo tras el descanso

### 🏆 Marcar Puntuación
1. Selecciona el equipo (AZUL o ROJO)
2. Haz clic en el tipo de puntuación:
   - **Try (+5)**: Para marcar un try
   - **Conversión (+2)**: Solo disponible tras un try reciente
   - **Penal (+3)**: Para penales

### 🔄 Realizar Cambios
1. Ve a la sección "Gestión de Equipos"
2. Selecciona el equipo a modificar
3. Haz clic en "Cambiar" en un jugador titular
4. Selecciona el jugador suplente que entra
5. El sistema validará automáticamente el cambio

### 🟨🟥 Aplicar Tarjetas
1. En "Gestión de Equipos", selecciona un jugador
2. Haz clic en:
   - **🟨**: Para tarjeta amarilla (10 min de expulsión)
   - **🟥**: Para tarjeta roja (expulsión permanente)
3. El temporizador se gestionará automáticamente

### 💾 Guardar y Cargar Partidos
- **💾 Guardar**: Guarda el partido actual
- **📚 Historial**: Ve partidos guardados anteriores
- **📤 Exportar**: Descarga todos los partidos como JSON
- **📥 Importar**: Carga partidos desde un archivo JSON

## 🏗️ Arquitectura del Proyecto

### Frontend (React + TypeScript)
\`\`\`
src/
├── components/          # Componentes React
│   ├── App.tsx         # Componente principal
│   ├── Timer/          # Temporizador del partido
│   ├── Scoreboard/     # Marcador y puntuación
│   └── TeamManagement/ # Gestión de equipos
├── hooks/              # Hooks personalizados
│   └── usePartido.ts   # Hook principal del partido
├── services/           # Servicios y utilidades
│   ├── storageService.ts    # Almacenamiento local
│   ├── apiService.ts        # Comunicación con backend
│   ├── teamService.ts       # Gestión de equipos
│   ├── scoringService.ts    # Sistema de puntuación
│   ├── cardService.ts       # Sistema de tarjetas
│   └── timerService.ts      # Temporizador
└── types/              # Definiciones TypeScript
    └── index.ts        # Interfaces y tipos
\`\`\`

### Backend (Node.js + Express)
\`\`\`
backend/
├── server.js           # Servidor principal
├── package.json        # Dependencias del backend
└── data/               # Datos persistentes
    └── partidos.json   # Archivo de partidos
\`\`\`

## 🔧 API del Backend

### Endpoints Disponibles

#### Partidos
- \`GET /api/partidos\` - Obtener todos los partidos
- \`GET /api/partidos/:id\` - Obtener un partido específico
- \`POST /api/partidos\` - Crear un nuevo partido
- \`PUT /api/partidos/:id\` - Actualizar un partido
- \`DELETE /api/partidos/:id\` - Eliminar un partido

#### Estadísticas
- \`GET /api/estadisticas\` - Obtener estadísticas generales

#### Importar/Exportar
- \`POST /api/exportar\` - Exportar todos los partidos
- \`POST /api/importar\` - Importar partidos

#### Salud del Servidor
- \`GET /api/health\` - Verificar estado del servidor

## 🎯 Características Técnicas

### Tecnologías Utilizadas
- **Frontend**: React 18, TypeScript, CSS3
- **Backend**: Node.js, Express.js
- **Almacenamiento**: JSON (localStorage + archivos)
- **Comunicación**: REST API
- **Estilos**: CSS moderno con gradientes y animaciones

### Funcionalidades Avanzadas
- **Sincronización automática** con el servidor
- **Almacenamiento offline** con localStorage
- **Notificaciones del navegador** para alarmas
- **Diseño responsivo** para todos los dispositivos
- **Validaciones** en tiempo real
- **Manejo de errores** robusto

## 🚀 Despliegue

### Frontend (Netlify/Vercel)
\`\`\`bash
npm run build
# Subir la carpeta 'build' al servicio de hosting
\`\`\`

### Backend (Heroku/Railway)
\`\`\`bash
cd backend
# Configurar variables de entorno en el servicio
# Deploy automático desde GitHub
\`\`\`

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (\`git checkout -b feature/nueva-funcionalidad\`)
3. Commit tus cambios (\`git commit -m 'Agregar nueva funcionalidad'\`)
4. Push a la rama (\`git push origin feature/nueva-funcionalidad\`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo \`LICENSE\` para más detalles.

## 🏉 Sobre Rugby

Esta aplicación está diseñada siguiendo las reglas oficiales del rugby:
- **Duración**: 2 tiempos de 40 minutos
- **Puntuación**: Try (5), Conversión (2), Penal (3)
- **Cambios**: Máximo 5 por equipo
- **Tarjetas**: Amarilla (10 min), Roja (expulsión)

¡Disfruta gestionando tus partidos de rugby de manera digital! 🏉
