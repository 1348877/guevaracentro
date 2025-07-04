import React from 'react';

const DebugApp = () => {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f0f0f0', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#333' }}>🔍 Diagnóstico de la Aplicación</h1>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '15px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h2>Estado de React</h2>
        <p>✅ React está funcionando correctamente</p>
        <p>📅 Fecha: {new Date().toLocaleDateString()}</p>
        <p>⏰ Hora: {new Date().toLocaleTimeString()}</p>
      </div>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '15px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h2>Información del Sistema</h2>
        <p>🌐 URL: {window.location.href}</p>
        <p>👤 User Agent: {navigator.userAgent.substring(0, 50)}...</p>
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        padding: '15px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h2>Prueba de Renderizado</h2>
        <p>Si puedes ver este mensaje, el renderizado básico funciona.</p>
        <button 
          onClick={() => alert('¡El JavaScript está funcionando!')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Probar JavaScript
        </button>
      </div>
    </div>
  );
};

export default DebugApp;
