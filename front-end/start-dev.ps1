#!/usr/bin/env pwsh
Write-Host "Iniciando servidor de desarrollo..." -ForegroundColor Green
Set-Location "e:\keylogger\front-end"
Write-Host "Directorio actual: $(Get-Location)" -ForegroundColor Yellow
Write-Host "Ejecutando 'npm run dev'..." -ForegroundColor Green
& npm run dev
