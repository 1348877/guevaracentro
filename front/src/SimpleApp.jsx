import React from 'react';

const SimpleApp = () => {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f5f5f5', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#333' }}>🏠 Centro Psicológico Integral Guevara</h1>
      <p style={{ fontSize: '18px', color: '#666' }}>
        Bienvenido a nuestra plataforma de gestión psicológica
      </p>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h2>Sistema funcionando correctamente</h2>
        <p>✅ React está cargando</p>
        <p>✅ Router está funcionando</p>
        <p>✅ Página de inicio cargada</p>
      </div>
    </div>
  );
};

export default SimpleApp;
