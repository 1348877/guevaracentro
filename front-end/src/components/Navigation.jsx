import React from 'react';
import './Navigation.css';

const Navigation = ({ activeSection, onSectionChange, userRole }) => {
  const getMenuItems = () => {
    const commonItems = [
      { id: 'dashboard', name: 'Dashboard', icon: '📊' },
      { id: 'profile', name: 'Mi Perfil', icon: '👤' }
    ];

    const roleSpecificItems = {
      admin: [
        { id: 'usuarios', name: 'Usuarios', icon: '👥' },
        { id: 'reportes', name: 'Reportes', icon: '📈' },
        { id: 'configuracion', name: 'Configuración', icon: '⚙️' }
      ],
      secretaria: [
        { id: 'citas', name: 'Gestión de Citas', icon: '📅' },
        { id: 'pacientes', name: 'Pacientes', icon: '🏥' },
        { id: 'agenda', name: 'Agenda', icon: '📝' }
      ],
      psicologo: [
        { id: 'agenda', name: 'Mi Agenda', icon: '📅' },
        { id: 'pacientes', name: 'Mis Pacientes', icon: '🏥' },
        { id: 'notas', name: 'Notas Clínicas', icon: '📋' }
      ],
      paciente: [
        { id: 'citas', name: 'Mis Citas', icon: '📅' },
        { id: 'historial', name: 'Historial', icon: '📋' }
      ]
    };

    return [...commonItems, ...(roleSpecificItems[userRole] || [])];
  };

  const menuItems = getMenuItems();

  return (
    <nav className="navigation">
      <div className="nav-header">
        <h2>Centro Psicológico</h2>
        <p>Integral Guevara</p>
      </div>
      
      <div className="nav-menu">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => onSectionChange(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.name}</span>
          </button>
        ))}
      </div>
      
      <div className="nav-footer">
        <div className="user-info">
          <span className="user-role">{userRole}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
