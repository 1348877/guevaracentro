Write-Host "🔍 Verificando estado del backend..." -ForegroundColor Cyan
Write-Host "================================"

# Verificar si el backend está ejecutándose
Write-Host "1. Verificando puerto 3001..." -ForegroundColor Yellow
$port = Test-NetConnection -ComputerName localhost -Port 3001 -InformationLevel Quiet
if ($port) {
    Write-Host "✅ Puerto 3001 está abierto" -ForegroundColor Green
} else {
    Write-Host "❌ Puerto 3001 no está disponible" -ForegroundColor Red
    Write-Host "   Ejecuta: cd backend && npm start" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "2. Probando endpoint de salud..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/health" -Method Get
    Write-Host "✅ Endpoint de salud respondió correctamente" -ForegroundColor Green
} catch {
    Write-Host "❌ Error al conectar con endpoint de salud: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "3. Probando endpoint de login..." -ForegroundColor Yellow
try {
    $loginData = @{
        email = "admin@admin.com"
        password = "admin123"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method Post -Body $loginData -ContentType "application/json"
    Write-Host "✅ Login exitoso para admin@admin.com" -ForegroundColor Green
    Write-Host "   Token recibido: $($response.token.Substring(0, 20))..." -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error en login: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "4. Verificando estructura de backend..." -ForegroundColor Yellow
if (Test-Path "..\backend\src\controllers\") {
    Write-Host "✅ Directorio de controladores encontrado" -ForegroundColor Green
    Get-ChildItem "..\backend\src\controllers\" | ForEach-Object { Write-Host "   - $($_.Name)" -ForegroundColor Cyan }
} else {
    Write-Host "❌ No se encontró directorio de controladores" -ForegroundColor Red
}

Write-Host ""
Write-Host "================================"
Write-Host "Diagnóstico completado" -ForegroundColor Cyan
