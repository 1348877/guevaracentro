import React, { useState, useEffect } from 'react';
import chatbotService from '../services/chatbotService';
import chatbotTrainingService from '../services/chatbotTrainingService';
import './ChatbotAdminPanel.css';

const ChatbotAdminPanel = ({ userRole, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [trainingData, setTrainingData] = useState(null);
  const [newTrainingEntry, setNewTrainingEntry] = useState({
    question: '',
    answer: '',
    category: 'general',
    confidence: 0.8
  });
  const [importData, setImportData] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Solo accesible para admin
  if (userRole !== 'admin') {
    return null;
  }

  useEffect(() => {
    if (isOpen) {
      loadStats();
      loadTrainingData();
    }
  }, [isOpen]);

  const loadStats = async () => {
    try {
      const chatStats = await chatbotService.getChatbotStats();
      setStats(chatStats);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      setMessage('Error al cargar estadísticas');
    }
  };

  const loadTrainingData = async () => {
    try {
      const data = await chatbotService.exportTrainingData();
      setTrainingData(data);
    } catch (error) {
      console.error('Error al cargar datos de entrenamiento:', error);
      setMessage('Error al cargar datos de entrenamiento');
    }
  };

  const handleAddTrainingEntry = async () => {
    if (!newTrainingEntry.question || !newTrainingEntry.answer) {
      setMessage('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      await chatbotTrainingService.addTrainingEntry(newTrainingEntry);
      setNewTrainingEntry({
        question: '',
        answer: '',
        category: 'general',
        confidence: 0.8
      });
      setMessage('Entrada de entrenamiento agregada exitosamente');
      await loadTrainingData();
    } catch (error) {
      console.error('Error al agregar entrada:', error);
      setMessage('Error al agregar entrada de entrenamiento');
    } finally {
      setLoading(false);
    }
  };

  const handleImportData = async () => {
    if (!importData) {
      setMessage('Por favor proporciona datos para importar');
      return;
    }

    setLoading(true);
    try {
      const data = JSON.parse(importData);
      const success = await chatbotService.importTrainingData(data);
      if (success) {
        setMessage('Datos importados exitosamente');
        setImportData('');
        await loadTrainingData();
      } else {
        setMessage('Error al importar datos');
      }
    } catch (error) {
      console.error('Error al importar:', error);
      setMessage('Error al procesar datos de importación');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const data = await chatbotService.exportTrainingData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chatbot-training-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMessage('Datos exportados exitosamente');
    } catch (error) {
      console.error('Error al exportar:', error);
      setMessage('Error al exportar datos');
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm('¿Estás seguro de que quieres limpiar todo el historial?')) {
      setLoading(true);
      try {
        await chatbotService.clearConversationHistory();
        setMessage('Historial limpiado exitosamente');
        await loadStats();
      } catch (error) {
        console.error('Error al limpiar historial:', error);
        setMessage('Error al limpiar historial');
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chatbot-admin-panel-overlay">
      <div className="chatbot-admin-panel">
        <div className="admin-panel-header">
          <h2>Panel de Administración del Chatbot</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>

        <div className="admin-panel-tabs">
          <button 
            className={activeTab === 'stats' ? 'active' : ''}
            onClick={() => setActiveTab('stats')}
          >
            Estadísticas
          </button>
          <button 
            className={activeTab === 'training' ? 'active' : ''}
            onClick={() => setActiveTab('training')}
          >
            Entrenamiento
          </button>
          <button 
            className={activeTab === 'import' ? 'active' : ''}
            onClick={() => setActiveTab('import')}
          >
            Importar/Exportar
          </button>
          <button 
            className={activeTab === 'management' ? 'active' : ''}
            onClick={() => setActiveTab('management')}
          >
            Gestión
          </button>
        </div>

        <div className="admin-panel-content">
          {message && (
            <div className={`admin-message ${message.includes('Error') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="stats-section">
              <h3>Estadísticas del Chatbot</h3>
              {stats ? (
                <div className="stats-grid">
                  <div className="stat-card">
                    <h4>Interacciones Totales</h4>
                    <p>{stats.totalInteractions || 0}</p>
                  </div>
                  <div className="stat-card">
                    <h4>Promedio de Confianza</h4>
                    <p>{((stats.averageConfidence || 0) * 100).toFixed(1)}%</p>
                  </div>
                  <div className="stat-card">
                    <h4>Respuestas Exitosas</h4>
                    <p>{stats.successfulResponses || 0}</p>
                  </div>
                  <div className="stat-card">
                    <h4>Temas Más Consultados</h4>
                    <ul>
                      {Object.entries(stats.topTopics || {}).map(([topic, count]) => (
                        <li key={topic}>{topic}: {count}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p>Cargando estadísticas...</p>
              )}
            </div>
          )}

          {activeTab === 'training' && (
            <div className="training-section">
              <h3>Agregar Datos de Entrenamiento</h3>
              <div className="training-form">
                <div className="form-group">
                  <label>Pregunta:</label>
                  <input
                    type="text"
                    value={newTrainingEntry.question}
                    onChange={(e) => setNewTrainingEntry({
                      ...newTrainingEntry,
                      question: e.target.value
                    })}
                    placeholder="Ej: ¿Cuáles son sus servicios?"
                  />
                </div>
                <div className="form-group">
                  <label>Respuesta:</label>
                  <textarea
                    value={newTrainingEntry.answer}
                    onChange={(e) => setNewTrainingEntry({
                      ...newTrainingEntry,
                      answer: e.target.value
                    })}
                    placeholder="Respuesta detallada..."
                    rows="4"
                  />
                </div>
                <div className="form-group">
                  <label>Categoría:</label>
                  <select
                    value={newTrainingEntry.category}
                    onChange={(e) => setNewTrainingEntry({
                      ...newTrainingEntry,
                      category: e.target.value
                    })}
                  >
                    <option value="general">General</option>
                    <option value="servicios">Servicios</option>
                    <option value="citas">Citas</option>
                    <option value="equipo">Equipo</option>
                    <option value="contacto">Contacto</option>
                    <option value="emergencia">Emergencia</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Confianza:</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={newTrainingEntry.confidence}
                    onChange={(e) => setNewTrainingEntry({
                      ...newTrainingEntry,
                      confidence: parseFloat(e.target.value)
                    })}
                  />
                  <span>{newTrainingEntry.confidence}</span>
                </div>
                <button 
                  onClick={handleAddTrainingEntry}
                  disabled={loading}
                  className="add-training-btn"
                >
                  {loading ? 'Agregando...' : 'Agregar Entrada'}
                </button>
              </div>

              {trainingData && (
                <div className="training-data-preview">
                  <h4>Datos de Entrenamiento Actuales</h4>
                  <div className="training-stats">
                    <p>Total de patrones: {Object.keys(trainingData.patterns || {}).length}</p>
                    <p>Total de respuestas: {Object.keys(trainingData.responses || {}).length}</p>
                    <p>Total de contextos: {Object.keys(trainingData.contexts || {}).length}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'import' && (
            <div className="import-section">
              <h3>Importar/Exportar Datos</h3>
              <div className="import-export-controls">
                <button onClick={handleExportData} className="export-btn">
                  Exportar Datos de Entrenamiento
                </button>
                
                <div className="import-form">
                  <label>Importar Datos (JSON):</label>
                  <textarea
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    placeholder="Pega aquí los datos JSON para importar..."
                    rows="8"
                  />
                  <button 
                    onClick={handleImportData}
                    disabled={loading}
                    className="import-btn"
                  >
                    {loading ? 'Importando...' : 'Importar Datos'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'management' && (
            <div className="management-section">
              <h3>Gestión del Sistema</h3>
              <div className="management-controls">
                <button 
                  onClick={handleClearHistory}
                  disabled={loading}
                  className="clear-history-btn dangerous"
                >
                  {loading ? 'Limpiando...' : 'Limpiar Historial Completo'}
                </button>
                
                <button 
                  onClick={loadStats}
                  className="refresh-stats-btn"
                >
                  Actualizar Estadísticas
                </button>
                
                <button 
                  onClick={loadTrainingData}
                  className="refresh-training-btn"
                >
                  Actualizar Datos de Entrenamiento
                </button>
              </div>
              
              <div className="system-info">
                <h4>Información del Sistema</h4>
                <p>Última actualización: {new Date().toLocaleString()}</p>
                <p>Versión del chatbot: 2.0</p>
                <p>Estado: Activo</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatbotAdminPanel;
