import AuthService from './authService.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Servicio para gestión de horarios disponibles
class HorarioService {
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

  // Obtener horarios de un psicólogo
  static async getHorariosPsicologo(psicologoId) {
    return this.fetchWithAuth(`${API_BASE_URL}/horarios/psicologo/${psicologoId}`);
  }

  // Crear horario disponible
  static async createHorario(horarioData) {
    return this.fetchWithAuth(`${API_BASE_URL}/horarios`, {
      method: 'POST',
      body: JSON.stringify(horarioData),
    });
  }

  // Actualizar horario
  static async updateHorario(id, horarioData) {
    return this.fetchWithAuth(`${API_BASE_URL}/horarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(horarioData),
    });
  }

  // Eliminar horario
  static async deleteHorario(id) {
    return this.fetchWithAuth(`${API_BASE_URL}/horarios/${id}`, {
      method: 'DELETE',
    });
  }

  // Obtener horarios disponibles para citas (público)
  static async getHorariosDisponiblesCitas(psicologoId, fecha, modalidad = '') {
    const params = new URLSearchParams({ psicologoId, fecha });
    if (modalidad) params.append('modalidad', modalidad);
    
    return this.fetchWithAuth(`${API_BASE_URL}/horarios/disponibles?${params.toString()}`);
  }
}

export default HorarioService;
