// AI Service con Hugging Face - GRATUITO
class AIService {
  constructor() {
    this.baseUrl = 'https://api-inference.huggingface.co/models';
    this.apiKey = process.env.REACT_APP_HUGGING_FACE_API_KEY || 'your_hugging_face_api_key_here';
    
    // Modelos disponibles (todos gratuitos)
    this.models = {
      // Modelo para español - Muy bueno para psicología
      SPANISH_CONVERSATIONAL: 'microsoft/DialoGPT-medium',
      SPANISH_GENERATION: 'flax-community/gpt-2-spanish',
      MULTILINGUAL_CHAT: 'microsoft/DialoGPT-large',
      MEDICAL_SPANISH: 'PlanTL-GOB-ES/gpt2-spanish-medical',
      SENTIMENT_ANALYSIS: 'nlptown/bert-base-multilingual-uncased-sentiment',
      EMOTION_DETECTION: 'j-hartmann/emotion-english-distilroberta-base'
    };
    
    this.currentModel = this.models.SPANISH_CONVERSATIONAL;
    this.conversationHistory = [];
    this.maxHistoryLength = 10;
  }

  // Configurar API Key (opcional, funciona sin key pero con límites)
  setApiKey(apiKey) {
    this.apiKey = apiKey;
    console.log('✅ API Key de Hugging Face configurada');
  }

