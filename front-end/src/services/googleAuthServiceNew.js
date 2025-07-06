import { getClientId } from '../config/googleOAuth';

class GoogleAuthService {
  constructor() {
    this.clientId = getClientId();
    this.isGoogleLoaded = false;
    this.googleAuth = null;
    this.initPromise = null;
  }

  // Inicializar Google OAuth
  async init() {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise((resolve, reject) => {
      // Verificar si Google ya está cargado
      if (window.google && window.google.accounts) {
        this.isGoogleLoaded = true;
        this.initializeGoogleAuth();
        resolve();
        return;
      }

      // Cargar el script de Google OAuth
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('✅ Google OAuth script cargado');
        this.isGoogleLoaded = true;
        this.initializeGoogleAuth();
        resolve();
      };
      
      script.onerror = () => {
        console.error('❌ Error al cargar Google OAuth script');
        reject(new Error('Error al cargar Google OAuth'));
      };
      
      document.head.appendChild(script);
    });

    return this.initPromise;
  }

  // Inicializar la autenticación de Google
  initializeGoogleAuth() {
    if (!window.google || !window.google.accounts) {
      console.error('❌ Google OAuth no está disponible');
      return;
    }

    try {
      // Inicializar Google Identity Services
      window.google.accounts.id.initialize({
        client_id: this.clientId,
        callback: this.handleCredentialResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: false
      });

      console.log('✅ Google OAuth inicializado correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar Google OAuth:', error);
    }
  }

  // Mostrar el prompt de Google para seleccionar cuenta
  async signIn() {
    try {
      await this.init();
      
      if (!this.isGoogleLoaded) {
        throw new Error('Google OAuth no está disponible');
      }

      // Mostrar el prompt de One Tap
      window.google.accounts.id.prompt((notification) => {
        console.log('🔍 Google prompt notification:', notification);
        
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Si One Tap no se muestra, usar el popup
          this.showPopup();
        }
      });

    } catch (error) {
      console.error('❌ Error en Google Sign In:', error);
      throw error;
    }
  }

  // Mostrar popup de Google OAuth
  showPopup() {
    try {
      window.google.accounts.oauth2.initTokenClient({
        client_id: this.clientId,
        scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
        callback: this.handleTokenResponse.bind(this)
      }).requestAccessToken();
    } catch (error) {
      console.error('❌ Error al mostrar popup de Google:', error);
    }
  }

  // Manejar respuesta del credential (One Tap)
  async handleCredentialResponse(response) {
    try {
      console.log('🔍 Google credential response:', response);
      
      // Decodificar el JWT token
      const userInfo = this.decodeJWT(response.credential);
      console.log('👤 Información del usuario:', userInfo);

      // Procesar el login
      await this.processGoogleLogin(userInfo);
      
    } catch (error) {
      console.error('❌ Error al procesar credential response:', error);
      throw error;
    }
  }

  // Manejar respuesta del token (Popup)
  async handleTokenResponse(response) {
    try {
      console.log('🔍 Google token response:', response);
      
      if (response.access_token) {
        // Obtener información del usuario usando el access token
        const userInfo = await this.getUserInfo(response.access_token);
        console.log('👤 Información del usuario:', userInfo);

        // Procesar el login
        await this.processGoogleLogin(userInfo);
      }
      
    } catch (error) {
      console.error('❌ Error al procesar token response:', error);
      throw error;
    }
  }

  // Obtener información del usuario usando access token
  async getUserInfo(accessToken) {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener información del usuario');
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error al obtener información del usuario:', error);
      throw error;
    }
  }

  // Decodificar JWT token
  decodeJWT(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('❌ Error al decodificar JWT:', error);
      throw error;
    }
  }

  // Procesar login de Google
  async processGoogleLogin(userInfo) {
    try {
      console.log('🔐 Procesando login de Google...');
      
      // Crear datos del usuario
      const userData = {
        id: `google_${userInfo.sub || userInfo.id}`,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        verified_email: userInfo.verified_email || userInfo.email_verified
      };

      console.log('📝 Datos del usuario procesados:', userData);

      // Generar token JWT para el frontend
      const token = await this.generateDevToken(userData);
      
      // Guardar en localStorage
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify({
        id: userData.id,
        email: userData.email,
        nombre: userData.name,
        rol: 'paciente',
        picture: userData.picture,
        verified_email: userData.verified_email
      }));

      console.log('✅ Login de Google completado exitosamente');
      
      // Disparar evento de login exitoso
      window.dispatchEvent(new CustomEvent('googleLoginSuccess', {
        detail: userData
      }));

      // Redirigir al dashboard
      window.location.href = '/dashboard';
      
    } catch (error) {
      console.error('❌ Error al procesar login de Google:', error);
      throw error;
    }
  }

  // Generar token de desarrollo
  async generateDevToken(userData) {
    const tokenData = {
      id: userData.id,
      email: userData.email,
      rol: 'paciente',
      nombre: userData.name,
      picture: userData.picture,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 horas
      isDev: true
    };

    // Simular JWT (en producción esto debería venir del backend)
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify(tokenData));
    const signature = btoa(`dev_signature_${Date.now()}`);
    
    return `${header}.${payload}.${signature}`;
  }

  // Renderizar botón de Google
  renderButton(elementId, options = {}) {
    const defaultOptions = {
      theme: 'outline',
      size: 'large',
      type: 'standard',
      shape: 'rectangular',
      text: 'signin_with',
      locale: 'es',
      ...options
    };

    if (this.isGoogleLoaded && window.google.accounts) {
      window.google.accounts.id.renderButton(
        document.getElementById(elementId),
        defaultOptions
      );
    }
  }

  // Cerrar sesión
  async signOut() {
    try {
      if (this.isGoogleLoaded && window.google.accounts) {
        window.google.accounts.id.disableAutoSelect();
      }
      
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      
      console.log('👋 Sesión cerrada correctamente');
      
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
    }
  }
}

// Exportar instancia única
export default new GoogleAuthService();
