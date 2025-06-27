import React, { Component, useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import App from './pages/App';
import AgendarCita from './pages/AgendarCita';
import Pacientes from './pages/Pacientes';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import Login from './components/Login';

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
  const navigate = useNavigate();
  if (!user) {
    alert('Debe iniciar sesión para acceder a esta sección');
    return null;
  }
  return children;
}

export default function AppRouter() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const loginBtnRef = useRef();
  const [loginPos, setLoginPos] = useState({ top: 70, left: null });

  useEffect(() => {
    if (showLogin && loginBtnRef.current) {
      const rect = loginBtnRef.current.getBoundingClientRect();
      setLoginPos({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + rect.width / 2 + window.scrollX
      });
    }
  }, [showLogin]);

  const handleLoginToggle = () => {
    if (showLogin) {
      // Cerrar con animación
      setIsClosing(true);
      setTimeout(() => {
        setShowLogin(false);
        setIsClosing(false);
      }, 320);
    } else {
      // Abrir
      setShowLogin(true);
    }
  };

  const handleCloseLogin = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowLogin(false);
      setIsClosing(false);
    }, 320);
  };

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Navbar
          user={user}
          onLoginClick={handleLoginToggle}
          onLogout={() => setUser(null)}
          showLogin={showLogin}
          loginBtnRef={loginBtnRef}
        />
        {/* Solo un panel de login flotante alineado con el botón */}
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/agendar" element={
              <ProtectedRoute user={user}>
                <AgendarCita />
              </ProtectedRoute>
            } />
            <Route path="/pacientes" element={<Pacientes />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
