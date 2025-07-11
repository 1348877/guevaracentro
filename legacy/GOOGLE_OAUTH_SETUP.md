# 🔐 Configuración de Google OAuth - Guía Paso a Paso

## 1. Acceder a Google Cloud Console
1. Ve a: https://console.cloud.google.com/
2. Inicia sesión con tu cuenta de Google

## 2. Crear un Proyecto (si no tienes uno)
1. Haz clic en "Crear proyecto"
2. Nombre: "Centro Psicológico Guevara"
3. Haz clic en "Crear"

## 3. Habilitar APIs necesarias
1. Ve a "APIs y servicios" → "Biblioteca"
2. Busca y habilita:
   - **Google+ API**
   - **Google Identity API**
   - **Google Sign-In API**

## 4. Configurar pantalla de consentimiento OAuth
1. Ve a "APIs y servicios" → "Pantalla de consentimiento OAuth"
2. Selecciona "Externo"
3. Completa los campos obligatorios:
   - **Nombre de la aplicación**: Centro Psicológico Guevara
   - **Correo electrónico de soporte**: tu.email@gmail.com
   - **Correo electrónico de contacto del desarrollador**: tu.email@gmail.com
4. Haz clic en "Guardar y continuar"

## 5. Crear credenciales OAuth
1. Ve a "APIs y servicios" → "Credenciales"
2. Haz clic en "Crear credenciales" → "ID de cliente de OAuth 2.0"
3. Selecciona "Aplicación web"
4. Nombre: "Centro Psicológico Guevara - Frontend"
5. **Orígenes de JavaScript autorizados**:
   - http://localhost:3000
   - http://localhost:5173
   - http://127.0.0.1:3000
   - http://127.0.0.1:5173
6. **URIs de redirección autorizados**:
   - http://localhost:3000/auth/callback
   - http://localhost:5173/auth/callback
   - http://127.0.0.1:3000/auth/callback
   - http://127.0.0.1:5173/auth/callback
7. Haz clic en "Crear"

## 6. Copiar las credenciales
1. Después de crear, verás una ventana con:
   - **Client ID**: algo como `123456789-abcdef.apps.googleusercontent.com`
   - **Client Secret**: algo como `GOCSPX-abcdef123456`
2. **¡IMPORTANTE!** Copia estos valores

## 7. Configurar en tu aplicación
1. Ve a tu archivo `.env` en el proyecto
2. Reemplaza `TU_CLIENT_ID_AQUI` con tu Client ID real
3. Guarda el archivo

## 8. Reiniciar la aplicación
1. Cierra el servidor de desarrollo
2. Reinicia con `npm run dev`
3. Prueba el login con Google

## 🚨 IMPORTANTE:
- Nunca compartas tu Client ID público en repositorios públicos
- El Client Secret debe mantenerse secreto
- Para producción, agrega tu dominio real a los orígenes autorizados

## 📝 Notas adicionales:
- El proceso puede tardar unos minutos en propagarse
- Si tienes problemas, verifica que las URLs coincidan exactamente
- Para producción, necesitarás verificar tu dominio
