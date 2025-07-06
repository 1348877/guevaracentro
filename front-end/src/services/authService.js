import { getClientId } from '../config/googleOAuth';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Servicio para autenticación
class AuthService {
  static async login(email, password) {
    console.log('🔐 AuthService.login - Iniciando login para:', email);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login-staff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      console.log('🔐 AuthService.login - Respuesta recibida:', response.status);
      
      if (!response.ok) {
        let errorMessage = 'Error en el login';
        try {
          const error = await response.json();
          errorMessage = error.message || error.error || errorMessage;
        } catch (e) {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      console.log('🔐 AuthService - Datos recibidos del backend:', data);
      
      // El backend devuelve { token, usuario }, adaptamos la estructura
      const user = data.usuario || data.user;
      
      console.log('🔐 AuthService - Usuario extraído:', user);
      console.log('🔐 AuthService - Token extraído:', data.token);
      
      // Guardar token y datos del usuario
      console.log('🔐 AuthService - Guardando en localStorage...');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log('🔐 AuthService - Guardado completado');
      console.log('🔐 AuthService - Token guardado:', localStorage.getItem('token'));
      console.log('🔐 AuthService - Usuario guardado:', localStorage.getItem('user'));
      
      // Verificar inmediatamente después de guardar
      console.log('🔐 AuthService - Iniciando verificación inmediata...');
      const savedToken = AuthService.getToken();
      console.log('🔐 AuthService - getToken() retornó:', savedToken);
      const savedUser = AuthService.getUser();
      console.log('🔐 AuthService - getUser() retornó:', savedUser);
      const isAuth = AuthService.isAuthenticated();
      console.log('🔐 AuthService - isAuthenticated() retornó:', isAuth);
      
      console.log('🔐 AuthService - Verificación inmediata completa:', {
        token: savedToken ? 'presente' : 'ausente',
        user: savedUser ? 'presente' : 'ausente',
        authenticated: isAuth
      });
      
      // Devolver datos consistentes
      return {
        ...data,
        user: user
      };
    } catch (error) {
      console.error('❌ AuthService.login - Error:', error);
      throw error;
    }
  }

  static async register(userData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error en el registro');
    }
    
    return response.json();
  }

