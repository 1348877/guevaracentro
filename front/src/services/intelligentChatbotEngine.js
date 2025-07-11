/**
 * Motor de IA Inteligente para el Centro Médico Psicológico Guevara
 * Procesamiento avanzado de lenguaje natural y navegación inteligente
 */

import centroGuevaraKnowledgeBase from '../data/centroGuevaraKnowledgeBase.js';

class IntelligentChatbotEngine {
  constructor() {
    this.knowledgeBase = centroGuevaraKnowledgeBase;
    this.conversationContext = new Map();
    this.userProfile = null;
    this.sessionHistory = [];
  }

  /**
   * Procesa el mensaje del usuario usando IA avanzada
   */
  async processMessage(message, userRole = 'public', userName = 'Usuario') {
    try {
      // Limpiar y normalizar el mensaje
      const normalizedMessage = this.normalizeMessage(message);
      
      // Detectar intención
      const intention = this.detectIntention(normalizedMessage);
      
      // Extraer entidades (nombres, fechas, servicios, etc.)
      const entities = this.extractEntities(normalizedMessage);
      
      // Generar respuesta contextual
      const response = await this.generateContextualResponse(
        normalizedMessage, 
        intention, 
        entities, 
        userRole, 
        userName
      );
      
      // Guardar en historial para contexto futuro
      this.addToSessionHistory(message, response, intention);
      
      return response;
      
    } catch (error) {
      console.error('Error en motor de IA:', error);
      return this.getFallbackResponse();
    }
  }

  /**
   * Normaliza el mensaje para mejor procesamiento
   */
  normalizeMessage(message) {
    return message
      .toLowerCase()
      .trim()
      .replace(/[^\w\sáéíóúñüç]/g, '') // Mantener caracteres especiales del español
      .replace(/\s+/g, ' ');
  }

  /**
   * Detecta la intención del usuario usando procesamiento de lenguaje natural
   */
  detectIntention(message) {
    const intentions = this.knowledgeBase.intenciones;
    let bestMatch = { intention: 'general', confidence: 0 };

    for (const [intentionKey, intentionData] of Object.entries(intentions)) {
      let confidence = 0;
      const phrases = intentionData.frases;

      for (const phrase of phrases) {
        const similarity = this.calculateSimilarity(message, phrase);
        confidence = Math.max(confidence, similarity);
      }

      // Boost para coincidencias exactas de palabras clave
      const keywordBoost = this.calculateKeywordBoost(message, intentionKey);
      confidence += keywordBoost;

      if (confidence > bestMatch.confidence) {
        bestMatch = { intention: intentionKey, confidence };
      }
    }

    // Solo consideramos válida si la confianza es alta
    return bestMatch.confidence > 0.4 ? bestMatch.intention : 'general';
  }

  /**
   * Calcula similitud entre dos strings usando algoritmo mejorado
   */
  calculateSimilarity(str1, str2) {
    const words1 = str1.split(' ');
    const words2 = str2.split(' ');
    
    let matches = 0;
    const totalWords = Math.max(words1.length, words2.length);
    
    for (const word1 of words1) {
      if (words2.some(word2 => 
        word2.includes(word1) || 
        word1.includes(word2) || 
        this.areSynonyms(word1, word2)
      )) {
        matches++;
      }
    }
    
    return matches / totalWords;
  }

  /**
   * Verifica si dos palabras son sinónimos
   */
  areSynonyms(word1, word2) {
    const synonyms = {
      'cita': ['sesion', 'consulta', 'turno', 'hora'],
      'agendar': ['reservar', 'programar', 'solicitar', 'pedir'],
      'psicolog': ['terapeuta', 'especialista', 'doctor', 'profesional'],
      'costo': ['precio', 'tarifa', 'valor', 'cobro'],
      'ayuda': ['apoyo', 'asistencia', 'soporte', 'auxilio'],
      'problema': ['dificultad', 'inconveniente', 'situacion', 'caso'],
      'tratamiento': ['terapia', 'atencion', 'cuidado', 'proceso']
    };

    for (const [key, syns] of Object.entries(synonyms)) {
      if ((word1.includes(key) && syns.some(syn => word2.includes(syn))) ||
          (word2.includes(key) && syns.some(syn => word1.includes(syn)))) {
        return true;
      }
    }
    return false;
  }

