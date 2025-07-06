// Configuración de Google OAuth
export const GOOGLE_OAUTH_CONFIG = {
  // Reemplaza este CLIENT_ID con tu Client ID real de Google Cloud Console
  CLIENT_ID: 'TU_CLIENT_ID_AQUI.apps.googleusercontent.com',
  
  // Scopes que necesitas para tu aplicación
  SCOPES: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ],
  
  // URLs de redirección autorizadas
  REDIRECT_URIS: {
    development: 'http://localhost:3000',
    production: 'https://tu-dominio.com'
  },
  
  // Configuración del botón de Google
  BUTTON_CONFIG: {
    theme: 'outline',
    size: 'large',
    type: 'standard',
    shape: 'rectangular',
    text: 'signin_with',
    locale: 'es'
  }
};

// Función para obtener el CLIENT_ID según el entorno
export const getClientId = () => {
  // En desarrollo, puedes usar un CLIENT_ID de prueba
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_GOOGLE_CLIENT_ID || GOOGLE_OAUTH_CONFIG.CLIENT_ID;
  }
  
  return GOOGLE_OAUTH_CONFIG.CLIENT_ID;
};

// Función para obtener la URL de redirección
export const getRedirectUri = () => {
  const isDevelopment = import.meta.env.DEV;
  return isDevelopment ? 
    GOOGLE_OAUTH_CONFIG.REDIRECT_URIS.development : 
    GOOGLE_OAUTH_CONFIG.REDIRECT_URIS.production;
};
