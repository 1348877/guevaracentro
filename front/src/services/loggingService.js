// Sistema de Logging para el Frontend
class LoggingService {
  constructor() {
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-backend-url.com/api' 
      : 'http://localhost:3000/api';
    this.logLevels = {
      DEBUG: 0,
      INFO: 1,
      WARN: 2,
      ERROR: 3,
      FATAL: 4
    };
    this.currentLogLevel = process.env.NODE_ENV === 'production' ? this.logLevels.WARN : this.logLevels.DEBUG;
    this.logs = [];
    this.maxLocalLogs = 1000;
    this.batchSize = 10;
    this.flushInterval = 30000; // 30 segundos
    this.pendingLogs = [];
    this.isFlushingLogs = false;
    this.sessionId = this.generateSessionId();
    this.logToServer = false; // Desactivar logging al servidor temporalmente
    
    this.startAutoFlush();
    this.setupErrorHandler();
  }

  // Generar ID de sesión
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Configurar manejador global de errores
  setupErrorHandler() {
    // Manejar errores no capturados
    window.addEventListener('error', (event) => {
      this.error('Uncaught Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });

    // Manejar promesas rechazadas
    window.addEventListener('unhandledrejection', (event) => {
      this.error('Unhandled Promise Rejection', {
        reason: event.reason,
        stack: event.reason?.stack
      });
    });
  }

  // Crear log entry
  createLogEntry(level, message, data = null, category = 'general') {
    const timestamp = new Date().toISOString();
    const logEntry = {
      id: this.generateLogId(),
      timestamp,
      level,
      message,
      data,
      category,
      sessionId: this.sessionId,
      userId: this.getUserId(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      stackTrace: this.getStackTrace()
    };

    // Agregar información adicional para errores
    if (level === 'ERROR' || level === 'FATAL') {
      logEntry.errorDetails = {
        browser: this.getBrowserInfo(),
        screen: this.getScreenInfo(),
        performance: this.getPerformanceInfo()
      };
    }

    return logEntry;
  }

  // Logging methods
  debug(message, data = null, category = 'debug') {
    if (this.currentLogLevel <= this.logLevels.DEBUG) {
      const logEntry = this.createLogEntry('DEBUG', message, data, category);
      this.processLog(logEntry);
    }
  }

  info(message, data = null, category = 'info') {
    if (this.currentLogLevel <= this.logLevels.INFO) {
      const logEntry = this.createLogEntry('INFO', message, data, category);
      this.processLog(logEntry);
    }
  }

  warn(message, data = null, category = 'warning') {
    if (this.currentLogLevel <= this.logLevels.WARN) {
      const logEntry = this.createLogEntry('WARN', message, data, category);
      this.processLog(logEntry);
    }
  }

  error(message, data = null, category = 'error') {
    if (this.currentLogLevel <= this.logLevels.ERROR) {
      const logEntry = this.createLogEntry('ERROR', message, data, category);
      this.processLog(logEntry);
    }
  }

  fatal(message, data = null, category = 'fatal') {
    if (this.currentLogLevel <= this.logLevels.FATAL) {
      const logEntry = this.createLogEntry('FATAL', message, data, category);
      this.processLog(logEntry);
      // Enviar inmediatamente logs fatales
      this.flushLogs();
    }
  }

  // Logs específicos del sistema
  logUserAction(action, details = null) {
    this.info(`User Action: ${action}`, details, 'user_action');
  }

  logApiCall(method, endpoint, status, duration) {
    const logData = {
      method,
      endpoint,
      status,
      duration,
      timestamp: new Date().toISOString()
    };
    
    if (status >= 400) {
      this.error(`API Call Failed: ${method} ${endpoint}`, logData, 'api_error');
    } else {
      this.info(`API Call: ${method} ${endpoint}`, logData, 'api_call');
    }
  }

  logPageView(page, loadTime = null) {
    const logData = {
      page,
      loadTime,
      referrer: document.referrer,
      timestamp: new Date().toISOString()
    };
    
    this.info(`Page View: ${page}`, logData, 'page_view');
  }

  logPerformanceMetric(metric, value, unit = 'ms') {
    const logData = {
      metric,
      value,
      unit,
      timestamp: new Date().toISOString()
    };
    
    this.info(`Performance Metric: ${metric}`, logData, 'performance');
  }

  logSecurityEvent(event, severity = 'medium', details = null) {
    const logData = {
      event,
      severity,
      details,
      timestamp: new Date().toISOString()
    };
    
    if (severity === 'high' || severity === 'critical') {
      this.error(`Security Event: ${event}`, logData, 'security');
    } else {
      this.warn(`Security Event: ${event}`, logData, 'security');
    }
  }

  // Procesar log entry
  processLog(logEntry) {
    // Mostrar en consola (desarrollo)
    if (process.env.NODE_ENV === 'development') {
      this.logToConsole(logEntry);
    }

    // Agregar a logs locales
    this.logs.push(logEntry);
    
    // Mantener límite de logs locales
    if (this.logs.length > this.maxLocalLogs) {
      this.logs.shift();
    }

    // Agregar a cola de envío
    this.pendingLogs.push(logEntry);

    // Enviar inmediatamente si es error crítico
    if (logEntry.level === 'FATAL' || logEntry.level === 'ERROR') {
      setTimeout(() => this.flushLogs(), 1000);
    }
  }

  // Mostrar en consola
  logToConsole(logEntry) {
    const { level, message, data, category } = logEntry;
    const prefix = `[${level}] [${category}]`;
    
    switch (level) {
      case 'DEBUG':
        console.debug(prefix, message, data);
        break;
      case 'INFO':
        console.info(prefix, message, data);
        break;
      case 'WARN':
        console.warn(prefix, message, data);
        break;
      case 'ERROR':
      case 'FATAL':
        console.error(prefix, message, data);
        break;
      default:
        console.log(prefix, message, data);
    }
  }

  // Iniciar flush automático
  startAutoFlush() {
    setInterval(() => {
      if (this.pendingLogs.length > 0) {
        this.flushLogs();
      }
    }, this.flushInterval);
  }

  // Enviar logs al backend
  async flushLogs() {
    if (this.isFlushingLogs || this.pendingLogs.length === 0 || !this.logToServer) {
      return;
    }

    this.isFlushingLogs = true;
    const logsToSend = this.pendingLogs.splice(0, this.batchSize);

    try {
      const response = await fetch(`${this.baseUrl}/logs/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify({
          logs: logsToSend,
          sessionId: this.sessionId,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Error al enviar logs: ${response.status}`);
      }

      console.log(`✅ ${logsToSend.length} logs enviados al servidor`);
      
    } catch (error) {
      console.error('❌ Error al enviar logs:', error);
      // Reintegrar logs fallidos
      this.pendingLogs.unshift(...logsToSend);
    } finally {
      this.isFlushingLogs = false;
    }
  }

  // Obtener logs locales
  getLocalLogs(filters = {}) {
    let filteredLogs = [...this.logs];

    if (filters.level) {
      filteredLogs = filteredLogs.filter(log => log.level === filters.level);
    }

    if (filters.category) {
      filteredLogs = filteredLogs.filter(log => log.category === filters.category);
    }

    if (filters.startTime && filters.endTime) {
      filteredLogs = filteredLogs.filter(log => {
        const logTime = new Date(log.timestamp);
        return logTime >= new Date(filters.startTime) && logTime <= new Date(filters.endTime);
      });
    }

    if (filters.message) {
      filteredLogs = filteredLogs.filter(log => 
        log.message.toLowerCase().includes(filters.message.toLowerCase())
      );
    }

    return filteredLogs;
  }

  // Obtener logs del servidor
  async getServerLogs(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const response = await fetch(`${this.baseUrl}/logs?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error al obtener logs: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('❌ Error al obtener logs del servidor:', error);
      throw error;
    }
  }

  // Exportar logs
  exportLogs(format = 'json') {
    const logs = this.getLocalLogs();
    
    if (format === 'json') {
      return JSON.stringify(logs, null, 2);
    } else if (format === 'csv') {
      return this.convertToCSV(logs);
    } else if (format === 'txt') {
      return this.convertToText(logs);
    }
  }

  // Convertir logs a CSV
  convertToCSV(logs) {
    const headers = ['timestamp', 'level', 'category', 'message', 'userId', 'url'];
    const csvRows = [headers.join(',')];
    
    logs.forEach(log => {
      const row = headers.map(header => {
        const value = log[header] || '';
        return `"${value.toString().replace(/"/g, '""')}"`;
      });
      csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
  }

