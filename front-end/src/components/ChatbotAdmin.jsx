import React, { useState, useEffect } from 'react';
import chatbotTrainingService from '../services/chatbotTrainingService';
import chatPersistenceService from '../services/chatPersistenceService';
import './ChatbotAdmin.css';

const ChatbotAdmin = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState({});
  const [analytics, setAnalytics] = useState({});
  const [trainingData, setTrainingData] = useState(null);
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = () => {
    const trainingStats = chatbotTrainingService.getTrainingStats();
    const chatAnalytics = chatPersistenceService.getChatAnalytics();
    
    setStats(trainingStats);
    setAnalytics(chatAnalytics);
  };

  const exportData = () => {
    const exportedData = chatbotTrainingService.exportTrainingData();
    const dataStr = JSON.stringify(exportedData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `chatbot_training_data_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const resetTraining = () => {
    if (window.confirm('¿Estás seguro de que quieres reiniciar todos los datos de entrenamiento?')) {
      chatbotTrainingService.resetTraining();
      chatPersistenceService.clearChatState();
      loadData();
      alert('Datos de entrenamiento reiniciados correctamente.');
    }
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          // Aquí podrías implementar la lógica para importar los datos
          console.log('Datos importados:', importedData);
          alert('Datos importados correctamente.');
          loadData();
        } catch (error) {
          alert('Error al importar datos: ' + error.message);
        }
      };
      reader.readAsText(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chatbot-admin-overlay" onClick={onClose}>
      <div className="chatbot-admin-panel" onClick={(e) => e.stopPropagation()}>
        <div className="admin-header">
          <h2>Administración del Chatbot</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="admin-tabs">
          <button 
            className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            Estadísticas
          </button>
          <button 
            className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analíticas
          </button>
          <button 
            className={`tab ${activeTab === 'data' ? 'active' : ''}`}
            onClick={() => setActiveTab('data')}
          >
            Gestión de Datos
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'stats' && (
            <div className="stats-section">
              <h3>Estadísticas de Entrenamiento</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <h4>Patrones Aprendidos</h4>
                  <p className="stat-number">{stats.totalPatterns || 0}</p>
                </div>
                <div className="stat-card">
                  <h4>Respuestas Únicas</h4>
                  <p className="stat-number">{stats.totalResponses || 0}</p>
                </div>
                <div className="stat-card">
                  <h4>Contextos Guardados</h4>
                  <p className="stat-number">{stats.totalContexts || 0}</p>
                </div>
                <div className="stat-card">
                  <h4>Intenciones Detectadas</h4>
                  <p className="stat-number">{stats.totalIntents || 0}</p>
                </div>
              </div>
              <div className="last-training">
                <p><strong>Último Entrenamiento:</strong> {stats.lastTraining}</p>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="analytics-section">
              <h3>Analíticas de Conversación</h3>
              <div className="analytics-grid">
                <div className="analytics-card">
                  <h4>Total de Interacciones</h4>
                  <p className="analytics-number">{analytics.totalInteractions || 0}</p>
                </div>
                <div className="analytics-card">
                  <h4>Satisfacción Promedio</h4>
                  <p className="analytics-number">
                    {analytics.satisfactionRating ? 
                      `${(analytics.satisfactionRating * 100).toFixed(1)}%` : 
                      'N/A'
                    }
                  </p>
                </div>
                <div className="analytics-card">
                  <h4>Tiempo Promedio de Respuesta</h4>
                  <p className="analytics-number">
                    {analytics.averageResponseTime ? 
                      `${(analytics.averageResponseTime / 1000).toFixed(1)}s` : 
                      'N/A'
                    }
                  </p>
                </div>
              </div>

              {analytics.commonTopics && analytics.commonTopics.length > 0 && (
                <div className="common-topics">
                  <h4>Temas Más Comunes</h4>
                  <ul>
                    {analytics.commonTopics.map((topic, index) => (
                      <li key={index}>
                        <span>{topic.topic}</span>
                        <span className="topic-count">{topic.count}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analytics.frequentQuestions && analytics.frequentQuestions.length > 0 && (
                <div className="frequent-questions">
                  <h4>Preguntas Más Frecuentes</h4>
                  <ol>
                    {analytics.frequentQuestions.slice(0, 5).map((question, index) => (
                      <li key={index}>
                        <span>{question.question}</span>
                        <span className="question-count">({question.count})</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}

          {activeTab === 'data' && (
            <div className="data-section">
              <h3>Gestión de Datos</h3>
              <div className="data-actions">
                <button className="action-btn export" onClick={exportData}>
                  📥 Exportar Datos de Entrenamiento
                </button>
                
                <div className="import-section">
                  <label htmlFor="import-file" className="action-btn import">
                    📤 Importar Datos
                  </label>
                  <input 
                    id="import-file"
                    type="file" 
                    accept=".json"
                    onChange={importData}
                    style={{ display: 'none' }}
                  />
                </div>
                
                <button className="action-btn reset" onClick={resetTraining}>
                  🗑️ Reiniciar Entrenamiento
                </button>
              </div>

              <div className="data-info">
                <h4>Información de los Datos</h4>
                <p>Los datos de entrenamiento incluyen:</p>
                <ul>
                  <li>Patrones de entrada del usuario</li>
                  <li>Respuestas generadas por el bot</li>
                  <li>Contextos de conversación</li>
                  <li>Intenciones detectadas</li>
                  <li>Historial de interacciones</li>
                  <li>Métricas de rendimiento</li>
                </ul>
                
                <div className="data-tips">
                  <h5>💡 Consejos para mejorar el entrenamiento:</h5>
                  <ul>
                    <li>Exporta los datos regularmente como respaldo</li>
                    <li>Revisa las preguntas frecuentes para mejorar respuestas</li>
                    <li>Analiza los temas comunes para agregar más contenido</li>
                    <li>Monitorea la satisfacción para identificar áreas de mejora</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatbotAdmin;
