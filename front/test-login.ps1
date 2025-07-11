Write-Host "🔍 Verificando credenciales de login..." -ForegroundColor Cyan
Write-Host "================================"

$loginData = @{
    email = "admin@psicologiaguevara.com"
    password = "123456"
} | ConvertTo-Json

try {
    Write-Host "Probando login con admin@psicologiaguevara.com..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method Post -Body $loginData -ContentType "application/json"
    
    Write-Host "✅ Login exitoso!" -ForegroundColor Green
    Write-Host "   Token: $($response.token.Substring(0, 50))..." -ForegroundColor Cyan
    Write-Host "   Usuario: $($response.usuario.nombre) $($response.usuario.apellido)" -ForegroundColor Cyan
    Write-Host "   Rol: $($response.usuario.rol)" -ForegroundColor Cyan
    Write-Host "   Email: $($response.usuario.email)" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Error en login:" -ForegroundColor Red
    Write-Host "   $($_.Exception.Message)" -ForegroundColor Red
    
    # Probar con credenciales alternativas
    Write-Host ""
    Write-Host "Probando con credenciales alternativas..." -ForegroundColor Yellow
    
    $loginData2 = @{
        email = "admin@admin.com"
        password = "admin123"
    } | ConvertTo-Json
    
    try {
        $response2 = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method Post -Body $loginData2 -ContentType "application/json"
        Write-Host "✅ Login exitoso con credenciales alternativas!" -ForegroundColor Green
        Write-Host "   Token: $($response2.token.Substring(0, 50))..." -ForegroundColor Cyan
    } catch {
        Write-Host "❌ También falló con credenciales alternativas" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "================================"
Write-Host "Verificación completada" -ForegroundColor Cyan
