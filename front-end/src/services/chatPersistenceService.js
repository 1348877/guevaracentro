/**
 * Servicio para persistir y gestionar el estado del chat
 */

class ChatPersistenceService {
  constructor() {
    this.STORAGE_KEY = 'floatingChatbot';
    this.SESSION_STORAGE_KEY = 'floatingChatbotSession';
    this.MAX_MESSAGES = 50; // Límite de mensajes guardados
    this.MAX_CONTEXTS = 10; // Límite de contextos guardados
  }

  /**
   * Guarda el estado del chat en localStorage
   * @param {Object} chatState - Estado del chat
   */
  saveChatState(chatState) {
    try {
      const persistentData = {
        messages: chatState.messages || [],
        userContext: chatState.userContext || {},
        lastInteraction: new Date().toISOString(),
        sessionId: this.generateSessionId(),
        conversationHistory: chatState.conversationHistory || []
      };

      // Limitar el número de mensajes guardados
      if (persistentData.messages.length > this.MAX_MESSAGES) {
        persistentData.messages = persistentData.messages.slice(-this.MAX_MESSAGES);
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(persistentData));
      
      // También guardar en sessionStorage para datos temporales
      sessionStorage.setItem(this.SESSION_STORAGE_KEY, JSON.stringify({
        isMinimized: chatState.isMinimized || false,
        isOpen: chatState.isOpen || false,
        currentTopic: chatState.currentTopic || null
      }));
      
    } catch (error) {
      console.error('Error al guardar estado del chat:', error);
    }
  }

  /**
   * Carga el estado del chat desde localStorage
   * @returns {Object} Estado del chat
   */
  loadChatState() {
    try {
      const persistentData = localStorage.getItem(this.STORAGE_KEY);
      const sessionData = sessionStorage.getItem(this.SESSION_STORAGE_KEY);
      
      const persistent = persistentData ? JSON.parse(persistentData) : {};
      const session = sessionData ? JSON.parse(sessionData) : {};
      
      return {
        messages: persistent.messages || [],
        userContext: persistent.userContext || {},
        lastInteraction: persistent.lastInteraction || null,
        sessionId: persistent.sessionId || this.generateSessionId(),
        conversationHistory: persistent.conversationHistory || [],
        isMinimized: session.isMinimized || false,
        isOpen: session.isOpen || false,
        currentTopic: session.currentTopic || null
      };
    } catch (error) {
      console.error('Error al cargar estado del chat:', error);
      return this.getDefaultState();
    }
  }

  /**
   * Guarda un mensaje individual
   * @param {Object} message - Mensaje a guardar
   */
  saveMessage(message) {
    try {
      const chatState = this.loadChatState();
      chatState.messages.push({
        ...message,
        timestamp: new Date().toISOString(),
        sessionId: chatState.sessionId
      });
      
      this.saveChatState(chatState);
    } catch (error) {
      console.error('Error al guardar mensaje:', error);
    }
  }

  /**
   * Guarda el contexto del usuario
   * @param {Object} context - Contexto del usuario
   */
  saveUserContext(context) {
    try {
      const chatState = this.loadChatState();
      chatState.userContext = {
        ...chatState.userContext,
        ...context,
        lastUpdate: new Date().toISOString()
      };
      
      this.saveChatState(chatState);
    } catch (error) {
      console.error('Error al guardar contexto:', error);
    }
  }

  /**
   * Obtiene el contexto del usuario
   * @returns {Object} Contexto del usuario
   */
  getUserContext() {
    try {
      const chatState = this.loadChatState();
      return chatState.userContext || {};
    } catch (error) {
      console.error('Error al obtener contexto:', error);
      return {};
    }
  }

  /**
   * Guarda el historial de conversación para entrenar el bot
   * @param {Object} interaction - Interacción usuario-bot
   */
  saveConversationHistory(interaction) {
    try {
      const chatState = this.loadChatState();
      
      const historyEntry = {
        userInput: interaction.userInput,
        botResponse: interaction.botResponse,
        timestamp: new Date().toISOString(),
        context: interaction.context || {},
        satisfaction: interaction.satisfaction || null,
        topic: interaction.topic || null
      };
      
      chatState.conversationHistory.push(historyEntry);
      
      // Limitar el historial
      if (chatState.conversationHistory.length > this.MAX_CONTEXTS) {
        chatState.conversationHistory = chatState.conversationHistory.slice(-this.MAX_CONTEXTS);
      }
      
      this.saveChatState(chatState);
    } catch (error) {
      console.error('Error al guardar historial:', error);
    }
  }

  /**
   * Obtiene el historial de conversación
   * @returns {Array} Historial de conversación
   */
  getConversationHistory() {
    try {
      const chatState = this.loadChatState();
      return chatState.conversationHistory || [];
    } catch (error) {
      console.error('Error al obtener historial:', error);
      return [];
    }
  }

