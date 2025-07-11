/**
 * Sistema de entrenamiento y aprendizaje para el chatbot
 */

import chatPersistenceService from './chatPersistenceService';

class ChatbotTrainingService {
  constructor() {
    this.learningData = {
      intents: {},
      responses: {},
      contexts: {},
      patterns: {},
      userProfiles: {}
    };
    
    this.loadTrainingData();
  }

  /**
   * Carga datos de entrenamiento desde localStorage
   */
  loadTrainingData() {
    try {
      const savedData = localStorage.getItem('chatbotTrainingData');
      if (savedData) {
        this.learningData = { ...this.learningData, ...JSON.parse(savedData) };
      }
      
      // Cargar datos del historial de conversación
      this.processConversationHistory();
    } catch (error) {
      console.error('Error al cargar datos de entrenamiento:', error);
    }
  }

  /**
   * Guarda datos de entrenamiento en localStorage
   */
  saveTrainingData() {
    try {
      localStorage.setItem('chatbotTrainingData', JSON.stringify(this.learningData));
    } catch (error) {
      console.error('Error al guardar datos de entrenamiento:', error);
    }
  }

  /**
   * Procesa el historial de conversación para extraer patrones
   */
  processConversationHistory() {
    const history = chatPersistenceService.getConversationHistory();
    
    history.forEach(entry => {
      this.learnFromInteraction(entry.userInput, entry.botResponse, entry.context);
    });
  }

  /**
   * Aprende de una interacción usuario-bot
   * @param {string} userInput - Entrada del usuario
   * @param {string} botResponse - Respuesta del bot
   * @param {Object} context - Contexto de la conversación
   */
  learnFromInteraction(userInput, botResponse, context = {}) {
    try {
      const normalizedInput = this.normalizeInput(userInput);
      const intent = this.extractIntent(normalizedInput);
      const keywords = this.extractKeywords(normalizedInput);
      
      // Guardar patrón de entrada
      if (!this.learningData.patterns[intent]) {
        this.learningData.patterns[intent] = [];
      }
      
      if (!this.learningData.patterns[intent].includes(normalizedInput)) {
        this.learningData.patterns[intent].push(normalizedInput);
      }
      
      // Guardar respuesta asociada
      if (!this.learningData.responses[intent]) {
        this.learningData.responses[intent] = [];
      }
      
      if (!this.learningData.responses[intent].includes(botResponse)) {
        this.learningData.responses[intent].push(botResponse);
      }
      
      // Guardar contexto
      if (context && Object.keys(context).length > 0) {
        this.learningData.contexts[intent] = {
          ...this.learningData.contexts[intent],
          ...context
        };
      }
      
      // Guardar palabras clave
      keywords.forEach(keyword => {
        if (!this.learningData.intents[keyword]) {
          this.learningData.intents[keyword] = [];
        }
        if (!this.learningData.intents[keyword].includes(intent)) {
          this.learningData.intents[keyword].push(intent);
        }
      });
      
      this.saveTrainingData();
    } catch (error) {
      console.error('Error al aprender de interacción:', error);
    }
  }

  /**
   * Normaliza la entrada del usuario
   * @param {string} input - Entrada del usuario
   * @returns {string} Entrada normalizada
   */
  normalizeInput(input) {
    return input
      .toLowerCase()
      .trim()
      .replace(/[¿?¡!.,;:]/g, '')
      .replace(/\s+/g, ' ');
  }

  /**
   * Extrae el intento de la entrada del usuario
   * @param {string} input - Entrada normalizada
   * @returns {string} Intento extraído
   */
  extractIntent(input) {
    const intentPatterns = {
      'agendar_cita': ['agendar', 'cita', 'turno', 'hora', 'reservar', 'solicitar'],
      'informacion_servicios': ['servicios', 'que ofrecen', 'tratamientos', 'terapia'],
      'preguntas_frecuentes': ['pregunta', 'duda', 'faq', 'ayuda', 'información'],
      'contacto': ['contacto', 'telefono', 'direccion', 'ubicacion', 'donde'],
      'horarios': ['horario', 'hora', 'cuando', 'abierto', 'funcionamiento'],
      'precios': ['precio', 'costo', 'cuanto', 'tarifa', 'pago'],
      'equipo': ['equipo', 'psicologo', 'doctor', 'profesional', 'quien'],
      'saludo': ['hola', 'buenos dias', 'buenas tardes', 'buenas noches', 'saludos'],
      'despedida': ['adios', 'gracias', 'hasta luego', 'nos vemos', 'chao'],
      'cancelar_cita': ['cancelar', 'cambiar', 'mover', 'reprogramar'],
      'emergencia': ['emergencia', 'urgente', 'crisis', 'ayuda inmediata']
    };
    
    let bestMatch = 'general';
    let maxMatches = 0;
    
    Object.entries(intentPatterns).forEach(([intent, patterns]) => {
      const matches = patterns.filter(pattern => input.includes(pattern)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = intent;
      }
    });
    
    return bestMatch;
  }