  /**
   * Calcula boost adicional por palabras clave específicas
   */
  calculateKeywordBoost(message, intentionKey) {
    const keywordMap = {
      'agendar_cita': ['agendar', 'cita', 'sesion', 'reservar', 'turno'],
      'informacion_servicios': ['servicio', 'terapia', 'tratamiento', 'especialidad'],
      'costos_precios': ['costo', 'precio', 'tarifa', 'pagar', 'valor'],
      'ubicacion_contacto': ['donde', 'ubicacion', 'direccion', 'telefono', 'contacto'],
      'emergencia_crisis': ['emergencia', 'crisis', 'urgente', 'ayuda', 'suicidio']
    };

    const keywords = keywordMap[intentionKey] || [];
    let boost = 0;

    for (const keyword of keywords) {
      if (message.includes(keyword)) {
        boost += 0.2;
      }
    }

    return Math.min(boost, 0.4); // Máximo boost del 40%
  }

  /**
   * Extrae entidades del mensaje (nombres, servicios, fechas, etc.)
   */
  extractEntities(message) {
    const entities = {
      servicios: [],
      especialistas: [],
      sintomas: [],
      fechas: [],
      modalidad: null
    };

    // Extraer servicios mencionados
    const servicios = Object.keys(this.knowledgeBase.servicios);
    for (const servicio of servicios) {
      const servicioNormalizado = servicio.replace('-', ' ');
      if (message.includes(servicioNormalizado) || 
          message.includes(this.knowledgeBase.servicios[servicio].nombre.toLowerCase())) {
        entities.servicios.push(servicio);
      }
    }

    // Extraer especialistas mencionados
    const especialistas = Object.values(this.knowledgeBase.equipo);
    for (const especialista of especialistas) {
      const nombreCompleto = especialista.nombre.toLowerCase();
      const apellido = nombreCompleto.split(' ').pop();
      if (message.includes(nombreCompleto) || message.includes(apellido)) {
        entities.especialistas.push(especialista);
      }
    }

    // Extraer síntomas o problemas
    const casosComunes = this.knowledgeBase.casosComunes;
    for (const [caso, datos] of Object.entries(casosComunes)) {
      for (const sintoma of datos.sintomas) {
        if (message.includes(sintoma)) {
          entities.sintomas.push({ caso, sintoma });
        }
      }
    }

    // Detectar modalidad preferida
    if (message.includes('virtual') || message.includes('online') || message.includes('linea')) {
      entities.modalidad = 'virtual';
    } else if (message.includes('presencial') || message.includes('persona')) {
      entities.modalidad = 'presencial';
    }

    return entities;
  }

  /**
   * Genera respuesta contextual inteligente
   */
  async generateContextualResponse(message, intention, entities, userRole, userName) {
    // Caso especial para emergencias
    if (intention === 'emergencia_crisis') {
      return this.generateEmergencyResponse();
    }

    // Respuesta basada en intención detectada
    const intentionData = this.knowledgeBase.intenciones[intention];
    if (intentionData) {
      return this.generateIntentionResponse(intentionData, entities, userRole, userName);
    }

    // Si no hay intención clara, usar IA generativa con contexto
    return this.generateGenerativeResponse(message, entities, userRole, userName);
  }

  /**
   * Genera respuesta de emergencia con alta prioridad
   */
  generateEmergencyResponse() {
    const emergencyData = this.knowledgeBase.intenciones.emergencia_crisis;
    return {
      message: `🚨 ${emergencyData.respuesta}`,
      type: 'emergency',
      suggestedActions: emergencyData.acciones,
      actionRoutes: emergencyData.rutas,
      priority: 'high',
      requiresImmediateAction: true
    };
  }