  /**
   * Limpia el estado del chat
   */
  clearChatState() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      sessionStorage.removeItem(this.SESSION_STORAGE_KEY);
    } catch (error) {
      console.error('Error al limpiar estado:', error);
    }
  }

  /**
   * Genera un ID único para la sesión
   * @returns {string} ID de sesión
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Obtiene el estado por defecto
   * @returns {Object} Estado por defecto
   */
  getDefaultState() {
    return {
      messages: [],
      userContext: {},
      lastInteraction: null,
      sessionId: this.generateSessionId(),
      conversationHistory: [],
      isMinimized: false,
      isOpen: false,
      currentTopic: null
    };
  }

  /**
   * Verifica si hay una sesión activa reciente
   * @returns {boolean} Si hay sesión activa
   */
  hasRecentSession() {
    try {
      const chatState = this.loadChatState();
      if (!chatState.lastInteraction) return false;
      
      const lastInteraction = new Date(chatState.lastInteraction);
      const now = new Date();
      const timeDiff = now - lastInteraction;
      
      // Considerar sesión activa si la última interacción fue hace menos de 24 horas
      return timeDiff < (24 * 60 * 60 * 1000);
    } catch (error) {
      console.error('Error al verificar sesión:', error);
      return false;
    }
  }

  /**
   * Restaura el estado completo del chat después de una recarga
   * @returns {Object} Estado completo del chat
   */
  restoreFullChatState() {
    try {
      const chatState = this.loadChatState();
      
      // Marcar como sesión restaurada
      chatState.isRestored = true;
      chatState.restoredAt = new Date().toISOString();
      
      // Mantener el estado visual si la sesión es reciente
      if (this.hasRecentSession()) {
        chatState.shouldRestore = true;
      }
      
      this.saveChatState(chatState);
      return chatState;
    } catch (error) {
      console.error('Error al restaurar estado:', error);
      return this.getDefaultState();
    }
  }

  /**
   * Actualiza el estado visual del chat
   * @param {Object} visualState - Estado visual (isOpen, isMinimized, etc.)
   */
  updateVisualState(visualState) {
    try {
      const currentSession = sessionStorage.getItem(this.SESSION_STORAGE_KEY);
      const session = currentSession ? JSON.parse(currentSession) : {};
      
      const updatedSession = {
        ...session,
        ...visualState,
        lastUpdate: new Date().toISOString()
      };
      
      sessionStorage.setItem(this.SESSION_STORAGE_KEY, JSON.stringify(updatedSession));
    } catch (error) {
      console.error('Error al actualizar estado visual:', error);
    }
  }

  /**
   * Sincroniza el estado entre tabs del navegador
   */
  syncAcrossTabs() {
    try {
      // Escuchar cambios en localStorage
      window.addEventListener('storage', (event) => {
        if (event.key === this.STORAGE_KEY) {
          // Emitir evento personalizado para notificar cambios
          window.dispatchEvent(new CustomEvent('chatStateChanged', {
            detail: event.newValue ? JSON.parse(event.newValue) : null
          }));
        }
      });
    } catch (error) {
      console.error('Error al configurar sincronización:', error);
    }
  }

  /**
   * Obtiene estadísticas de uso del chat
   * @returns {Object} Estadísticas
   */
  getUsageStats() {
    try {
      const chatState = this.loadChatState();
      
      return {
        totalMessages: chatState.messages.length,
        totalSessions: this.getSessionCount(),
        averageMessagesPerSession: this.getAverageMessagesPerSession(),
        lastInteraction: chatState.lastInteraction,
        mostActiveHours: this.getMostActiveHours(chatState.messages),
        topTopics: this.getTopTopics(chatState.conversationHistory)
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      return {};
    }
  }

  /**
   * Obtiene el conteo de sesiones
   * @returns {number} Número de sesiones
   */
  getSessionCount() {
    try {
      const sessions = localStorage.getItem('chatbotSessions');
      return sessions ? JSON.parse(sessions).length : 0;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Obtiene el promedio de mensajes por sesión
   * @returns {number} Promedio de mensajes
   */
  getAverageMessagesPerSession() {
    try {
      const chatState = this.loadChatState();
      const sessionCount = this.getSessionCount();
      
      if (sessionCount === 0) return 0;
      
      return Math.round(chatState.messages.length / sessionCount);
    } catch (error) {
      return 0;
    }
  }

  /**
   * Obtiene las horas más activas
   * @param {Array} messages - Mensajes del chat
   * @returns {Object} Horas más activas
   */
  getMostActiveHours(messages) {
    try {
      const hourCounts = {};
      
      messages.forEach(message => {
        if (message.timestamp) {
          const hour = new Date(message.timestamp).getHours();
          hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        }
      });
      
      // Ordenar por frecuencia
      const sortedHours = Object.entries(hourCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([hour, count]) => ({ hour: parseInt(hour), count }));
      
      return sortedHours;
    } catch (error) {
      return [];
    }
  }

  /**
   * Obtiene los temas más frecuentes
   * @param {Array} history - Historial de conversación
   * @returns {Object} Temas más frecuentes
   */
  getTopTopics(history) {
    try {
      const topicCounts = {};
      
      history.forEach(entry => {
        if (entry.topic) {
          topicCounts[entry.topic] = (topicCounts[entry.topic] || 0) + 1;
        }
      });
      
      // Ordenar por frecuencia
      const sortedTopics = Object.entries(topicCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .reduce((obj, [topic, count]) => {
          obj[topic] = count;
          return obj;
        }, {});
      
      return sortedTopics;
    } catch (error) {
      return {};
    }
  }

  /**
   * Exporta datos para entrenamiento
   * @returns {Object} Datos para entrenamiento
   */
  exportTrainingData() {
    try {
      const history = this.getConversationHistory();
      const analytics = this.getChatAnalytics();
      
      return {
        trainingData: history.map(entry => ({
          input: entry.userInput,
          output: entry.botResponse,
          context: entry.context,
          topic: entry.topic,
          timestamp: entry.timestamp
        })),
        analytics,
        metadata: {
          exportDate: new Date().toISOString(),
          totalSamples: history.length,
          version: '1.0'
        }
      };
    } catch (error) {
      console.error('Error al exportar datos:', error);
      return null;
    }
  }
}

// Crear instancia singleton
const chatPersistenceService = new ChatPersistenceService();

export default chatPersistenceService;
