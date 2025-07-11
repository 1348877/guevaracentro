# 🔍 Diagnóstico: Error "Sesión expirada" en Dashboard

## 🚨 Problema Identificado
Cuando te logeas como admin, aparece "Error al cargar dashboard - Sesión expirada" inmediatamente.

## 🎯 Posibles Causas

### 1. **Backend no está ejecutándose**
- El servidor backend no está iniciado en el puerto 3001
- **Solución**: Ejecuta `cd backend && npm start`

### 2. **Problema de configuración de URL**
- La variable `VITE_API_URL` no está configurada correctamente
- **Solución**: Verifica que el frontend apunte a `http://localhost:3001/api`

### 3. **Token no se está enviando correctamente**
- El token se guarda pero no se envía en las peticiones
- **Solución**: Verificar headers de autorización

### 4. **Endpoint de dashboard no existe**
- El backend no tiene implementado `/api/dashboard`
- **Solución**: Verificar que existe el controlador

### 5. **Error de CORS**
- El backend no permite peticiones desde localhost:5173
- **Solución**: Configurar CORS en el backend

## 🔧 Soluciones a Probar

### Solución 1: Verificar Backend
```bash
# Navegar al directorio backend
cd backend

# Iniciar el servidor
npm start
```

### Solución 2: Verificar Variables de Entorno
Crear archivo `.env` en `/front-end/`:
```
VITE_API_URL=http://localhost:3001/api
```

### Solución 3: Verificar Manualmente
1. Abre las herramientas de desarrollo (F12)
2. Ve a la pestaña "Network"
3. Intenta cargar el dashboard
4. Verifica qué peticiones se están haciendo y cuáles fallan

### Solución 4: Probar Login Manual
```javascript
// En la consola del navegador
localStorage.getItem('token')
localStorage.getItem('user')
```

### Solución 5: Verificar Endpoint
Abre en otra pestaña: `http://localhost:3001/api/health`

## 📋 Información de Diagnóstico Mejorada

He actualizado el dashboard para mostrar más información cuando hay error:
- ✅ Presencia del token
- ✅ Email del usuario
- ✅ URL del backend
- ✅ Rol del usuario
- ✅ Botón para recargar página

## 🎯 Siguiente Paso
1. **Refresca la página** del dashboard (F5)
2. **Revisa la información de diagnóstico** que ahora aparece
3. **Verifica** si el backend está ejecutándose
4. **Comprueba** la consola del navegador para errores adicionales

---

## 🚀 Scripts de Verificación
He creado scripts para verificar el backend:
- `test-backend.ps1` - Script de PowerShell para Windows
- `test-backend.sh` - Script de Bash para Linux/Mac

**Ejecuta**: `cd front-end && powershell -ExecutionPolicy Bypass -File .\test-backend.ps1`
