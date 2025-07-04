import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/authService';
import DashboardService from '../services/dashboardService';
import Chat from './Chat';
import './Dashboard.css';

// Función helper para formatear nombres
const formatFullName = (person) => {
  if (!person) return 'Sin nombre';
  if (person.nombre) return person.nombre; // Para compatibilidad con datos legacy
  return `${person.nombres || ''} ${person.apellidos || ''}`.trim() || 'Sin nombre';
};

// Función helper para formatear fechas
const formatDate = (dateStr) => {
  if (!dateStr) return 'Sin fecha';
  return new Date(dateStr).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Función helper para formatear horas
const formatTime = (timeStr) => {
  if (!timeStr) return 'Sin hora';
  return new Date(`1970-01-01T${timeStr}`).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const navigate = useNavigate();

  // Verificar autenticación al cargar
  useEffect(() => {
    const currentUser = AuthService.getUser();
    const isAuthenticated = AuthService.isAuthenticated();
    
    console.log('🔍 Dashboard - Verificando autenticación:', {
      user: currentUser,
      authenticated: isAuthenticated,
      token: AuthService.getToken() ? 'presente' : 'ausente'
    });
    
    if (isAuthenticated && currentUser) {
      setUser(currentUser);
      loadDashboard();
    } else {
      setError('No hay sesión activa');
      setLoading(false);
    }
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await DashboardService.getDashboard();
      setDashboardData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate('/'); // Redirigir al inicio después del logout
  };

  const handleGoHome = () => {
    navigate('/'); // Ir al inicio sin cerrar sesión
  };

  const getChatRecipient = () => {
    switch (user?.rol) {
      case 'admin':
        return { id: 'system', nombre: 'Sistema de Gestión', avatar: '🤖' };
      case 'secretaria':
        return { id: 'admin', nombre: 'Administrador', avatar: '👨‍💼' };
      case 'psicologo':
        return { id: 'secretaria', nombre: 'Secretaría', avatar: '👩‍💼' };
      case 'paciente':
        return { id: 'secretaria', nombre: 'Recepción', avatar: '👩‍💼' };
      default:
        return { id: 'support', nombre: 'Soporte', avatar: '💬' };
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Error al cargar dashboard</h2>
        <p>{error}</p>
        <div style={{ marginTop: '20px' }}>
          <button onClick={loadDashboard} className="btn-retry" style={{ marginRight: '10px' }}>
            Reintentar
          </button>
          <button onClick={() => window.location.reload()} className="btn-retry">
            Recargar Página
          </button>
        </div>
        
        {/* Información de diagnóstico */}
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
          <h3>🔍 Información de Diagnóstico</h3>
          <p><strong>Token:</strong> {AuthService.getToken() ? 'Presente' : 'Ausente'}</p>
          <p><strong>Usuario:</strong> {AuthService.getUser()?.email || 'No disponible'}</p>
          <p><strong>URL Backend:</strong> {import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}</p>
          <p><strong>Rol:</strong> {AuthService.getUser()?.rol || 'No disponible'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-info">
            <h1>Dashboard - {user?.rol?.charAt(0).toUpperCase() + user?.rol?.slice(1)}</h1>
            <p>Bienvenido/a, {user?.nombre || user?.email}</p>
          </div>
          <div className="header-actions">
            <button onClick={handleGoHome} className="btn-home" title="Ir al Inicio">
              🏠 Inicio
            </button>
            <button onClick={loadDashboard} className="btn-refresh" title="Actualizar">
              🔄
            </button>
            <button onClick={() => setChatOpen(true)} className="btn-chat" title="Abrir Chat">
              💬 Chat
            </button>
            <button onClick={handleLogout} className="btn-logout">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        {user?.rol === 'admin' && <AdminDashboard data={dashboardData} />}
        {user?.rol === 'secretaria' && <SecretariaDashboard data={dashboardData} />}
        {user?.rol === 'psicologo' && <PsicologoDashboard data={dashboardData} />}
        {user?.rol === 'paciente' && <PacienteDashboard data={dashboardData} />}
      </main>

      {/* Chat flotante */}
      <Chat 
        isOpen={chatOpen} 
        onClose={() => setChatOpen(false)} 
        recipient={getChatRecipient()}
      />

      {/* Botón flotante de chat */}
      {!chatOpen && (
        <button 
          className="floating-chat-btn"
          onClick={() => setChatOpen(true)}
          title="Abrir Chat"
        >
          💬
          <span className="chat-notification">3</span>
        </button>
      )}
    </div>
  );
};

// Dashboard para Admin
const AdminDashboard = ({ data }) => {
  const navigate = useNavigate();
  
  return (
    <div className="admin-dashboard">
      {/* Métricas principales */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{data?.resumen?.totalPacientes || 0}</h3>
            <p>Total Pacientes</p>
            <span className="stat-change positive">+12 este mes</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👨‍⚕️</div>
          <div className="stat-content">
            <h3>{data?.resumen?.totalPsicologos || 0}</h3>
            <p>Psicólogos Activos</p>
            <span className="stat-change neutral">Sin cambios</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{data?.resumen?.totalCitas || 0}</h3>
            <p>Citas del Mes</p>
            <span className="stat-change positive">+18% vs mes anterior</span>
          </div>
        </div>
        <div className="stat-card highlight">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>S/.{data?.resumen?.ingresoEstimadoMes || 0}</h3>
            <p>Ingresos del Mes</p>
            <span className="stat-change positive">+23% vs mes anterior</span>
          </div>
        </div>
      </div>

      {/* Acciones rápidas principales */}
      <div className="admin-actions-grid">
        <div className="action-section">
          <h3>👥 Gestión de Pacientes</h3>
          <div className="action-buttons">
            <button className="btn-primary" onClick={() => navigate('/pacientes')}>
              <span>👤</span> Ver Todos los Pacientes
            </button>
            <button className="btn-secondary" onClick={() => navigate('/pacientes/nuevo')}>
              <span>➕</span> Agregar Paciente
            </button>
            <button className="btn-secondary">
              <span>📊</span> Reportes de Pacientes
            </button>
          </div>
        </div>

        <div className="action-section">
          <h3>📅 Gestión de Citas</h3>
          <div className="action-buttons">
            <button className="btn-primary" onClick={() => navigate('/agendar')}>
              <span>📅</span> Agendar Nueva Cita
            </button>
            <button className="btn-secondary" onClick={() => navigate('/citas')}>
              <span>📋</span> Ver Todas las Citas
            </button>
            <button className="btn-secondary">
              <span>⏰</span> Gestionar Horarios
            </button>
          </div>
        </div>

        <div className="action-section">
          <h3>👨‍⚕️ Personal</h3>
          <div className="action-buttons">
            <button className="btn-primary">
              <span>👥</span> Gestionar Psicólogos
            </button>
            <button className="btn-secondary">
              <span>📊</span> Reportes de Personal
            </button>
            <button className="btn-secondary">
              <span>⚙️</span> Configurar Roles
            </button>
          </div>
        </div>

        <div className="action-section">
          <h3>📊 Reportes y Análisis</h3>
          <div className="action-buttons">
            <button className="btn-primary">
              <span>📈</span> Reporte Mensual
            </button>
            <button className="btn-secondary">
              <span>💰</span> Análisis Financiero
            </button>
            <button className="btn-secondary">
              <span>📋</span> Exportar Datos
            </button>
          </div>
        </div>
      </div>

      {/* Actividad reciente mejorada */}
      <div className="recent-activity">
        <h3>🔔 Actividad Reciente</h3>
        <div className="activity-list">
          {Array.isArray(data?.actividadReciente) && data.actividadReciente.length > 0 ? (
            data.actividadReciente.map((actividad, index) => (
              <div key={index} className="activity-item">
                <span className="activity-icon">{actividad.icon}</span>
                <div className="activity-content">
                  <span className="activity-text">{actividad.descripcion}</span>
                  <span className="activity-time">{actividad.tiempo}</span>
                </div>
                <button className="activity-action">Ver</button>
              </div>
            ))
          ) : (
            <div className="no-activity">
              <span>📋 No hay actividad reciente</span>
            </div>
          )}
        </div>
      </div>

      {/* Gráficos y estadísticas adicionales */}
      <div className="admin-analytics">
        <div className="analytics-section">
          <h3>📊 Rendimiento del Centro</h3>
          <div className="analytics-grid">
            <div className="analytics-card">
              <h4>Citas por Estado</h4>
              <div className="progress-stats">
                <div className="progress-item">
                  <span className="progress-label">Completadas</span>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '75%'}}></div>
                  </div>
                  <span className="progress-value">75%</span>
                </div>
                <div className="progress-item">
                  <span className="progress-label">Pendientes</span>
                  <div className="progress-bar">
                    <div className="progress-fill warning" style={{width: '20%'}}></div>
                  </div>
                  <span className="progress-value">20%</span>
                </div>
                <div className="progress-item">
                  <span className="progress-label">Canceladas</span>
                  <div className="progress-bar">
                    <div className="progress-fill danger" style={{width: '5%'}}></div>
                  </div>
                  <span className="progress-value">5%</span>
                </div>
              </div>
            </div>

            <div className="analytics-card">
              <h4>Psicólogos Más Activos</h4>
              <div className="ranking-list">
                <div className="ranking-item">
                  <span className="ranking-position">1</span>
                  <span className="ranking-name">Dr. García</span>
                  <span className="ranking-score">28 citas</span>
                </div>
                <div className="ranking-item">
                  <span className="ranking-position">2</span>
                  <span className="ranking-name">Dra. Rodríguez</span>
                  <span className="ranking-score">24 citas</span>
                </div>
                <div className="ranking-item">
                  <span className="ranking-position">3</span>
                  <span className="ranking-name">Dra. Mendoza</span>
                  <span className="ranking-score">19 citas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard para Secretaria
const SecretariaDashboard = ({ data }) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Debug: Log the data to understand the structure
  console.log('SecretariaDashboard data:', data);
  console.log('citasHoy structure:', data?.citasHoy);
  console.log('citasPendientes structure:', data?.citasPendientes);
  
  // Safe data extraction with fallbacks - handling both mock and real backend data
  const citasHoyTotal = data?.citasHoy?.total || (Array.isArray(data?.citasHoy) ? data.citasHoy.length : 0);
  const citasPendientes = data?.citasPendientes?.total || (typeof data?.citasPendientes === 'number' ? data.citasPendientes : 0);
  const citasCompletadas = data?.citasCompletadas || 0;
  const citasCanceladas = data?.citasCanceladas || 0;
  const citasHoyList = data?.citasHoy?.citas || (Array.isArray(data?.citasHoy) ? data.citasHoy : []);
  const notificaciones = data?.notificaciones || (Array.isArray(data?.recordatorios) ? data.recordatorios : []);
  
  return (
    <div className="secretaria-dashboard">
      {/* Resumen del día */}
      <div className="today-overview">
        <h3>📅 Resumen del Día - {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
        <div className="stats-row">
          <div className="stat-box urgent">
            <span className="stat-number">{citasHoyTotal}</span>
            <span className="stat-label">Citas Hoy</span>
          </div>
          <div className="stat-box info">
            <span className="stat-number">{citasPendientes}</span>
            <span className="stat-label">Por Confirmar</span>
          </div>
          <div className="stat-box success">
            <span className="stat-number">{citasCompletadas}</span>
            <span className="stat-label">Completadas</span>
          </div>
          <div className="stat-box warning">
            <span className="stat-number">{citasCanceladas}</span>
            <span className="stat-label">Canceladas</span>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="secretaria-main-grid">
        {/* Sección de citas */}
        <div className="schedule-section">
          <div className="section-header">
            <h3>🗓️ Agenda del Día</h3>
            <div className="date-selector">
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="date-input"
              />
              <button className="btn-small">📅 Hoy</button>
            </div>
          </div>
          
          <div className="appointments-list">
            {citasHoyList.length > 0 ? (
              citasHoyList.map(cita => (
                <div key={cita.id} className="appointment-card">
                  <div className="appointment-time">
                    <span className="time">{cita.hora}</span>
                    <span className={`status ${cita.estado}`}>{cita.estado}</span>
                  </div>
                  <div className="appointment-info">
                    <h4>{cita.paciente?.nombre || 'Paciente'}</h4>
                    <p>Dr. {cita.psicologo?.nombre || 'Sin asignar'}</p>
                    <p className="appointment-type">{cita.tipoConsulta}</p>
                  </div>
                  <div className="appointment-actions">
                    <button className="btn-icon edit" title="Editar">
                      ✏️
                    </button>
                    <button className="btn-icon call" title="Llamar">
                      📞
                    </button>
                    <button className="btn-icon cancel" title="Cancelar">
                      ❌
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-appointments">
                <span>📅 No hay citas programadas para este día</span>
                <button className="btn-primary" onClick={() => navigate('/agendar')}>
                  Agendar Primera Cita
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="quick-actions-section">
          <h3>⚡ Acciones Rápidas</h3>
          <div className="quick-actions-grid">
            <button className="quick-action-btn primary" onClick={() => navigate('/pacientes/nuevo')}>
              <span className="action-icon">👤</span>
              <span className="action-text">Nuevo Paciente</span>
            </button>
            <button className="quick-action-btn secondary" onClick={() => navigate('/agendar')}>
              <span className="action-icon">📅</span>
              <span className="action-text">Agendar Cita</span>
            </button>
            <button className="quick-action-btn info">
              <span className="action-icon">📋</span>
              <span className="action-text">Lista de Espera</span>
            </button>
            <button className="quick-action-btn warning">
              <span className="action-icon">📞</span>
              <span className="action-text">Llamadas Pendientes</span>
            </button>
            <button className="quick-action-btn success" onClick={() => navigate('/pacientes')}>
              <span className="action-icon">👥</span>
              <span className="action-text">Ver Pacientes</span>
            </button>
            <button className="quick-action-btn">
              <span className="action-icon">📊</span>
              <span className="action-text">Reportes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notificaciones importantes */}
      <div className="notifications-section">
        <h3>🔔 Notificaciones Importantes</h3>
        <div className="notifications-list">
          {notificaciones.length > 0 ? (
            notificaciones.map((notif, index) => (
              <div key={index} className={`notification-item ${notif.tipo}`}>
                <span className="notification-icon">{notif.icon}</span>
                <div className="notification-content">
                  <p className="notification-text">{notif.mensaje}</p>
                  <span className="notification-time">{notif.tiempo}</span>
                </div>
                <button className="notification-close">×</button>
              </div>
            ))
          ) : (
            <div className="no-notifications">
              <span>✅ No hay notificaciones pendientes</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Dashboard para Psicólogo
const PsicologoDashboard = ({ data }) => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('agenda');
  
  // Debug: Log the data to understand the structure
  console.log('PsicologoDashboard data:', data);
  
  // Safe data extraction with fallbacks
  const citasHoyTotal = data?.citasHoy?.total || 0;
  const misPacientes = Array.isArray(data?.misPacientes) ? data.misPacientes : [];
  const tasaComplecion = data?.estadisticas?.tasaComplecion || 95;
  const notasPendientes = data?.notasPendientes || 0;
  const citasHoyList = Array.isArray(data?.citasHoy?.citas) ? data.citasHoy.citas : [];
  const notasRecientes = Array.isArray(data?.notasRecientes) ? data.notasRecientes : [];
  const proximasCitas = Array.isArray(data?.proximasCitas) ? data.proximasCitas : [];
  
  return (
    <div className="psicologo-dashboard">
      <div className="psicologo-header">
        <h3>👨‍⚕️ Mi Consulta - {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
        <div className="schedule-overview">
          <div className="schedule-stat primary">
            <span className="schedule-number">{citasHoyTotal}</span>
            <span className="schedule-label">Citas Hoy</span>
          </div>
          <div className="schedule-stat info">
            <span className="schedule-number">{misPacientes.length}</span>
            <span className="schedule-label">Mis Pacientes</span>
          </div>
          <div className="schedule-stat success">
            <span className="schedule-number">{tasaComplecion}%</span>
            <span className="schedule-label">Tasa Éxito</span>
          </div>
          <div className="schedule-stat warning">
            <span className="schedule-number">{notasPendientes}</span>
            <span className="schedule-label">Notas Pendientes</span>
          </div>
        </div>
      </div>

      <div className="psicologo-tabs">
        <button 
          className={`tab-btn ${selectedTab === 'agenda' ? 'active' : ''}`}
          onClick={() => setSelectedTab('agenda')}
        >
          📅 Mi Agenda
        </button>
        <button 
          className={`tab-btn ${selectedTab === 'pacientes' ? 'active' : ''}`}
          onClick={() => setSelectedTab('pacientes')}
        >
          👥 Mis Pacientes
        </button>
        <button 
          className={`tab-btn ${selectedTab === 'notas' ? 'active' : ''}`}
          onClick={() => setSelectedTab('notas')}
        >
          📝 Notas Clínicas
        </button>
      </div>

      <div className="psicologo-content">
        {selectedTab === 'agenda' && (
          <div className="agenda-section">
            <div className="today-appointments">
              <h4>🗓️ Citas de Hoy</h4>
              {citasHoyList.length > 0 ? (
                citasHoyList.map((cita, index) => (
                  <div key={cita.id || index} className="psicologo-appointment-card">
                    <div className="appointment-header">
                      <span className="appointment-time">{cita.hora}</span>
                      <span className={`appointment-status ${cita.estado}`}>{cita.estado}</span>
                    </div>
                    <div className="appointment-patient-info">
                      <h5>{cita.paciente?.nombre || 'Paciente'}</h5>
                      <p className="appointment-type">{cita.tipoCita || 'Consulta General'}</p>
                      <p className="appointment-mode">{cita.modalidad || 'Presencial'}</p>
                    </div>
                    <div className="appointment-actions">
                      <button className="btn-small primary">📋 Ver Historial</button>
                      <button className="btn-small secondary">📝 Agregar Notas</button>
                      <button className="btn-small success">✅ Completar</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-appointments-psy">
                  <span>📅 No tienes citas programadas para hoy</span>
                  <p>¡Perfecto momento para ponerse al día con las notas clínicas!</p>
                </div>
              )}
            </div>

            <div className="upcoming-schedule">
              <h4>📋 Próximas Citas</h4>
              <div className="upcoming-list">
                {Array.isArray(data?.proximasCitas) && data.proximasCitas.length > 0 ? (
                  data.proximasCitas.slice(0, 5).map((cita, index) => (
                    <div key={index} className="upcoming-appointment">
                      <span className="upcoming-date">{cita.fecha}</span>
                      <span className="upcoming-patient">{cita.paciente}</span>
                      <span className="upcoming-time">{cita.hora}</span>
                    </div>
                  ))
                ) : (
                  <p className="no-upcoming">No hay citas próximas programadas</p>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'pacientes' && (
          <div className="patients-section">
            <div className="patients-header">
              <h4>👥 Mis Pacientes Activos</h4>
              <button className="btn-primary">➕ Agregar Paciente</button>
            </div>
            <div className="patients-grid">
              {misPacientes.length > 0 ? (
                misPacientes.map((paciente, index) => (
                  <div key={paciente.id || index} className="patient-card">
                    <div className="patient-info">
                      <h5>{paciente.nombre}</h5>
                      <p className="patient-detail">Edad: {paciente.edad} años</p>
                      <p className="patient-detail">Tratamiento: {paciente.tratamiento || 'General'}</p>
                      <p className="patient-sessions">Sesiones: {paciente.totalSesiones || 0}</p>
                    </div>
                    <div className="patient-actions">
                      <button className="btn-icon" title="Ver expediente">📋</button>
                      <button className="btn-icon" title="Agendar cita">📅</button>
                      <button className="btn-icon" title="Agregar nota">📝</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-patients">
                  <span>👥 No tienes pacientes asignados</span>
                  <button className="btn-secondary">Solicitar Asignación</button>
                </div>
              )}
            </div>
          </div>
        )}

        {selectedTab === 'notas' && (
          <div className="notes-section">
            <div className="notes-header">
              <h4>📝 Notas Clínicas Recientes</h4>
              <button className="btn-primary">✍️ Nueva Nota</button>
            </div>
            <div className="notes-list">
              {notasRecientes.length > 0 ? (
                notasRecientes.map((nota, index) => (
                  <div key={nota.id || index} className="note-card">
                    <div className="note-header">
                      <span className="note-patient">{nota.paciente}</span>
                      <span className="note-date">{nota.fecha}</span>
                    </div>
                    <div className="note-content">
                      <p>{nota.contenido}</p>
                    </div>
                    <div className="note-actions">
                      <button className="btn-small">✏️ Editar</button>
                      <button className="btn-small">👁️ Ver Completa</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-notes">
                  <span>📝 No hay notas clínicas recientes</span>
                  <p>Comienza agregando notas de tus sesiones</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="psicologo-quick-actions">
        <h4>⚡ Acciones Rápidas</h4>
        <div className="quick-actions-row">
          <button className="quick-btn">📋 Nuevo Expediente</button>
          <button className="quick-btn">📊 Generar Reporte</button>
          <button className="quick-btn">💬 Mensajes</button>
          <button className="quick-btn">🔔 Recordatorios</button>
        </div>
      </div>
    </div>
  );
};

// Dashboard para Paciente
const PacienteDashboard = ({ data }) => (
  <div className="paciente-dashboard">
    {data.proximaCita && (
      <div className="next-appointment">
        <h3>Próxima Cita</h3>
        <div className="next-appointment-card">
          <div className="appointment-date">
            <span className="date">{formatDate(data.proximaCita.fecha)}</span>
            <span className="time">{formatTime(data.proximaCita.hora)}</span>
          </div>
          <div className="appointment-details">
            <h4>Dr. {formatFullName(data.proximaCita.Psicologo)}</h4>
            <p>{data.proximaCita.Psicologo?.especialidad}</p>
            <p className="appointment-type">{data.proximaCita.modalidad}</p>
          </div>
          <div className={`appointment-status ${data.proximaCita.estado}`}>
            {data.proximaCita.estado}
          </div>
        </div>
      </div>
    )}

    <div className="patient-stats">
      <div className="stat-item">
        <span className="stat-value">{data.estadisticas?.totalCitas || 0}</span>
        <span className="stat-title">Total Citas</span>
      </div>
      <div className="stat-item">
        <span className="stat-value">{data.estadisticas?.citasCompletadas || 0}</span>
        <span className="stat-title">Completadas</span>
      </div>
      <div className="stat-item">
        <span className="stat-value">{data.estadisticas?.asistencia || 0}%</span>
        <span className="stat-title">Asistencia</span>
      </div>
    </div>

    <div className="dashboard-grid">
      <div className="dashboard-section">
        <h3>Próximas Citas</h3>
        <div className="patient-appointments">
          {Array.isArray(data?.proximasCitas?.citas) && data.proximasCitas.citas.length > 0 ? (
            data.proximasCitas.citas.map((cita, index) => (
              <div key={index} className="patient-appointment-item">
                <div className="appointment-date">{formatDate(cita.fecha)} - {formatTime(cita.hora)}</div>
                <div className="appointment-doctor">Dr. {formatFullName(cita.Psicologo)}</div>
                <div className={`appointment-status ${cita.estado}`}>{cita.estado}</div>
              </div>
            ))
          ) : (
            <p className="no-appointments">No hay citas próximas programadas</p>
          )}
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Historial Reciente</h3>
        <div className="patient-history">
          {Array.isArray(data?.historialCitas?.citas) && data.historialCitas.citas.length > 0 ? (
            data.historialCitas.citas.slice(0, 5).map((cita, index) => (
              <div key={index} className="history-item">
                <div className="history-date">{formatDate(cita.fecha)}</div>
                <div className="history-info">
                  <p>Dr. {formatFullName(cita.Psicologo)}</p>
                  <span className={`history-status ${cita.estado}`}>{cita.estado}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="no-history">No hay historial de citas disponible</p>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;
