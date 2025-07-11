import authService from './authService';

const API_URL = import.meta.env.VITE_API_URL + '/pacientes';

// Función helper para hacer peticiones autenticadas
const fetchWithAuth = async (url, options = {}) => {
  const token = authService.getToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  
  if (response.status === 401) {
    authService.logout();
    window.location.href = '/';
    throw new Error('Sesión expirada');
  }
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

const PacientesService = {
  // Obtener todos los pacientes
  async getPacientes() {
    try {
      return await fetchWithAuth(API_URL);
    } catch (error) {
      console.error('Error al obtener pacientes:', error);
      throw error;
    }
  },

  // Obtener un paciente por ID
  async getPacienteById(id) {
    try {
      return await fetchWithAuth(`${API_URL}/${id}`);
    } catch (error) {
      console.error('Error al obtener paciente:', error);
      throw error;
    }
  },

  // Crear un nuevo paciente
  async createPaciente(pacienteData) {
    try {
      return await fetchWithAuth(API_URL, {
        method: 'POST',
        body: JSON.stringify(pacienteData),
      });
    } catch (error) {
      console.error('Error al crear paciente:', error);
      throw error;
    }
  },

  // Actualizar un paciente
  async updatePaciente(id, pacienteData) {
    try {
      return await fetchWithAuth(`${API_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(pacienteData),
      });
    } catch (error) {
      console.error('Error al actualizar paciente:', error);
      throw error;
    }
  },

  // Eliminar un paciente
  async deletePaciente(id) {
    try {
      return await fetchWithAuth(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error al eliminar paciente:', error);
      throw error;
    }
  },

  // Buscar pacientes
  async searchPacientes(searchTerm) {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      return await fetchWithAuth(`${API_URL}/search?${params}`);
    } catch (error) {
      console.error('Error al buscar pacientes:', error);
      throw error;
    }
  }
};

export default PacientesService;
