@echo off
echo.
echo =========================================
echo   CENTRO PSICOLOGICO INTEGRAL GUEVARA
echo        Dashboard y Chat System
echo =========================================
echo.
echo Iniciando aplicacion...
echo.

cd /d "%~dp0front-end"

echo Verificando dependencias...
if not exist node_modules (
    echo Instalando dependencias...
    npm install
)

echo.
echo Iniciando servidor de desarrollo...
echo.
echo Dashboard URLs:
echo - Admin: http://localhost:5173/dashboard
echo - Secretaria: http://localhost:5173/dashboard  
echo - Psicologo: http://localhost:5173/dashboard
echo - Paciente: http://localhost:5173/dashboard
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

npm run dev

pause
