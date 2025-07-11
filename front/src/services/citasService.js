import AuthService from './authService.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Servicio para gestión de citas
class CitasService {
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

  // Obtener todas las citas (con filtros según rol)
  static async getAllCitas(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const url = `${API_BASE_URL}/citas${params.toString() ? `?${params.toString()}` : ''}`;
    return this.fetchWithAuth(url);
  }

  // Crear nueva cita
  static async createCita(citaData) {
    return this.fetchWithAuth(`${API_BASE_URL}/citas`, {
      method: 'POST',
      body: JSON.stringify(citaData),
    });
  }

  // Obtener cita por ID
  static async getCitaById(id) {
    return this.fetchWithAuth(`${API_BASE_URL}/citas/${id}`);
  }

  // Confirmar cita
  static async confirmarCita(id, data = {}) {
    return this.fetchWithAuth(`${API_BASE_URL}/citas/${id}/confirmar`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Cancelar cita
  static async cancelarCita(id, motivo = '') {
    return this.fetchWithAuth(`${API_BASE_URL}/citas/${id}/cancelar`, {
      method: 'PUT',
      body: JSON.stringify({ motivo }),
    });
  }

  // Actualizar estado de cita
  static async actualizarEstadoCita(id, estado, notas = '', notasPrivadas = '') {
    return this.fetchWithAuth(`${API_BASE_URL}/citas/${id}/estado`, {
      method: 'PUT',
      body: JSON.stringify({ estado, notas, notasPrivadas }),
    });
  }

  // Eliminar cita (solo admin)
  static async eliminarCita(id) {
    return this.fetchWithAuth(`${API_BASE_URL}/citas/${id}`, {
      method: 'DELETE',
    });
  }

  // Obtener horarios disponibles
  static async getHorariosDisponibles(psicologoId, fecha, modalidad = '') {
    const params = new URLSearchParams({ psicologoId, fecha });
    if (modalidad) params.append('modalidad', modalidad);
    
    return this.fetchWithAuth(`${API_BASE_URL}/citas/horarios-disponibles?${params.toString()}`);
  }
}

// Funciones compatibles con la implementación anterior
export async function getCitas(filters = {}) {
  return CitasService.getAllCitas(filters);
}

export async function createCita(data) {
  return CitasService.createCita(data);
}

export default CitasService;
