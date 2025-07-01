import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { FaLock } from 'react-icons/fa';

const Navbar = ({ user, onLoginClick, onLogout, showLogin, loginBtnRef, staffBtnRef, onStaffToggle, showStaff, onStaffLogin, staffPos }) => {
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
          <Link to="/nosotros" className={`navbar-link ${location.pathname === '/nosotros' ? 'active' : ''}`}>
            Nosotros
          </Link>
          <Link to="/servicios" className={`navbar-link ${location.pathname === '/servicios' ? 'active' : ''}`}>
            Servicios
          </Link>
          <Link to="/equipo" className={`navbar-link ${location.pathname === '/equipo' ? 'active' : ''}`}>
            Nuestro Equipo
          </Link>
          <Link to="/blog" className={`navbar-link ${location.pathname === '/blog' ? 'active' : ''}`}>
            Blog
          </Link>
          <Link to="/faq" className={`navbar-link ${location.pathname === '/faq' ? 'active' : ''}`}>
            FAQ
          </Link>
          <Link to="/contacto" className={`navbar-link ${location.pathname === '/contacto' ? 'active' : ''}`}>
            Contacto
          </Link>
          <Link to="/solicitar-cita" className={`navbar-link ${location.pathname === '/solicitar-cita' ? 'active' : ''}`}>
            Solicitar Cita
          </Link>
          {user && (
            <Link to="/perfil" className={`navbar-link ${location.pathname === '/perfil' ? 'active' : ''}`}>
              Mi Perfil
            </Link>
          )}
        </div>

        <div className="navbar-actions">
          {!user && (
            <>
              <button className="staff-login-btn" title="Acceso privado" ref={staffBtnRef} onClick={onStaffToggle}>
                <FaLock size={20} />
              </button>
              <button className="navbar-button" onClick={onLoginClick} ref={loginBtnRef} style={{ background: showLogin ? '#222' : undefined }}>
                Iniciar Sesión
              </button>
            </>
          )}
          {user && (
            <button className="navbar-button" onClick={onLogout}>
              Cerrar sesión
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
