import React, { useState, useEffect } from 'react';
import AuthService from '../services/authService';

const AuthDebugger = () => {
  const [authState, setAuthState] = useState({});

  const checkAuth = () => {
    const state = {
      token: AuthService.getToken(),
      user: AuthService.getUser(),
      isAuthenticated: AuthService.isAuthenticated(),
      localStorageToken: localStorage.getItem('token'),
      localStorageUser: localStorage.getItem('user'),
      timestamp: new Date().toISOString()
    };
    
    setAuthState(state);
    console.log('🔍 Estado de autenticación:', state);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const clearAuth = () => {
    AuthService.logout();
    localStorage.clear();
    checkAuth();
  };

  const testLogin = async () => {
    try {
      const result = await AuthService.login('admin@psicologiaguevara.com', '123456');
      console.log('✅ Login de prueba exitoso:', result);
      checkAuth();
    } catch (error) {
      console.error('❌ Error en login de prueba:', error);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      padding: '15px', 
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      zIndex: 9999,
      fontSize: '12px',
      maxWidth: '300px'
    }}>
      <h4>🔍 Debug de Autenticación</h4>
      
      <div style={{ marginBottom: '10px' }}>
        <button onClick={checkAuth} style={{ marginRight: '5px', padding: '5px 10px' }}>
          🔄 Verificar
        </button>
        <button onClick={testLogin} style={{ marginRight: '5px', padding: '5px 10px' }}>
          🔑 Login
        </button>
        <button onClick={clearAuth} style={{ padding: '5px 10px' }}>
          🗑️ Limpiar
        </button>
      </div>

      <div style={{ fontSize: '11px', fontFamily: 'monospace' }}>
        <p><strong>Token:</strong> {authState.token ? `${authState.token.substring(0, 20)}...` : 'null'}</p>
        <p><strong>User:</strong> {authState.user ? `${authState.user.nombre} (${authState.user.rol})` : 'null'}</p>
        <p><strong>Authenticated:</strong> {authState.isAuthenticated ? '✅' : '❌'}</p>
        <p><strong>Updated:</strong> {authState.timestamp}</p>
      </div>
    </div>
  );
};

export default AuthDebugger;
