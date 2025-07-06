# 📋 Guía de Configuración de Google OAuth

## ⚡ Pasos para configurar Google OAuth REAL

### 1. 🌐 Configurar Google Cloud Console

1. **Ve a:** https://console.cloud.google.com/
2. **Crear proyecto nuevo** o seleccionar uno existente
3. **Habilitar APIs necesarias:**
   - Google+ API
   - Google People API
   - Google Identity

### 2. 🔑 Crear credenciales OAuth 2.0

1. **Ir a:** `APIs y servicios > Credenciales`
2. **Hacer clic en:** `+ CREAR CREDENCIALES > ID de cliente de OAuth 2.0`
3. **Tipo de aplicación:** `Aplicación web`
4. **Nombre:** `Centro Psicológico Guevara - Web`

### 3. 🌍 Configurar URLs autorizadas

**Orígenes de JavaScript autorizados:**
```
http://localhost:3000
http://localhost:5173
http://127.0.0.1:3000
http://127.0.0.1:5173
https://tu-dominio-produccion.com
```

**URIs de redirección autorizados:**
```
http://localhost:3000/
http://localhost:5173/
http://127.0.0.1:3000/
http://127.0.0.1:5173/
https://tu-dominio-produccion.com/
```

### 4. 📝 Copiar Client ID

1. **Copiar el Client ID** que se genera (algo como: `123456789-abc123def456.apps.googleusercontent.com`)
2. **Reemplazar en el archivo:** `front-end/.env`

```env
# Reemplaza TU_CLIENT_ID_AQUI con tu Client ID real
REACT_APP_GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
```

### 5. 🛠️ Configurar archivos del proyecto

**Archivo:** `front-end/src/config/googleOAuth.js`
```javascript
export const GOOGLE_OAUTH_CONFIG = {
  // Reemplaza con tu Client ID real
  CLIENT_ID: '123456789-abc123def456.apps.googleusercontent.com',
  // ... resto de configuración
};
```

### 6. 🚀 Probar la configuración

1. **Reiniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

2. **Ir a la página de login**
3. **Hacer clic en "Continuar con Google"**
4. **Debe aparecer el popup real de Google** como en las imágenes que enviaste

### 7. ⚠️ Solución de problemas

**Si aparece error "Este app no ha sido verificada":**
- Es normal en desarrollo
- Hacer clic en "Avanzado" > "Ir a [tu-app] (no seguro)"

**Si no aparece el popup:**
- Verificar que el Client ID esté correcto
- Verificar que las URLs estén configuradas correctamente
- Revisar la consola del navegador para errores

### 8. 🎯 Resultado esperado

Cuando funcione correctamente, verás:

1. **Primera pantalla:** Selección de cuenta de Google (como en tu imagen)
2. **Segunda pantalla:** Permisos de la aplicación (como en tu segunda imagen)
3. **Resultado:** Login exitoso con datos reales del usuario

---

## 🔧 Comandos útiles

```bash
# Reiniciar servidor de desarrollo
cd front-end
npm run dev

# Ver logs en tiempo real
# Abrir DevTools > Console para ver los logs de Google OAuth
```

## 📞 ¿Necesitas ayuda?

Si tienes problemas:
1. Verifica que el Client ID esté correcto
2. Revisa las URLs autorizadas
3. Comprueba los logs en la consola del navegador
4. Asegúrate de que el script de Google esté cargando correctamente

## ✅ Checklist final

- [ ] Proyecto creado en Google Cloud Console
- [ ] APIs habilitadas
- [ ] Credenciales OAuth 2.0 creadas
- [ ] URLs autorizadas configuradas
- [ ] Client ID copiado al archivo .env
- [ ] Servidor reiniciado
- [ ] Popup de Google aparece al hacer clic en "Continuar con Google"
