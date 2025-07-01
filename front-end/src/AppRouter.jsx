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

function ProtectedRoute({ user, children }) {
  // Permitir acceso a /agendar aunque no esté logueado, pero proteger otras rutas si es necesario
  return children;
}

export default function AppRouter() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showStaff, setShowStaff] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const loginBtnRef = useRef();
  const staffBtnRef = useRef();
  const [loginPos, setLoginPos] = useState({ top: 70, left: null });
  const [staffPos, setStaffPos] = useState(null);

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
        top: rect.bottom - 4, // Espacio visual más natural
        left: rect.left + rect.width / 2 + window.scrollX
      });
    } else if (!showStaff) {
      setStaffPos(null);
    }
  }, [showStaff]);

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
          top: rect.bottom - 4, // Espacio visual más natural
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
    <ErrorBoundary>
      <BrowserRouter>
        <Navbar
          user={user}
          onLoginClick={handleLoginToggle}
          onLogout={() => setUser(null)}
          showLogin={showLogin}
          loginBtnRef={loginBtnRef}
          staffBtnRef={staffBtnRef}
          onStaffToggle={handleStaffToggle}
          showStaff={showStaff}
          onStaffLogin={u => setUser(u.usuario)}
          staffPos={staffPos}
        />
        {showLogin && (
          <div style={{
            position: 'absolute',
            top: loginPos.top,
            left: loginPos.left,
            transform: 'translateX(-50%)',
            zIndex: 1000
          }}>
            <Login
              onLogin={u => { setUser(u); handleCloseLogin(); }}
              small
              isClosing={isClosing}
              onClose={handleCloseLogin}
            />
          </div>
        )}
        {showStaff && staffPos && (
          <StaffLogin
            open={showStaff}
            onClose={handleCloseStaff}
            panelPos={staffPos}
            onSuccess={u => { setUser(u.usuario); handleCloseStaff(); }}
          />
        )}
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/agendar" element={
            <ProtectedRoute user={user}>
              <AgendarCita />
            </ProtectedRoute>
          } />
          <Route path="/pacientes" element={<Pacientes />} />
          <Route path="/login-redirect" element={<LoginRedirect />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/equipo" element={<Equipo />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<ArticuloCompleto />} />
          <Route path="/solicitar-cita" element={<SolicitarCita />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
