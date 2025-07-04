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
import MainApp from './components/MainApp';
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
    // Obtener usuario actual del servicio si no está en el estado
    const currentUser = user || AuthService.getUser();
    const isAuthenticated = AuthService.isAuthenticated();
    
    console.log('🔍 ProtectedRoute - Verificando acceso:', {
      user: currentUser,
      authenticated: isAuthenticated,
      requiredRoles
    });

    // Verificar si el usuario está autenticado
    if (!isAuthenticated || !currentUser) {
      console.log('🔒 No autenticado, redirigiendo a home');
      navigate('/');
      return;
    }

    // Verificar permisos usando el usuario actual
    if (requiredRoles.length > 0 && !requiredRoles.includes(currentUser.rol)) {
      console.log('⚠️ Sin permisos para acceder a esta ruta. Rol:', currentUser.rol, 'Requeridos:', requiredRoles);
      navigate('/');
      return;
    }
  }, [user, requiredRoles, navigate]);

  // Verificar autenticación usando AuthService directamente
  const currentUser = user || AuthService.getUser();
  const isAuthenticated = AuthService.isAuthenticated();
  
  if (!isAuthenticated || !currentUser) {
    return null;
  }

  // Verificar permisos
  if (requiredRoles.length > 0 && !requiredRoles.includes(currentUser.rol)) {
    return null;
  }

  return children;
}

function AppContent() {
  const [user, setUser] = useState(null); // Inicializar como null para evitar errores
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
    try {
      // Limpiar datos corruptos primero - COMENTADO TEMPORALMENTE
      // AuthService.clearCorruptedData();
      const currentUser = AuthService.getUser();
      const isAuthenticated = AuthService.isAuthenticated();
      
      console.log('🔍 Verificando autenticación al cargar:', {
        user: currentUser,
        authenticated: isAuthenticated,
        token: AuthService.getToken() ? 'presente' : 'ausente'
      });
      
      if (isAuthenticated && currentUser) {
        setUser(currentUser);
        console.log('✅ Usuario autenticado encontrado:', currentUser.nombre, '- Rol:', currentUser.rol);
      } else {
        console.log('❌ No hay usuario autenticado');
        setUser(null);
      }
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      localStorage.clear(); // Limpiar todo si hay errores
      setUser(null);
    }
  }, []);

  // Listener para cambios en localStorage (para detectar login/logout)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        console.log('🔄 Cambio detectado en localStorage:', e.key);
        
        const currentUser = AuthService.getUser();
        const isAuthenticated = AuthService.isAuthenticated();
        
        if (isAuthenticated && currentUser) {
          console.log('✅ Usuario actualizado desde localStorage:', currentUser.nombre);
          setUser(currentUser);
        } else {
          console.log('❌ Sesión eliminada, limpiando estado');
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Calcular posición del login público
  useEffect(() => {
    if (showLogin && loginBtnRef.current) {
      const rect = loginBtnRef.current.getBoundingClientRect();
      setLoginPos({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + rect.width / 2 + window.scrollX
      });
    }
  }, [showLogin]);

  // Calcular posición del login staff
  useEffect(() => {
    if (showStaff && staffBtnRef.current) {
      const rect = staffBtnRef.current.getBoundingClientRect();
      setStaffPos({
        top: rect.bottom - 4,
        left: rect.left + rect.width / 2 + window.scrollX
      });
    } else if (!showStaff) {
      setStaffPos(null);
    }
  }, [showStaff]);

  // Manejar login exitoso
  const handleSuccessfulLogin = (userData) => {
    console.log('🔐 Login exitoso recibido:', userData);
    
    // El AuthService ya se encargó de guardar el token y usuario
    // Solo necesitamos actualizar el estado local y redirigir
    
    // Verificar que el usuario se guardó correctamente en AuthService
    const savedUser = AuthService.getUser();
    const isAuthenticated = AuthService.isAuthenticated();
    
    console.log('🔍 Verificando después del login:', {
      savedUser,
      isAuthenticated,
      token: AuthService.getToken() ? 'presente' : 'ausente'
    });
    
    // Actualizar el estado del AppRouter con los datos de AuthService
    if (isAuthenticated && savedUser) {
      setUser(savedUser);
      console.log('✅ Usuario autenticado:', savedUser.nombre, '- Rol:', savedUser.rol);
    } else {
      console.error('❌ Error: AuthService no tiene datos después del login');
    }
    
    // Cerrar todos los modales
    setShowLogin(false);
    setShowStaff(false);
    setIsClosing(false);
    
    // Si es staff, redirigir al dashboard
    if (savedUser && ['admin', 'secretaria', 'psicologo', 'paciente'].includes(savedUser.rol)) {
      console.log('🚀 Redirigiendo al dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    } else {
      console.log('❌ Rol no autorizado para dashboard:', savedUser?.rol);
    }
  };

  // Manejar logout
  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    navigate('/');
  };

  // Exclusividad de paneles
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

  const handleStaffToggle = () => {
    if (showStaff) {
      setShowStaff(false);
      setStaffPos(null);
    } else if (staffBtnRef.current) {
      setTimeout(() => {
        const rect = staffBtnRef.current.getBoundingClientRect();
        setStaffPos({
          top: rect.bottom - 4,
          left: rect.left + rect.width / 2 + window.scrollX
        });
        setShowStaff(true);
        setShowLogin(false);
      }, 0);
    }
  };

  const handleCloseLogin = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowLogin(false);
      setIsClosing(false);
    }, 320);
  };

  const handleCloseStaff = () => setShowStaff(false);

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
              small
              isClosing={isClosing}
              onClose={handleCloseLogin}
            />
          </div>
        </>
      )}
      
      {/* Modal de login staff */}
      {showStaff && staffPos && (
        <StaffLogin
          open={showStaff}
          onClose={handleCloseStaff}
          panelPos={staffPos}
          onSuccess={handleSuccessfulLogin}
        />
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
