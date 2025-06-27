import React, { useEffect } from 'react';
import './App.css';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    window.onerror = (msg, url, line, col, error) => {
      console.error('Error global en App:', msg, url, line, col, error);
    };
    return () => { window.onerror = null; };
  }, []);

  return (
    <div className="app-container">
      <header className="header">
        <h1>Guevara Centro Psicológico Integral</h1>
        <p className="subtitle">Gestión de pacientes y citas</p>
      </header>
      <main className="main-content">
        <Button onClick={() => navigate('/agendar')}>Agendar Cita</Button>
        <Button variant="outline" onClick={() => navigate('/pacientes')}>Ver Pacientes</Button>
      </main>
    </div>
  );
}
