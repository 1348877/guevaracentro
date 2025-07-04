import React, { useState, useEffect, useRef } from 'react';
import AuthService from '../services/authService';
import './Chat.css';

const Chat = ({ isOpen, onClose, recipient }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const messagesEndRef = useRef(null);
  const currentUser = AuthService.getUser();

  // Simular conexión WebSocket
  useEffect(() => {
    if (isOpen) {
      // Simular conexión
      setConnectionStatus('connecting');
      setTimeout(() => {
        setConnectionStatus('connected');
        loadInitialMessages();
      }, 1000);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadInitialMessages = () => {
    // Mensajes de ejemplo según el rol
    const mockMessages = [
      {
        id: 1,
        senderId: recipient?.id || 'system',
        senderName: recipient?.nombre || 'Sistema',
        content: '¡Hola! ¿En qué puedo ayudarte hoy?',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        type: 'text'
      },
      {
        id: 2,
        senderId: currentUser?.id || 'user',
        senderName: currentUser?.nombre || 'Tú',
        content: 'Hola, tengo una consulta sobre mi próxima cita.',
        timestamp: new Date(Date.now() - 240000).toISOString(),
        type: 'text'
      },
      {
        id: 3,
        senderId: recipient?.id || 'system',
        senderName: recipient?.nombre || 'Sistema',
        content: 'Por supuesto, estaré encantado de ayudarte con tu consulta.',
        timestamp: new Date(Date.now() - 180000).toISOString(),
        type: 'text'
      }
    ];
    setMessages(mockMessages);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      senderId: currentUser?.id || 'user',
      senderName: currentUser?.nombre || 'Tú',
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simular respuesta automática
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const autoResponse = {
        id: Date.now() + 1,
        senderId: recipient?.id || 'system',
        senderName: recipient?.nombre || 'Sistema',
        content: generateAutoResponse(newMessage),
        timestamp: new Date().toISOString(),
        type: 'text'
      };
      setMessages(prev => [...prev, autoResponse]);
    }, 1500);
  };

  const generateAutoResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('cita') || lowerMessage.includes('agenda')) {
      return 'Entiendo que tienes una consulta sobre tu cita. ¿Necesitas cambiar la fecha o confirmar los detalles?';
    } else if (lowerMessage.includes('pago') || lowerMessage.includes('factura')) {
      return 'Te ayudo con temas de pagos y facturación. ¿Qué necesitas saber específicamente?';
    } else if (lowerMessage.includes('emergencia') || lowerMessage.includes('urgente')) {
      return 'Si tienes una emergencia, por favor contacta inmediatamente al teléfono de emergencias: +51 XXX XXX XXX';
    } else if (lowerMessage.includes('horario') || lowerMessage.includes('disponible')) {
      return 'Nuestros horarios de atención son de lunes a viernes de 8:00 AM a 6:00 PM. ¿Te gustaría agendar una cita?';
    } else {
      return 'Gracias por tu mensaje. Un miembro de nuestro equipo te responderá pronto. ¿Hay algo más en lo que pueda ayudarte?';
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === new Date(today.getTime() - 86400000).toDateString()) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short' 
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chat-overlay">
      <div className="chat-container">
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="chat-avatar">
              {recipient?.avatar || '💬'}
            </div>
            <div className="chat-details">
              <h4>{recipient?.nombre || 'Centro Psicológico'}</h4>
              <span className={`chat-status ${connectionStatus}`}>
                {connectionStatus === 'connected' ? 'En línea' : 
                 connectionStatus === 'connecting' ? 'Conectando...' : 'Desconectado'}
              </span>
            </div>
          </div>
          <div className="chat-header-actions">
            <button className="chat-action-btn" title="Configuración">
              ⚙️
            </button>
            <button className="chat-action-btn" onClick={onClose} title="Cerrar">
              ✕
            </button>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.senderId === currentUser?.id ? 'sent' : 'received'}`}>
              <div className="message-content">
                <div className="message-text">{message.content}</div>
                <div className="message-meta">
                  <span className="message-time">{formatTime(message.timestamp)}</span>
                  {message.senderId === currentUser?.id && (
                    <span className="message-status">✓</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message received">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="message-meta">
                  <span className="message-time">Escribiendo...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-form" onSubmit={handleSendMessage}>
          <div className="chat-input-container">
            <button type="button" className="chat-attachment-btn" title="Adjuntar archivo">
              📎
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="chat-input"
              disabled={connectionStatus !== 'connected'}
            />
            <button type="submit" className="chat-send-btn" disabled={!newMessage.trim()}>
              📤
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