  // Generar respuesta inteligente
  async generateResponse(userMessage, context = {}) {
    try {
      // Preparar el contexto para psicología
      const psychologyContext = this.createPsychologyContext(context);
      const prompt = this.buildPrompt(userMessage, psychologyContext);

      const response = await fetch(`${this.baseUrl}/${this.currentModel}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_length: 150,
            temperature: 0.7,
            do_sample: true,
            pad_token_id: 50256,
            return_full_text: false
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Error de API: ${response.status}`);
      }

      const data = await response.json();
      let aiResponse = '';

      if (Array.isArray(data) && data.length > 0) {
        aiResponse = data[0].generated_text || data[0].text || '';
      } else if (data.generated_text) {
        aiResponse = data.generated_text;
      }

      // Limpiar y procesar respuesta
      const cleanResponse = this.cleanResponse(aiResponse, userMessage);
      
      // Agregar a historial
      this.addToHistory(userMessage, cleanResponse);
      
      return {
        message: cleanResponse,
        type: 'ai_response',
        confidence: this.calculateConfidence(cleanResponse),
        suggestedActions: this.generateSuggestedActions(userMessage, cleanResponse),
        emotion: await this.detectEmotion(userMessage)
      };

    } catch (error) {
      console.error('❌ Error en AI Service:', error);
      return this.getFallbackResponse(userMessage);
    }
  }

  // Crear contexto específico para psicología
  createPsychologyContext(context) {
    const baseContext = `Eres un asistente virtual empático y profesional de un centro psicológico en Juliaca, Perú. 
Tu papel es:
- Brindar apoyo emocional inicial
- Orientar sobre servicios psicológicos
- Detectar situaciones de crisis
- Usar un lenguaje cálido y profesional
- Ser culturalmente sensible a la región andina

Información del usuario:
- Rol: ${context.userRole || 'paciente'}
- Nombre: ${context.userName || 'Usuario'}
- Contexto: ${context.situation || 'consulta general'}

Instrucciones:
- Responde en español peruano
- Máximo 2-3 oraciones
- Sé empático pero profesional
- Si detectas crisis, ofrece contacto inmediato
- Incluye referencias culturales andinas cuando sea apropiado

Conversación:`;

    return baseContext;
  }

  // Construir prompt optimizado
  buildPrompt(userMessage, context) {
    const recentHistory = this.conversationHistory.slice(-3);
    let historyText = '';
    
    recentHistory.forEach(item => {
      historyText += `Usuario: ${item.user}\nAsistente: ${item.ai}\n`;
    });

    return `${context}
${historyText}
Usuario: ${userMessage}
Asistente:`;
  }

  // Limpiar respuesta de la IA
  cleanResponse(response, userMessage) {
    if (!response || response.trim() === '') {
      return this.getFallbackResponse(userMessage).message;
    }

    let cleaned = response.trim();
    
    // Remover repeticiones del mensaje del usuario
    cleaned = cleaned.replace(new RegExp(userMessage, 'gi'), '');
    
    // Remover prefijos comunes
    cleaned = cleaned.replace(/^(Usuario:|Asistente:|AI:|Bot:)/i, '');
    
    // Remover caracteres extraños
    cleaned = cleaned.replace(/[^\w\s.,!?¿¡áéíóúñüÁÉÍÓÚÑÜ()-]/g, '');
    
    // Limitar longitud
    if (cleaned.length > 200) {
      cleaned = cleaned.substring(0, 200) + '...';
    }
    
    // Respuesta por defecto si está vacía
    if (cleaned.trim() === '') {
      return 'Entiendo tu consulta. ¿Podrías contarme un poco más sobre lo que necesitas?';
    }
    
    return cleaned.trim();
  }

  // Detectar emociones en el mensaje
  async detectEmotion(text) {
    try {
      const response = await fetch(`${this.baseUrl}/${this.models.EMOTION_DETECTION}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: text
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          return data[0].label || 'neutral';
        }
      }
    } catch (error) {
      console.warn('⚠️ Error en detección de emociones:', error);
    }
    
    return 'neutral';
  }

  // Generar acciones sugeridas basadas en IA
  generateSuggestedActions(userMessage, aiResponse) {
    const message = userMessage.toLowerCase();
    const suggestions = [];

    // Análisis inteligente del contenido
    if (message.includes('ansiedad') || message.includes('ansioso') || message.includes('nervioso')) {
      suggestions.push('Técnicas de respiración', 'Agendar cita con psicólogo', 'Información sobre ansiedad');
    }
    
    if (message.includes('depresión') || message.includes('triste') || message.includes('deprimido')) {
      suggestions.push('Hablar con un profesional', 'Agendar cita urgente', 'Recursos de apoyo');
    }
    
    if (message.includes('cita') || message.includes('agendar') || message.includes('reservar')) {
      suggestions.push('Solicitar cita online', 'Ver horarios disponibles', 'Contactar secretaría');
    }
    
    if (message.includes('pareja') || message.includes('familia') || message.includes('relación')) {
      suggestions.push('Terapia de pareja', 'Terapia familiar', 'Orientación psicológica');
    }

    // Sugerencias basadas en emociones detectadas
    if (aiResponse.includes('crisis') || aiResponse.includes('urgente')) {
      suggestions.push('Contacto de emergencia', 'Línea de ayuda', 'Cita inmediata');
    }

    return suggestions.slice(0, 3); // Máximo 3 sugerencias
  }

  // Calcular confianza de la respuesta
  calculateConfidence(response) {
    if (!response || response.length < 10) return 0.3;
    if (response.includes('no entiendo') || response.includes('no sé')) return 0.4;
    if (response.length > 50 && response.includes('.')) return 0.9;
    return 0.7;
  }

  // Respuesta de emergencia si falla la IA
  getFallbackResponse(userMessage) {
    const fallbacks = [
      'Entiendo tu consulta. ¿Podrías contarme un poco más sobre lo que necesitas?',
      'Estoy aquí para ayudarte. ¿Qué te preocupa en este momento?',
      'Me gustaría apoyarte mejor. ¿Puedes darme más detalles?',
      'Comprendo que buscas ayuda. ¿Te gustaría agendar una cita con uno de nuestros psicólogos?'
    ];
    
    const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    
    return {
      message: randomFallback,
      type: 'fallback',
      confidence: 0.5,
      suggestedActions: ['Agendar cita', 'Más información', 'Contactar equipo'],
      emotion: 'neutral'
    };
  }

  // Agregar a historial de conversación
  addToHistory(userMessage, aiResponse) {
    this.conversationHistory.push({
      user: userMessage,
      ai: aiResponse,
      timestamp: new Date().toISOString()
    });

    // Mantener límite del historial
    if (this.conversationHistory.length > this.maxHistoryLength) {
      this.conversationHistory.shift();
    }
  }

  // Cambiar modelo de IA
  switchModel(modelName) {
    if (this.models[modelName]) {
      this.currentModel = this.models[modelName];
      console.log(`🔄 Cambiado a modelo: ${modelName}`);
    }
  }

  // Obtener análisis de sentimientos
  async analyzeSentiment(text) {
    try {
      const response = await fetch(`${this.baseUrl}/${this.models.SENTIMENT_ANALYSIS}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: text
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.warn('⚠️ Error en análisis de sentimientos:', error);
    }
    
    return null;
  }

  // Limpiar historial
  clearHistory() {
    this.conversationHistory = [];
    console.log('🧹 Historial de conversación limpiado');
  }

  // Obtener estadísticas
  getStats() {
    return {
      conversationLength: this.conversationHistory.length,
      currentModel: this.currentModel,
      apiKey: this.apiKey ? '✅ Configurada' : '❌ Sin configurar'
    };
  }
}

// Instancia singleton
const aiService = new AIService();
export default aiService;
