import React, { useState, useEffect } from 'react';
import CitasService, { getCitas } from '../services/citasService';
import './CitasManagement.css';

const CitasManagement = () => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadCitas();
  }, []);

  const loadCitas = async () => {
    try {
      setLoading(true);
      const data = await getCitas();
      setCitas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (citaId, newStatus) => {
    try {
      await CitasService.updateCita(citaId, { estado: newStatus });
      loadCitas(); // Reload data
    } catch (err) {
      alert('Error al actualizar el estado de la cita');
    }
  };

  const filteredCitas = citas.filter(cita => {
    if (filter === 'all') return true;
    return cita.estado === filter;
  });

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return 'Sin hora';
    return new Date(`1970-01-01T${timeStr}`).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFullName = (person) => {
    if (!person) return 'Sin nombre';
    if (person.nombre) return person.nombre;
    return `${person.nombres || ''} ${person.apellidos || ''}`.trim() || 'Sin nombre';
  };

  if (loading) {
    return (
      <div className="citas-loading">
        <div className="loading-spinner"></div>
        <p>Cargando citas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="citas-error">
        <h2>Error al cargar citas</h2>
        <p>{error}</p>
        <button onClick={loadCitas} className="btn-retry">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="citas-management">
      <header className="citas-header">
        <h1>Gestión de Citas</h1>
        <div className="header-actions">
          <button className="btn-new-cita">
            ➕ Nueva Cita
          </button>
          <button onClick={loadCitas} className="btn-refresh">
            🔄 Actualizar
          </button>
        </div>
      </header>

      <div className="citas-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Todas ({citas.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'solicitada' ? 'active' : ''}`}
          onClick={() => setFilter('solicitada')}
        >
          Solicitadas ({citas.filter(c => c.estado === 'solicitada').length})
        </button>
        <button 
          className={`filter-btn ${filter === 'confirmada' ? 'active' : ''}`}
          onClick={() => setFilter('confirmada')}
        >
          Confirmadas ({citas.filter(c => c.estado === 'confirmada').length})
        </button>
        <button 
          className={`filter-btn ${filter === 'completada' ? 'active' : ''}`}
          onClick={() => setFilter('completada')}
        >
          Completadas ({citas.filter(c => c.estado === 'completada').length})
        </button>
      </div>

      <div className="citas-list">
        {filteredCitas.map(cita => (
          <div key={cita.id} className="cita-card">
            <div className="cita-header">
              <div className="cita-date">
                <span className="date">{formatDate(cita.fecha)}</span>
                <span className="time">{formatTime(cita.hora)}</span>
              </div>
              <div className={`cita-status ${cita.estado}`}>
                {cita.estado}
              </div>
            </div>
            
            <div className="cita-details">
              <div className="cita-info">
                <h3>Paciente: {formatFullName(cita.Paciente)}</h3>
                <p>Psicólogo: Dr. {formatFullName(cita.Psicologo)}</p>
                <p>Modalidad: {cita.modalidad || 'No especificada'}</p>
                {cita.notas && <p>Notas: {cita.notas}</p>}
              </div>
              
              <div className="cita-actions">
                {cita.estado === 'solicitada' && (
                  <>
                    <button 
                      className="btn-confirm"
                      onClick={() => handleStatusChange(cita.id, 'confirmada')}
                    >
                      Confirmar
                    </button>
                    <button 
                      className="btn-cancel"
                      onClick={() => handleStatusChange(cita.id, 'cancelada')}
                    >
                      Cancelar
                    </button>
                  </>
                )}
                {cita.estado === 'confirmada' && (
                  <>
                    <button 
                      className="btn-complete"
                      onClick={() => handleStatusChange(cita.id, 'completada')}
                    >
                      Completar
                    </button>
                    <button 
                      className="btn-cancel"
                      onClick={() => handleStatusChange(cita.id, 'cancelada')}
                    >
                      Cancelar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CitasManagement;
