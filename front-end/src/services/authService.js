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
      console.log('🔍 AuthService.getUser() - Iniciando...');
      const userStr = localStorage.getItem('user');
      console.log('🔍 AuthService.getUser() - Valor raw:', userStr);
      
      // Verificar si el valor es válido
      if (!userStr || userStr === 'undefined' || userStr === 'null' || userStr.trim() === '') {
        console.log('🔍 AuthService.getUser() - Usuario inválido o vacío');
        return null;
      }
      
      console.log('🔍 AuthService.getUser() - Intentando parsear JSON...');
      const user = JSON.parse(userStr);
      console.log('🔍 AuthService.getUser() - Usuario parseado exitosamente:', user);
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
