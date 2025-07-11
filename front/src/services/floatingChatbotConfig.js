/**
 * Servicio para gestionar la configuración del chatbot flotante
 */

class FloatingChatbotConfig {
  constructor() {
    this.config = {
      // Configuración por defecto
      position: {
        bottom: '20px',
        right: '20px'
      },
      
      // Configuración por rol
      roleConfigs: {
        admin: {
          color: '#e74c3c',
          features: [
            'Gestión de usuarios',
            'Reportes del sistema',
            'Configuraciones avanzadas',
            'Monitoreo de actividad',
            'Backup y seguridad'
          ],
          greeting: 'Como administrador, puedo ayudarte con la gestión completa del sistema.'
        },
        secretaria: {
          color: '#f39c12',
          features: [
            'Gestión de citas',
            'Registro de pacientes',
            'Horarios disponibles',
            'Recordatorios',
            'Reportes básicos'
          ],
          greeting: 'Puedo ayudarte con la gestión de citas y tareas administrativas.'
        },
        psicologo: {
          color: '#27ae60',
          features: [
            'Agenda de citas',
            'Historial de pacientes',
            'Recursos profesionales',
            'Notas de sesión',
            'Herramientas de evaluación'
          ],
          greeting: 'Estoy aquí para ayudarte con información sobre pacientes y recursos profesionales.'
        },
        paciente: {
          color: '#3498db',
          features: [
            'Mis citas',
            'Agendar nueva cita',
            'Historial médico',
            'Recursos de autoayuda',
            'Contactar mi psicólogo'
          ],
          greeting: '¿Necesitas ayuda con tu cita o información sobre nuestros servicios?'
        },
        public: {
          color: '#667eea',
          features: [
            'Información sobre servicios',
            'Agendar cita',
            'Preguntas frecuentes',
            'Contacto y ubicación',
            'Horarios de atención'
          ],
          greeting: 'Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?'
        }
      },
      
      // Configuración de comportamiento
      behavior: {
        autoOpen: false,
        showUnreadBadge: true,
        typingDelay: 1000,
        maxUnreadMessages: 9,
        enableNotifications: true,
        enableSound: false
      },
      
      // Configuración de UI
      ui: {
        theme: 'light',
        borderRadius: '50%',
        showTooltip: true,
        showConnectionStatus: true,
        minimizable: true
      }
    };
  }

  /**
   * Obtiene la configuración para un rol específico
   * @param {string} role - El rol del usuario
   * @returns {object} Configuración del rol
   */
  getRoleConfig(role) {
    return this.config.roleConfigs[role] || this.config.roleConfigs.public;
  }

  /**
   * Obtiene el saludo personalizado para un rol y usuario
   * @param {string} role - El rol del usuario
   * @param {string} name - El nombre del usuario
   * @returns {string} Saludo personalizado
   */
  getGreeting(role, name) {
    const roleConfig = this.getRoleConfig(role);
    const greeting = roleConfig.greeting;
    
    if (!name || role === 'public') {
      return `¡Hola! ${greeting}`;
    }
    
    const titles = {
      admin: 'Administrador',
      secretaria: '',
      psicologo: 'Dr.',
      paciente: ''
    };
    
    const title = titles[role] || '';
    const fullName = title ? `${title} ${name}` : name;
    
    return `¡Hola ${fullName}! ${greeting}`;
  }

  /**
   * Obtiene las funcionalidades disponibles para un rol
   * @param {string} role - El rol del usuario
   * @returns {array} Lista de funcionalidades
   */
  getFeatures(role) {
    const roleConfig = this.getRoleConfig(role);
    return roleConfig.features || [];
  }

  /**
   * Obtiene el color del tema para un rol
   * @param {string} role - El rol del usuario
   * @returns {string} Color hex
   */
  getThemeColor(role) {
    const roleConfig = this.getRoleConfig(role);
    return roleConfig.color || '#667eea';
  }

  /**
   * Verifica si el chatbot debe estar visible para una ruta específica
   * @param {string} path - La ruta actual
   * @returns {boolean} Si debe ser visible
   */
  shouldShowForPath(path) {
    // Rutas donde NO debe aparecer el chatbot
    const hiddenPaths = [
      '/login',
      '/404',
      '/error'
    ];
    
    return !hiddenPaths.some(hiddenPath => path.includes(hiddenPath));
  }

  /**
   * Obtiene configuración de notificaciones
   * @returns {object} Configuración de notificaciones
   */
  getNotificationConfig() {
    return {
      enabled: this.config.behavior.enableNotifications,
      sound: this.config.behavior.enableSound,
      maxUnread: this.config.behavior.maxUnreadMessages
    };
  }

  /**
   * Obtiene configuración de posición
   * @returns {object} Configuración de posición
   */
  getPositionConfig() {
    return this.config.position;
  }

  /**
   * Actualiza la configuración
   * @param {object} newConfig - Nueva configuración
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.saveConfig();
  }

  /**
   * Guarda la configuración en localStorage
   */
  saveConfig() {
    try {
      localStorage.setItem('floatingChatbotConfig', JSON.stringify(this.config));
    } catch (error) {
      console.error('Error al guardar configuración del chatbot:', error);
    }
  }

  /**
   * Carga la configuración desde localStorage
   */
  loadConfig() {
    try {
      const savedConfig = localStorage.getItem('floatingChatbotConfig');
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        this.config = { ...this.config, ...parsedConfig };
      }
    } catch (error) {
      console.error('Error al cargar configuración del chatbot:', error);
    }
  }

  /**
   * Obtiene mensajes de respuesta rápida basados en el rol
   * @param {string} role - El rol del usuario
   * @returns {array} Lista de respuestas rápidas
   */
  getQuickResponses(role) {
    const quickResponses = {
      admin: [
        'Ver usuarios activos',
        'Generar reporte',
        'Configurar sistema',
        'Revisar logs'
      ],
      secretaria: [
        'Agendar cita',
        'Buscar paciente',
        'Ver horarios',
        'Enviar recordatorio'
      ],
      psicologo: [
        'Mi agenda',
        'Historial paciente',
        'Recursos terapéuticos',
        'Notas de sesión'
      ],
      paciente: [
        'Mis citas',
        'Agendar cita',
        'Contactar psicólogo',
        'Recursos de ayuda'
      ],
      public: [
        'Información servicios',
        'Agendar cita',
        'Preguntas frecuentes',
        'Contacto'
      ]
    };
    
    return quickResponses[role] || quickResponses.public;
  }

  /**
   * Obtiene configuración de accesibilidad
   * @returns {object} Configuración de accesibilidad
   */
  getAccessibilityConfig() {
    return {
      highContrast: false,
      largeText: false,
      reduceMotion: false,
      screenReader: false
    };
  }
}

// Crear instancia singleton
const floatingChatbotConfig = new FloatingChatbotConfig();

// Cargar configuración al inicializar
floatingChatbotConfig.loadConfig();

export default floatingChatbotConfig;