  /**
   * Genera respuesta basada en intención detectada
   */
  generateIntentionResponse(intentionData, entities, userRole, userName) {
    let response = intentionData.respuesta;

    // Personalizar respuesta según entidades extraídas
    if (entities.servicios.length > 0) {
      const servicio = entities.servicios[0];
      const servicioData = this.knowledgeBase.servicios[servicio];
      response += `\n\n📋 Sobre ${servicioData.nombre}: ${servicioData.descripcion}`;
    }

    if (entities.especialistas.length > 0) {
      const especialista = entities.especialistas[0];
      response += `\n\n👨‍⚕️ Te recomiendo al ${especialista.titulo} ${especialista.nombre}, especialista en ${especialista.especialidades.join(', ')}.`;
    }

    if (entities.sintomas.length > 0) {
      const sintoma = entities.sintomas[0];
      const casoData = this.knowledgeBase.casosComunes[sintoma.caso];
      response += `\n\n💡 Para casos relacionados con ${sintoma.sintoma}, generalmente recomendamos: ${casoData.tratamiento}`;
    }

    // Personalizar según rol del usuario
    response = this.personalizeByRole(response, userRole, userName);

    return {
      message: response,
      type: 'contextual',
      suggestedActions: intentionData.acciones,
      actionRoutes: intentionData.rutas,
      entities: entities,
      confidence: 0.9
    };
  }

  /**
   * Genera respuesta usando IA generativa con contexto
   */
  generateGenerativeResponse(message, entities, userRole, userName) {
    // Buscar en FAQ por similitud
    const faqMatch = this.findBestFaqMatch(message);
    if (faqMatch.confidence > 0.5) {
      return {
        message: faqMatch.respuesta,
        type: 'faq',
        suggestedActions: faqMatch.acciones,
        actionRoutes: faqMatch.rutas,
        confidence: faqMatch.confidence
      };
    }

    // Respuesta general inteligente
    let response = this.generateGeneralResponse(message, entities, userRole);
    response = this.personalizeByRole(response, userRole, userName);

    return {
      message: response,
      type: 'general',
      suggestedActions: this.getContextualActions(entities, userRole),
      actionRoutes: this.getContextualRoutes(entities),
      confidence: 0.6
    };
  }

  /**
   * Busca la mejor coincidencia en FAQ
   */
  findBestFaqMatch(message) {
    const faqs = this.knowledgeBase.faq;
    let bestMatch = { confidence: 0 };

    for (const [key, faqData] of Object.entries(faqs)) {
      const questionSimilarity = this.calculateSimilarity(message, faqData.pregunta);
      
      if (questionSimilarity > bestMatch.confidence) {
        bestMatch = {
          ...faqData,
          confidence: questionSimilarity,
          key: key
        };
      }
    }

    return bestMatch;
  }

  /**
   * Genera respuesta general inteligente
   */
  generateGeneralResponse(message, entities, userRole) {
    const responses = [
      "Entiendo tu consulta. Como Centro Médico Psicológico Guevara, estamos aquí para brindarte la mejor atención en salud mental.",
      "Gracias por contactarnos. Nuestro equipo de profesionales especializados está listo para ayudarte.",
      "Te escucho. En el Centro Guevara creemos que cada persona merece atención personalizada y de calidad.",
      "Me alegra que nos hayas contactado. Llevamos 9 años ayudando a personas como tú a mejorar su bienestar mental y emocional."
    ];

    let baseResponse = responses[Math.floor(Math.random() * responses.length)];

    // Agregar información contextual basada en entidades
    if (entities.sintomas.length > 0) {
      baseResponse += " He notado que mencionas algunos síntomas o preocupaciones específicas. Te recomiendo agendar una evaluación inicial para que podamos entender mejor tu situación.";
    }

    if (entities.servicios.length === 0 && entities.especialistas.length === 0) {
      baseResponse += " ¿Te gustaría conocer nuestros servicios disponibles o hablar con algún especialista en particular?";
    }

    return baseResponse;
  }

  /**
   * Personaliza la respuesta según el rol del usuario
   */
  personalizeByRole(response, userRole, userName) {
    const greetings = {
      'admin': `${userName}, como administrador`,
      'secretaria': `${userName}, desde secretaría`,
      'psicologo': `Dr(a). ${userName}`,
      'paciente': userName !== 'Usuario' ? userName : '',
      'public': ''
    };

    const greeting = greetings[userRole] || '';
    if (greeting && userName !== 'Usuario') {
      response = `${greeting}, ${response.charAt(0).toLowerCase()}${response.slice(1)}`;
    }

    return response;
  }

