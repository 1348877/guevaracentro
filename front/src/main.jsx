import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './AppRouter';
import './styles/global.css';

console.log('🚀 Iniciando aplicación React...');

try {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  console.log('📦 Root creado exitosamente');
  
  root.render(
    <React.StrictMode>
      <AppRouter />
    </React.StrictMode>
  );
  
  console.log('✅ Aplicación renderizada exitosamente');
} catch (error) {
  console.error('❌ Error al renderizar la app:', error);
  
  // Fallback básico
  const fallbackContent = document.createElement('div');
  fallbackContent.style.padding = '20px';
  fallbackContent.style.fontFamily = 'Arial, sans-serif';
  fallbackContent.style.backgroundColor = '#ffebee';
  fallbackContent.style.color = '#c62828';
  fallbackContent.innerHTML = `
    <h1>🚨 Error al cargar la aplicación</h1>
    <p><strong>Error:</strong> ${error.message}</p>
    <p><strong>Tipo:</strong> ${error.name}</p>
    <p><strong>Stack:</strong> ${error.stack?.substring(0, 500)}...</p>
    <p>Revisa la consola del navegador para más detalles.</p>
  `;
  
  document.getElementById('root').appendChild(fallbackContent);
}
