import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './AppRouter';
import './styles/global.css';

try {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <AppRouter />
    </React.StrictMode>
  );
} catch (error) {
  console.error('Error al renderizar la app:', error);
}