  /**
   * Extrae palabras clave de la entrada
   * @param {string} input - Entrada normalizada
   * @returns {Array} Palabras clave
   */
  extractKeywords(input) {
    const stopWords = ['el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le', 'da', 'su', 'por', 'son', 'con', 'para', 'al', 'me', 'mi', 'tu', 'si', 'yo', 'pero', 'muy', 'mas', 'como', 'una', 'las', 'los', 'del', 'sus', 'nos', 'este', 'esta', 'esto', 'ese', 'esa', 'eso'];
    
    return input
      .split(' ')
      .filter(word => word.length > 2 && !stopWords.includes(word))
      .slice(0, 5); // Limitar a 5 palabras clave
  }

  /**
   * Genera una respuesta mejorada basada en el entrenamiento
   * @param {string} input - Entrada del usuario
   * @param {string} userRole - Rol del usuario
   * @param {Object} context - Contexto actual
   * @returns {Object} Respuesta mejorada
   */
  generateImprovedResponse(input, userRole = 'public', context = {}) {
    try {
      const normalizedInput = this.normalizeInput(input);
      const intent = this.extractIntent(normalizedInput);
      const keywords = this.extractKeywords(normalizedInput);
      
      // Buscar respuestas aprendidas
      const learnedResponses = this.learningData.responses[intent] || [];
      const contextualInfo = this.learningData.contexts[intent] || {};
      
      // Generar respuesta base
      let response = this.getBaseResponse(intent, userRole);
      
      // Mejorar con información aprendida
      if (learnedResponses.length > 0) {
        // Variar respuestas para evitar repetición
        const randomResponse = learnedResponses[Math.floor(Math.random() * learnedResponses.length)];
        if (Math.random() > 0.5) { // 50% de probabilidad de usar respuesta aprendida
          response = randomResponse;
        }
      }
      
      // Agregar información contextual
      if (contextualInfo && Object.keys(contextualInfo).length > 0) {
        response += this.addContextualInfo(contextualInfo, intent);
      }
      
      // Generar acciones sugeridas inteligentes
      const suggestedActions = this.generateSmartSuggestions(intent, keywords, userRole);
      
      // Guardar esta interacción para futuro aprendizaje
      const interactionData = {
        userInput: input,
        botResponse: response,
        context: { ...context, intent, keywords },
        topic: intent,
        timestamp: new Date().toISOString()
      };
      
      chatPersistenceService.saveConversationHistory(interactionData);
      
      return {
        message: response,
        type: intent,
        suggestedActions,
        confidence: this.calculateConfidence(intent, keywords),
        context: { intent, keywords }
      };
      
    } catch (error) {
      console.error('Error al generar respuesta mejorada:', error);
      return {
        message: 'Lo siento, hubo un error al procesar tu mensaje. ¿Podrías intentar de nuevo?',
        type: 'error',
        suggestedActions: ['Reintentar', 'Hablar con un humano', 'Menú principal'],
        confidence: 0.1
      };
    }
  }

