import React from 'react';
import Login from '../components/Login';
import { useNavigate } from 'react-router-dom';

export default function LoginRedirect() {
  const navigate = useNavigate();
  // Cuando el usuario loguea, restaurar el draft y agendar
  const handleLogin = (user) => {
    const draft = localStorage.getItem('citaDraft');
    if (draft) {
      // Simular guardar token
      localStorage.setItem('token', user.token || 'token-fake');
      navigate('/agendar');
    }
  };
  return (
    <div style={{ marginTop: 60, textAlign: 'center' }}>
      <h2>Debes iniciar sesión para agendar tu cita</h2>
      <Login onLogin={handleLogin} />
    </div>
  );
}