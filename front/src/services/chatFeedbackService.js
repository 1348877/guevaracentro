/**
 * Servicio para gestionar el feedback del chatbot
 */
import chatPersistenceService from './chatPersistenceService';

class ChatFeedbackService {
  constructor() {
    this.FEEDBACK_STORAGE_KEY = 'chatbotFeedback';
    this.feedbackData = this.loadFeedbackData();
  }

  /**
   * Carga los datos de feedback desde localStorage
   */
  loadFeedbackData() {
    try {
      const saved = localStorage.getItem(this.FEEDBACK_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {
        feedback: [],
        statistics: {
          totalFeedback: 0,
          averageRating: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          commonIssues: {},
          improvementSuggestions: []
        }
      };
    } catch (error) {
      console.error('Error al cargar datos de feedback:', error);
      return {
        feedback: [],
        statistics: {
          totalFeedback: 0,
          averageRating: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          commonIssues: {},
          improvementSuggestions: []
        }
      };
    }
  }

  /**
   * Guarda los datos de feedback
   */
  saveFeedbackData() {
    try {
      localStorage.setItem(this.FEEDBACK_STORAGE_KEY, JSON.stringify(this.feedbackData));
    } catch (error) {
      console.error('Error al guardar datos de feedback:', error);
    }
  }

  /**
   * Registra nuevo feedback
   * @param {Object} feedback - Datos del feedback
   */
  async submitFeedback(feedback) {
    try {
      const feedbackEntry = {
        id: Date.now().toString(),
        ...feedback,
        timestamp: new Date().toISOString()
      };

      // Agregar a la lista de feedback
      this.feedbackData.feedback.push(feedbackEntry);

      // Actualizar estadísticas
      this.updateStatistics(feedbackEntry);

      // Guardar datos
      this.saveFeedbackData();

      // Guardar también en el contexto del chat para entrenamiento
      await this.saveFeedbackToChat(feedbackEntry);

      console.log('Feedback registrado exitosamente');
      return true;
    } catch (error) {
      console.error('Error al registrar feedback:', error);
      return false;
    }
  }

  /**
   * Actualiza las estadísticas de feedback
   * @param {Object} feedbackEntry - Entrada de feedback
   */
  updateStatistics(feedbackEntry) {
    const stats = this.feedbackData.statistics;
    
    // Incrementar total
    stats.totalFeedback++;
    
    // Actualizar distribución de ratings
    stats.ratingDistribution[feedbackEntry.rating]++;
    
    // Calcular promedio
    const totalRating = this.feedbackData.feedback.reduce((sum, fb) => sum + fb.rating, 0);
    stats.averageRating = totalRating / stats.totalFeedback;
    
    // Analizar comentarios para issues comunes
    if (feedbackEntry.comment) {
      this.analyzeComments(feedbackEntry.comment, feedbackEntry.rating);
    }
  }

  /**
   * Analiza comentarios para identificar issues comunes
   * @param {string} comment - Comentario del usuario
   * @param {number} rating - Calificación del usuario
   */
  analyzeComments(comment, rating) {
    const keywords = {
      'lento': 'response_speed',
      'no entendió': 'understanding',
      'no ayudó': 'helpfulness',
      'confuso': 'clarity',
      'error': 'technical_issues',
      'información incorrecta': 'accuracy',
      'repetitivo': 'repetitive_responses',
      'no contextual': 'context_awareness'
    };

    const lowerComment = comment.toLowerCase();
    
    Object.entries(keywords).forEach(([keyword, category]) => {
      if (lowerComment.includes(keyword)) {
        if (!this.feedbackData.statistics.commonIssues[category]) {
          this.feedbackData.statistics.commonIssues[category] = 0;
        }
        this.feedbackData.statistics.commonIssues[category]++;
      }
    });

    // Guardar sugerencias de mejora si el rating es bajo
    if (rating <= 3 && comment.length > 10) {
      this.feedbackData.statistics.improvementSuggestions.push({
        comment,
        rating,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Guarda el feedback en el contexto del chat para entrenamiento
   * @param {Object} feedbackEntry - Entrada de feedback
   */
  async saveFeedbackToChat(feedbackEntry) {
    try {
      const chatState = chatPersistenceService.loadChatState();
      
      // Buscar el mensaje correspondiente en el historial
      const messageIndex = chatState.messages.findIndex(msg => 
        msg.id === feedbackEntry.messageId
      );

      if (messageIndex !== -1) {
        // Agregar feedback al mensaje
        chatState.messages[messageIndex].feedback = {
          rating: feedbackEntry.rating,
          comment: feedbackEntry.comment,
          timestamp: feedbackEntry.timestamp
        };

        // Guardar en historial de conversación para entrenamiento
        chatState.conversationHistory.push({
          userInput: feedbackEntry.userMessage,
          botResponse: feedbackEntry.messageContent,
          feedback: {
            rating: feedbackEntry.rating,
            comment: feedbackEntry.comment
          },
          timestamp: feedbackEntry.timestamp,
          type: 'feedback'
        });

        chatPersistenceService.saveChatState(chatState);
      }
    } catch (error) {
      console.error('Error al guardar feedback en chat:', error);
    }
  }

  /**
   * Obtiene estadísticas de feedback
   * @returns {Object} Estadísticas
   */
  getFeedbackStatistics() {
    return {
      ...this.feedbackData.statistics,
      recentFeedback: this.getRecentFeedback(7), // Últimos 7 días
      topIssues: this.getTopIssues(),
      improvementTrends: this.getImprovementTrends()
    };
  }

  /**
   * Obtiene feedback reciente
   * @param {number} days - Número de días
   * @returns {Array} Feedback reciente
   */
  getRecentFeedback(days = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return this.feedbackData.feedback.filter(fb => 
      new Date(fb.timestamp) >= cutoffDate
    );
  }

  /**
   * Obtiene los issues más comunes
   * @returns {Array} Issues ordenados por frecuencia
   */
  getTopIssues() {
    const issues = this.feedbackData.statistics.commonIssues;
    
    return Object.entries(issues)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([issue, count]) => ({
        issue: this.translateIssue(issue),
        count,
        percentage: ((count / this.feedbackData.statistics.totalFeedback) * 100).toFixed(1)
      }));
  }

  /**
   * Traduce los nombres de issues al español
   * @param {string} issue - Issue en inglés
   * @returns {string} Issue traducido
   */
  translateIssue(issue) {
    const translations = {
      'response_speed': 'Velocidad de respuesta',
      'understanding': 'Comprensión',
      'helpfulness': 'Utilidad',
      'clarity': 'Claridad',
      'technical_issues': 'Problemas técnicos',
      'accuracy': 'Precisión',
      'repetitive_responses': 'Respuestas repetitivas',
      'context_awareness': 'Comprensión contextual'
    };

    return translations[issue] || issue;
  }

  /**
   * Obtiene tendencias de mejora
   * @returns {Object} Tendencias
   */
  getImprovementTrends() {
    const recent = this.getRecentFeedback(30);
    const older = this.feedbackData.feedback.filter(fb => {
      const date = new Date(fb.timestamp);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
      
      return date >= sixtyDaysAgo && date < thirtyDaysAgo;
    });

    const recentAvg = recent.length > 0 ? 
      recent.reduce((sum, fb) => sum + fb.rating, 0) / recent.length : 0;
    
    const olderAvg = older.length > 0 ? 
      older.reduce((sum, fb) => sum + fb.rating, 0) / older.length : 0;

    return {
      recentAverage: recentAvg.toFixed(2),
      olderAverage: olderAvg.toFixed(2),
      trend: recentAvg > olderAvg ? 'improving' : 
             recentAvg < olderAvg ? 'declining' : 'stable',
      improvement: (recentAvg - olderAvg).toFixed(2)
    };
  }

  /**
   * Exporta todos los datos de feedback
   * @returns {Object} Datos de feedback
   */
  exportFeedbackData() {
    return {
      ...this.feedbackData,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
  }

  /**
   * Limpia feedback antiguo
   * @param {number} days - Días a mantener
   */
  cleanOldFeedback(days = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const originalLength = this.feedbackData.feedback.length;
    this.feedbackData.feedback = this.feedbackData.feedback.filter(fb => 
      new Date(fb.timestamp) >= cutoffDate
    );

    const removedCount = originalLength - this.feedbackData.feedback.length;
    
    if (removedCount > 0) {
      this.saveFeedbackData();
      console.log(`Limpiados ${removedCount} registros de feedback antiguos`);
    }

    return removedCount;
  }
}

// Exportar instancia singleton
const chatFeedbackService = new ChatFeedbackService();
export default chatFeedbackService;
