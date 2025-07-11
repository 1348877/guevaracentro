import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './FloatingChatbot.css';
import Chat from './Chat';
import ChatbotAdmin from './ChatbotAdmin';
import ChatbotAdminPanel from './ChatbotAdminPanel';
import AuthService from '../services/authService';
import floatingChatbotConfig from '../services/floatingChatbotConfig';
import chatPersistenceService from '../services/chatPersistenceService';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [user, setUser] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [shouldShow, setShouldShow] = useState(true);
  const [chatState, setChatState] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [newMessagesWhileMinimized, setNewMessagesWhileMinimized] = useState(0);
  const chatRef = useRef(null);
  const location = useLocation();

  // Cargar estado persistente al inicializar
  useEffect(() => {
    const savedState = chatPersistenceService.restoreFullChatState();
    setChatState(savedState);
    
    // Restaurar estado visual si hay una sesión reciente
    if (chatPersistenceService.hasRecentSession() && savedState.shouldRestore) {
      setIsOpen(savedState.isOpen || false);
      setIsMinimized(savedState.isMinimized || false);
    }
    
    // Configurar sincronización entre tabs
    chatPersistenceService.syncAcrossTabs();
    
    // Listener para cambios de estado entre tabs
    const handleChatStateChanged = (event) => {
      if (event.detail) {
        setChatState(event.detail);
      }
    };
    
    window.addEventListener('chatStateChanged', handleChatStateChanged);
    
    return () => {
      window.removeEventListener('chatStateChanged', handleChatStateChanged);
    };
  }, []);

  // Verificar usuario autenticado
  useEffect(() => {
    const checkAuth = () => {
      const currentUser = AuthService.getUser();
      const isAuthenticated = AuthService.isAuthenticated();
      
      if (isAuthenticated && currentUser) {
        setUser(currentUser);
        // Guardar contexto del usuario
        chatPersistenceService.saveUserContext({
          userId: currentUser.id,
          role: currentUser.rol,
          name: currentUser.nombre,
          lastLogin: new Date().toISOString()
        });
      } else {
        setUser(null);
      }
    };
    
    checkAuth();
    
    // Listener para cambios en la autenticación
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  // Verificar si debe mostrar el chatbot según la ruta
  useEffect(() => {
    const shouldShowForCurrentPath = floatingChatbotConfig.shouldShowForPath(location.pathname);
    setShouldShow(shouldShowForCurrentPath);
  }, [location.pathname]);

  // Detectar cambios en la conexión
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Gestionar notificaciones de mensajes no leídos
  useEffect(() => {
    if (isOpen) {
      setUnreadMessages(0);
    }
  }, [isOpen]);

  const toggleChat = () => {
    if (isMinimized) {
      // Si está minimizado, restaurar
      setIsMinimized(false);
      setIsOpen(true);
      
      // Persistir estado visual
      chatPersistenceService.updateVisualState({
        isOpen: true,
        isMinimized: false
      });
      
      // Persistir estado completo
      const currentState = chatPersistenceService.loadChatState();
      chatPersistenceService.saveChatState({
        ...currentState,
        isOpen: true,
        isMinimized: false,
        lastInteraction: new Date().toISOString()
      });
    } else {
      // Comportamiento normal de abrir/cerrar
      const newIsOpen = !isOpen;
      setIsOpen(newIsOpen);
      setIsMinimized(false);
      
      // Persistir estado visual
      chatPersistenceService.updateVisualState({
        isOpen: newIsOpen,
        isMinimized: false
      });
      
      // Persistir estado completo
      const currentState = chatPersistenceService.loadChatState();
      chatPersistenceService.saveChatState({
        ...currentState,
        isOpen: newIsOpen,
        isMinimized: false,
        lastInteraction: new Date().toISOString()
      });
    }
  };

  const minimizeChat = () => {
    setIsMinimized(true);
    // Mantener el chat abierto pero minimizado
    setIsOpen(true);
    
    // Persistir estado visual
    chatPersistenceService.updateVisualState({
      isOpen: true,
      isMinimized: true
    });
    
    // Persistir estado completo
    const currentState = chatPersistenceService.loadChatState();
    chatPersistenceService.saveChatState({
      ...currentState,
      isOpen: true,
      isMinimized: true,
      lastInteraction: new Date().toISOString()
    });
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
    
    // Persistir estado visual
    chatPersistenceService.updateVisualState({
      isOpen: false,
      isMinimized: false
    });
    
    // Persistir estado completo
    const currentState = chatPersistenceService.loadChatState();
    chatPersistenceService.saveChatState({
      ...currentState,
      isOpen: false,
      isMinimized: false,
      lastInteraction: new Date().toISOString()
    });
  };

  const handleNewMessage = () => {
    if (!isOpen || isMinimized) {
      setUnreadMessages(prev => prev + 1);
      
      if (isMinimized) {
        setNewMessagesWhileMinimized(prev => prev + 1);
      }
    }
    
    if (onNewMessage) {
      onNewMessage();
    }
  };

  // Obtener saludo personalizado según el rol
  const getGreeting = () => {
    const role = user?.rol || 'public';
    const name = user?.nombre || null;
    return floatingChatbotConfig.getGreeting(role, name);
  };

  // Obtener funcionalidades disponibles según el rol
  const getAvailableFeatures = () => {
    const role = user?.rol || 'public';
    return floatingChatbotConfig.getFeatures(role);
  };

  // Obtener color del tema según el rol
  const getThemeColor = () => {
    const role = user?.rol || 'public';
    return floatingChatbotConfig.getThemeColor(role);
  };

  // Obtener respuestas rápidas según el rol
  const getQuickResponses = () => {
    const role = user?.rol || 'public';
    return floatingChatbotConfig.getQuickResponses(role);
  };

  const restoreChat = () => {
    setIsMinimized(false);
    setIsOpen(true);
    setNewMessagesWhileMinimized(0);
    setUnreadMessages(0);
    
    // Persistir estado visual
    chatPersistenceService.updateVisualState({
      isOpen: true,
      isMinimized: false
    });
    
    // Persistir estado completo
    const currentState = chatPersistenceService.loadChatState();
    chatPersistenceService.saveChatState({
      ...currentState,
      isOpen: true,
      isMinimized: false,
      lastInteraction: new Date().toISOString()
    });
  };

  // No mostrar si no debe aparecer en esta ruta
  if (!shouldShow) {
    return null;
  }

  return (
    <>
      {/* Botón flotante */}
      <div 
        className={`floating-chatbot-button ${isOpen ? 'active' : ''} ${isMinimized ? 'minimized' : ''}`} 
        onClick={toggleChat}
        style={{ 
          background: `linear-gradient(135deg, ${getThemeColor()} 0%, ${getThemeColor()}dd 100%)`
        }}
      >
        <div className="chatbot-icon">
          {isMinimized ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 7H5V5H19V7ZM19 12H5V10H19V12ZM19 17H5V15H19V17Z" fill="currentColor"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 13.54 2.38 14.98 3.06 16.24L2 22L7.76 20.94C9.02 21.62 10.46 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="currentColor"/>
              <circle cx="8.5" cy="12" r="1.5" fill="white"/>
              <circle cx="12" cy="12" r="1.5" fill="white"/>
              <circle cx="15.5" cy="12" r="1.5" fill="white"/>
            </svg>
          )}
        </div>
        
        {/* Indicador de conexión */}
        <div className={`connection-indicator ${isOnline ? 'online' : 'offline'}`}></div>
        
        {/* Contador de mensajes no leídos */}
        {unreadMessages > 0 && (
          <div className="unread-badge">
            {unreadMessages > 9 ? '9+' : unreadMessages}
          </div>
        )}
        
        {/* Tooltip */}
        <div className="chatbot-tooltip">
          {isMinimized ? 
            'Chat minimizado - Clic para maximizar' : 
            user ? `Asistente Virtual - ${user.rol}` : 'Asistente Virtual'
          }
        </div>
        
        {/* Botón de administración (solo para admins) */}
        {user?.rol === 'admin' && (
          <div 
            className="admin-button"
            onClick={(e) => {
              e.stopPropagation();
              setShowAdmin(true);
            }}
            title="Administración del Chatbot"
          >
            ⚙️
          </div>
        )}
      </div>

      {/* Ventana del chat */}
      {(isOpen || isMinimized) && (
        <div 
          className={`floating-chatbot-window ${isMinimized ? 'minimized' : ''}`}
          data-role={user?.rol || 'public'}
        >
          {/* Header */}
          <div 
            className="chatbot-header"
            style={{ 
              background: `linear-gradient(135deg, ${getThemeColor()} 0%, ${getThemeColor()}dd 100%)`
            }}
          >
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 13.54 2.38 14.98 3.06 16.24L2 22L7.76 20.94C9.02 21.62 10.46 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="currentColor"/>
                  <circle cx="8.5" cy="12" r="1.5" fill="white"/>
                  <circle cx="12" cy="12" r="1.5" fill="white"/>
                  <circle cx="15.5" cy="12" r="1.5" fill="white"/>
                </svg>
              </div>
              <div className="chatbot-header-text">
                <h3>Asistente Virtual</h3>
                <span className={`status ${isOnline ? 'online' : 'offline'}`}>
                  {isOnline ? 'En línea' : 'Sin conexión'}
                </span>
              </div>
            </div>
            <div className="chatbot-header-actions">
              {/* Botón de administración avanzada (solo para admins) */}
              {user?.rol === 'admin' && (
                <button 
                  className="admin-panel-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAdminPanel(true);
                  }} 
                  title="Panel de Administración"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5A3.5 3.5 0 0 1 15.5 12A3.5 3.5 0 0 1 12 15.5M19.43 12.98C19.47 12.66 19.5 12.34 19.5 12S19.47 11.34 19.43 11.02L21.54 9.37C21.73 9.22 21.78 8.95 21.66 8.73L19.66 5.27C19.54 5.05 19.27 4.97 19.05 5.05L16.56 6.05C16.04 5.65 15.48 5.32 14.87 5.07L14.49 2.42C14.46 2.18 14.25 2 14 2H10C9.75 2 9.54 2.18 9.51 2.42L9.13 5.07C8.52 5.32 7.96 5.65 7.44 6.05L4.95 5.05C4.72 4.96 4.46 5.05 4.34 5.27L2.34 8.73C2.21 8.95 2.27 9.22 2.46 9.37L4.57 11.02C4.53 11.34 4.5 11.67 4.5 12S4.53 12.66 4.57 12.98L2.46 14.63C2.27 14.78 2.21 15.05 2.34 15.27L4.34 18.73C4.46 18.95 4.72 19.03 4.95 18.95L7.44 17.95C7.96 18.35 8.52 18.68 9.13 18.93L9.51 21.58C9.54 21.82 9.75 22 10 22H14C14.25 22 14.46 21.82 14.49 21.58L14.87 18.93C15.48 18.68 16.04 18.34 16.56 17.95L19.05 18.95C19.28 19.04 19.54 18.95 19.66 18.73L21.66 15.27C21.78 15.05 21.73 14.78 21.54 14.63L19.43 12.98Z" fill="currentColor"/>
                  </svg>
                </button>
              )}
              <button 
                className={isMinimized ? "maximize-btn" : "minimize-btn"} 
                onClick={isMinimized ? restoreChat : minimizeChat} 
                title={isMinimized ? "Maximizar" : "Minimizar"}
              >
                {isMinimized ? (
                  // Ícono de maximizar (cuadrado expandido - más claro)
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 9H15V15H9V9ZM7 7V17H17V7H7ZM5 5H19V19H5V5Z" fill="currentColor"/>
                  </svg>
                ) : (
                  // Ícono de minimizar (línea)
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 13H5V11H19V13Z" fill="currentColor"/>
                  </svg>
                )}
              </button>
              <button className="close-btn" onClick={closeChat} title="Cerrar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Contenido del chat */}
          <div className="chatbot-content">
            {!isMinimized && (
              <Chat
                ref={chatRef}
                isFloating={true}
                user={user}
                onNewMessage={handleNewMessage}
                greeting={getGreeting()}
                availableFeatures={getAvailableFeatures()}
                isOnline={isOnline}
              />
            )}
            
            {/* Vista minimizada */}
            {isMinimized && (
              <div className="chatbot-minimized-content">
                <div className="minimized-header">
                  <span className="minimized-title">
                    💬 Chat minimizado
                    {newMessagesWhileMinimized > 0 && (
                      <span className="new-messages-indicator">
                        {newMessagesWhileMinimized} nuevo{newMessagesWhileMinimized > 1 ? 's' : ''}
                      </span>
                    )}
                  </span>
                  <button 
                    className="restore-btn"
                    onClick={restoreChat}
                    title="Maximizar chat"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 9H15V15H9V9ZM7 7V17H17V7H7ZM5 5H19V19H5V5Z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
                <button 
                  className="restore-conversation-btn"
                  onClick={restoreChat}
                  style={{
                    background: `linear-gradient(135deg, ${getThemeColor()} 0%, ${getThemeColor()}dd 100%)`
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 9H15V15H9V9ZM7 7V17H17V7H7ZM5 5H19V19H5V5Z" fill="currentColor"/>
                  </svg>
                  Maximizar chat
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Panel de administración */}
      <ChatbotAdmin 
        isOpen={showAdmin} 
        onClose={() => setShowAdmin(false)} 
      />
      
      {/* Panel de administración avanzada */}
      <ChatbotAdminPanel
        isOpen={showAdminPanel}
        onClose={() => setShowAdminPanel(false)}
        userRole={user?.rol || 'public'}
      />
    </>
  );
};

export default FloatingChatbot;
