import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Componente de prueba simple
function HomePage() {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f7fa',
      minHeight: '100vh'
    }}>
      <header style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#2c3e50', margin: 0 }}>
          🏥 Centro Psicológico Integral Guevara
        </h1>
        <p style={{ color: '#6c757d', margin: '8px 0 0 0' }}>
          Sistema de gestión en línea
        </p>
      </header>
      
      <main style={{ 
        background: 'white', 
        padding: '30px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#2c3e50' }}>Bienvenido</h2>
        <p style={{ color: '#6c757d', lineHeight: '1.6' }}>
          La aplicación se está cargando correctamente. 
          El sistema de navegación está funcionando.
        </p>
        
        <div style={{ 
          background: '#e8f5e8', 
          padding: '15px', 
          borderRadius: '6px',
          marginTop: '20px',
          border: '1px solid #27ae60'
        }}>
          <h3 style={{ color: '#27ae60', margin: '0 0 10px 0' }}>✅ Estado del Sistema</h3>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#2c3e50' }}>
            <li>React Router: Funcionando</li>
            <li>Componentes: Cargando</li>
            <li>Estilos: Aplicados</li>
          </ul>
        </div>
        
        <div style={{ marginTop: '30px' }}>
          <button style={{
            background: '#3498db',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            Continuar al Sistema
          </button>
        </div>
      </main>
    </div>
  );
}

function SimpleRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default SimpleRouter;
