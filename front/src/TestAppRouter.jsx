import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import TestLogin from './components/TestLogin';
import Dashboard from './components/Dashboard';

const TestAppRouter = () => {
  return (
    <BrowserRouter>
      <div>
        <nav style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
          <Link to="/" style={{ marginRight: '20px' }}>🏠 Inicio</Link>
          <Link to="/test-login" style={{ marginRight: '20px' }}>🧪 Test Login</Link>
          <Link to="/dashboard" style={{ marginRight: '20px' }}>📊 Dashboard</Link>
        </nav>
        
        <Routes>
          <Route path="/" element={
            <div style={{ padding: '20px' }}>
              <h1>🏠 Página de Inicio</h1>
              <p>Bienvenido al sistema de pruebas</p>
            </div>
          } />
          <Route path="/test-login" element={<TestLogin />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default TestAppRouter;
