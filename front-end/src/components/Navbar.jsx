import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { FaLock, FaBars, FaTimes, FaUser } from 'react-icons/fa';

const Navbar = ({ user, onLoginClick, onLogout, showLogin, loginBtnRef, staffBtnRef, onStaffToggle, showStaff, onStaffLogin, staffPos }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Guevara
        </Link>

        <div className={`navbar-links ${isMobileMenuOpen ? 'navbar-links-mobile-open' : ''}`}>
          <Link to="/" className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`} onClick={closeMobileMenu}>
            Inicio
          </Link>
          <Link to="/nosotros" className={`navbar-link ${location.pathname === '/nosotros' ? 'active' : ''}`} onClick={closeMobileMenu}>
            Nosotros
          </Link>
          <Link to="/servicios" className={`navbar-link ${location.pathname === '/servicios' ? 'active' : ''}`} onClick={closeMobileMenu}>
            Servicios
          </Link>
          <Link to="/equipo" className={`navbar-link ${location.pathname === '/equipo' ? 'active' : ''}`} onClick={closeMobileMenu}>
            Nuestro Equipo
          </Link>
          <Link to="/blog" className={`navbar-link ${location.pathname === '/blog' ? 'active' : ''}`} onClick={closeMobileMenu}>
            Blog
          </Link>
          <Link to="/faq" className={`navbar-link ${location.pathname === '/faq' ? 'active' : ''}`} onClick={closeMobileMenu}>
            FAQ
          </Link>
          <Link to="/contacto" className={`navbar-link ${location.pathname === '/contacto' ? 'active' : ''}`} onClick={closeMobileMenu}>
            Contacto
          </Link>
          <Link to="/solicitar-cita" className={`navbar-link navbar-link-cta ${location.pathname === '/solicitar-cita' ? 'active' : ''}`} onClick={closeMobileMenu}>
            Solicitar Cita
          </Link>
          {user && (
            <Link to="/perfil" className={`navbar-link ${location.pathname === '/perfil' ? 'active' : ''}`} onClick={closeMobileMenu}>
              <FaUser style={{marginRight: '6px'}} />
              Mi Perfil
            </Link>
          )}
        </div>

        <div className="navbar-actions">
          <button 
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Menú"
          >
            {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          
          {!user && (
            <>
              <button className="staff-login-btn" title="Acceso privado para staff" ref={staffBtnRef} onClick={onStaffToggle} aria-label="Acceso staff">
                <FaLock size={18} /> <span className="staff-btn-text">Staff</span>
              </button>
              <button className="navbar-button" onClick={onLoginClick} ref={loginBtnRef} style={{ background: showLogin ? '#ff9800' : undefined }}>
                Iniciar Sesión
              </button>
            </>
          )}
          {user && (
            <button className="navbar-button navbar-button-logout" onClick={onLogout}>
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
