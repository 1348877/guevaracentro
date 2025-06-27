import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, onLoginClick, onLogout, showLogin, loginBtnRef }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Guevara
        </Link>

        <div className="navbar-links">
          <Link to="/" className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}>
            Inicio
          </Link>
          <Link to="/pacientes" className={`navbar-link ${location.pathname === '/pacientes' ? 'active' : ''}`}>
            Pacientes
          </Link>
          <Link to="/agendar" className={`navbar-link ${location.pathname === '/agendar' ? 'active' : ''}`}>
            Agendar Cita
          </Link>
        </div>

        <div className="navbar-actions">
          {user ? (
            <button className="navbar-button" onClick={onLogout}>
              Cerrar sesión
            </button>
          ) : (
            <button className="navbar-button" onClick={onLoginClick} ref={loginBtnRef} style={{ background: showLogin ? '#222' : undefined }}>
              Iniciar Sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

try {
  // Código existente
} catch (error) {
  console.error('Error en Navbar:', error);
}
