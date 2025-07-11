import React, { useState, useEffect } from 'react';
import AuthService from '../services/authService';
import CitasService from '../services/citasService';
import HorarioService from '../services/horarioService';
import './SolicitarCitaNueva.css';

const SolicitarCitaNueva = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    psicologoId: '',
    fecha: '',
    hora: '',
    tipoCita: 'consulta',
    modalidad: 'presencial',
    motivo: ''
  });

  const [psicologos] = useState([
    { id: 1, nombre: 'Dr. Juan Pérez', especialidad: 'Psicología Clínica' },
    { id: 2, nombre: 'Dra. María García', especialidad: 'Psicología Infantil' },
    { id: 3, nombre: 'Dr. Carlos López', especialidad: 'Terapia de Pareja' },
  ]);

  const [horariosDisponibles, setHorariosDisponibles] = useState([]);

  useEffect(() => {
    if (formData.psicologoId && formData.fecha) {
      loadHorariosDisponibles();
    }
  }, [formData.psicologoId, formData.fecha]);

  const loadHorariosDisponibles = async () => {
    try {
      setLoading(true);
      const data = await HorarioService.getHorariosDisponiblesCitas(
        formData.psicologoId, 
        formData.fecha, 
        formData.modalidad
      );
      setHorariosDisponibles(data.slots || []);
    } catch (err) {
      setError('Error al cargar horarios disponibles');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleNextStep = () => {
    if (step === 1 && (!formData.psicologoId || !formData.fecha)) {
      setError('Por favor selecciona un psicólogo y una fecha');
      return;
    }
    if (step === 2 && !formData.hora) {
      setError('Por favor selecciona un horario');
      return;
    }
    setStep(step + 1);
    setError(null);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await CitasService.createCita(formData);
      setSuccess(true);
      setTimeout(() => {
        onSuccess && onSuccess();
        onClose && onClose();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  if (success) {
    return (
      <div className="solicitar-cita-overlay">
        <div className="solicitar-cita-container success">
          <div className="success-icon">✅</div>
          <h2>¡Cita Solicitada!</h2>
          <p>Tu solicitud de cita ha sido enviada exitosamente. Te contactaremos pronto para confirmar la cita.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="solicitar-cita-overlay">
      <div className="solicitar-cita-container">
        <div className="solicitar-cita-header">
          <h2>Solicitar Cita</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="progress-bar">
          <div className="progress-steps">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>3</div>
          </div>
          <div className="progress-labels">
            <span>Seleccionar</span>
            <span>Horario</span>
            <span>Detalles</span>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="solicitar-cita-form">
          {step === 1 && (
            <div className="form-step">
              <h3>Selecciona Psicólogo y Fecha</h3>
              
              <div className="form-group">
                <label htmlFor="psicologoId">Psicólogo</label>
                <select
                  id="psicologoId"
                  name="psicologoId"
                  value={formData.psicologoId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecciona un psicólogo</option>
                  {psicologos.map(psicologo => (
                    <option key={psicologo.id} value={psicologo.id}>
                      {psicologo.nombre} - {psicologo.especialidad}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="fecha">Fecha</label>
                <input
                  type="date"
                  id="fecha"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleInputChange}
                  min={getTomorrowDate()}
                  max={getMaxDate()}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="modalidad">Modalidad</label>
                <select
                  id="modalidad"
                  name="modalidad"
                  value={formData.modalidad}
                  onChange={handleInputChange}
                >
                  <option value="presencial">Presencial</option>
                  <option value="virtual">Virtual</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleNextStep} className="btn-next">
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-step">
              <h3>Selecciona Horario</h3>
              
              <div className="selected-info">
                <p><strong>Psicólogo:</strong> {psicologos.find(p => p.id == formData.psicologoId)?.nombre}</p>
                <p><strong>Fecha:</strong> {new Date(formData.fecha).toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
                <p><strong>Modalidad:</strong> {formData.modalidad}</p>
              </div>

              {loading ? (
                <div className="loading-horarios">
                  <div className="loading-spinner"></div>
                  <p>Cargando horarios disponibles...</p>
                </div>
              ) : (
                <div className="horarios-grid">
                  {horariosDisponibles.length > 0 ? (
                    horariosDisponibles.map((slot, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`horario-slot ${formData.hora === slot.hora ? 'selected' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, hora: slot.hora }))}
                      >
                        {slot.hora}
                      </button>
                    ))
                  ) : (
                    <p className="no-horarios">No hay horarios disponibles para esta fecha.</p>
                  )}
                </div>
              )}

              <div className="form-actions">
                <button type="button" onClick={handlePrevStep} className="btn-prev">
                  Anterior
                </button>
                <button 
                  type="button" 
                  onClick={handleNextStep} 
                  className="btn-next"
                  disabled={!formData.hora}
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-step">
              <h3>Detalles de la Cita</h3>
              
              <div className="cita-summary">
                <h4>Resumen de tu cita:</h4>
                <div className="summary-item">
                  <span className="label">Psicólogo:</span>
                  <span className="value">{psicologos.find(p => p.id == formData.psicologoId)?.nombre}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Fecha:</span>
                  <span className="value">{new Date(formData.fecha).toLocaleDateString('es-ES')}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Hora:</span>
                  <span className="value">{formData.hora}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Modalidad:</span>
                  <span className="value">{formData.modalidad}</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="tipoCita">Tipo de Cita</label>
                <select
                  id="tipoCita"
                  name="tipoCita"
                  value={formData.tipoCita}
                  onChange={handleInputChange}
                >
                  <option value="consulta">Consulta General</option>
                  <option value="primera_vez">Primera Vez</option>
                  <option value="seguimiento">Seguimiento</option>
                  <option value="evaluacion">Evaluación</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="motivo">Motivo de la Consulta</label>
                <textarea
                  id="motivo"
                  name="motivo"
                  value={formData.motivo}
                  onChange={handleInputChange}
                  placeholder="Describe brevemente el motivo de tu consulta..."
                  rows={4}
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={handlePrevStep} className="btn-prev">
                  Anterior
                </button>
                <button 
                  type="submit" 
                  className="btn-submit"
                  disabled={loading}
                >
                  {loading ? 'Enviando...' : 'Solicitar Cita'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SolicitarCitaNueva;
