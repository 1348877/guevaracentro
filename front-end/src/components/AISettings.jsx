import React, { useState, useEffect } from 'react';
import chatbotService from '../services/chatbotService';
import aiService from '../services/aiService';
import './AISettings.css';

const AISettings = ({ isOpen, onClose }) => {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [currentModel, setCurrentModel] = useState('SPANISH_CONVERSATIONAL');
  const [stats, setStats] = useState(null);
  const [testMessage, setTestMessage] = useState('');
  const [testResponse, setTestResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  const loadSettings = () => {
    const stats = chatbotService.getStats();
    setStats(stats);
    setAiEnabled(stats.aiEnabled);
  };

  const handleToggleAI = () => {
    const newState = !aiEnabled;
    setAiEnabled(newState);
    chatbotService.toggleAI(newState);
    
    if (newState && !apiKey) {
      alert('Nota: Sin API Key, la IA usará el tier gratuito con límites.');
    }
  };

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      chatbotService.setAIApiKey(apiKey);
      aiService.setApiKey(apiKey);
      alert('✅ API Key guardada correctamente');
    }
  };

  const handleModelChange = (model) => {
    setCurrentModel(model);
    aiService.switchModel(model);
  };

  const handleTestAI = async () => {
    if (!testMessage.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await aiService.generateResponse(testMessage, {
        userRole: 'paciente',
        userName: 'Usuario Test',
        situation: 'test'
      });
      
      setTestResponse(response.message);
    } catch (error) {
      setTestResponse('❌ Error al probar la IA: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const models = [
    { key: 'SPANISH_CONVERSATIONAL', name: 'Conversacional Español' },
    { key: 'SPANISH_GENERATION', name: 'Generación Español' },
    { key: 'MULTILINGUAL_CHAT', name: 'Chat Multilingüe' },
    { key: 'MEDICAL_SPANISH', name: 'Médico Español' }
  ];

  if (!isOpen) return null;

  return (
    <div className="ai-settings-overlay" onClick={onClose}>
      <div className="ai-settings-container" onClick={(e) => e.stopPropagation()}>
        <div className="ai-settings-header">
          <h2>🤖 Configuración de IA</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="ai-settings-content">
          {/* Estado de la IA */}
          <div className="settings-section">
            <h3>Estado del Sistema</h3>
            <div className="ai-status">
              <div className={`status-indicator ${aiEnabled ? 'active' : 'inactive'}`}>
                {aiEnabled ? '🟢 IA Activada' : '🔴 IA Desactivada'}
              </div>
              <button 
                className={`toggle-btn ${aiEnabled ? 'enabled' : 'disabled'}`}
                onClick={handleToggleAI}
              >
                {aiEnabled ? 'Desactivar IA' : 'Activar IA'}
              </button>
            </div>
          </div>

          {/* Configuración de API */}
          <div className="settings-section">
            <h3>🔑 API Key de Hugging Face</h3>
            <p className="help-text">
              Opcional: Aumenta los límites de uso. Obtén tu API key gratuita en 
              <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer">
                huggingface.co/settings/tokens
              </a>
            </p>
            <div className="api-key-section">
              <input
                type="password"
                placeholder="hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="api-key-input"
              />
              <button onClick={handleSaveApiKey} className="save-btn">
                Guardar
              </button>
            </div>
          </div>

          {/* Selección de Modelo */}
          <div className="settings-section">
            <h3>🧠 Modelo de IA</h3>
            <div className="model-selector">
              {models.map(model => (
                <label key={model.key} className="model-option">
                  <input
                    type="radio"
                    name="model"
                    value={model.key}
                    checked={currentModel === model.key}
                    onChange={() => handleModelChange(model.key)}
                  />
                  <span>{model.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Prueba de IA */}
          <div className="settings-section">
            <h3>🧪 Probar IA</h3>
            <div className="test-section">
              <input
                type="text"
                placeholder="Escribe un mensaje de prueba..."
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className="test-input"
              />
              <button 
                onClick={handleTestAI} 
                disabled={isLoading || !aiEnabled}
                className="test-btn"
              >
                {isLoading ? '⏳ Probando...' : '🚀 Probar'}
              </button>
            </div>
            
            {testResponse && (
              <div className="test-response">
                <strong>Respuesta de IA:</strong>
                <p>{testResponse}</p>
              </div>
            )}
          </div>

          {/* Estadísticas */}
          {stats && (
            <div className="settings-section">
              <h3>📊 Estadísticas</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span>Conversaciones:</span>
                  <span>{stats.conversationLength}</span>
                </div>
                <div className="stat-item">
                  <span>Última interacción:</span>
                  <span>{stats.lastInteraction ? new Date(stats.lastInteraction).toLocaleTimeString() : 'Ninguna'}</span>
                </div>
                <div className="stat-item">
                  <span>Intención actual:</span>
                  <span>{stats.currentIntent || 'Ninguna'}</span>
                </div>
                <div className="stat-item">
                  <span>API Key:</span>
                  <span>{stats.aiStats?.apiKey || '❌ Sin configurar'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Instrucciones */}
          <div className="settings-section">
            <h3>💡 Instrucciones</h3>
            <div className="instructions">
              <p><strong>Sin API Key:</strong> Funciona gratis con límites de uso.</p>
              <p><strong>Con API Key:</strong> Mayor capacidad y mejores respuestas.</p>
              <p><strong>Modelos disponibles:</strong></p>
              <ul>
                <li><strong>Conversacional:</strong> Mejor para chat general</li>
                <li><strong>Médico:</strong> Especializado en términos psicológicos</li>
                <li><strong>Multilingüe:</strong> Soporte para varios idiomas</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="ai-settings-footer">
          <button onClick={onClose} className="close-footer-btn">
            Cerrar Configuración
          </button>
        </div>
      </div>
    </div>
  );
};

export default AISettings;
