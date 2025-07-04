import React from 'react';

function TestApp() {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333' }}>🎯 Test - Centro Psicológico</h1>
      <p>Si ves este mensaje, React está funcionando correctamente.</p>
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        marginTop: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2>Estado del Sistema:</h2>
        <ul>
          <li>✅ React: Funcionando</li>
          <li>✅ Vite: Funcionando</li>
          <li>✅ Renderizado: OK</li>
        </ul>
      </div>
    </div>
  );
}

export default TestApp;
