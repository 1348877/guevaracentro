import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

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
          <button className="navbar-button">
            Iniciar Sesión
          </button>
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
