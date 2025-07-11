// Configuración de Google OAuth para desarrollo local
export const GOOGLE_CONFIG = {
  // Client ID temporal para desarrollo local
  // IMPORTANTE: Este Client ID debe ser reemplazado por uno real en producción
  CLIENT_ID: '914953759705-3c4g7vlrb285bl82u1vb5noqlsd5ibcj.apps.googleusercontent.com',
  
  // Configuración para desarrollo
  SCOPES: 'email profile',
  
  // Dominios permitidos para desarrollo
  ALLOWED_DOMAINS: ['localhost:5173', 'localhost:3000', '127.0.0.1:5173'],
  
  // Configuración de callback
  CALLBACK_CONFIG: {
    cancel_on_tap_outside: false,
    auto_select: false,
    use_fedcm_for_prompt: false
  }
};

// Función para verificar si Google SDK está disponible
export const checkGoogleSDK = () => {
  return new Promise((resolve) => {
    if (typeof window.google !== 'undefined' && window.google.accounts) {
      resolve(true);
      return;
    }
    
    // Esperar hasta 5 segundos para que cargue el SDK
    let attempts = 0;
    const maxAttempts = 50;
    
    const checkInterval = setInterval(() => {
      attempts++;
      if (typeof window.google !== 'undefined' && window.google.accounts) {
        clearInterval(checkInterval);
        resolve(true);
      } else if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        resolve(false);
      }
    }, 100);
  });
};

// Función para inicializar Google OAuth con manejo de errores
export const initializeGoogleAuth = async (callback) => {
  try {
    const sdkAvailable = await checkGoogleSDK();
    
    if (!sdkAvailable) {
      throw new Error('Google SDK no disponible después de 5 segundos');
    }
    
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CONFIG.CLIENT_ID,
      callback: callback,
      ...GOOGLE_CONFIG.CALLBACK_CONFIG
    });
    
    return true;
  } catch (error) {
    console.error('Error inicializando Google Auth:', error);
    return false;
  }
};

// Función para mostrar el prompt de Google
export const showGooglePrompt = () => {
  return new Promise((resolve, reject) => {
    window.google.accounts.id.prompt((notification) => {
      console.log('Google prompt notification:', notification);
      
      if (notification.isNotDisplayed()) {
        const reason = notification.getNotDisplayedReason();
        console.log('Google prompt not displayed:', reason);
        
        // Traducir las razones comunes
        const reasonMessages = {
          'browser_not_supported': 'Tu navegador no es compatible con Google Sign-In',
          'invalid_client': 'Configuración de cliente inválida',
          'missing_client_id': 'ID de cliente faltante',
          'opt_out_or_no_session': 'Usuario optó por no usar Google Sign-In',
          'secure_http_required': 'Se requiere HTTPS para Google Sign-In',
          'suppressed_by_user': 'Suprimido por el usuario',
          'unregistered_origin': 'Origen no registrado en Google Console',
          'unknown_reason': 'Razón desconocida'
        };
        
        const message = reasonMessages[reason] || `Razón: ${reason}`;
        reject(new Error(`Google Sign-In no disponible: ${message}`));
      } else {
        resolve();
      }
    });
  });
};