  /**
   * Obtiene respuesta base según el intento
   * @param {string} intent - Intento identificado
   * @param {string} userRole - Rol del usuario
   * @returns {string} Respuesta base
   */
  getBaseResponse(intent, userRole) {
    const responses = {
      'agendar_cita': {
        'public': 'Te ayudo a agendar una cita. Puedes hacerlo directamente en nuestra página o llamando al (123) 456-7890.',
        'paciente': 'Perfecto, veo que quieres agendar una cita. Te redirijo a tu panel de citas.',
        'admin': 'Como administrador, puedes gestionar todas las citas del sistema.',
        'secretaria': 'Te ayudo con la gestión de citas. ¿Para qué paciente necesitas agendar?'
      },
      'informacion_servicios': {
        'public': 'Ofrecemos terapia individual, terapia de pareja, terapia familiar y evaluaciones psicológicas.',
        'paciente': 'Estos son los servicios disponibles para ti según tu plan de tratamiento.',
        'admin': 'Aquí tienes el catálogo completo de servicios que ofrecemos.',
        'psicologo': 'Información sobre los servicios que puedes ofrecer a tus pacientes.'
      },
      'preguntas_frecuentes': {
        'public': 'Aquí están las preguntas más comunes de nuestros usuarios.',
        'paciente': 'Estas son las preguntas frecuentes relacionadas con tu tratamiento.',
        'admin': 'FAQ del sistema y preguntas administrativas.',
        'secretaria': 'Preguntas frecuentes sobre gestión de citas y pacientes.'
      },
      'contacto': {
        'public': 'Puedes contactarnos al (123) 456-7890 o visitarnos en Calle Principal 123.',
        'paciente': 'Para contactar a tu psicólogo o cambiar datos de contacto.',
        'admin': 'Información de contacto del centro y datos administrativos.',
        'secretaria': 'Datos de contacto para gestión administrativa.'
      },
      'horarios': {
        'public': 'Atendemos de lunes a viernes de 8:00 AM a 6:00 PM, sábados de 9:00 AM a 2:00 PM.',
        'paciente': 'Aquí están los horarios disponibles para tu psicólogo.',
        'admin': 'Gestión de horarios del centro y disponibilidad.',
        'secretaria': 'Horarios de atención y disponibilidad para agendar citas.'
      },
      'saludo': {
        'public': '¡Hola! Bienvenido al Centro Psicológico Integral. ¿En qué puedo ayudarte?',
        'paciente': '¡Hola! Me alegra verte de nuevo. ¿Cómo puedo ayudarte hoy?',
        'admin': '¡Hola! Como administrador, tienes acceso completo al sistema.',
        'secretaria': '¡Hola! Lista para ayudarte con las tareas administrativas.'
      },
      'despedida': {
        'public': '¡Gracias por visitarnos! Que tengas un excelente día.',
        'paciente': '¡Hasta pronto! Recuerda que estamos aquí para apoyarte.',
        'admin': '¡Hasta luego! Que tengas un buen día.',
        'secretaria': '¡Nos vemos! Cualquier cosa que necesites, aquí estoy.'
      }
    };
    
    return responses[intent]?.[userRole] || responses[intent]?.['public'] || 'Entiendo tu consulta, déjame ayudarte con eso.';
  }

  /**
   * Agrega información contextual a la respuesta
   * @param {Object} contextInfo - Información contextual
   * @param {string} intent - Intento identificado
   * @returns {string} Información adicional
   */
  addContextualInfo(contextInfo, intent) {
    if (intent === 'agendar_cita' && contextInfo.availableSlots) {
      return ` Los horarios disponibles más próximos son: ${contextInfo.availableSlots.join(', ')}.`;
    }
    
    if (intent === 'informacion_servicios' && contextInfo.specialties) {
      return ` Nuestras especialidades incluyen: ${contextInfo.specialties.join(', ')}.`;
    }
    
    return '';
  }

  /**
   * Genera sugerencias inteligentes basadas en el contexto
   * @param {string} intent - Intento identificado
   * @param {Array} keywords - Palabras clave
   * @param {string} userRole - Rol del usuario
   * @returns {Array} Sugerencias inteligentes
   */
  generateSmartSuggestions(intent, keywords, userRole) {
    const suggestions = {
      'agendar_cita': {
        'public': ['Ver horarios disponibles', 'Tipos de terapia', 'Contactar por teléfono'],
        'paciente': ['Agendar ahora', 'Ver mis citas', 'Cancelar cita existente']
      },
      'informacion_servicios': {
        'public': ['Agendar consulta', 'Ver precios', 'Conocer al equipo'],
        'paciente': ['Mis servicios', 'Cambiar tipo de terapia', 'Hablar con mi psicólogo']
      },
      'preguntas_frecuentes': {
        'public': ['Ver más preguntas', 'Contactar soporte', 'Agendar cita'],
        'paciente': ['Preguntas sobre mi tratamiento', 'Contactar mi psicólogo', 'Ver recursos']
      },
      'contacto': {
        'public': ['Llamar ahora', 'Ver ubicación', 'Enviar mensaje'],
        'paciente': ['Contactar mi psicólogo', 'Actualizar mis datos', 'Emergencia']
      },
      'saludo': {
        'public': ['Información servicios', 'Agendar cita', 'Preguntas frecuentes'],
        'paciente': ['Mis citas', 'Recursos de ayuda', 'Contactar psicólogo']
      }
    };
    
    return suggestions[intent]?.[userRole] || suggestions[intent]?.['public'] || ['Más información', 'Menú principal', 'Contacto'];
  }

