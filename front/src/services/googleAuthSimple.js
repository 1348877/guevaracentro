// Servicio simplificado de Google OAuth
class GoogleAuthSimple {
  constructor() {
    const envClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const useMockAuth = import.meta.env.VITE_USE_MOCK_AUTH === 'true';
    
    // Usar modo mock si está habilitado
    if (useMockAuth) {
      console.log('🔧 Modo desarrollo activado - Google OAuth simulado');
      this.clientId = 'mock_client_id';
      this.mockMode = true;
    } else if (envClientId && envClientId !== 'TU_CLIENT_ID_AQUI.apps.googleusercontent.com') {
      // Usar Client ID real si está configurado
      this.clientId = envClientId;
      this.mockMode = false;
    } else {
      // Usar Client ID de prueba (puede fallar)
      this.clientId = '945043949953-ttvnc80cik4vac1s3bfj1v7fk6d0k84e.apps.googleusercontent.com';
      this.mockMode = false;
      console.warn('⚠️ Usando Client ID de prueba. Configura tu propio Client ID en .env');
    }
    
    this.isLoaded = false;
    this.isInitialized = false;
  }

  // Cargar el SDK de Google
  async loadGoogleSDK() {
    if (this.isLoaded) return Promise.resolve();

    return new Promise((resolve, reject) => {
      if (window.google && window.google.accounts) {
        this.isLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.isLoaded = true;
        resolve();
      };
      script.onerror = () => {
        reject(new Error('Error al cargar Google SDK'));
      };
      document.head.appendChild(script);
    });
  }

  // Inicializar Google Auth
  async initialize() {
    if (this.isInitialized) return;

    try {
      await this.loadGoogleSDK();
      
      // Esperar a que Google SDK esté disponible
      let attempts = 0;
      while (!window.google?.accounts?.id && attempts < 20) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      if (!window.google?.accounts?.id) {
        throw new Error('Google SDK no está disponible');
      }

      window.google.accounts.id.initialize({
        client_id: this.clientId,
        callback: this.handleCredentialResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: false
      });

      this.isInitialized = true;
      console.log('✅ Google Auth inicializado correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar Google Auth:', error);
      throw error;
    }
  }

  // Manejar respuesta de credenciales
  handleCredentialResponse(response) {
    try {
      const credential = response.credential;
      
      // Decodificar el JWT token
      const payload = JSON.parse(atob(credential.split('.')[1]));
      
      const userData = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        given_name: payload.given_name,
        family_name: payload.family_name,
        verified_email: payload.email_verified
      };

      console.log('✅ Usuario autenticado:', userData);
      
      // Disparar evento personalizado
      window.dispatchEvent(new CustomEvent('googleAuthSuccess', {
        detail: userData
      }));
      
    } catch (error) {
      console.error('❌ Error al procesar respuesta de Google:', error);
      window.dispatchEvent(new CustomEvent('googleAuthError', {
        detail: error
      }));
    }
  }

  // Mostrar el prompt de Google
  async showGooglePrompt() {
    try {
      await this.initialize();
      
      if (!window.google?.accounts?.id) {
        throw new Error('Google SDK no está disponible');
      }

      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log('❌ Google prompt no se mostró:', notification.getNotDisplayedReason());
          // Fallback: usar el método de One Tap
          this.showOneTap();
        }
      });
    } catch (error) {
      console.error('❌ Error al mostrar Google prompt:', error);
      throw error;
    }
  }

  // Método One Tap alternativo
  async showOneTap() {
    try {
      await this.initialize();
      
      if (!window.google?.accounts?.id) {
        throw new Error('Google SDK no está disponible');
      }

      // Crear un contenedor temporal para el botón
      const buttonContainer = document.createElement('div');
      buttonContainer.id = 'google-signin-button';
      buttonContainer.style.position = 'fixed';
      buttonContainer.style.top = '50%';
      buttonContainer.style.left = '50%';
      buttonContainer.style.transform = 'translate(-50%, -50%)';
      buttonContainer.style.zIndex = '10000';
      buttonContainer.style.background = 'white';
      buttonContainer.style.padding = '20px';
      buttonContainer.style.borderRadius = '10px';
      buttonContainer.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
      
      document.body.appendChild(buttonContainer);

      window.google.accounts.id.renderButton(buttonContainer, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        shape: 'rectangular',
        text: 'signin_with',
        locale: 'es'
      });

      // Agregar botón de cerrar
      const closeButton = document.createElement('button');
      closeButton.innerHTML = '×';
      closeButton.style.position = 'absolute';
      closeButton.style.top = '5px';
      closeButton.style.right = '5px';
      closeButton.style.border = 'none';
      closeButton.style.background = 'none';
      closeButton.style.fontSize = '20px';
      closeButton.style.cursor = 'pointer';
      closeButton.onclick = () => {
        document.body.removeChild(buttonContainer);
      };
      buttonContainer.appendChild(closeButton);

      // Auto-remover después de 30 segundos
      setTimeout(() => {
        if (document.body.contains(buttonContainer)) {
          document.body.removeChild(buttonContainer);
        }
      }, 30000);

    } catch (error) {
      console.error('❌ Error al mostrar One Tap:', error);
      throw error;
    }
  }

  // Método principal para autenticación
  async signIn() {
    try {
      console.log('🔄 Iniciando autenticación con Google...');
      
      // Si estamos en modo mock, simular login
      if (this.mockMode) {
        return this.simulateGoogleLogin();
      }
      
      // Intentar método 1: Prompt automático
      await this.showGooglePrompt();
      
      // Si no funciona, usar One Tap como respaldo
      setTimeout(() => {
        this.showOneTap();
      }, 1000);
      
    } catch (error) {
      console.error('❌ Error en Google Sign In:', error);
      throw error;
    }
  }

  // Simular login para modo desarrollo
  async simulateGoogleLogin() {
    console.log('🎭 Simulando login con Google...');
    
    // Simular datos del usuario
    const userData = {
      id: 'google_dev_' + Date.now(),
      email: 'agueveraq@est.unap.edu.pe',
      name: 'Alfonso Guevara',
      picture: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
      given_name: 'Alfonso',
      family_name: 'Guevara',
      verified_email: true
    };

    // Simular evento de callback
    if (this.onSuccess) {
      this.onSuccess(userData);
    }

    return userData;
  }

  // Cerrar sesión
  async signOut() {
    try {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.disableAutoSelect();
      }
      console.log('✅ Sesión cerrada');
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
    }
  }
}

// Exportar instancia singleton
export default new GoogleAuthSimple();
