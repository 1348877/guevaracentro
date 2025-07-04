import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/authService';
import DashboardService from '../services/dashboardService';
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
    </div>
  );
};

// Dashboard para Admin
const AdminDashboard = ({ data }) => (
  <div className="admin-dashboard">
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon">👥</div>
        <div className="stat-content">
          <h3>{data.resumen?.totalPacientes || 0}</h3>
          <p>Total Pacientes</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">👨‍⚕️</div>
        <div className="stat-content">
          <h3>{data.resumen?.totalPsicologos || 0}</h3>
          <p>Psicólogos</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">📅</div>
        <div className="stat-content">
          <h3>{data.resumen?.totalCitas || 0}</h3>
          <p>Total Citas</p>
        </div>
      </div>
      <div className="stat-card highlight">
        <div className="stat-icon">💰</div>
        <div className="stat-content">
          <h3>${data.resumen?.ingresoEstimadoMes || 0}</h3>
          <p>Ingresos del Mes</p>
        </div>
      </div>
    </div>

    <div className="dashboard-grid">
      <div className="dashboard-section">
        <h3>Citas por Estado</h3>
        <div className="status-list">
          {data.citasPorEstado?.map((item, index) => (
            <div key={index} className="status-item">
              <span className={`status-badge ${item.estado}`}>{item.estado}</span>
              <span className="status-count">{item.cantidad}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Psicólogos Más Activos</h3>
        <div className="ranking-list">
          {data.psicologosActivos?.map((item, index) => (
            <div key={index} className="ranking-item">
              <div className="ranking-position">{index + 1}</div>
              <div className="ranking-info">
                <p className="ranking-name">{formatFullName(item.psicologo)}</p>
                <p className="ranking-detail">{item.psicologo?.especialidad}</p>
              </div>
              <div className="ranking-score">{item.totalCitas} citas</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Dashboard para Secretaria
const SecretariaDashboard = ({ data }) => (
  <div className="secretaria-dashboard">
    <div className="today-overview">
      <h3>Resumen de Hoy</h3>
      <div className="stats-row">
        <div className="stat-box">
          <span className="stat-number">{data.citasHoy?.total || 0}</span>
          <span className="stat-label">Citas Hoy</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">{data.citasManana?.total || 0}</span>
          <span className="stat-label">Citas Mañana</span>
        </div>
        <div className="stat-box alert">
          <span className="stat-number">{data.citasPendientes?.total || 0}</span>
          <span className="stat-label">Pendientes</span>
        </div>
      </div>
    </div>

    <div className="dashboard-grid">
      <div className="dashboard-section">
        <h3>Citas de Hoy</h3>
        <div className="appointments-list">
          {data.citasHoy?.citas?.slice(0, 5).map((cita, index) => (
            <div key={index} className="appointment-item">
              <div className="appointment-time">{formatTime(cita.hora)}</div>
              <div className="appointment-info">
                <p className="patient-name">{formatFullName(cita.Paciente)}</p>
                <p className="doctor-name">Dr. {formatFullName(cita.Psicologo)}</p>
              </div>
              <div className={`appointment-status ${cita.estado}`}>
                {cita.estado}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Citas Pendientes de Confirmar</h3>
        <div className="pending-list">
          {data.citasPendientes?.citas?.slice(0, 5).map((cita, index) => (
            <div key={index} className="pending-item">
              <div className="pending-info">
                <p className="patient-name">{formatFullName(cita.Paciente)}</p>
                <p className="appointment-date">{formatDate(cita.fecha)} - {formatTime(cita.hora)}</p>
              </div>
              <div className="pending-actions">
                <button className="btn-confirm">Confirmar</button>
                <button className="btn-reject">Rechazar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Dashboard para Psicólogo
const PsicologoDashboard = ({ data }) => (
  <div className="psicologo-dashboard">
    <div className="today-schedule">
      <h3>Mi Agenda de Hoy</h3>
      <div className="schedule-overview">
        <div className="schedule-stat">
          <span className="schedule-number">{data.citasHoy?.total || 0}</span>
          <span className="schedule-label">Citas Hoy</span>
        </div>
        <div className="schedule-stat">
          <span className="schedule-number">{data.citasPendientes?.total || 0}</span>
          <span className="schedule-label">Pendientes</span>
        </div>
        <div className="schedule-stat">
          <span className="schedule-number">{data.estadisticas?.tasaComplecion || 0}%</span>
          <span className="schedule-label">Tasa Completadas</span>
        </div>
      </div>
    </div>

    <div className="dashboard-grid">
      <div className="dashboard-section">
        <h3>Citas de Hoy</h3>
        <div className="today-appointments">
          {data.citasHoy?.citas?.map((cita, index) => (
            <div key={index} className="appointment-card">
              <div className="appointment-time">{formatTime(cita.hora)}</div>
              <div className="appointment-patient">
                <h4>{formatFullName(cita.Paciente)}</h4>
                <p>{cita.tipoCita || 'Consulta'} - {cita.modalidad}</p>
              </div>
              <div className={`appointment-status ${cita.estado}`}>
                {cita.estado}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Próximas Citas</h3>
        <div className="upcoming-appointments">
          {data.proximasCitas?.citas?.slice(0, 5).map((cita, index) => (
            <div key={index} className="upcoming-item">
              <div className="upcoming-date">{formatDate(cita.fecha)}</div>
              <div className="upcoming-info">
                <p className="patient-name">{formatFullName(cita.Paciente)}</p>
                <p className="upcoming-time">{formatTime(cita.hora)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

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
          {data.proximasCitas?.citas?.map((cita, index) => (
            <div key={index} className="patient-appointment-item">
              <div className="appointment-date">{formatDate(cita.fecha)} - {formatTime(cita.hora)}</div>
              <div className="appointment-doctor">Dr. {formatFullName(cita.Psicologo)}</div>
              <div className={`appointment-status ${cita.estado}`}>{cita.estado}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Historial Reciente</h3>
        <div className="patient-history">
          {data.historialCitas?.citas?.slice(0, 5).map((cita, index) => (
            <div key={index} className="history-item">
              <div className="history-date">{formatDate(cita.fecha)}</div>
              <div className="history-info">
                <p>Dr. {formatFullName(cita.Psicologo)}</p>
                <span className={`history-status ${cita.estado}`}>{cita.estado}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;
