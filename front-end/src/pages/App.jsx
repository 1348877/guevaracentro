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
    <div className="app-container" style={{ textAlign: 'center', marginTop: '10rem', padding: '0 2rem' }}>
      <header className="header">
        <h1 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: 16, letterSpacing: -0.5, lineHeight: 1.1 }}>Guevara Centro Psicológico Integral</h1>
        <p style={{ fontSize: '1.8rem', color: '#555', marginBottom: 48, fontWeight: 400 }}>Gestión de pacientes y citas</p>
      </header>
      <main className="main-content" style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button onClick={() => navigate('/agendar')} style={{ fontSize: '1.3rem', fontWeight: 700, borderRadius: 24, padding: '16px 36px', marginRight: 16, background: '#000', color: '#fff', border: 'none', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 12px #0002' }}>Agendar Cita</Button>
        <Button variant="outline" onClick={() => navigate('/pacientes')} style={{ fontSize: '1.3rem', fontWeight: 700, borderRadius: 24, padding: '16px 36px', background: '#fff', color: '#000', border: '2px solid #ddd', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 12px #0001' }}>Ver Pacientes</Button>
      </main>
    </div>
  );
}
