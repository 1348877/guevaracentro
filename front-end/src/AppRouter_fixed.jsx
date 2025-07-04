import React, { Component, useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import App from './pages/App';
import AgendarCita from './pages/AgendarCita';
import Pacientes from './pages/Pacientes';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import Login from './components/Login';
import LoginRedirect from './pages/LoginRedirect';
import StaffLogin from './components/StaffLogin';
import Servicios from './pages/Servicios';
import Nosotros from './pages/Nosotros';
import Equipo from './pages/Equipo';
import Contacto from './pages/Contacto';
import Blog from './pages/Blog';
import Faq from './pages/Faq';
import ArticuloCompleto from './pages/ArticuloCompleto';
import SolicitarCita from './pages/SolicitarCita';
import Dashboard from './components/Dashboard';
import TestingPage from './pages/TestingPage';
import AuthService from './services/authService';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error en AppRouter:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'red', padding: '2rem' }}>
          Error en el router: {this.state.error?.message}
        </div>
      );
    }

    return this.props.children;
  }
}

function ProtectedRoute({ user, children, requiredRoles = [] }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      navigate('/');
      return;
    }

    if (requiredRoles.length > 0 && !AuthService.hasAnyRole(requiredRoles)) {
      navigate('/dashboard');
      return;
    }
  }, [user, requiredRoles, navigate]);

  if (!AuthService.isAuthenticated()) {
    return null;
  }

  if (requiredRoles.length > 0 && !AuthService.hasAnyRole(requiredRoles)) {
    return null;
  }

  return children;
}

function AppContent() {
  const [user, setUser] = useState(AuthService.getUser());
  const [showLogin, setShowLogin] = useState(false);
  const [showStaff, setShowStaff] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const loginBtnRef = useRef();
  const staffBtnRef = useRef();
  const [loginPos, setLoginPos] = useState({ top: 70, left: null });
  const [staffPos, setStaffPos] = useState(null);
  const navigate = useNavigate();

  // Verificar si el usuario está autenticado al cargar
  useEffect(() => {
    const currentUser = AuthService.getUser();
    setUser(currentUser);
  }, []);

  // Manejar login exitoso
  const handleSuccessfulLogin = (userData) => {
    console.log('Login exitoso:', userData);
    setUser(userData.user);
    handleCloseLogin();
    handleCloseStaff();
    
    // Si es staff, redirigir al dashboard
    if (['admin', 'secretaria', 'psicologo'].includes(userData.user?.rol)) {
      navigate('/dashboard');
    }
  };

  // Manejar logout
  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    navigate('/');
  };

  // Manejar apertura/cierre del login
  const handleLoginToggle = () => {
    if (showLogin) {
      setIsClosing(true);
      setTimeout(() => {
        setShowLogin(false);
        setIsClosing(false);
      }, 320);
    } else {
      setShowLogin(true);
      setShowStaff(false);
    }
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
    setIsClosing(false);
  };

  // Manejar apertura/cierre del staff login
  const handleStaffToggle = () => {
    setShowStaff(!showStaff);
    setShowLogin(false);
  };

  const handleCloseStaff = () => {
    setShowStaff(false);
  };

  return (
    <div>
      {/* Solo mostrar navbar en rutas públicas */}
      {!window.location.pathname.startsWith('/dashboard') && (
        <Navbar
          user={user}
          onLoginClick={handleLoginToggle}
          onLogout={handleLogout}
          showLogin={showLogin}
          loginBtnRef={loginBtnRef}
          staffBtnRef={staffBtnRef}
          onStaffToggle={handleStaffToggle}
          showStaff={showStaff}
          onStaffLogin={handleSuccessfulLogin}
          staffPos={staffPos}
        />
      )}

      {/* Modal de login público */}
      {showLogin && (
        <>
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 9998
            }}
            onClick={handleCloseLogin}
          />
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999
          }}>
            <Login
              onLogin={handleSuccessfulLogin}
              small={true}
              isClosing={isClosing}
              onClose={handleCloseLogin}
            />
          </div>
        </>
      )}

      {/* Modal de staff login */}
      {showStaff && (
        <>
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 9998
            }}
            onClick={handleCloseStaff}
          />
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999
          }}>
            <StaffLogin
              onLogin={handleSuccessfulLogin}
              onClose={handleCloseStaff}
            />
          </div>
        </>
      )}

      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<App />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/equipo" element={<Equipo />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<ArticuloCompleto />} />
        <Route path="/solicitar-cita" element={<SolicitarCita />} />
        <Route path="/testing" element={<TestingPage />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/login-redirect" element={<LoginRedirect />} />
        
        {/* Rutas protegidas para pacientes autenticados */}
        <Route path="/agendar" element={
          <ProtectedRoute user={user} requiredRoles={['paciente', 'admin']}>
            <AgendarCita />
          </ProtectedRoute>
        } />
        
        {/* Dashboard para usuarios autenticados */}
        <Route path="/dashboard" element={
          <ProtectedRoute user={user} requiredRoles={['admin', 'secretaria', 'psicologo', 'paciente']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Rutas administrativas */}
        <Route path="/pacientes" element={
          <ProtectedRoute user={user} requiredRoles={['admin', 'secretaria']}>
            <Pacientes />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </BrowserRouter>
  );
}
