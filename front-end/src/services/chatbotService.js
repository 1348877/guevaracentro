// Servicio de Chatbot Inteligente para Centro Psicológico Guevara
// Version 2.0 - Con IA avanzada y base de conocimiento específica

import IntelligentChatbotEngine from './intelligentChatbotEngine';
import chatbotTrainingService from './chatbotTrainingService';
import chatPersistenceService from './chatPersistenceService';

class ChatbotService {
  constructor() {
    // Usar el motor inteligente como base
    this.intelligentEngine = new IntelligentChatbotEngine();
    this.conversationHistory = [];
  }

  /**
   * Método principal para procesar mensajes - ahora usa IA avanzada
   */
  async processMessage(message, userRole = 'public', userName = 'Usuario') {
    try {
      // Usar el motor inteligente para procesar el mensaje
      const intelligentResponse = await this.intelligentEngine.processMessage(message, userRole, userName);
      
      // Agregar entrenamiento y persistencia
      await this.trainFromInteraction(message, intelligentResponse, userRole);
      await this.saveInteraction(message, intelligentResponse, userRole, userName);
      
      // Simular delay realista para mejor experiencia de usuario
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
      
      // Convertir al formato esperado por el componente
      return {
        message: intelligentResponse.message,
        type: intelligentResponse.type || 'contextual',
        suggestedActions: intelligentResponse.suggestedActions || [],
        confidence: intelligentResponse.confidence || 0.8,
        actionRoutes: intelligentResponse.actionRoutes || [],
        entities: intelligentResponse.entities || {},
        requiresImmediateAction: intelligentResponse.requiresImmediateAction || false
      };
      
    } catch (error) {
      console.error('Error en processMessage:', error);
      return this.getFallbackResponse();
    }
  }

  /**
   * Guarda la interacción para persistencia
   */
  async saveInteraction(userMessage, botResponse, userRole, userName) {
    try {
      await chatPersistenceService.saveMessage({
        userMessage,
        botResponse: botResponse.message,
        userRole,
        userName,
        timestamp: new Date().toISOString(),
        confidence: botResponse.confidence,
        type: botResponse.type
      });
    } catch (error) {
      console.error('Error al guardar interacción:', error);
    }
  }

  /**
   * Entrena el sistema basado en la interacción
   */
  async trainFromInteraction(userMessage, botResponse, userRole) {
    try {
      chatbotTrainingService.learnFromInteraction(
        userMessage, 
        botResponse.message, 
        { 
          userRole, 
          confidence: botResponse.confidence,
          type: botResponse.type,
          timestamp: new Date().toISOString()
        }
      );
    } catch (error) {
      console.error('Error en entrenamiento:', error);
    }
  }

  /**
   * Respuesta de fallback cuando hay errores
   */
  getFallbackResponse() {
    return {
      message: 'Lo siento, estoy teniendo dificultades técnicas en este momento. Por favor, puedes contactarnos directamente al +57 301 234 5678 o intentar nuevamente. Tu bienestar es importante para nosotros.',
      type: 'error',
      suggestedActions: ['Llamar Ahora', 'Intentar Nuevamente', 'WhatsApp'],
      actionRoutes: ['tel:+573012345678', 'refresh', 'https://wa.me/573012345678'],
      confidence: 1.0
    };
  }

  /**
   * Obtiene mensaje de bienvenida personalizado
   */
  getWelcomeMessage(userRole = 'public', userName = 'Usuario') {
    return this.intelligentEngine.getWelcomeMessage(userRole, userName);
  }

  /**
   * Resetea el contexto de conversación
   */
  resetContext() {
    this.intelligentEngine.resetContext();
    this.conversationHistory = [];
  }

  /**
   * Obtiene el historial de conversación
   */
  async getConversationHistory() {
    try {
      return await chatPersistenceService.getConversationHistory();
    } catch (error) {
      console.error('Error al obtener historial:', error);
      return [];
    }
  }

  /**
   * Limpia el historial de conversación
   */
  async clearConversationHistory() {
    try {
      await chatPersistenceService.clearHistory();
      this.conversationHistory = [];
      return true;
    } catch (error) {
      console.error('Error al limpiar historial:', error);
      return false;
    }
  }

  /**
   * Obtiene estadísticas del chatbot
   */
  async getChatbotStats() {
    try {
      const stats = await chatbotTrainingService.getStats();
      return stats;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      return null;
    }
  }

  /**
   * Exporta datos de entrenamiento
   */
  async exportTrainingData() {
    try {
      return await chatbotTrainingService.exportTrainingData();
    } catch (error) {
      console.error('Error al exportar datos:', error);
      return null;
    }
  }