  /**
   * Obtiene acciones contextuales basadas en entidades
   */
  getContextualActions(entities, userRole) {
    const actions = [];

    if (entities.servicios.length > 0) {
      actions.push("Ver Más Detalles", "Agendar Cita");
    }

    if (entities.especialistas.length > 0) {
      actions.push("Ver Perfil Completo", "Agendar con Especialista");
    }

    if (entities.sintomas.length > 0) {
      actions.push("Evaluación Inicial", "Hablar con Especialista");
    }

    // Acciones por defecto según rol
    const defaultActions = {
      'admin': ["Panel Admin", "Ver Reportes", "Gestionar"],
      'secretaria': ["Agendar Citas", "Ver Pacientes", "Horarios"],
      'psicologo': ["Mi Agenda", "Pacientes", "Recursos"],
      'paciente': ["Mis Citas", "Agendar Nueva", "Mi Perfil"],
      'public': ["Agendar Cita", "Nuestros Servicios", "Contacto"]
    };

    if (actions.length === 0) {
      actions.push(...(defaultActions[userRole] || defaultActions.public));
    }

    return actions.slice(0, 3); // Máximo 3 acciones
  }

  /**
   * Obtiene rutas contextuales basadas en entidades
   */
  getContextualRoutes(entities) {
    const routes = [];

    if (entities.servicios.length > 0) {
      const servicio = entities.servicios[0];
      const servicioData = this.knowledgeBase.servicios[servicio];
      routes.push(servicioData.ruta, "/agendar");
    }

    if (entities.especialistas.length > 0) {
      const especialista = entities.especialistas[0];
      routes.push(especialista.ruta, `/agendar?especialista=${especialista.nombre.toLowerCase().replace(/\s+/g, '-')}`);
    }

    // Rutas por defecto
    if (routes.length === 0) {
      routes.push("/agendar", "/servicios", "/contacto");
    }

    return routes.slice(0, 3);
  }

  /**
   * Añade interacción al historial de sesión
   */
  addToSessionHistory(userMessage, botResponse, intention) {
    this.sessionHistory.push({
      timestamp: new Date().toISOString(),
      userMessage,
      botResponse: botResponse.message,
      intention,
      confidence: botResponse.confidence || 0.5
    });

    // Mantener solo las últimas 10 interacciones para contexto
    if (this.sessionHistory.length > 10) {
      this.sessionHistory = this.sessionHistory.slice(-10);
    }
  }

  /**
   * Respuesta de fallback cuando hay errores
   */
  getFallbackResponse() {
    return {
      message: "Disculpa, estoy teniendo dificultades técnicas en este momento. Por favor, puedes contactarnos directamente al +57 301 234 5678 o intentar nuevamente en unos minutos. Tu bienestar es importante para nosotros.",
      type: 'error',
      suggestedActions: ["Llamar Ahora", "Intentar Nuevamente", "WhatsApp"],
      actionRoutes: ["tel:+573012345678", "refresh", "https://wa.me/573012345678"],
      confidence: 1.0
    };
  }

  /**
   * Resetea el contexto de conversación
   */
  resetContext() {
    this.conversationContext.clear();
    this.sessionHistory = [];
  }

  /**
   * Obtiene mensaje de bienvenida personalizado
   */
  getWelcomeMessage(userRole = 'public', userName = 'Usuario') {
    const welcomeMessages = {
      'admin': `¡Hola ${userName}! Como administrador, puedo ayudarte con la gestión del sistema, reportes, configuraciones y supervisión general del centro.`,
      'secretaria': `¡Hola ${userName}! Puedo ayudarte con la gestión de citas, información de pacientes, horarios disponibles y tareas administrativas.`,
      'psicologo': `¡Hola Dr(a). ${userName}! Estoy aquí para asistirte con información sobre pacientes, recursos profesionales, agenda y herramientas clínicas.`,
      'paciente': `¡Hola ${userName}! Me alegra verte de nuevo. ¿Necesitas ayuda con tus citas, información sobre servicios o tienes alguna pregunta específica?`,
      'public': "¡Hola! Soy el asistente virtual del Centro Médico Psicológico Guevara. Estoy aquí para ayudarte con información sobre nuestros servicios, agendar citas, contacto y resolver tus dudas sobre salud mental. ¿En qué puedo ayudarte hoy?"
    };

    const message = welcomeMessages[userRole] || welcomeMessages.public;
    const actions = this.getContextualActions({}, userRole);

    return {
      message,
      type: 'welcome',
      suggestedActions: actions,
      confidence: 1.0
    };
  }
}

export default IntelligentChatbotEngine;