  /**
   * Calcula la confianza de la respuesta
   * @param {string} intent - Intento identificado
   * @param {Array} keywords - Palabras clave
   * @returns {number} Nivel de confianza (0-1)
   */
  calculateConfidence(intent, keywords) {
    const baseConfidence = 0.7;
    const keywordBonus = Math.min(keywords.length * 0.05, 0.2);
    const learningBonus = this.learningData.patterns[intent]?.length > 0 ? 0.1 : 0;
    
    return Math.min(baseConfidence + keywordBonus + learningBonus, 1.0);
  }

  /**
   * Obtiene estadísticas del entrenamiento
   * @returns {Object} Estadísticas
   */
  getTrainingStats() {
    return {
      totalPatterns: Object.keys(this.learningData.patterns).length,
      totalResponses: Object.keys(this.learningData.responses).length,
      totalContexts: Object.keys(this.learningData.contexts).length,
      totalIntents: Object.keys(this.learningData.intents).length,
      lastTraining: localStorage.getItem('lastTrainingUpdate') || 'Never'
    };
  }

  /**
   * Reinicia los datos de entrenamiento
   */
  resetTraining() {
    this.learningData = {
      intents: {},
      responses: {},
      contexts: {},
      patterns: {},
      userProfiles: {}
    };
    
    localStorage.removeItem('chatbotTrainingData');
    localStorage.removeItem('lastTrainingUpdate');
  }

  /**
   * Exporta datos de entrenamiento
   * @returns {Object} Datos exportados
   */
  exportTrainingData() {
    return {
      learningData: this.learningData,
      stats: this.getTrainingStats(),
      conversationHistory: chatPersistenceService.getConversationHistory(),
      exportDate: new Date().toISOString()
    };
  }

  /**
   * Agrega una entrada de entrenamiento manualmente
   * @param {Object} entry - Entrada de entrenamiento
   */
  addTrainingEntry(entry) {
    const { question, answer, category, confidence } = entry;
    
    // Normalizar la pregunta
    const normalizedQuestion = this.normalizeText(question);
    const keywords = this.extractKeywords(normalizedQuestion);
    
    // Crear un intent basado en la categoría y palabras clave
    const intent = `${category}_${keywords.slice(0, 3).join('_')}`;
    
    // Agregar al sistema de entrenamiento
    this.learningData.patterns[intent] = {
      pattern: normalizedQuestion,
      keywords,
      confidence: confidence || 0.8,
      category,
      timestamp: new Date().toISOString()
    };
    
    // Agregar respuesta
    if (!this.learningData.responses[intent]) {
      this.learningData.responses[intent] = [];
    }
    this.learningData.responses[intent].push(answer);
    
    // Agregar contexto
    this.learningData.contexts[intent] = {
      category,
      confidence,
      userAdded: true,
      timestamp: new Date().toISOString()
    };
    
    // Agregar palabras clave
    keywords.forEach(keyword => {
      if (!this.learningData.intents[keyword]) {
        this.learningData.intents[keyword] = [];
      }
      if (!this.learningData.intents[keyword].includes(intent)) {
        this.learningData.intents[keyword].push(intent);
      }
    });
    
    // Guardar datos
    this.saveTrainingData();
    
    console.log(`Entrada de entrenamiento agregada: ${intent}`);
  }
}

// Crear instancia singleton
const chatbotTrainingService = new ChatbotTrainingService();

export default chatbotTrainingService;
