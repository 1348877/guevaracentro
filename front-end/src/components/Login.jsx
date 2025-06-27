// Componente de login con Google y celular
import React, { useState } from 'react';
import './Login.css';

const API_URL = 'http://localhost:3001/api/auth';

export default function Login({ onLogin, small, isClosing, onClose }) {
  const [telefono, setTelefono] = useState('');
  const [codigo, setCodigo] = useState('');
  const [step, setStep] = useState(0); // 0: menú, 1: celular, 2: código
  const [anim, setAnim] = useState('menu-enter');
  const [error, setError] = useState(null);

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
    <div className={`login-float-anim${isClosing ? ' hide' : ''}`} style={{
      width: small ? 200 : 220,
      minWidth: 160,
      margin: '0 auto',
      textAlign: 'center',
      background: '#fff',
      borderRadius: 16,
      padding: small ? 8 : 10,
      boxShadow: '0 2px 16px #0002',
      border: '1px solid #f0f0f0',
      fontSize: small ? '0.98rem' : '1.08rem',
      transition: 'box-shadow 0.2s',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10, marginTop: 2, justifyContent: step === 1 ? 'flex-start' : 'center' }}>
        {step === 1 && (
          <button onClick={goToMenu} style={{ background: 'none', border: 'none', color: '#222', fontSize: '1.5rem', fontWeight: 700, cursor: 'pointer', padding: '0 6px 0 0', lineHeight: 1, display: 'flex', alignItems: 'center', marginRight: 4 }} title="Volver" aria-label="Volver">‹</button>
        )}
        <span style={{ fontSize: small ? '1.08rem' : '1.25rem', fontWeight: 700 }}>Iniciar Sesión</span>
      </div>
      <div className={`login-step ${anim}`} style={{ minHeight: 90 }}>
        {step === 0 && (
          <>
            <button onClick={handleGoogle} style={{ width: '100%', marginBottom: 6, borderRadius: 8, padding: small ? '7px 0' : '9px 0', background: '#4285F4', color: '#fff', border: 'none', fontWeight: 400, fontSize: small ? '0.98rem' : '1.05rem', boxShadow: '0 1px 4px #0001', whiteSpace: 'normal', overflow: 'visible', textOverflow: 'unset', minWidth: 0 }}>
              Iniciar sesión con Google
            </button>
            <button onClick={goToCelular} style={{ width: '100%', borderRadius: 8, padding: small ? '7px 0' : '9px 0', background: '#222', color: '#fff', border: 'none', fontWeight: 400, fontSize: small ? '0.93rem' : '1rem', marginTop: 4, whiteSpace: 'normal', overflow: 'visible', textOverflow: 'unset', minWidth: 0 }}>
              Iniciar sesión con número de celular
            </button>
          </>
        )}
        {step === 1 && (
          <>
            <input type="text" placeholder="Número de celular" value={telefono} onChange={e => setTelefono(e.target.value)} style={{ width: '100%', marginBottom: 6, borderRadius: 8, padding: small ? 6 : 8, fontSize: small ? '0.98rem' : '1.05rem', border: '1px solid #e0e0e0' }} />
            <button onClick={enviarCodigo} style={{ width: '100%', borderRadius: 8, padding: small ? '7px 0' : '9px 0', background: '#222', color: '#fff', border: 'none', fontWeight: 500 }}>Enviar código</button>
          </>
        )}
        {step === 2 && (
          <>
            <input type="text" placeholder="Código recibido" value={codigo} onChange={e => setCodigo(e.target.value)} style={{ width: '100%', marginBottom: 6, borderRadius: 8, padding: small ? 6 : 8, fontSize: small ? '0.98rem' : '1.05rem', border: '1px solid #e0e0e0' }} />
            <button onClick={loginCelular} style={{ width: '100%', borderRadius: 8, padding: small ? '7px 0' : '9px 0', background: '#222', color: '#fff', border: 'none', fontWeight: 500 }}>Validar código</button>
          </>
        )}
      </div>
      {error && <p style={{ color: 'red', marginTop: 8, fontSize: small ? '0.95rem' : '1rem' }}>{error}</p>}
    </div>
  );
}
