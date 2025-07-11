import React, { useState } from 'react';
import AuthService from '../services/authService';
import citasService from '../services/citasService';
import dashboardService from '../services/dashboardService';
import './TestingPage.css';

const TestingPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const testCredentials = [
    { email: 'admin@psicologiaguevara.com', password: '123456', role: 'admin' },
    { email: 'secretaria@psicologiaguevara.com', password: '123456', role: 'secretaria' },
    { email: 'carlos@psicologiaguevara.com', password: '123456', role: 'psicologo' },
    { email: 'juan@email.com', password: '123456', role: 'paciente' }
  ];

  const addResult = (test, status, message) => {
    setResults(prev => [...prev, {
      id: Date.now(),
      test,
      status,
      message,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testLogin = async (credentials) => {
    try {
      const response = await AuthService.login(credentials.email, credentials.password);
      if (response.success) {
        addResult(
          `Login ${credentials.role}`,
          'success',
          `Usuario ${credentials.email} autenticado correctamente`
        );
        return response.data;
      } else {
        addResult(
          `Login ${credentials.role}`,
          'error',
          `Error: ${response.message}`
        );
        return null;
      }
    } catch (error) {
      addResult(
        `Login ${credentials.role}`,
        'error',
        `Error de conexión: ${error.message}`
      );
      return null;
    }
  };

  const testDashboard = async (token, role) => {
    try {
      const response = await dashboardService.getDashboard();
      if (response.success) {
        addResult(
          `Dashboard ${role}`,
          'success',
          `Dashboard cargado correctamente con ${Object.keys(response.data).length} secciones`
        );
      } else {
        addResult(
          `Dashboard ${role}`,
          'error',
          `Error: ${response.message}`
        );
      }
    } catch (error) {
      addResult(
        `Dashboard ${role}`,
        'error',
        `Error de conexión: ${error.message}`
      );
    }
  };

  const testCitas = async (token) => {
    try {
      const response = await citasService.getAllCitas();
      if (response.success) {
        addResult(
          'Citas Service',
          'success',
          `${response.data.length} citas encontradas`
        );
      } else {
        addResult(
          'Citas Service',
          'error',
          `Error: ${response.message}`
        );
      }
    } catch (error) {
      addResult(
        'Citas Service',
        'error',
        `Error de conexión: ${error.message}`
      );
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setResults([]);

    addResult('Inicio de Testing', 'info', 'Comenzando pruebas del sistema...');

    // Test Backend Connection
    try {
      const response = await fetch('http://localhost:3001/api/auth/health');
      if (response.ok) {
        addResult('Backend Connection', 'success', 'Backend conectado correctamente');
      } else {
        addResult('Backend Connection', 'error', 'Backend no responde');
      }
    } catch (error) {
      addResult('Backend Connection', 'error', `Error: ${error.message}`);
    }

    // Test Login for each role
    for (const credentials of testCredentials) {
      const loginResult = await testLogin(credentials);
      if (loginResult) {
        // Test Dashboard
        await testDashboard(loginResult.token, credentials.role);
        
        // Test Citas (only for roles that have access)
        if (['admin', 'secretaria', 'psicologo'].includes(credentials.role)) {
          await testCitas(loginResult.token);
        }
      }
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    addResult('Testing Completado', 'success', 'Todas las pruebas han terminado');
    setLoading(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="testing-page">
      <div className="testing-header">
        <h1>🧪 Sistema de Testing - Centro Psicológico</h1>
        <p>Pruebas automatizadas del sistema completo</p>
      </div>

      <div className="testing-controls">
        <button 
          onClick={runAllTests} 
          disabled={loading}
          className="btn-run-tests"
        >
          {loading ? '🔄 Ejecutando Tests...' : '▶️ Ejecutar Todas las Pruebas'}
        </button>
        
        <button 
          onClick={clearResults}
          className="btn-clear"
        >
          🗑️ Limpiar Resultados
        </button>
      </div>

      <div className="testing-credentials">
        <h3>📋 Credenciales de Prueba</h3>
        <div className="credentials-grid">
          {testCredentials.map((cred, index) => (
            <div key={index} className="credential-card">
              <h4>{cred.role.toUpperCase()}</h4>
              <p>Email: {cred.email}</p>
              <p>Password: {cred.password}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="testing-results">
        <h3>📊 Resultados de las Pruebas</h3>
        
        {results.length === 0 ? (
          <div className="no-results">
            <p>No hay resultados aún. Ejecuta las pruebas para ver los resultados.</p>
          </div>
        ) : (
          <div className="results-list">
            {results.map((result) => (
              <div key={result.id} className={`result-item ${result.status}`}>
                <div className="result-header">
                  <span className="result-test">{result.test}</span>
                  <span className="result-timestamp">{result.timestamp}</span>
                </div>
                <div className="result-message">{result.message}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestingPage;
