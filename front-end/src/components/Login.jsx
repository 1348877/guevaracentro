// Componente de login con Google y celular
import React, { useState, useEffect } from 'react';
import './Login.css';

const API_URL = 'http://localhost:3001/api/auth';

export default function Login({ onLogin, small, isClosing, onClose }) {
  const [telefono, setTelefono] = useState('');
  const [codigo, setCodigo] = useState('');
  const [step, setStep] = useState(0); // 0: menú, 1: celular, 2: código
  const [anim, setAnim] = useState('menu-enter');
  const [error, setError] = useState(null);
  // Para detectar si es móvil
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Google login
  const handleGoogle = () => {
    /* global google */
    window.google.accounts.id.initialize({
      client_id: '914953759705-3c4g7vlrb285bl82u1vb5noqlsd5ibcj.apps.googleusercontent.com', // <-- Reemplaza por tu client ID
      callback: async (response) => {
        const res = await fetch(`${API_URL}/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: response.credential })
        });
        const data = await res.json();
        if (data.token) onLogin(data);
        else setError(data.error || 'Error de autenticación');
      }
    });
    window.google.accounts.id.prompt();
  };

  // Celular login
  const enviarCodigo = async () => {
    setError(null);
    const res = await fetch(`${API_URL}/enviar-codigo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telefono })
    });
    const data = await res.json();
    if (data.message) setStep(2);
    else setError(data.error || 'Error enviando código');
  };

  const loginCelular = async () => {
    setError(null);
    const res = await fetch(`${API_URL}/celular`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telefono, codigo })
    });
    const data = await res.json();
    if (data.token) onLogin(data);
    else setError(data.error || 'Error de autenticación');
  };

  const goToCelular = () => {
    setAnim('celular-enter');
    setTimeout(() => {
      setStep(1);
      setAnim('celular-active');
    }, 50);
  };
  
  const goToMenu = () => {
    setAnim('menu-exit');
    setTimeout(() => {
      setStep(0);
      setAnim('menu-enter');
    }, 350);
  };

  return (
    <>
      {isMobile && <div className="login-overlay" onClick={onClose}></div>}
      <div className={`login-float-anim login-container${small ? ' small' : ''}${isClosing ? ' hide' : ''}`}>
        {onClose && (
          <button className="login-close" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        )}
        <div className={`login-header${step === 1 ? ' with-back' : ''}`}>
        {step === 1 && (
          <button onClick={goToMenu} className="login-back-btn" title="Volver" aria-label="Volver">
            ‹
          </button>
        )}
        <span className="login-title">Iniciar Sesión</span>
      </div>
      <div className={`login-step login-content ${anim}`}>
        {step === 0 && (
          <>
            <button onClick={handleGoogle} className="login-btn login-btn-google">
              Iniciar sesión con Google
            </button>
            <button onClick={goToCelular} className="login-btn login-btn-phone">
              Iniciar sesión con número de celular
            </button>
          </>
        )}
        {step === 1 && (
          <>
            <input 
              type="text" 
              placeholder="Número de celular" 
              value={telefono} 
              onChange={e => setTelefono(e.target.value)} 
              className="login-input"
            />
            <button onClick={enviarCodigo} className="login-btn-action">
              Enviar código
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <input 
              type="text" 
              placeholder="Código recibido" 
              value={codigo} 
              onChange={e => setCodigo(e.target.value)} 
              className="login-input"
            />
            <button onClick={loginCelular} className="login-btn-action">
              Validar código
            </button>
          </>
        )}
      </div>
      {error && <p className="login-error">{error}</p>}
    </div>
    </>
  );
}