  // Convertir logs a texto
  convertToText(logs) {
    return logs.map(log => 
      `[${log.timestamp}] [${log.level}] [${log.category}] ${log.message}`
    ).join('\n');
  }

  // Limpiar logs locales
  clearLocalLogs() {
    this.logs = [];
    this.pendingLogs = [];
    console.log('🧹 Logs locales limpiados');
  }

  // Configurar nivel de logging
  setLogLevel(level) {
    if (this.logLevels[level] !== undefined) {
      this.currentLogLevel = this.logLevels[level];
      console.log(`📊 Nivel de logging configurado a: ${level}`);
    }
  }

  // Funciones de utilidad
  generateLogId() {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getUserId() {
    return localStorage.getItem('userId') || sessionStorage.getItem('userId') || 'anonymous';
  }

  getToken() {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  }

  getStackTrace() {
    return new Error().stack;
  }

  getBrowserInfo() {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine
    };
  }

  getScreenInfo() {
    return {
      width: screen.width,
      height: screen.height,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth
    };
  }

  getPerformanceInfo() {
    if (window.performance) {
      return {
        navigation: window.performance.navigation,
        timing: window.performance.timing,
        memory: window.performance.memory
      };
    }
    return null;
  }

  // Crear reporte de error detallado
  createErrorReport(error, context = {}) {
    const errorReport = {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      context,
      browser: this.getBrowserInfo(),
      screen: this.getScreenInfo(),
      performance: this.getPerformanceInfo(),
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.getUserId(),
      url: window.location.href,
      recentLogs: this.logs.slice(-10) // Últimos 10 logs
    };

    return errorReport;
  }
}

// Instancia singleton
const loggingService = new LoggingService();
export default loggingService;
