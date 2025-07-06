/**
 * Configuración global para logs y debugging
 */

const DEBUG_CONFIG = {
  // Configuración general de logs
  enableConsoleLogging: true,
  enableServerLogging: false, // Desactivado hasta que el backend esté listo
  
  // Configuración específica por servicio
  services: {
    auth: {
      verbose: false, // Reducir verbosidad del AuthService
      logSuccessfulAuth: false,
      logTokenValidation: false
    },
    chatbot: {
      verbose: true,
      logUserInteractions: true,
      logBotResponses: true
    },
    websocket: {
      verbose: false,
      logConnections: true,
      logMessages: false
    },
    logging: {
      verbose: false,
      logToServer: false,
      batchSize: 10,
      flushInterval: 30000
    }
  },
  
  // Configuración de entorno
  environment: process.env.NODE_ENV || 'development',
  
  // Niveles de log
  logLevels: {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    FATAL: 4
  },
  
  // Nivel mínimo de log según el entorno
  minLogLevel: process.env.NODE_ENV === 'production' ? 2 : 0, // WARN en producción, DEBUG en desarrollo
  
  // Configuración de UI
  ui: {
    showToasts: true,
    showErrorBoundaries: true,
    showLoadingStates: true
  }
};

// Función para obtener configuración de un servicio
export const getServiceConfig = (serviceName) => {
  return DEBUG_CONFIG.services[serviceName] || {};
};

// Función para verificar si un log debe mostrarse
export const shouldLog = (level) => {
  const levelValue = DEBUG_CONFIG.logLevels[level] || 0;
  return levelValue >= DEBUG_CONFIG.minLogLevel;
};

// Función para verificar si está en modo desarrollo
export const isDevelopment = () => {
  return DEBUG_CONFIG.environment === 'development';
};

// Función para verificar si está en modo producción
export const isProduction = () => {
  return DEBUG_CONFIG.environment === 'production';
};

export default DEBUG_CONFIG;
