#!/bin/bash

echo "🔍 Verificando estado del backend..."
echo "================================"

# Verificar si el backend está ejecutándose
echo "1. Verificando puerto 3001..."
nc -z localhost 3001
if [ $? -eq 0 ]; then
    echo "✅ Puerto 3001 está abierto"
else
    echo "❌ Puerto 3001 no está disponible"
    echo "   Ejecuta: cd backend && npm start"
    exit 1
fi

echo ""
echo "2. Probando endpoint de salud..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/health
echo ""

echo ""
echo "3. Probando endpoint de login..."
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@admin.com","password":"admin123"}' \
  -s | head -c 100
echo ""

echo ""
echo "4. Verificando estructura de backend..."
ls -la ../backend/src/controllers/
echo ""

echo "================================"
echo "Diagnóstico completado"
