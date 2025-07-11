import React, { useState, useEffect } from 'react';
import PacientesService from '../services/pacientesService';
import './PacientesManagement.css';

const PacientesManagement = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPacientes();
  }, []);

  const loadPacientes = async () => {
    try {
      setLoading(true);
      const data = await PacientesService.getPacientes();
      setPacientes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredPacientes = pacientes.filter(paciente => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${paciente.nombres || ''} ${paciente.apellidos || ''}`.toLowerCase();
    return fullName.includes(searchLower) || 
           (paciente.dni && paciente.dni.includes(searchTerm)) ||
           (paciente.email && paciente.email.toLowerCase().includes(searchLower));
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No especificada';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'No especificada';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  if (loading) {
    return (
      <div className="pacientes-loading">
        <div className="loading-spinner"></div>
        <p>Cargando pacientes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pacientes-error">
        <h2>Error al cargar pacientes</h2>
        <p>{error}</p>
        <button onClick={loadPacientes} className="btn-retry">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="pacientes-management">
      <header className="pacientes-header">
        <h1>Gestión de Pacientes</h1>
        <div className="header-actions">
          <button className="btn-new-paciente">
            ➕ Nuevo Paciente
          </button>
          <button onClick={loadPacientes} className="btn-refresh">
            🔄 Actualizar
          </button>
        </div>
      </header>

      <div className="search-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar por nombre, DNI o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="search-results">
          {searchTerm && (
            <p>{filteredPacientes.length} paciente(s) encontrado(s)</p>
          )}
        </div>
      </div>

      <div className="pacientes-stats">
        <div className="stat-item">
          <span className="stat-number">{pacientes.length}</span>
          <span className="stat-label">Total Pacientes</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{pacientes.filter(p => p.sexo === 'M').length}</span>
          <span className="stat-label">Masculino</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{pacientes.filter(p => p.sexo === 'F').length}</span>
          <span className="stat-label">Femenino</span>
        </div>
      </div>

      <div className="pacientes-list">
        {filteredPacientes.map(paciente => (
          <div key={paciente.id} className="paciente-card">
            <div className="paciente-header">
              <div className="paciente-avatar">
                <span className="avatar-icon">
                  {paciente.sexo === 'M' ? '👨' : paciente.sexo === 'F' ? '👩' : '👤'}
                </span>
              </div>
              <div className="paciente-basic-info">
                <h3>{paciente.nombres} {paciente.apellidos}</h3>
                <p className="paciente-dni">DNI: {paciente.dni}</p>
                <p className="paciente-age">
                  {calculateAge(paciente.fecha_nacimiento)} años
                </p>
              </div>
            </div>
            
            <div className="paciente-details">
              <div className="detail-section">
                <h4>Información Personal</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Fecha de Nacimiento:</span>
                    <span className="value">{formatDate(paciente.fecha_nacimiento)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Sexo:</span>
                    <span className="value">
                      {paciente.sexo === 'M' ? 'Masculino' : paciente.sexo === 'F' ? 'Femenino' : 'Otro'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Teléfono:</span>
                    <span className="value">{paciente.telefono || 'No especificado'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Email:</span>
                    <span className="value">{paciente.email || 'No especificado'}</span>
                  </div>
                </div>
              </div>
              
              {paciente.direccion && (
                <div className="detail-section">
                  <h4>Dirección</h4>
                  <p>{paciente.direccion}</p>
                </div>
              )}
              
              {paciente.historial_clinico && (
                <div className="detail-section">
                  <h4>Historial Clínico</h4>
                  <p>{paciente.historial_clinico}</p>
                </div>
              )}
            </div>
            
            <div className="paciente-actions">
              <button className="btn-edit">✏️ Editar</button>
              <button className="btn-history">📋 Historial</button>
              <button className="btn-schedule">📅 Agendar Cita</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PacientesManagement;
