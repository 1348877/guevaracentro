import React, { useState, useEffect, useRef } from 'react';
import AuthService from '../services/authService';
import './StaffLogin.css';

export default function StaffLogin({ onSuccess, open, onClose, panelPos }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);
  const btnRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setEmail('');
      setPassword('');
      setError('');
      setShowRecovery(false);
      setRecoveryEmail('');
      setRecoverySent(false);
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      console.log('🔐 StaffLogin - Iniciando login para:', email);
      const data = await AuthService.login(email, password);
      console.log('🔐 StaffLogin - Login exitoso:', data);
      onSuccess(data);
      onClose();
    } catch (err) {
      console.error('❌ StaffLogin - Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRecovery = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRecoverySent(false);
    try {
      // Aquí deberías llamar a un endpoint real de recuperación
      await new Promise(r => setTimeout(r, 1200));
      setRecoverySent(true);
    } catch (err) {
      setError('No se pudo enviar el correo de recuperación');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="staff-login-absolute-overlay" onClick={onClose}>
      <div
        className="staff-login-panel slide-up"
        style={{
          position: 'fixed',
          top: 44.5,
          left: panelPos?.left || '50%', // Si quieres centrarlo horizontalmente, usa '50%'
          transform: 'translateX(-50%)',
          zIndex: 1001
        }}
        onClick={e => e.stopPropagation()}
      >
        <h3>Acceso Privado</h3>
        {!showRecovery ? (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Usuario privilegiado"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</button>
            <div className="staff-login-links">
              <button type="button" className="staff-login-link" onClick={() => setShowRecovery(true)}>
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            {error && <div className="staff-login-error">{error}</div>}
          </form>
        ) : (
          <form onSubmit={handleRecovery}>
            <input
              type="email"
              placeholder="Usuario privilegiado"
              value={recoveryEmail}
              onChange={e => setRecoveryEmail(e.target.value)}
              required
              autoFocus
            />
            <button type="submit" disabled={loading || recoverySent}>
              {recoverySent ? 'Enviado' : loading ? 'Enviando...' : 'Recuperar contraseña'}
            </button>
            <div className="staff-login-links">
              <button type="button" className="staff-login-link" onClick={() => setShowRecovery(false)}>
                Volver al login
              </button>
            </div>
            {recoverySent && <div className="staff-login-success">Revisa tu correo para instrucciones</div>}
            {error && <div className="staff-login-error">{error}</div>}
          </form>
        )}
        <button className="staff-login-close" onClick={onClose}>&times;</button>
      </div>
    </div>
  );
}
