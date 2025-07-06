// WebSocket Service para Chat en Tiempo Real
class WebSocketService {
  constructor() {
    this.ws = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
    this.listeners = new Map();
    this.messageQueue = [];
    this.heartbeatInterval = null;
    this.userId = null;
    this.userRole = null;
  }

  // Conectar al WebSocket
  connect(userId, userRole = 'paciente') {
    this.userId = userId;
    this.userRole = userRole;
    
    // URL del WebSocket (cambiar según el entorno)
    const wsUrl = process.env.NODE_ENV === 'production' 
      ? 'wss://your-backend-url.com/ws' 
      : 'ws://localhost:3000/ws';

    try {
      this.ws = new WebSocket(`${wsUrl}?userId=${userId}&role=${userRole}`);
      
      this.ws.onopen = this.onOpen.bind(this);
      this.ws.onclose = this.onClose.bind(this);
      this.ws.onerror = this.onError.bind(this);
      this.ws.onmessage = this.onMessage.bind(this);
      
      console.log('🔌 Conectando al WebSocket...');
      
    } catch (error) {
      console.error('❌ Error al conectar WebSocket:', error);
      this.handleReconnect();
    }
  }

  // Manejar apertura de conexión
  onOpen(event) {
    console.log('✅ WebSocket conectado');
    this.isConnected = true;
    this.reconnectAttempts = 0;
    this.startHeartbeat();
    
    // Procesar mensajes en cola
    this.processMessageQueue();
    
    // Notificar a los listeners
    this.emit('connected', { userId: this.userId, role: this.userRole });
  }

  // Manejar cierre de conexión
  onClose(event) {
    console.log('🔌 WebSocket desconectado:', event.code, event.reason);
    this.isConnected = false;
    this.clearHeartbeat();
    
    this.emit('disconnected', { code: event.code, reason: event.reason });
    
    // Intentar reconectar si no fue intencional
    if (event.code !== 1000) {
      this.handleReconnect();
    }
  }

  // Manejar errores
  onError(event) {
    console.error('❌ Error en WebSocket:', event);
    this.emit('error', event);
  }

  // Manejar mensajes recibidos
  onMessage(event) {
    try {
      const data = JSON.parse(event.data);
      console.log('📥 Mensaje recibido:', data);
      
      // Manejar diferentes tipos de mensajes
      switch (data.type) {
        case 'chat_message':
          this.emit('message', data);
          break;
        case 'user_typing':
          this.emit('typing', data);
          break;
        case 'user_online':
          this.emit('userOnline', data);
          break;
        case 'user_offline':
          this.emit('userOffline', data);
          break;
        case 'notification':
          this.emit('notification', data);
          break;
        case 'heartbeat':
          this.handleHeartbeat(data);
          break;
        case 'error':
          this.emit('error', data);
          break;
        default:
          console.warn('🤔 Tipo de mensaje desconocido:', data.type);
      }
    } catch (error) {
      console.error('❌ Error al procesar mensaje:', error);
    }
  }

  // Enviar mensaje
  sendMessage(message, recipientId = null, messageType = 'chat_message') {
    const messageData = {
      type: messageType,
      message: message,
      senderId: this.userId,
      senderRole: this.userRole,
      recipientId: recipientId,
      timestamp: new Date().toISOString(),
      id: this.generateMessageId()
    };

    if (this.isConnected) {
      this.ws.send(JSON.stringify(messageData));
      console.log('📤 Mensaje enviado:', messageData);
    } else {
      console.log('📝 Agregando mensaje a cola (desconectado)');
      this.messageQueue.push(messageData);
    }

    return messageData;
  }

  // Enviar indicador de escritura
  sendTyping(isTyping = true, recipientId = null) {
    const typingData = {
      type: 'user_typing',
      isTyping: isTyping,
      userId: this.userId,
      userRole: this.userRole,
      recipientId: recipientId,
      timestamp: new Date().toISOString()
    };

    if (this.isConnected) {
      this.ws.send(JSON.stringify(typingData));
    }
  }

  // Manejar reconexión automática
  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Reintentando conexión (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      this.emit('reconnecting', { 
        attempt: this.reconnectAttempts, 
        maxAttempts: this.maxReconnectAttempts 
      });
      
      setTimeout(() => {
        this.connect(this.userId, this.userRole);
      }, this.reconnectDelay);
      
    } else {
      console.error('❌ Máximo de intentos de reconexión alcanzado');
      this.emit('reconnectFailed');
    }
  }

  // Procesar cola de mensajes
  processMessageQueue() {
    if (this.messageQueue.length > 0) {
      console.log(`📋 Procesando ${this.messageQueue.length} mensajes en cola`);
      
      this.messageQueue.forEach(message => {
        this.ws.send(JSON.stringify(message));
      });
      
      this.messageQueue = [];
    }
  }

  // Heartbeat para mantener la conexión activa
  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected) {
        this.ws.send(JSON.stringify({ 
          type: 'heartbeat', 
          userId: this.userId,
          timestamp: new Date().toISOString()
        }));
      }
    }, 30000); // Cada 30 segundos
  }

  clearHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  handleHeartbeat(data) {
    console.log('💓 Heartbeat recibido');
    // Responder al heartbeat si es necesario
    if (data.needsResponse) {
      this.ws.send(JSON.stringify({
        type: 'heartbeat_response',
        userId: this.userId,
        timestamp: new Date().toISOString()
      }));
    }
  }

  // Sistema de eventos
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`❌ Error en callback de evento ${event}:`, error);
        }
      });
    }
  }

  // Desconectar
  disconnect() {
    console.log('🔌 Desconectando WebSocket...');
    this.clearHeartbeat();
    this.isConnected = false;
    
    if (this.ws) {
      this.ws.close(1000, 'Desconexión intencional');
      this.ws = null;
    }
  }

  // Obtener estado de conexión
  getConnectionState() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts,
      queuedMessages: this.messageQueue.length,
      userId: this.userId,
      userRole: this.userRole
    };
  }

  // Generar ID único para mensajes
  generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Solicitar historial de chat
  requestChatHistory(withUserId = null, limit = 50) {
    const historyRequest = {
      type: 'request_history',
      userId: this.userId,
      withUserId: withUserId,
      limit: limit,
      timestamp: new Date().toISOString()
    };

    if (this.isConnected) {
      this.ws.send(JSON.stringify(historyRequest));
    }
  }

  // Marcar mensajes como leídos
  markAsRead(messageIds) {
    const readStatus = {
      type: 'mark_as_read',
      messageIds: messageIds,
      userId: this.userId,
      timestamp: new Date().toISOString()
    };

    if (this.isConnected) {
      this.ws.send(JSON.stringify(readStatus));
    }
  }

  // Obtener usuarios online
  getOnlineUsers() {
    const request = {
      type: 'get_online_users',
      userId: this.userId,
      timestamp: new Date().toISOString()
    };

    if (this.isConnected) {
      this.ws.send(JSON.stringify(request));
    }
  }
}

// Instancia singleton
const webSocketService = new WebSocketService();
export default webSocketService;
