import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SolicitarCita.css';

export default function SolicitarCita() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Paso 1: Datos personales básicos
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    edad: '',
    // Paso 2: Información de la consulta
    modalidad: '',
    servicioInteres: '',
    motivoConsulta: '',
    experienciaPrevia: '',
    // Paso 3: Preferencias de horario
    fechaPreferida: '',
    horaPreferida: '',
    expectativas: '',
    // Paso 4: Consentimiento
    aceptaTerminos: false,
    aceptaPrivacidad: false
  });

  const serviciosDisponibles = [
    'Psicoterapia Individual',
    'Terapia de Pareja',
    'Coaching Profesional con PNL',
    'Evaluación Psicológica Inicial',
    'Acompañamiento en Duelo',
    'Consulta para Ansiedad/Depresión'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que se acepten términos
    if (!formData.aceptaTerminos || !formData.aceptaPrivacidad) {
      alert('Debes aceptar los términos y condiciones y la política de privacidad para continuar.');
      return;
    }

    try {
      // Aquí se enviará la solicitud al backend
      console.log('Solicitud de cita enviada:', formData);
      
      // Simular envío exitoso
      alert('¡Solicitud enviada exitosamente! Te contactaremos dentro de las próximas 24 horas para confirmar tu cita.');
      
      // Redirigir o limpiar formulario
      navigate('/');
    } catch (error) {
      alert('Error al enviar la solicitud. Por favor, inténtalo de nuevo o contáctanos directamente.');
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.nombres && formData.apellidos && formData.email && formData.telefono && formData.edad;
      case 2:
        return formData.modalidad && formData.servicioInteres && formData.motivoConsulta;
      case 3:
        return formData.fechaPreferida && formData.horaPreferida;
      case 4:
        return formData.aceptaTerminos && formData.aceptaPrivacidad;
      default:
        return false;
    }
  };

  return (
    <div className="solicitar-cita-container">
      <div className="solicitar-cita-header">
        <h1>Solicitar Cita</h1>
        <p className="solicitar-subtitle">
          Completa este formulario y nos pondremos en contacto contigo para confirmar tu cita
        </p>
        
        {/* Indicador de progreso */}
        <div className="progress-indicator">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
          <div className="step-labels">
            <span className={step >= 1 ? 'active' : ''}>Datos Personales</span>
            <span className={step >= 2 ? 'active' : ''}>Información de Consulta</span>
            <span className={step >= 3 ? 'active' : ''}>Horarios Preferidos</span>
            <span className={step >= 4 ? 'active' : ''}>Confirmación</span>
          </div>
        </div>
      </div>

      <form className="solicitar-form" onSubmit={handleSubmit}>
        {/* Paso 1: Datos Personales */}
        {step === 1 && (
          <div className="form-step">
            <h2>Datos Personales</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nombres">Nombres *</label>
                <input
                  type="text"
                  id="nombres"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  required
                  placeholder="Tus nombres"
                />
              </div>
              <div className="form-group">
                <label htmlFor="apellidos">Apellidos *</label>
                <input
                  type="text"
                  id="apellidos"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  required
                  placeholder="Tus apellidos"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="tu@email.com"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="telefono">Teléfono/WhatsApp *</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  placeholder="962 376 425"
                />
              </div>
              <div className="form-group">
                <label htmlFor="edad">Edad *</label>
                <input
                  type="number"
                  id="edad"
                  name="edad"
                  value={formData.edad}
                  onChange={handleChange}
                  required
                  min="18"
                  max="100"
                  placeholder="25"
                />
              </div>
            </div>
          </div>
        )}

        {/* Paso 2: Información de Consulta */}
        {step === 2 && (
          <div className="form-step">
            <h2>Información de Consulta</h2>
            
            <div className="form-group">
              <label>Modalidad de Atención *</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="modalidad"
                    value="presencial"
                    checked={formData.modalidad === 'presencial'}
                    onChange={handleChange}
                  />
                  <span>Presencial en Juliaca</span>
                  <small>Independencia 211, Juliaca 21104</small>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="modalidad"
                    value="virtual"
                    checked={formData.modalidad === 'virtual'}
                    onChange={handleChange}
                  />
                  <span>Virtual (Videollamada)</span>
                  <small>Desde cualquier lugar</small>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="servicioInteres">Servicio de Interés *</label>
              <select
                id="servicioInteres"
                name="servicioInteres"
                value={formData.servicioInteres}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un servicio</option>
                {serviciosDisponibles.map((servicio, index) => (
                  <option key={index} value={servicio}>{servicio}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="motivoConsulta">Motivo de la Consulta *</label>
              <textarea
                id="motivoConsulta"
                name="motivoConsulta"
                value={formData.motivoConsulta}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Describe brevemente qué te lleva a buscar apoyo psicológico..."
              ></textarea>
              <small>Esta información nos ayuda a preparar mejor tu primera sesión</small>
            </div>

            <div className="form-group">
              <label htmlFor="experienciaPrevia">¿Has tenido experiencia previa con terapia psicológica?</label>
              <select
                id="experienciaPrevia"
                name="experienciaPrevia"
                value={formData.experienciaPrevia}
                onChange={handleChange}
              >
                <option value="">Selecciona una opción</option>
                <option value="no">No, es mi primera vez</option>
                <option value="si-positiva">Sí, y fue una experiencia positiva</option>
                <option value="si-mixta">Sí, con resultados mixtos</option>
                <option value="si-negativa">Sí, pero no fue una buena experiencia</option>
              </select>
            </div>
          </div>
        )}

        {/* Paso 3: Horarios Preferidos */}
        {step === 3 && (
          <div className="form-step">
            <h2>Horarios Preferidos</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fechaPreferida">Fecha Preferida *</label>
                <input
                  type="date"
                  id="fechaPreferida"
                  name="fechaPreferida"
                  value={formData.fechaPreferida}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
                <small>Te contactaremos para confirmar disponibilidad</small>
              </div>
              <div className="form-group">
                <label htmlFor="horaPreferida">Hora Preferida *</label>
                <select
                  id="horaPreferida"
                  name="horaPreferida"
                  value={formData.horaPreferida}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona una opción</option>
                  <option value="mañana">Mañana (8:00 - 12:00)</option>
                  <option value="tarde">Tarde (12:00 - 18:00)</option>
                  <option value="especifica">Hora específica (indicar en expectativas)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="expectativas">Expectativas y Comentarios Adicionales</label>
              <textarea
                id="expectativas"
                name="expectativas"
                value={formData.expectativas}
                onChange={handleChange}
                rows="3"
                placeholder="¿Qué esperas de las sesiones? ¿Tienes alguna preferencia de horario específica? Cualquier información adicional..."
              ></textarea>
            </div>
          </div>
        )}

        {/* Paso 4: Confirmación */}
        {step === 4 && (
          <div className="form-step">
            <h2>Confirmación y Términos</h2>
            
            <div className="resumen-solicitud">
              <h3>Resumen de tu Solicitud</h3>
              <div className="resumen-item">
                <strong>Nombre:</strong> {formData.nombres} {formData.apellidos}
              </div>
              <div className="resumen-item">
                <strong>Contacto:</strong> {formData.email} | {formData.telefono}
              </div>
              <div className="resumen-item">
                <strong>Servicio:</strong> {formData.servicioInteres}
              </div>
              <div className="resumen-item">
                <strong>Modalidad:</strong> {formData.modalidad === 'presencial' ? 'Presencial en Juliaca' : 'Virtual'}
              </div>
              {formData.fechaPreferida && (
                <div className="resumen-item">
                  <strong>Fecha preferida:</strong> {formData.fechaPreferida}
                </div>
              )}
            </div>

            <div className="terminos-section">
              <div className="checkbox-group">
                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    name="aceptaTerminos"
                    checked={formData.aceptaTerminos}
                    onChange={handleChange}
                    required
                  />
                  <span>Acepto los términos y condiciones del servicio</span>
                </label>
                
                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    name="aceptaPrivacidad"
                    checked={formData.aceptaPrivacidad}
                    onChange={handleChange}
                    required
                  />
                  <span>Acepto la política de privacidad y manejo de datos</span>
                </label>
              </div>

              <div className="info-importante">
                <h4>⚠️ Información Importante</h4>
                <ul>
                  <li>Te contactaremos dentro de las próximas 24 horas para confirmar tu cita</li>
                  <li>Todas las sesiones son estrictamente confidenciales</li>
                  <li>La primera consulta incluye evaluación y plan de trabajo personalizado</li>
                  <li>Puedes cancelar o reprogramar con 24 horas de anticipación</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Botones de navegación */}
        <div className="form-navigation">
          {step > 1 && (
            <button type="button" onClick={handlePrevStep} className="btn-prev">
              ← Anterior
            </button>
          )}
          
          {step < 4 ? (
            <button 
              type="button" 
              onClick={handleNextStep} 
              className="btn-next"
              disabled={!isStepValid()}
            >
              Siguiente →
            </button>
          ) : (
            <button 
              type="submit" 
              className="btn-submit"
              disabled={!isStepValid()}
            >
              Enviar Solicitud
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
