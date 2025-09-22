#!/bin/bash

echo "🏉 Iniciando Ficha Digital de Partido - Rugby"
echo

echo "📦 Instalando dependencias del frontend..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Error al instalar dependencias del frontend"
    exit 1
fi

echo "📦 Instalando dependencias del backend..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Error al instalar dependencias del backend"
    exit 1
fi
cd ..

echo
echo "🚀 Iniciando servidor backend..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

echo "⏳ Esperando 3 segundos para que el backend inicie..."
sleep 3

echo "🚀 Iniciando aplicación frontend..."
npm start &
FRONTEND_PID=$!

echo
echo "✅ Aplicación iniciada correctamente!"
echo
echo "📊 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:3001/api"
echo "❤️  Salud del servidor: http://localhost:3001/api/health"
echo
echo "Presiona Ctrl+C para detener ambos servidores..."

# Función para limpiar procesos al salir
cleanup() {
    echo
    echo "🛑 Deteniendo servidores..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servidores detenidos"
    exit 0
}

# Capturar Ctrl+C
trap cleanup SIGINT SIGTERM

# Esperar indefinidamente
wait
