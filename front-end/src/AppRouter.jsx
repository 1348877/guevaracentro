import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './pages/App';
import AgendarCita from './pages/AgendarCita';
import Pacientes from './pages/Pacientes';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';

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

export default function AppRouter() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/agendar" element={<AgendarCita />} />
          <Route path="/pacientes" element={<Pacientes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
