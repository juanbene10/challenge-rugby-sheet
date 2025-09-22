@echo off
echo 🏉 Iniciando Ficha Digital de Partido - Rugby
echo.

echo 📦 Instalando dependencias del frontend...
call npm install
if errorlevel 1 (
    echo ❌ Error al instalar dependencias del frontend
    pause
    exit /b 1
)

echo 📦 Instalando dependencias del backend...
cd backend
call npm install
if errorlevel 1 (
    echo ❌ Error al instalar dependencias del backend
    pause
    exit /b 1
)
cd ..

echo.
echo 🚀 Iniciando servidor backend...
start "Backend - Rugby API" cmd /k "cd backend && npm run dev"

echo ⏳ Esperando 3 segundos para que el backend inicie...
timeout /t 3 /nobreak > nul

echo 🚀 Iniciando aplicación frontend...
start "Frontend - Rugby App" cmd /k "npm start"

echo.
echo ✅ Aplicación iniciada correctamente!
echo.
echo 📊 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:3001/api
echo ❤️  Salud del servidor: http://localhost:3001/api/health
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause > nul
