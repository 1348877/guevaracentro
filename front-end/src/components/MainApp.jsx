import React, { useState } from 'react';
import Dashboard from './Dashboard';
import Navigation from './Navigation';
import CitasManagement from './CitasManagement';
import PacientesManagement from './PacientesManagement';
import AuthService from '../services/authService';
import './MainApp.css';

const MainApp = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = AuthService.getUser();

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setSidebarOpen(false); // Cerrar sidebar en móvil
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'citas':
        return <CitasManagement />;
      case 'pacientes':
        return <PacientesManagement />;
      case 'agenda':
        return <div className="section-placeholder">
          <h2>Agenda</h2>
          <p>Sección en desarrollo...</p>
        </div>;
      case 'profile':
        return <div className="section-placeholder">
          <h2>Mi Perfil</h2>
          <p>Información del usuario...</p>
        </div>;
      default:
        return <div className="section-placeholder">
          <h2>Sección no encontrada</h2>
          <p>La sección seleccionada no está disponible.</p>
        </div>;
    }
  };

  return (
    <div className="main-app">
      <Navigation 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        userRole={user?.rol}
      />
      
      <div className="main-content">
        <div className="mobile-header">
          <button 
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <h1>Centro Psicológico Integral Guevara</h1>
        </div>
        
        <div className="content-area">
          {renderContent()}
        </div>
      </div>
      
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MainApp;