  /**
   * Importa datos de entrenamiento
   */
  async importTrainingData(data) {
    try {
      return await chatbotTrainingService.importTrainingData(data);
    } catch (error) {
      console.error('Error al importar datos:', error);
      return false;
    }
  }

  /**
   * Obtiene recomendaciones inteligentes basadas en el contexto
   */
  getSmartRecommendations(userRole, currentPage) {
    const recommendations = {
      'public': {
        '/': ['Conocer Servicios', 'Agendar Cita', 'Leer FAQ'],
        '/servicios': ['Agendar Cita', 'Ver Equipo', 'Contactar'],
        '/equipo': ['Agendar con Especialista', 'Ver Servicios', 'Contactar'],
        '/contacto': ['Agendar Cita', 'Llamar Ahora', 'WhatsApp']
      },
      'paciente': {
        '/dashboard': ['Ver Mis Citas', 'Agendar Nueva', 'Mi Historial'],
        '/agendar': ['Seleccionar Especialista', 'Ver Horarios', 'Confirmar'],
        '/': ['Ir a Dashboard', 'Mis Citas', 'Servicios']
      },
      'psicologo': {
        '/dashboard': ['Mi Agenda', 'Ver Pacientes', 'Recursos'],
        '/pacientes': ['Buscar Paciente', 'Nuevo Registro', 'Reportes'],
        '/': ['Ir a Dashboard', 'Mi Agenda', 'Pacientes']
      },
      'admin': {
        '/dashboard': ['Gestionar Usuarios', 'Ver Reportes', 'Configurar'],
        '/pacientes': ['Todos los Pacientes', 'Reportes', 'Exportar'],
        '/': ['Panel Admin', 'Dashboard', 'Configuración']
      }
    };

    return recommendations[userRole]?.[currentPage] || recommendations['public']['/'];
  }

  /**
   * Procesa comandos especiales del chatbot
   */
  async processSpecialCommand(command, userRole) {
    const commands = {
      '/help': () => this.getHelpMessage(userRole),
      '/stats': () => this.getChatbotStats(),
      '/clear': () => this.clearConversationHistory(),
      '/export': () => this.exportTrainingData(),
      '/emergency': () => this.getEmergencyResponse(),
      '/contact': () => this.getContactInfo()
    };

    const commandFunction = commands[command.toLowerCase()];
    if (commandFunction) {
      return await commandFunction();
    }

    return null;
  }

  /**
   * Obtiene mensaje de ayuda específico por rol
   */
  getHelpMessage(userRole) {
    const helpMessages = {
      'admin': 'Comandos disponibles: /stats (estadísticas), /export (exportar datos), /clear (limpiar historial)',
      'psicologo': 'Puedo ayudarte con: agenda de pacientes, recursos profesionales, herramientas clínicas',
      'secretaria': 'Puedo ayudarte con: gestión de citas, información de pacientes, horarios',
      'paciente': 'Puedo ayudarte con: agendar citas, ver tus citas, información de servicios',
      'public': 'Puedo ayudarte con: información de servicios, agendar citas, contacto, preguntas frecuentes'
    };

    return {
      message: helpMessages[userRole] || helpMessages['public'],
      type: 'help',
      suggestedActions: ['Ver Servicios', 'Agendar Cita', 'Contactar'],
      confidence: 1.0
    };
  }

  /**
   * Obtiene respuesta de emergencia
   */
  getEmergencyResponse() {
    return {
      message: '🚨 Si tienes una emergencia médica o crisis psicológica:\n\n• Llama al 123 (Emergencias)\n• Línea Nacional 106 (24/7 gratuita)\n• Centro Guevara: +57 301 234 5678\n\nTu seguridad y bienestar son lo más importante.',
      type: 'emergency',
      suggestedActions: ['Llamar 123', 'Llamar 106', 'Llamar Centro'],
      actionRoutes: ['tel:123', 'tel:106', 'tel:+573012345678'],
      requiresImmediateAction: true,
      confidence: 1.0
    };
  }

  /**
   * Obtiene información de contacto
   */
  getContactInfo() {
    return {
      message: '📞 Centro Médico Psicológico Guevara\n\n• Teléfono: +57 301 234 5678\n• WhatsApp: +57 301 234 5678\n• Email: info@centroguevara.com\n• Dirección: Calle 123 #45-67, Bogotá\n\n🕐 Horarios:\n• Lunes a Viernes: 8:00 AM - 7:00 PM\n• Sábados: 8:00 AM - 2:00 PM',
      type: 'contact',
      suggestedActions: ['Llamar', 'WhatsApp', 'Ver Mapa'],
      actionRoutes: ['tel:+573012345678', 'https://wa.me/573012345678', '/contacto#ubicacion'],
      confidence: 1.0
    };
  }
}

// Exportar instancia singleton
const chatbotService = new ChatbotService();
export default chatbotService;
