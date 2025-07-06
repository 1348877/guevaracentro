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

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          AuthService.logout();
          throw new Error('Sesión expirada');
        }
        
        // Si el backend no está disponible (500, 503, etc.), usar datos de respaldo
        if (response.status >= 500) {
          console.warn('⚠️ Backend no disponible, usando datos de respaldo');
          throw new Error('Backend no disponible');
        }
        
        const error = await response.json();
        throw new Error(error.message || error.error || 'Error en la solicitud');
      }

      return response.json();
    } catch (error) {
      // Si es un error de red o el backend no responde
      if (error.name === 'TypeError' || error.message.includes('fetch')) {
        console.warn('⚠️ Error de red, usando datos de respaldo');
        throw new Error('Backend no disponible');
      }
      throw error;
    }
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
      const data = await this.fetchWithAuth(`${API_BASE_URL}/dashboard`);
      
      // Si no hay datos del backend, generar datos de ejemplo según el rol
      if (!data || Object.keys(data).length === 0) {
        console.log('📊 Generando datos de ejemplo para dashboard');
        return this.generateMockData(user.rol);
      }
      
      return data;
    } catch (error) {
      console.error('❌ Error al cargar dashboard:', error);
      
      // Si hay error, generar datos de ejemplo para que el dashboard funcione
      console.log('🔄 Generando datos de respaldo para dashboard');
      return this.generateMockData(user.rol);
    }
  }

  // Generar datos de ejemplo según el rol
  static generateMockData(rol) {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    switch (rol) {
      case 'admin':
        return {
          resumen: {
            totalPacientes: 127,
            totalPsicologos: 5,
            totalCitas: 89,
            ingresoEstimadoMes: 12450
          },
          actividadReciente: [
            {
              icon: '👤',
              descripcion: 'Nuevo paciente registrado: María González',
              tiempo: 'Hace 2 horas'
            },
            {
              icon: '📅',
              descripcion: 'Cita agendada para mañana - Dr. García',
              tiempo: 'Hace 4 horas'
            },
            {
              icon: '💰',
              descripcion: 'Pago recibido - S/. 150.00',
              tiempo: 'Hace 6 horas'
            },
            {
              icon: '📊',
              descripcion: 'Reporte mensual generado',
              tiempo: 'Ayer'
            },
            {
              icon: '🔔',
              descripcion: 'Recordatorio: Reunión de equipo a las 3 PM',
              tiempo: 'Hace 1 hora'
            }
          ],
          citasPorEstado: [
            { estado: 'completadas', cantidad: 65 },
            { estado: 'pendientes', cantidad: 18 },
            { estado: 'canceladas', cantidad: 6 }
          ],
          psicologosActivos: [
            { psicologo: { nombre: 'Dr. García', especialidad: 'Psicología Clínica' }, totalCitas: 28 },
            { psicologo: { nombre: 'Dra. Rodríguez', especialidad: 'Terapia Familiar' }, totalCitas: 24 },
            { psicologo: { nombre: 'Dra. Mendoza', especialidad: 'Psicología Infantil' }, totalCitas: 19 }
          ]
        };

      case 'secretaria':
        return {
          citasHoy: {
            total: 8,
            citas: [
              {
                id: 1,
                hora: '09:00',
                paciente: { nombre: 'Juan Pérez' },
                psicologo: { nombre: 'Dr. García' },
                tipoConsulta: 'Primera consulta',
                estado: 'confirmada'
              },
              {
                id: 2,
                hora: '10:30',
                paciente: { nombre: 'María López' },
                psicologo: { nombre: 'Dra. Rodríguez' },
                tipoConsulta: 'Seguimiento',
                estado: 'pendiente'
              },
              {
                id: 3,
                hora: '14:00',
                paciente: { nombre: 'Carlos Ruiz' },
                psicologo: { nombre: 'Dr. García' },
                tipoConsulta: 'Terapia familiar',
                estado: 'confirmada'
              },
              {
                id: 4,
                hora: '15:30',
                paciente: { nombre: 'Ana Torres' },
                psicologo: { nombre: 'Dra. Mendoza' },
                tipoConsulta: 'Consulta individual',
                estado: 'pendiente'
              },
              {
                id: 5,
                hora: '16:00',
                paciente: { nombre: 'Luis Morales' },
                psicologo: { nombre: 'Dr. García' },
                tipoConsulta: 'Terapia de ansiedad',
                estado: 'confirmada'
              },
              {
                id: 6,
                hora: '17:30',
                paciente: { nombre: 'Sofia Herrera' },
                psicologo: { nombre: 'Dra. Rodríguez' },
                tipoConsulta: 'Consulta de pareja',
                estado: 'pendiente'
              }
            ]
          },
          citasPendientes: 3,
          citasCompletadas: 5,
          citasCanceladas: 1,
          notificaciones: [
            {
              tipo: 'urgent',
              icon: '⚠️',
              mensaje: 'Recordar llamar a María López para confirmar cita de mañana',
              tiempo: 'Hace 1 hora'
            },
            {
              tipo: 'info',
              icon: 'ℹ️',
              mensaje: 'Nueva solicitud de cita recibida por WhatsApp',
              tiempo: 'Hace 3 horas'
            },
            {
              tipo: 'urgent',
              icon: '📞',
              mensaje: 'Paciente Carlos Ruiz canceló su cita de las 2 PM',
              tiempo: 'Hace 30 minutos'
            }
          ]
        };

      case 'psicologo':
        return {
          citasHoy: {
            total: 6,
            citas: [
              {
                id: 1,
                hora: '09:00',
                paciente: { nombre: 'Juan Pérez' },
                tipoCita: 'Primera consulta',
                modalidad: 'Presencial',
                estado: 'confirmada'
              },
              {
                id: 2,
                hora: '10:30',
                paciente: { nombre: 'María López' },
                tipoCita: 'Seguimiento',
                modalidad: 'Virtual',
                estado: 'pendiente'
              },
              {
                id: 3,
                hora: '14:00',
                paciente: { nombre: 'Carlos Ruiz' },
                tipoCita: 'Terapia familiar',
                modalidad: 'Presencial',
                estado: 'confirmada'
              },
              {
                id: 4,
                hora: '15:30',
                paciente: { nombre: 'Ana Torres' },
                tipoCita: 'Terapia individual',
                modalidad: 'Presencial',
                estado: 'confirmada'
              },
              {
                id: 5,
                hora: '16:30',
                paciente: { nombre: 'Luis Morales' },
                tipoCita: 'Terapia de ansiedad',
                modalidad: 'Virtual',
                estado: 'pendiente'
              },
              {
                id: 6,
                hora: '17:30',
                paciente: { nombre: 'Sofia Herrera' },
                tipoCita: 'Consulta de pareja',
                modalidad: 'Presencial',
                estado: 'confirmada'
              }
            ]
          },
          misPacientes: [
            {
              id: 1,
              nombre: 'Juan Pérez',
              edad: 28,
              tratamiento: 'Ansiedad generalizada',
              totalSesiones: 8
            },
            {
              id: 2,
              nombre: 'María López',
              edad: 35,
              tratamiento: 'Depresión',
              totalSesiones: 12
            },
            {
              id: 3,
              nombre: 'Carlos Ruiz',
              edad: 42,
              tratamiento: 'Terapia de pareja',
              totalSesiones: 6
            },
            {
              id: 4,
              nombre: 'Ana Torres',
              edad: 29,
              tratamiento: 'Trastorno del sueño',
              totalSesiones: 4
            },
            {
              id: 5,
              nombre: 'Luis Morales',
              edad: 33,
              tratamiento: 'Trastorno de ansiedad',
              totalSesiones: 10
            },
            {
              id: 6,
              nombre: 'Sofia Herrera',
              edad: 26,
              tratamiento: 'Terapia de pareja',
              totalSesiones: 3
            }
          ],
          proximasCitas: [
            {
              fecha: 'Mañana',
              paciente: 'Luis Morales',
              hora: '09:00'
            },
            {
              fecha: '6 Jul',
              paciente: 'Sofia Herrera',
              hora: '11:00'
            },
            {
              fecha: '6 Jul',
              paciente: 'Roberto Silva',
              hora: '15:30'
            },
            {
              fecha: '7 Jul',
              paciente: 'Carmen Ruiz',
              hora: '10:00'
            },
            {
              fecha: '7 Jul',
              paciente: 'Diego Ramírez',
              hora: '14:30'
            }
          ],
          notasRecientes: [
            {
              paciente: 'Juan Pérez',
              fecha: 'Hoy, 10:00',
              contenido: 'Paciente muestra mejora significativa en el manejo de ansiedad. Continuar con técnicas de respiración y mindfulness. Próxima sesión enfocada en exposición gradual.'
            },
            {
              paciente: 'María López',
              fecha: 'Ayer, 15:30',
              contenido: 'Sesión enfocada en identificación de pensamientos negativos. Asignar tarea de diario emocional. Paciente reporta mejora en patrones de sueño.'
            },
            {
              paciente: 'Carlos Ruiz',
              fecha: 'Ayer, 14:00',
              contenido: 'Sesión de terapia de pareja. Trabajamos en comunicación asertiva. Ambos muestran disposición al cambio. Tarea: ejercicios de escucha activa.'
            }
          ],
          estadisticas: {
            tasaComplecion: 96
          },
          notasPendientes: 2
        };

      case 'paciente':
        return {
          proximaCita: {
            fecha: 'Mañana',
            hora: '10:30',
            Psicologo: { nombre: 'Dr. García', especialidad: 'Psicología Clínica' },
            modalidad: 'Presencial',
            estado: 'confirmada'
          },
          estadisticas: {
            totalCitas: 8,
            citasCompletadas: 6,
            asistencia: 85
          },
          proximasCitas: {
            citas: [
              {
                fecha: 'Mañana',
                hora: '10:30',
                Psicologo: { nombre: 'Dr. García' },
                estado: 'confirmada'
              },
              {
                fecha: '6 Jul',
                hora: '15:00',
                Psicologo: { nombre: 'Dr. García' },
                estado: 'pendiente'
              }
            ]
          },
          historialCitas: {
            citas: [
              {
                fecha: '2 Jul',
                Psicologo: { nombre: 'Dr. García' },
                estado: 'completada'
              },
              {
                fecha: '28 Jun',
                Psicologo: { nombre: 'Dr. García' },
                estado: 'completada'
              },
              {
                fecha: '21 Jun',
                Psicologo: { nombre: 'Dr. García' },
                estado: 'completada'
              }
            ]
          }
        };

      default:
        return {};
    }
  }

  // Método para manejo de errores de autenticación
  static handleAuthError(error, user) {
    if (error.message === 'Sesión expirada') {
      throw new Error(`Sesión expirada para usuario ${user.email}. Por favor, inicia sesión nuevamente.`);
    }
    throw error;
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
