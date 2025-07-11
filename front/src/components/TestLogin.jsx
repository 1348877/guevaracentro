import React, { useState } from 'react';
import AuthService from '../services/authService';

const TestLogin = () => {
  const [formData, setFormData] = useState({
    email: 'admin@psicologiaguevara.com',
    password: '123456'
  });
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const testLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      console.log('🔍 Probando login con:', formData.email);
      
      const result = await AuthService.login(formData.email, formData.password);
      console.log('✅ Login exitoso:', result);
      
      // Verificar qué se guardó en localStorage
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      console.log('🔍 Token guardado:', token);
      console.log('🔍 Usuario guardado:', user);
      
      setResultado({
        loginResponse: result,
        tokenEnStorage: token,
        userEnStorage: user,
        isAuthenticated: AuthService.isAuthenticated(),
        currentUser: AuthService.getUser()
      });
      
    } catch (err) {
      console.error('❌ Error en login:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testBackend = async () => {
    try {
      const response = await fetch('/api/health');
      const data = await response.text();
      console.log('Backend response:', data);
    } catch (err) {
      console.error('Backend error:', err);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>🧪 Test de Login</h2>
      
      <form onSubmit={testLogin} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '10px 20px', marginRight: '10px' }}
        >
          {loading ? 'Probando...' : '🔑 Probar Login'}
        </button>
        
        <button 
          type="button" 
          onClick={testBackend}
          style={{ padding: '10px 20px' }}
        >
          🔍 Probar Backend
        </button>
      </form>

      {error && (
        <div style={{ backgroundColor: '#ffebee', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3>❌ Error:</h3>
          <p>{error}</p>
        </div>
      )}

      {resultado && (
        <div style={{ backgroundColor: '#e8f5e8', padding: '15px', borderRadius: '8px' }}>
          <h3>✅ Resultado del Login:</h3>
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>
            {JSON.stringify(resultado, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestLogin;
