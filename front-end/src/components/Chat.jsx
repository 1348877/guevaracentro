import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../services/authService';
import chatbotService from '../services/chatbotService';
import webSocketService from '../services/webSocketService';
import loggingService from '../services/loggingService';
import chatNavigationService from '../services/chatNavigationService';
import chatFeedbackService from '../services/chatFeedbackService';
import ChatFeedback from './ChatFeedback';
import './Chat.css';

const Chat = forwardRef(({ 
  isOpen = true, 
  onClose, 
  recipient, 
  isFloating = false,
  user = null,
  onNewMessage,
  greeting = null,
  availableFeatures = [],
  isOnline = true
}, ref) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [suggestedActions, setSuggestedActions] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const messagesEndRef = useRef(null);
  const currentUser = user || AuthService.getUser();
  const navigate = useNavigate();
  const location = useLocation();

  // Exponer métodos al componente padre
  useImperativeHandle(ref, () => ({
    sendMessage: (message) => {
      setNewMessage(message);
      // Simular envío después de un pequeño delay
      setTimeout(() => {
        handleSendMessage({ preventDefault: () => {} });
      }, 100);
    },
    clearChat: () => {
      setMessages([]);
      setSuggestedActions([]);
    },
    addMessage: (message) => {
      setMessages(prev => [...prev, message]);
    }
  }));

  // Inicializar conexión WebSocket y chatbot
  useEffect(() => {
    if (isOpen) {
      // Log apertura del chat
      loggingService.logUserAction('chat_opened', { 
        recipient: recipient?.id || 'chatbot',
        timestamp: new Date().toISOString(),
        mode: isFloating ? 'floating' : 'modal'
      });

      // Reiniciar contexto del chatbot
      chatbotService.resetContext();
      
      // Conectar WebSocket solo si está online
      if (currentUser?.id && isOnline) {
        setConnectionStatus('connecting');
        webSocketService.connect(currentUser.id, currentUser.rol);
        
        // Configurar listeners de WebSocket
        webSocketService.on('connected', handleWebSocketConnected);
        webSocketService.on('disconnected', handleWebSocketDisconnected);
        webSocketService.on('message', handleWebSocketMessage);
        webSocketService.on('typing', handleTypingIndicator);
        webSocketService.on('error', handleWebSocketError);
        webSocketService.on('reconnecting', handleReconnecting);
        
        // Solicitar historial de chat
        setTimeout(() => {
          webSocketService.requestChatHistory(recipient?.id);
        }, 1000);
      } else {
        // Modo sin conexión (solo chatbot)
        setConnectionStatus('connected');
        loadInitialMessages();
      }
    }

    // Cleanup
    return () => {
      if (webSocketService.isConnected) {
        webSocketService.disconnect();
      }
    };
  }, [isOpen, isOnline, currentUser]);

  // Handlers de WebSocket
  const handleWebSocketConnected = () => {
    setConnectionStatus('connected');
    loggingService.info('WebSocket conectado correctamente');
    loadInitialMessages();
  };

  const handleWebSocketDisconnected = (data) => {
    setConnectionStatus('disconnected');
    loggingService.warn('WebSocket desconectado', data);
  };

  const handleWebSocketMessage = (data) => {
    const message = {
      id: data.id || Date.now(),
      senderId: data.senderId,
      senderName: data.senderName || 'Usuario',
      content: data.message,
      timestamp: data.timestamp,
      isFromChatbot: data.senderId === 'chatbot',
      type: data.messageType || 'text'
    };

    setMessages(prev => [...prev, message]);
    loggingService.info('Mensaje recibido via WebSocket', { messageId: message.id });
  };

  const handleTypingIndicator = (data) => {
    if (data.userId !== currentUser?.id) {
      setIsTyping(data.isTyping);
    }
  };

  const handleWebSocketError = (error) => {
    loggingService.error('Error en WebSocket', error);
    setConnectionStatus('disconnected');
  };

  const handleReconnecting = (data) => {
    setConnectionStatus('connecting');
    loggingService.info('Reintentando conexión WebSocket', data);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadInitialMessages = () => {
    // Usar saludo personalizado si se proporciona, o generar uno inteligente
    let welcomeResponse;
    
    if (greeting) {
      welcomeResponse = {
        message: greeting,
        type: 'welcome',
        suggestedActions: availableFeatures.slice(0, 3) // Solo usar los strings directamente
      };
    } else {
      welcomeResponse = chatbotService.getWelcomeMessage(
        currentUser?.rol || 'paciente',
        currentUser?.nombre || 'Usuario'
      );
    }

    const welcomeMessage = {
      id: 1,
      senderId: 'chatbot',
      senderName: '🤖 Asistente Virtual',
      content: welcomeResponse.message,
      timestamp: new Date().toISOString(),
      isFromChatbot: true,
      type: 'bot',
      messageType: welcomeResponse.type
    };

    setMessages([welcomeMessage]);
    setSuggestedActions(welcomeResponse.suggestedActions || []);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    const messageText = newMessage.trim();
    setNewMessage('');

    // Crear mensaje del usuario
    const userMessage = {
      id: Date.now(),
      senderId: currentUser?.id || 'user',
      senderName: currentUser?.nombre || 'Usuario',
      content: messageText,
      timestamp: new Date().toISOString(),
      isFromChatbot: false,
      type: 'text'
    };

    // Agregar mensaje del usuario
    setMessages(prev => [...prev, userMessage]);

    // Log del mensaje enviado
    loggingService.logUserAction('message_sent', {
      messageLength: messageText.length,
      recipient: recipient?.id || 'chatbot'
    });

    // Enviar via WebSocket si está conectado
    if (connectionStatus === 'connected' && recipient?.id) {
      try {
        webSocketService.sendMessage(messageText, recipient.id);
      } catch (error) {
        loggingService.error('Error al enviar mensaje via WebSocket', error);
      }
    }

    // Procesar con chatbot
    setIsTyping(true);
    
    try {
      const botResponse = await chatbotService.processMessage(
        messageText,
        currentUser?.rol || 'paciente',
        currentUser?.nombre || 'Usuario'
      );

      setTimeout(() => {
        setIsTyping(false);
        
        const botMessage = {
          id: Date.now() + 1,
          senderId: 'chatbot',
          senderName: '🤖 Asistente Virtual',
          content: botResponse.message,
          timestamp: new Date().toISOString(),
          isFromChatbot: true,
          type: botResponse.type || 'text',
          suggestedActions: botResponse.suggestedActions || []
        };

        setMessages(prev => [...prev, botMessage]);
        setSuggestedActions(botResponse.suggestedActions || []);

        // Log de respuesta del chatbot
        loggingService.info('Respuesta del chatbot generada', {
          responseType: botResponse.type,
          hasSuggestions: botResponse.suggestedActions?.length > 0
        });

        // Notificar al componente padre sobre nuevo mensaje
        if (onNewMessage) {
          onNewMessage();
        }

        // Enviar respuesta del bot via WebSocket si hay otro usuario
        if (connectionStatus === 'connected' && recipient?.id) {
          try {
            webSocketService.sendMessage(botResponse.message, recipient.id, 'bot_response');
          } catch (error) {
            loggingService.error('Error al enviar respuesta del bot via WebSocket', error);
          }
        }
      }, 1000 + Math.random() * 2000);
      
    } catch (error) {
      setIsTyping(false);
      loggingService.error('Error al procesar mensaje con chatbot', error);
      
      // Mensaje de error
      const errorMessage = {
        id: Date.now() + 1,
        senderId: 'chatbot',
        senderName: '🤖 Asistente Virtual',
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor intenta nuevamente.',
        timestamp: new Date().toISOString(),
        isFromChatbot: true,
        type: 'error'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleSuggestedAction = (action) => {
    loggingService.logUserAction('suggested_action_clicked', { action });
    
    // Verificar si es una acción de navegación
    const isNavigationAction = chatNavigationService.getRoute(action, currentUser?.rol || 'public');
    
    if (isNavigationAction) {
      // Si es navegación, ejecutar y agregar mensaje informativo
      const success = chatNavigationService.navigateTo(action, currentUser?.rol || 'public');
      
      if (success) {
        const navMessage = {
          id: Date.now(),
          senderId: 'chatbot',
          senderName: '🤖 Asistente Virtual',
          content: `Perfecto, te estoy redirigiendo a ${action}. Si no se abre automáticamente, puedes hacer clic en el enlace.`,
          timestamp: new Date().toISOString(),
          isFromChatbot: true,
          type: 'navigation'
        };
        
        setMessages(prev => [...prev, navMessage]);
        
        // También cerrar el chat flotante si está abierto
        if (isFloating && onClose) {
          setTimeout(() => onClose(), 2000);
        }
        
        return;
      }
    }
    
    // Si no es navegación o falló, procesar como mensaje normal
    // Enviar el mensaje directamente sin delay
    const userMessage = {
      id: Date.now(),
      senderId: currentUser?.id || 'user',
      senderName: currentUser?.nombre || 'Usuario',
      content: action,
      timestamp: new Date().toISOString(),
      isFromChatbot: false,
      type: 'text'
    };

    // Agregar mensaje del usuario inmediatamente
    setMessages(prev => [...prev, userMessage]);

    // Log del mensaje enviado
    loggingService.logUserAction('message_sent', {
      messageLength: action.length,
      recipient: recipient?.id || 'chatbot',
      isFromSuggestedAction: true
    });

    // Procesar con chatbot inmediatamente
    setIsTyping(true);
    
    chatbotService.processMessage(
      action,
      currentUser?.rol || 'public',
      currentUser?.nombre || 'Usuario'
    ).then(botResponse => {
      setTimeout(() => {
        setIsTyping(false);
        
        const botMessage = {
          id: Date.now() + 1,
          senderId: 'chatbot',
          senderName: '🤖 Asistente Virtual',
          content: botResponse.message,
          timestamp: new Date().toISOString(),
          isFromChatbot: true,
          type: botResponse.type || 'text',
          suggestedActions: botResponse.suggestedActions || []
        };

        setMessages(prev => [...prev, botMessage]);
        setSuggestedActions(botResponse.suggestedActions || []);

        // Notificar al componente padre sobre nuevo mensaje
        if (onNewMessage) {
          onNewMessage();
        }
      }, 800 + Math.random() * 1000); // Respuesta más rápida para acciones sugeridas
    }).catch(error => {
      setIsTyping(false);
      loggingService.error('Error al procesar acción sugerida', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        senderId: 'chatbot',
        senderName: '🤖 Asistente Virtual',
        content: 'Lo siento, hubo un error al procesar tu solicitud. Por favor intenta nuevamente.',
        timestamp: new Date().toISOString(),
        isFromChatbot: true,
        type: 'error'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    });
  };

  // Métodos para feedback
  const handleFeedbackRequest = (message, userMessage) => {
    setFeedbackMessage({
      id: message.id,
      content: message.content,
      userMessage: userMessage,
      timestamp: message.timestamp
    });
    setShowFeedback(true);
  };

  const handleFeedbackSubmit = async (feedbackData) => {
    try {
      const success = await chatFeedbackService.submitFeedback(feedbackData);
      if (success) {
        // Actualizar el mensaje con el feedback
        setMessages(prev => prev.map(msg => 
          msg.id === feedbackData.messageId 
            ? { ...msg, feedback: { rating: feedbackData.rating, comment: feedbackData.comment } }
            : msg
        ));
        
        // Log del feedback
        loggingService.logUserAction('feedback_submitted', {
          rating: feedbackData.rating,
          hasComment: !!feedbackData.comment,
          messageId: feedbackData.messageId
        });
      }
    } catch (error) {
      console.error('Error al enviar feedback:', error);
    }
  };

  const handleFeedbackClose = () => {
    setShowFeedback(false);
    setFeedbackMessage(null);
  };

  const handleClose = () => {
    loggingService.logUserAction('chat_closed', {
      duration: Date.now() - (messages[0]?.timestamp ? new Date(messages[0].timestamp).getTime() : Date.now()),
      messageCount: messages.length
    });
    
    if (connectionStatus === 'connected') {
      webSocketService.disconnect();
    }
    
    onClose();
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Conectado';
      case 'connecting':
        return 'Conectando...';
      case 'disconnected':
        return 'Desconectado';
      default:
        return 'Sin conexión';
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`chat-overlay ${isFloating ? 'floating' : ''}`} onClick={!isFloating ? handleClose : undefined}>
      <div className="chat-container" onClick={(e) => e.stopPropagation()} data-role={currentUser?.rol}>
        {!isFloating && (
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">
                {recipient?.avatar || '🤖'}
              </div>
              <div className="chat-details">
                <h4>{recipient?.nombre || 'Asistente Virtual'}</h4>
                <div className={`chat-status ${connectionStatus}`}>
                  {getConnectionStatusText()}
                </div>
              </div>
            </div>
            <div className="chat-header-actions">
              <button 
                className="chat-action-btn" 
                onClick={() => webSocketService.getOnlineUsers()}
                title="Usuarios en línea"
              >
                👥
              </button>
              <button 
                className="chat-action-btn" 
                onClick={handleClose}
                title="Cerrar chat"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={message.id} className={`message ${message.isFromChatbot ? 'received' : 'sent'}`}>
              <div className="message-content">
                <div className={`message-text ${message.type ? `message-type-${message.type}` : ''}`}>
                  {message.content}
                </div>
                <div className="message-meta">
                  <span className="message-time">
                    {formatTime(message.timestamp)}
                  </span>
                  {message.isFromChatbot && (
                    <span className="message-status">Bot</span>
                  )}
                  
                  {/* Botón de feedback para mensajes del bot */}
                  {message.isFromChatbot && !message.feedback && (
                    <button 
                      className="feedback-btn"
                      onClick={() => handleFeedbackRequest(message, messages[index - 1]?.content || '')}
                      title="Calificar respuesta"
                    >
                      ⭐
                    </button>
                  )}
                  
                  {/* Indicador de feedback enviado */}
                  {message.feedback && (
                    <span className="feedback-indicator" title={`Calificación: ${message.feedback.rating}/5`}>
                      ⭐ {message.feedback.rating}/5
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message received">
              <div className="message-content">
                <div className="typing-indicator smart">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {suggestedActions.length > 0 && (
          <div className="suggested-actions">
            {suggestedActions.map((action, index) => (
              <button 
                key={index}
                className="suggested-action"
                onClick={() => handleSuggestedAction(action)}
              >
                {action}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSendMessage} className="chat-input-form">
          <div className="chat-input-container">
            <button 
              type="button" 
              className="chat-attachment-btn"
              title="Adjuntar archivo"
            >
              📎
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="chat-input"
              disabled={connectionStatus === 'connecting'}
            />
            <button 
              type="submit" 
              className="chat-send-btn"
              disabled={!newMessage.trim() || connectionStatus === 'connecting'}
            >
              📤
            </button>
          </div>
        </form>

        {showFeedback && feedbackMessage && (
          <ChatFeedback 
            message={feedbackMessage}
            onSubmit={handleFeedbackSubmit}
            onClose={handleFeedbackClose}
          />
        )}
      </div>
    </div>
  );
});

export default Chat;
