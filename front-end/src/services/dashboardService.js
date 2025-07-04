import AuthService from './authService.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Servicio para gestión de dashboards
class DashboardService {
  static async fetchWithAuth(url, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...AuthService.getAuthHeaders(),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        AuthService.logout();
        throw new Error('Sesión expirada');
      }
      const error = await response.json();
      throw new Error(error.message || error.error || 'Error en la solicitud');
    }

    return response.json();
  }

  // Obtener dashboard según rol del usuario
  static async getDashboard() {
    // Verificar que el usuario esté autenticado
    if (!AuthService.isAuthenticated()) {
      throw new Error('No hay sesión activa');
    }

    const user = AuthService.getUser();
    if (!user) {
      throw new Error('No se encontró información del usuario');
    }

    console.log('🔍 Cargando dashboard para usuario:', user.email, 'rol:', user.rol);

    try {
      return await this.fetchWithAuth(`${API_BASE_URL}/dashboard`);
    } catch (error) {
      console.error('❌ Error al cargar dashboard:', error);
      
      // Si es error de autenticación, proporcionar más información
      if (error.message === 'Sesión expirada') {
        throw new Error(`Sesión expirada para usuario ${user.email}. Por favor, inicia sesión nuevamente.`);
      }
      
      throw error;
    }
  }

  // Obtener dashboard específico por rol
  static async getDashboardAdmin() {
    return this.fetchWithAuth(`${API_BASE_URL}/dashboard/admin`);
  }

  static async getDashboardSecretaria() {
    return this.fetchWithAuth(`${API_BASE_URL}/dashboard/secretaria`);
  }

  static async getDashboardPsicologo() {
    return this.fetchWithAuth(`${API_BASE_URL}/dashboard/psicologo`);
  }

  static async getDashboardPaciente() {
    return this.fetchWithAuth(`${API_BASE_URL}/dashboard/paciente`);
  }
}

export default DashboardService;
