# 🏉 Demo - Ficha Digital de Partido Rugby

## 🎯 Objetivo de la Demo

Esta demostración te guiará paso a paso para crear y gestionar un partido completo de rugby usando la ficha digital.

## 🚀 Pasos para la Demo

### 1. Iniciar la Aplicación

#### Opción A: Script Automático (Recomendado)
```bash
# En Windows
start.bat

# En Linux/Mac
./start.sh
```

#### Opción B: Manual
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
npm install
npm start
```

### 2. Acceder a la Aplicación
- Abre tu navegador en: http://localhost:3000
- Verás la interfaz principal con el temporizador, marcador y gestión de equipos

### 3. Configurar el Partido

#### 3.1 Iniciar el Partido
1. Haz clic en **"▶️ Iniciar"** en el temporizador
2. Observa cómo comienza a contar el tiempo del primer tiempo (40 minutos)
3. El cronómetro mostrará el progreso visual

#### 3.2 Personalizar Equipos (Opcional)
1. Ve a **"Gestión de Equipos"**
2. Selecciona el **Equipo Azul** o **Equipo Rojo**
3. Puedes editar los nombres de los jugadores haciendo clic en ellos
4. Observa cómo se muestran los 15 titulares y 10 suplentes

### 4. Simular Acciones del Partido

#### 4.1 Marcar Puntuación
1. En el marcador, haz clic en **"Try (+5)"** para el Equipo Azul
2. Observa cómo aumenta el marcador y aparece en "Acciones Recientes"
3. Ahora haz clic en **"Conversión (+2)"** para el Equipo Azul
   - Nota: Solo está disponible porque acabamos de marcar un try
4. Marca un **"Penal (+3)"** para el Equipo Rojo
5. Observa el desglose de puntos por tipo en cada equipo

#### 4.2 Aplicar Tarjetas
1. En **"Gestión de Equipos"**, selecciona el **Equipo Azul**
2. Selecciona un jugador titular (por ejemplo, el jugador #1)
3. Haz clic en **🟨** para darle una tarjeta amarilla
4. Observa cómo aparece la tarjeta amarilla junto al jugador
5. El temporizador de 10 minutos comenzará automáticamente
6. Prueba dar una **🟥** tarjeta roja a otro jugador
   - Nota: Los jugadores con tarjeta roja no pueden recibir más tarjetas

#### 4.3 Realizar Cambios
1. En **"Gestión de Equipos"**, selecciona el **Equipo Rojo**
2. Haz clic en **"Cambiar"** en un jugador titular
3. Selecciona un jugador suplente (numerados 16-25)
4. Haz clic en **"Entra"** para completar el cambio
5. Observa cómo el jugador titular se convierte en suplente y viceversa
6. Verifica que el contador de cambios aumenta (1/5)
7. Repite el proceso hasta alcanzar el límite de 5 cambios

### 5. Gestionar el Tiempo

#### 5.1 Pausar/Reanudar
1. Haz clic en **"⏸️ Pausar"** para detener el cronómetro
2. Haz clic en **"▶️ Iniciar"** para reanudar
3. Útil para pausas por lesiones o tiempo muerto

#### 5.2 Primer Tiempo a Descanso
1. Deja que el cronómetro llegue a 40 minutos (o usa el botón de desarrollo)
2. Se reproducirá una alarma sonora
3. El cronómetro mostrará "Descanso"
4. Haz clic en **"Comenzar 2do Tiempo"** para continuar

#### 5.3 Segundo Tiempo
1. El cronómetro reinicia y muestra "2do Tiempo"
2. Continúa marcando puntos, tarjetas y cambios
3. Al llegar a los 80 minutos totales, se marcará como "Finalizado"

#### 5.4 Finalizar Partido Manualmente
1. En cualquier momento del partido, puedes hacer clic en **"🏁 Finalizar Partido"**
2. Aparecerá una confirmación para evitar finalizaciones accidentales
3. El partido se marcará como finalizado y se reproducirá una alarma
4. Esta función es útil para:
   - Partidos suspendidos por mal tiempo
   - Lesiones graves que impiden continuar
   - Acuerdos entre equipos
   - Emergencias

### 6. Funciones Avanzadas

#### 6.1 Guardar Partido
1. Haz clic en **"💾 Guardar"** en cualquier momento
2. El partido se guardará automáticamente en el navegador

#### 6.2 Historial de Partidos
1. Haz clic en **"📚 Historial"**
2. Ve todos los partidos guardados
3. Haz clic en un partido para cargarlo
4. Observa la información de fecha, equipos y tiempo

#### 6.3 Exportar/Importar
1. En el historial, haz clic en **"📤 Exportar JSON"**
2. Se descargará un archivo JSON con todos los partidos
3. Haz clic en **"📄 Exportar PDFs"** para generar PDFs de todos los partidos
4. Haz clic en **"📥 Importar"** para cargar partidos desde un archivo

#### 6.4 Exportar a PDF
1. **PDF Completo**: Genera un reporte detallado con toda la información del partido
2. **PDF Resumen**: Genera un reporte conciso con lo esencial
3. Los PDFs incluyen:
   - Información del partido y fecha
   - Marcador final y desglose de puntos
   - Cronología de puntuaciones por minuto
   - Lista de tarjetas aplicadas
   - Cambios de jugadores realizados
   - Alineaciones finales
   - Nota si fue finalizado manualmente

### 7. Funciones del Backend (Opcional)

#### 7.1 Verificar API
1. Abre: http://localhost:3001/api/health
2. Deberías ver el estado del servidor

#### 7.2 Ver Partidos en API
1. Abre: http://localhost:3001/api/partidos
2. Verás todos los partidos en formato JSON

#### 7.3 Estadísticas
1. Abre: http://localhost:3001/api/estadisticas
2. Verás estadísticas generales de todos los partidos

## 🎮 Escenario de Demo Completo

### Partido de Ejemplo: Azul vs Rojo

**Minuto 5**: Try del Equipo Azul (+5)
**Minuto 6**: Conversión exitosa del Equipo Azul (+2)
**Minuto 12**: Tarjeta amarilla para jugador #3 del Equipo Rojo
**Minuto 15**: Penal del Equipo Rojo (+3)
**Minuto 18**: Cambio en Equipo Azul (jugador #8 sale, #16 entra)
**Minuto 22**: Try del Equipo Rojo (+5)
**Minuto 25**: Conversión fallida (no se marca)
**Minuto 30**: Tarjeta roja para jugador #5 del Equipo Azul
**Minuto 35**: Cambio en Equipo Rojo (jugador #10 sale, #17 entra)
**Minuto 40**: Finaliza el primer tiempo (Alarma)

**Descanso**: 15 minutos

**Minuto 41**: Comienza el segundo tiempo
**Minuto 50**: Try del Equipo Azul (+5)
**Minuto 55**: Penal del Equipo Rojo (+3)
**Minuto 60**: Cambio en Equipo Azul (jugador #2 sale, #18 entra)
**Minuto 70**: Tarjeta amarilla para jugador #7 del Equipo Rojo
**Minuto 75**: Try del Equipo Rojo (+5)
**Minuto 80**: Finaliza el partido

### Resultado Final:
- **Equipo Azul**: 17 puntos (2 tries, 1 conversión)
- **Equipo Rojo**: 16 puntos (2 tries, 2 penales)
- **Cambios**: Azul (2/5), Rojo (1/5)
- **Tarjetas**: 2 amarillas, 1 roja

## 🔧 Comandos de Desarrollo

### Para Desarrollo Frontend
```bash
npm start          # Inicia en modo desarrollo
npm run build      # Construye para producción
npm test           # Ejecuta pruebas
```

### Para Desarrollo Backend
```bash
cd backend
npm run dev        # Inicia con nodemon (recarga automática)
npm start          # Inicia en modo producción
```

### Para Verificar Instalación
```bash
# Verificar Node.js
node --version

# Verificar npm
npm --version

# Verificar dependencias
npm list --depth=0
```

## 🐛 Solución de Problemas

### Problema: Puerto 3000 ocupado
```bash
# Cambiar puerto del frontend
set PORT=3001 && npm start
```

### Problema: Puerto 3001 ocupado (Backend)
```bash
# Cambiar puerto del backend
cd backend
set PORT=3002 && npm run dev
```

### Problema: Errores de CORS
- Verificar que el backend esté ejecutándose en el puerto correcto
- Verificar la variable REACT_APP_API_URL

### Problema: No se guardan los datos
- Verificar que el navegador permita localStorage
- Verificar la consola del navegador para errores

## 📱 Uso en Móvil

La aplicación es completamente responsiva:
1. Abre la URL en tu móvil
2. La interfaz se adaptará automáticamente
3. Todas las funciones están disponibles
4. Ideal para usar durante partidos reales

## 🎯 Próximos Pasos

Después de esta demo, puedes:
1. Personalizar los nombres de equipos y jugadores
2. Experimentar con diferentes escenarios
3. Exportar partidos para análisis
4. Usar la aplicación en partidos reales
5. Contribuir con mejoras al código

¡Disfruta gestionando tus partidos de rugby! 🏉
