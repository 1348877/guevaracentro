import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importar los componentes principales
import App from './pages/App';
import Navbar from './components/Navbar';
import Servicios from './pages/Servicios';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/Contacto';
import SolicitarCita from './pages/SolicitarCita';
import NotFound from './pages/NotFound';

const SimpleAppRouter = () => {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/solicitar-cita" element={<SolicitarCita />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default SimpleAppRouter;
