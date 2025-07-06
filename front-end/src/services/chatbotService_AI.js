// Intelligent Chatbot Service - Integración con IA Real
import aiService from './aiService';

class ChatbotService {
  constructor() {
    this.context = {
      conversationFlow: [],
      userProfile: {},
      currentIntent: null,
      emergencyDetected: false,
      lastInteraction: null
    };
    
    this.intents = {
      GREETING: ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'saludos'],
      APPOINTMENT: ['cita', 'agendar', 'reservar', 'horario', 'disponible', 'consulta'],
      EMERGENCY: ['crisis', 'suicidio', 'emergencia', 'urgente', 'ayuda inmediata', 'me quiero morir'],
      ANXIETY: ['ansiedad', 'ansioso', 'nervioso', 'pánico', 'miedo', 'preocupado'],
      DEPRESSION: ['depresión', 'triste', 'deprimido', 'sin ánimo', 'melancolía'],
      RELATIONSHIP: ['pareja', 'matrimonio', 'relación', 'familia', 'hijos', 'conflicto familiar'],
      INFO: ['información', 'servicios', 'costos', 'precio', 'ubicación', 'contacto'],
      GOODBYE: ['adiós', 'hasta luego', 'nos vemos', 'gracias', 'chau']
    };

    this.useAI = true; // Activar IA por defecto
  }

  // Activar/Desactivar IA
  toggleAI(enabled = true) {
    this.useAI = enabled;
    console.log(`🤖 IA ${enabled ? 'activada' : 'desactivada'}`);
  }

  // Procesar mensaje principal
  async processMessage(message, userRole = 'paciente', userName = 'Usuario') {
    this.context.lastInteraction = new Date().toISOString();
    this.context.userProfile = { role: userRole, name: userName };
    
    // Detectar emergencias primero
    if (this.detectEmergency(message)) {
      return this.handleEmergency(message);
    }

    // Si la IA está activada, usar respuesta inteligente
    if (this.useAI) {
      try {
        const aiResponse = await aiService.generateResponse(message, {
          userRole,
          userName,
          situation: this.getCurrentSituation(),
          conversationHistory: this.context.conversationFlow
        });

        // Combinar respuesta de IA con lógica específica
        return this.enhanceAIResponse(aiResponse, message, userRole);
        
      } catch (error) {
        console.warn('⚠️ Error en IA, usando respuesta de emergencia:', error);
        // Fallback a respuestas programadas
        return this.getStaticResponse(message, userRole);
      }
    } else {
      // Usar solo respuestas programadas
      return this.getStaticResponse(message, userRole);
    }
  }

  // Mejorar respuesta de IA con lógica específica
  enhanceAIResponse(aiResponse, userMessage, userRole) {
    const intent = this.detectIntent(userMessage);
    
    // Agregar acciones específicas según intención
    let suggestedActions = aiResponse.suggestedActions || [];
    
    switch (intent) {
      case 'APPOINTMENT':
        suggestedActions = ['Solicitar cita online', 'Ver horarios', 'Llamar al centro'];
        break;
      case 'ANXIETY':
        suggestedActions = ['Técnicas de respiración', 'Agendar consulta', 'Recursos de autoayuda'];
        break;
      case 'DEPRESSION':
        suggestedActions = ['Hablar con profesional', 'Agendar cita urgente', 'Línea de apoyo'];
        break;
      case 'INFO':
        suggestedActions = ['Ver servicios', 'Consultar precios', 'Ubicación del centro'];
        break;
    }

    // Personalizar según rol
    if (userRole === 'psicologo') {
      suggestedActions = ['Ver agenda del día', 'Pacientes asignados', 'Recursos clínicos'];
    } else if (userRole === 'secretaria') {
      suggestedActions = ['Gestionar citas', 'Ver calendario', 'Contactar pacientes'];
    }

    return {
      message: aiResponse.message,
      type: aiResponse.type || 'info',
      intent: intent,
      confidence: aiResponse.confidence || 0.8,
      suggestedActions: suggestedActions.slice(0, 3),
      emotion: aiResponse.emotion || 'neutral',
      timestamp: new Date().toISOString()
    };
  }

  // Respuestas estáticas como fallback
  getStaticResponse(message, userRole) {
    const intent = this.detectIntent(message);
    const responses = this.getResponsesByIntent(intent, userRole);
    const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      message: selectedResponse.message,
      type: selectedResponse.type,
      intent: intent,
      confidence: 0.7,
      suggestedActions: selectedResponse.actions,
      emotion: 'neutral',
      timestamp: new Date().toISOString()
    };
  }

  // Detectar intención del mensaje
  detectIntent(message) {
    const text = message.toLowerCase();
    
    for (const [intent, keywords] of Object.entries(this.intents)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        this.context.currentIntent = intent;
        return intent;
      }
    }
    
    return 'UNKNOWN';
  }

  // Detectar emergencias
  detectEmergency(message) {
    const emergencyKeywords = this.intents.EMERGENCY;
    const text = message.toLowerCase();
    
    const isEmergency = emergencyKeywords.some(keyword => text.includes(keyword));
    this.context.emergencyDetected = isEmergency;
    
    return isEmergency;
  }

  // Manejar emergencias
  handleEmergency(message) {
    return {
      message: '🚨 Detecté que podrías estar pasando por una situación difícil. Tu bienestar es nuestra prioridad. Por favor, contacta inmediatamente a nuestro equipo de crisis o llama a la línea de emergencia.',
      type: 'emergency',
      intent: 'EMERGENCY',
      confidence: 1.0,
      suggestedActions: [
        'Llamar línea de crisis: 113',
        'Contacto inmediato',
        'Whatsapp: +51962376425'
      ],
      emotion: 'crisis',
      timestamp: new Date().toISOString()
    };
  }

  // Obtener respuestas por intención
  getResponsesByIntent(intent, userRole) {
    const responses = {
      GREETING: [
        {
          message: `¡Hola! Soy el asistente virtual del Centro Psicológico Guevara. ¿En qué puedo ayudarte hoy?`,
          type: 'greeting',
          actions: ['Agendar cita', 'Ver servicios', 'Información general']
        }
      ],
      APPOINTMENT: [
        {
          message: 'Te ayudo a agendar tu cita. Nuestros horarios son de lunes a viernes de 8:00 AM a 6:00 PM.',
          type: 'info',
          actions: ['Solicitar cita online', 'Ver disponibilidad', 'Llamar al centro']
        }
      ],
      ANXIETY: [
        {
          message: 'Entiendo que puedas estar sintiendo ansiedad. Es importante que sepas que no estás solo y que hay formas efectivas de manejarla.',
          type: 'support',
          actions: ['Técnicas de respiración', 'Agendar consulta', 'Más información']
        }
      ],
      DEPRESSION: [
        {
          message: 'Comprendo lo difícil que puede ser lo que estás sintiendo. Buscar ayuda es un paso valiente e importante.',
          type: 'support',
          actions: ['Hablar con profesional', 'Agendar cita', 'Recursos de apoyo']
        }
      ],
      INFO: [
        {
          message: 'El Centro Psicológico Guevara ofrece consultas individuales, terapia familiar, evaluaciones psicológicas y tratamientos especializados.',
          type: 'info',
          actions: ['Ver todos los servicios', 'Consultar precios', 'Ubicación']
        }
      ],
      UNKNOWN: [
        {
          message: 'Entiendo tu consulta. ¿Podrías contarme un poco más sobre lo que necesitas?',
          type: 'clarification',
          actions: ['Agendar cita', 'Ver servicios', 'Contactar equipo']
        }
      ]
    };

    return responses[intent] || responses.UNKNOWN;
  }

  // Mensaje de bienvenida
  getWelcomeMessage(userRole, userName) {
    const welcomeMessages = {
      paciente: `¡Hola ${userName}! Bienvenido al Centro Psicológico Guevara. Estoy aquí para apoyarte y orientarte. ¿En qué puedo ayudarte hoy?`,
      psicologo: `¡Hola Dr. ${userName}! ¿Cómo puedo asistirte con tu práctica profesional hoy?`,
      secretaria: `¡Hola ${userName}! ¿Necesitas ayuda con la gestión de citas o información de pacientes?`,
      admin: `¡Hola ${userName}! ¿En qué aspecto administrativo puedo ayudarte hoy?`
    };

    const message = welcomeMessages[userRole] || welcomeMessages.paciente;
    
    return {
      message,
      type: 'welcome',
      intent: 'GREETING',
      confidence: 1.0,
      suggestedActions: this.getWelcomeSuggestions(userRole),
      emotion: 'positive',
      timestamp: new Date().toISOString()
    };
  }

  // Sugerencias de bienvenida
  getWelcomeSuggestions(userRole) {
    const suggestions = {
      paciente: ['Agendar cita', 'Ver servicios', 'Tengo una consulta'],
      psicologo: ['Ver agenda', 'Pacientes del día', 'Recursos clínicos'],
      secretaria: ['Gestionar citas', 'Ver calendario', 'Información de pacientes'],
      admin: ['Dashboard general', 'Reportes', 'Configuración']
    };

    return suggestions[userRole] || suggestions.paciente;
  }

  // Obtener situación actual
  getCurrentSituation() {
    if (this.context.emergencyDetected) return 'crisis_detected';
    if (this.context.currentIntent) return this.context.currentIntent.toLowerCase();
    return 'general_consultation';
  }

  // Reiniciar contexto
  resetContext() {
    this.context = {
      conversationFlow: [],
      userProfile: {},
      currentIntent: null,
      emergencyDetected: false,
      lastInteraction: null
    };
    
    // También limpiar historial de IA
    if (aiService) {
      aiService.clearHistory();
    }
  }

  // Obtener estadísticas del chatbot
  getStats() {
    return {
      conversationLength: this.context.conversationFlow.length,
      currentIntent: this.context.currentIntent,
      emergencyDetected: this.context.emergencyDetected,
      lastInteraction: this.context.lastInteraction,
      aiEnabled: this.useAI,
      aiStats: aiService ? aiService.getStats() : null
    };
  }

  // Configurar API Key de IA
  setAIApiKey(apiKey) {
    if (aiService) {
      aiService.setApiKey(apiKey);
    }
  }
}

// Instancia singleton
const chatbotService = new ChatbotService();
export default chatbotService;
