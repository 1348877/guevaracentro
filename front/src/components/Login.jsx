// Componente de login mejorado con múltiples métodos de autenticación
import React, { useState, useEffect } from 'react';
import AuthService from '../services/authService';
import { initializeGoogleAuth, showGooglePrompt } from '../services/googleAuthService';
import './Login.css';

export default function Login({ onLogin, small, isClosing, onClose }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    telefono: '',
    codigo: ''
  });
  const [step, setStep] = useState(0); // 0: menú, 1: email/password, 2: celular, 3: código
  const [anim, setAnim] = useState('menu-enter');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [googleAvailable, setGoogleAvailable] = useState(false);
  // Para detectar si es móvil
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Verificar si Google SDK está disponible
  useEffect(() => {
    const checkGoogleSDK = () => {
      const available = typeof window.google !== 'undefined' && window.google.accounts;
      setGoogleAvailable(available);
      if (!available) {
        console.log('Google SDK no disponible, usando modo de desarrollo');
      }
    };
    
    // Verificar inmediatamente
    checkGoogleSDK();
    
    // Verificar después de 1 segundo por si acaso el SDK tarda en cargar
    setTimeout(checkGoogleSDK, 1000);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(null);
  };

  // Login tradicional con email y password
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await AuthService.login(formData.email, formData.password);
      onLogin(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Google login con Google OAuth real
  const handleGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔐 Iniciando login con Google OAuth...');
      
      // Importar el servicio de producción
      const googleAuthProduction = await import('../services/googleAuthProduction.js');
      const googleAuth = googleAuthProduction.default;
      
      // Iniciar el proceso de autenticación
      const result = await googleAuth.signIn();
      
      console.log('✅ Autenticación exitosa:', result);
      
      // Procesar los datos del usuario
      const userData = {
        id: result.user.id,
        email: result.user.email,
        nombre: result.user.nombre,
        picture: result.user.picture,
        rol: 'paciente',
        provider: 'google',
        credential: result.credential
      };

      // Generar token JWT para el sistema
      const token = await AuthService.loginWithGoogle(userData);
      
      if (token) {
        console.log('✅ Token generado exitosamente');
        
        // Guardar usuario en localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        
        setLoading(false);
        setMessage('¡Autenticación exitosa! Redirigiendo...');
        
        // Redirigir según el rol
        const redirectPath = userData.rol === 'admin' ? '/admin' : '/dashboard';
        console.log(`🔄 Redirigiendo a: ${redirectPath}`);
        
        setTimeout(() => {
          navigate(redirectPath);
        }, 1000);
      } else {
        throw new Error('No se pudo generar el token de autenticación');
      }
      
    } catch (error) {
      console.error('❌ Error en Google login:', error);
      setError(error.message || 'Error al iniciar sesión con Google');
      setLoading(false);
    }
  };

  // Celular login
  const enviarCodigo = async () => {
    setError(null);
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:3001/api/auth/enviar-codigo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telefono: formData.telefono })
      });
      
      const data = await res.json();
      if (res.ok) {
        setStep(3);
        setAnim('codigo-enter');
      } else {
        setError(data.error || 'Error al enviar código');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };
  // Verificar código de celular
  const verificarCodigo = async () => {
    setError(null);
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:3001/api/auth/celular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telefono: formData.telefono, codigo: formData.codigo })
      });
      
      const data = await res.json();
      if (data.token) {
        // Guardar en localStorage a través del AuthService
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data);
      } else {
        setError(data.error || 'Código incorrecto');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const goToEmailLogin = () => {
    setAnim('email-enter');
    setTimeout(() => {
      setStep(1);
      setAnim('email-active');
    }, 50);
  };

  const goToCelular = () => {
    setAnim('celular-enter');
    setTimeout(() => {
      setStep(2);
      setAnim('celular-active');
    }, 50);
  };
  
  const goToMenu = () => {
    setAnim('menu-exit');
    setTimeout(() => {
      setStep(0);
      setAnim('menu-enter');
      setError(null);
      setFormData({ email: '', password: '', telefono: '', codigo: '' });
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
        <div className={`login-header${step > 0 ? ' with-back' : ''}`}>
          {step > 0 && (
            <button onClick={goToMenu} className="login-back-btn" title="Volver" aria-label="Volver">
              ‹
            </button>
          )}
          <span className="login-title">Iniciar Sesión</span>
        </div>
        
        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <div className={`login-step login-content ${anim}`}>
          {step === 0 && (
            <>
              <button onClick={goToEmailLogin} className="login-btn login-btn-email">
                <i className="fas fa-envelope"></i>
                Iniciar sesión con Email
              </button>
              <button onClick={handleGoogle} className="login-btn login-btn-google" disabled={loading}>
                <i className="fab fa-google"></i>
                {loading ? 'Conectando...' : 'Iniciar sesión con Google'}
                {!googleAvailable && (
                  <span className="dev-badge">DEV</span>
                )}
              </button>
              <button onClick={goToCelular} className="login-btn login-btn-phone">
                <i className="fas fa-mobile-alt"></i>
                Iniciar sesión con Celular
              </button>
            </>
          )}
          
          {step === 1 && (
            <form onSubmit={handleEmailLogin}>
              <input 
                type="email" 
                name="email"
                placeholder="Email" 
                value={formData.email} 
                onChange={handleInputChange}
                className="login-input"
                required
                disabled={loading}
              />
              <input 
                type="password" 
                name="password"
                placeholder="Contraseña" 
                value={formData.password} 
                onChange={handleInputChange}
                className="login-input"
                required
                disabled={loading}
              />
              <button 
                type="submit" 
                className="login-btn-action"
                disabled={loading || !formData.email || !formData.password}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </form>
          )}
          
          {step === 2 && (
            <>
              <input 
                type="tel" 
                name="telefono"
                placeholder="Número de celular" 
                value={formData.telefono} 
                onChange={handleInputChange}
                className="login-input"
                disabled={loading}
              />
              <button 
                onClick={enviarCodigo} 
                className="login-btn-action"
                disabled={loading || !formData.telefono}
              >
                {loading ? 'Enviando...' : 'Enviar código'}
              </button>
            </>
          )}
          
          {step === 3 && (
            <>
              <p className="login-info">
                Hemos enviado un código de verificación a {formData.telefono}
              </p>
              <input 
                type="text" 
                name="codigo"
                placeholder="Código de verificación" 
                value={formData.codigo} 
                onChange={handleInputChange}
                className="login-input"
                disabled={loading}
              />
              <button 
                onClick={verificarCodigo} 
                className="login-btn-action"
                disabled={loading || !formData.codigo}
              >
                {loading ? 'Verificando...' : 'Verificar código'}
              </button>
              <button 
                onClick={enviarCodigo} 
                className="login-btn-secondary"
                disabled={loading}
              >
                Reenviar código
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
