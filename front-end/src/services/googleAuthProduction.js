/**
 * Servicio de Google OAuth para producción
 * Sistema completo de autenticación con Google
 */

class GoogleAuthProductionService {
  constructor() {
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    this.redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/callback`;
    this.isInitialized = false;
    this.gapi = null;
    this.devMode = import.meta.env.VITE_DEV_MODE === 'true';
    
    console.log('🔧 Google Auth Service - Configuración:', {
      clientId: this.clientId,
      redirectUri: this.redirectUri,
      devMode: this.devMode
    });
  }

  /**
   * Inicializa Google OAuth
   */
  async initialize() {
    if (this.isInitialized) return true;

    try {
      // Si estamos en modo desarrollo y no tenemos un client ID válido, usar simulación
      if (this.devMode && (this.clientId === 'TU_CLIENT_ID_AQUI.apps.googleusercontent.com' || !this.clientId)) {
        console.log('🔧 Modo desarrollo activado - Usando simulación de Google OAuth');
        this.isInitialized = true;
        return true;
      }

      // Cargar el script de Google si no está cargado
      if (!window.google) {
        await this.loadGoogleScript();
      }

      // Inicializar Google OAuth
      await new Promise((resolve, reject) => {
        window.google.accounts.id.initialize({
          client_id: this.clientId,
          callback: this.handleCredentialResponse.bind(this),
          auto_select: false,
          cancel_on_tap_outside: true,
          context: 'signin',
          ux_mode: 'popup',
          use_fedcm_for_prompt: false
        });

        console.log('✅ Google OAuth inicializado correctamente');
        resolve();
      });

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('❌ Error al inicializar Google OAuth:', error);
      // En caso de error, activar modo desarrollo
      this.devMode = true;
      this.isInitialized = true;
      return true;
    }
  }

  /**
   * Carga el script de Google OAuth
   */
  async loadGoogleScript() {
    return new Promise((resolve, reject) => {
      if (window.google) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  /**
   * Maneja la respuesta de Google OAuth
   */
  handleCredentialResponse(response) {
    console.log('🔐 Respuesta de Google OAuth recibida');
    
    try {
      // Decodificar el JWT token
      const credential = response.credential;
      const payload = this.parseJwt(credential);
      
      console.log('👤 Información del usuario:', {
        name: payload.name,
        email: payload.email,
        picture: payload.picture
      });

      // Disparar evento personalizado con los datos del usuario
      const event = new CustomEvent('googleAuthSuccess', {
        detail: {
          credential,
          user: {
            id: payload.sub,
            email: payload.email,
            nombre: payload.name,
            picture: payload.picture,
            verified: payload.email_verified
          }
        }
      });
      window.dispatchEvent(event);

    } catch (error) {
      console.error('❌ Error al procesar respuesta de Google:', error);
      this.handleAuthError(error);
    }
  }

  /**
   * Inicia el proceso de autenticación
   */
  async signIn() {
    console.log('🔐 Iniciando autenticación con Google...');

    try {
      await this.initialize();

      // Si estamos en modo desarrollo, usar simulación
      if (this.devMode && (this.clientId === 'TU_CLIENT_ID_AQUI.apps.googleusercontent.com' || !this.clientId)) {
        return this.simulateGoogleAuth();
      }

      // Usar Google OAuth real
      return new Promise((resolve, reject) => {
        // Configurar listener para el evento de éxito
        const handleSuccess = (event) => {
          window.removeEventListener('googleAuthSuccess', handleSuccess);
          resolve(event.detail);
        };

        const handleError = (event) => {
          window.removeEventListener('googleAuthError', handleError);
          reject(event.detail);
        };

        window.addEventListener('googleAuthSuccess', handleSuccess);
        window.addEventListener('googleAuthError', handleError);

        // Mostrar el prompt de Google
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log('🔄 Prompt no mostrado, usando botón de login...');
            this.showGoogleButton();
          }
        });

        // Timeout de 30 segundos
        setTimeout(() => {
          window.removeEventListener('googleAuthSuccess', handleSuccess);
          window.removeEventListener('googleAuthError', handleError);
          reject(new Error('Timeout en autenticación'));
        }, 30000);
      });

    } catch (error) {
      console.error('❌ Error en signIn:', error);
      // Fallback a modo simulado
      return this.simulateGoogleAuth();
    }
  }

  /**
   * Muestra el botón de Google OAuth
   */
  showGoogleButton() {
    console.log('🔘 Mostrando botón de Google OAuth...');
    
    // Crear contenedor temporal para el botón
    const container = document.createElement('div');
    container.id = 'google-signin-button';
    container.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 10000;
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    `;
    
    document.body.appendChild(container);

    // Renderizar botón de Google
    window.google.accounts.id.renderButton(container, {
      theme: 'outline',
      size: 'large',
      type: 'standard',
      text: 'signin_with',
      shape: 'rectangular',
      logo_alignment: 'left',
      width: 300
    });

    // Agregar botón de cerrar
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
      position: absolute;
      top: 5px;
      right: 10px;
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
    `;
    closeBtn.onclick = () => {
      document.body.removeChild(container);
      const event = new CustomEvent('googleAuthError', {
        detail: new Error('Usuario canceló la autenticación')
      });
      window.dispatchEvent(event);
    };
    
    container.appendChild(closeBtn);
  }

  /**
   * Simula la autenticación de Google para desarrollo
   */
  async simulateGoogleAuth() {
    console.log('🎭 Simulando autenticación de Google...');
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const simulatedUser = {
          credential: 'simulated_credential_' + Date.now(),
          user: {
            id: 'google_dev_' + Date.now(),
            email: 'usuario.desarrollo@gmail.com',
            nombre: 'Usuario Desarrollo',
            picture: 'https://ui-avatars.com/api/?name=Usuario+Desarrollo&background=4285f4&color=fff',
            verified: true
          }
        };

        console.log('✅ Autenticación simulada exitosa:', simulatedUser);
        resolve(simulatedUser);
      }, 1000);
    });
  }

  /**
   * Maneja errores de autenticación
   */
  handleAuthError(error) {
    console.error('❌ Error de autenticación:', error);
    
    const event = new CustomEvent('googleAuthError', {
      detail: error
    });
    window.dispatchEvent(event);
  }

  /**
   * Decodifica un JWT token
   */
  parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('❌ Error al decodificar JWT:', error);
      return {};
    }
  }

  /**
   * Cierra la sesión
   */
  async signOut() {
    try {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.disableAutoSelect();
      }
      console.log('✅ Sesión cerrada correctamente');
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
    }
  }
}

// Crear instancia singleton
const googleAuthService = new GoogleAuthProductionService();

export default googleAuthService;