  static logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // No redirigir automáticamente, dejar que el componente maneje la navegación
  }

  static getToken() {
    try {
      console.log('🔍 AuthService.getToken() - Iniciando...');
      const token = localStorage.getItem('token');
      console.log('🔍 AuthService.getToken() - Valor raw:', token);
      
      if (!token || token === 'undefined' || token === 'null' || token.trim() === '') {
        console.log('🔍 AuthService.getToken() - Token inválido o vacío');
        return null;
      }
      
      console.log('🔍 AuthService.getToken() - Token válido encontrado');
      return token;
    } catch (error) {
      console.error('❌ AuthService.getToken() - Error:', error);
      return null;
    }
  }

  static getUser() {
    try {
      const userStr = localStorage.getItem('user');
      
      // Verificar si el valor es válido
      if (!userStr || userStr === 'undefined' || userStr === 'null' || userStr.trim() === '') {
        return null;
      }
      
      const user = JSON.parse(userStr);
      return user;
    } catch (error) {
      console.error('❌ AuthService.getUser() - Error parsing user data:', error);
      // Limpiar datos corruptos automáticamente
      AuthService.clearCorruptedData();
      return null;
    }
  }

  static isAuthenticated() {
    console.log('🔍 AuthService.isAuthenticated() - Iniciando verificación...');
    const token = AuthService.getToken();
    const isAuth = !!token;
    console.log('🔍 AuthService.isAuthenticated() - Token:', token ? 'presente' : 'ausente', '- Resultado:', isAuth);
    return isAuth;
  }

  static hasRole(role) {
    const user = this.getUser();
    const hasRole = user && user.rol === role;
    return hasRole;
  }

  static hasAnyRole(roles) {
    const user = this.getUser();
    const hasAnyRole = user && roles.includes(user.rol);
    return hasAnyRole;
  }

  static getAuthHeaders() {
    const token = AuthService.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  static clearCorruptedData() {
    try {
      // Intentar leer y parsear los datos
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      console.log('🔍 Verificando datos de localStorage:', { token: token?.substring(0, 20), userStr: userStr?.substring(0, 50) });
      
      if (userStr && userStr !== 'undefined' && userStr !== 'null') {
        JSON.parse(userStr); // Esto lanzará error si está corrupto
      }
      
      console.log('✅ Datos de localStorage válidos');
    } catch (error) {
      console.warn('❌ Datos corruptos encontrados, limpiando localStorage:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  // Función para login con Google (simulado para desarrollo)
  static async loginWithGoogle() {
    console.log('🔍 AuthService.loginWithGoogle() - Iniciando login con Google (DEV MODE)');
    
    try {
      // Verificar si ya existe un usuario guardado y mantener la misma sesión
      const existingUser = this.getUser();
      const existingToken = this.getToken();
      
      if (existingUser && existingToken && existingUser.proveedor === 'google') {
        console.log('🔄 Reutilizando usuario existente:', existingUser);
        return {
          token: existingToken,
          user: existingUser,
          message: 'Sesión existente restaurada'
        };
      }
      
      // Crear un usuario consistente - usar el ID de sesión fijo para mantener consistencia
      const sessionId = 'google_session_123456';
      const userData = {
        id: sessionId,
        email: 'mi.cuenta@gmail.com',
        nombre: 'Mi Cuenta Personal',
        rol: 'paciente',
        proveedor: 'google',
        picture: 'https://ui-avatars.com/api/?name=Mi+Cuenta+Personal&background=667eea&color=fff&size=200',
        emailVerified: true,
        googleId: sessionId,
        accessToken: `dev_google_access_${sessionId}`
      };
      
      // Generar un token JWT válido para desarrollo
      const mockToken = this.generateDevJWT(userData);
      
      console.log('🔍 AuthService.loginWithGoogle() - Usuario fijo:', userData);
      console.log('🔍 AuthService.loginWithGoogle() - Token generado:', mockToken);
      
      // Guardar en localStorage
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return {
        token: mockToken,
        user: userData,
        message: 'Login exitoso con Google (modo desarrollo)'
      };
      
    } catch (error) {
      console.error('❌ Error en login con Google:', error);
      throw new Error('Error en autenticación con Google');
    }
  }

  // Procesar resultado de Google login real
  static async processGoogleLogin(googleUser) {
    console.log('🔍 AuthService.processGoogleLogin() - Procesando usuario de Google:', googleUser);
    
    try {
      let userData;
      
      // Intentar obtener información real del usuario de Google
      if (googleUser && typeof googleUser === 'object') {
        // Verificar si es un objeto de Google Identity con credential
        if (googleUser.credential) {
          // Decodificar el JWT de Google
          const credential = googleUser.credential;
          const payload = JSON.parse(atob(credential.split('.')[1]));
          
          userData = {
            id: payload.sub,
            email: payload.email,
            nombre: payload.name || `${payload.given_name} ${payload.family_name}`,
            picture: payload.picture,
            rol: 'paciente',
            proveedor: 'google',
            googleId: payload.sub,
            emailVerified: payload.email_verified,
            accessToken: credential
          };
        } else if (googleUser.getBasicProfile) {
          // API legacy de Google Sign-In
          const profile = googleUser.getBasicProfile();
          const authResponse = googleUser.getAuthResponse();
          
          userData = {
            id: profile.getId(),
            email: profile.getEmail(),
            nombre: profile.getName(),
            picture: profile.getImageUrl(),
            rol: 'paciente',
            proveedor: 'google',
            googleId: profile.getId(),
            emailVerified: true,
            accessToken: authResponse ? authResponse.access_token : null
          };
        } else {
          // Fallback para datos simulados
          userData = {
            id: 'dev_google_' + Date.now(),
            email: 'demo@centropsicologico.com',
            nombre: 'Usuario Demo Google',
            picture: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
            rol: 'paciente',
            proveedor: 'google',
            googleId: 'dev_google_' + Date.now(),
            emailVerified: true,
            accessToken: 'dev_access_token_' + Date.now()
          };
        }
      } else {
        // Datos simulados para desarrollo
        userData = {
          id: 'dev_google_' + Date.now(),
          email: 'demo@centropsicologico.com',
          nombre: 'Usuario Demo Google',
          picture: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
          rol: 'paciente',
          proveedor: 'google',
          googleId: 'dev_google_' + Date.now(),
          emailVerified: true,
          accessToken: 'dev_access_token_' + Date.now()
        };
      }
      
      // Generar token JWT válido
      const token = AuthService.generateDevJWT(userData);
      
      // Guardar en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      console.log('✅ Login con Google exitoso:', userData);
      
      return {
        token: token,
        user: userData,
        message: 'Login exitoso con Google'
      };
      
    } catch (error) {
      console.error('❌ Error procesando Google login:', error);
      
      // Fallback a datos simulados en caso de error
      const fallbackUser = {
        id: 'dev_google_' + Date.now(),
        email: 'demo@centropsicologico.com',
        nombre: 'Usuario Demo Google',
        picture: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
        rol: 'paciente',
        proveedor: 'google',
        googleId: 'dev_google_' + Date.now(),
        emailVerified: true,
        accessToken: 'dev_access_token_' + Date.now()
      };
      
      const token = AuthService.generateDevJWT(fallbackUser);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(fallbackUser));
      
      return {
        token: token,
        user: fallbackUser,
        message: 'Login con datos simulados (modo desarrollo)'
      };
    }
  }

  // Generar JWT simulado para desarrollo
  static generateDevJWT(user) {
    const header = {
      alg: "HS256",
      typ: "JWT"
    };
    
    const payload = {
      id: user.id,
      email: user.email,
      rol: user.rol,
      nombre: user.nombre,
      provider: user.provider,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 horas
      isDev: true
    };
    
    // Codificar en base64url (simulado para desarrollo)
    const encodedHeader = btoa(JSON.stringify(header)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    const encodedPayload = btoa(JSON.stringify(payload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    const signature = btoa(`dev_signature_${Date.now()}`).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }
}

// Función global para limpiar localStorage (solo para desarrollo)
if (typeof window !== 'undefined') {
  window.clearAuthData = () => {
    localStorage.clear();
    console.log('✅ localStorage limpiado completamente');
    window.location.reload();
  };
  
  // Detectar cambios en localStorage
  window.addEventListener('storage', (e) => {
    if (e.key === 'token' || e.key === 'user') {
      console.log('🔄 Cambio detectado en localStorage:', e.key, 'Nuevo valor:', e.newValue);
    }
  });
  
  console.log('🛠️ Para limpiar datos de autenticación, ejecuta: clearAuthData()');
}

export default AuthService;
