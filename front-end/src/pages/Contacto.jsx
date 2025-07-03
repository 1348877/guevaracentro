import React, { useState } from 'react';
import './Contacto.css';

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí se integrará con el backend
    console.log('Formulario enviado:', formData);
    alert('Mensaje enviado. Nos pondremos en contacto contigo pronto.');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="page-wrapper">
      <div className="contacto-container">
        <div className="contacto-hero">
          <h1>Contacto</h1>
          <p className="contacto-subtitle">
            Estamos aquí para apoyarte. Contáctanos y da el primer paso hacia tu bienestar.
          </p>
        </div>

      <div className="contacto-content">
        <div className="contacto-info">
          <div className="info-card">
            <h3>📍 Ubicación</h3>
            <p><strong>Dirección:</strong> Independencia 211, Juliaca, Puno</p>
            <p><strong>Referencia:</strong> Centro de la ciudad</p>
          </div>

          <div className="info-card">
            <h3>📞 Teléfono</h3>
            <p><strong>Principal:</strong> 977 527 381</p>
            <p><strong>WhatsApp:</strong> Disponible</p>
            <p><strong>Horario:</strong> Lunes a Sábado, 8:00 AM - 7:00 PM</p>
          </div>

          <div className="info-card">
            <h3>✉️ Email</h3>
            <p><strong>Contacto:</strong> alberto.guevara.ps@gmail.com</p>
            <p><strong>Citas:</strong> Agendar por teléfono o WhatsApp</p>
          </div>

          <div className="info-card">
            <h3>🌐 Modalidades</h3>
            <p><strong>Presencial:</strong> En nuestro consultorio en Juliaca</p>
            <p><strong>Virtual:</strong> Videollamada para toda la región</p>
            <p><strong>Cobertura:</strong> Puno y nivel nacional (virtual)</p>
          </div>
        </div>

        <div className="contacto-form-section">
          <h2>Envíanos un Mensaje</h2>
          <form className="contacto-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre Completo *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder="Tu nombre completo"
              />
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

            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Tu número de teléfono"
              />
            </div>

            <div className="form-group">
              <label htmlFor="mensaje">Mensaje *</label>
              <textarea
                id="mensaje"
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                required
                rows="5"
                placeholder="Cuéntanos cómo podemos ayudarte..."
              ></textarea>
            </div>

            <button type="submit" className="btn-enviar">
              Enviar Mensaje
            </button>
          </form>
        </div>
      </div>

      <div className="mapa-section">
        <h2>Encuéntranos</h2>
        <div className="mapa-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3840.5274!2d-70.1357!3d-15.4905!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9167f316c9b6c33f%3A0x4c5b6b5b6b5b6b5b!2sIndependencia%20211%2C%20Juliaca%2021101%2C%20Per%C3%BA!5e0!3m2!1ses!2spe!4v1640995200000!5m2!1ses!2spe"
            width="100%"
            height="350"
            style={{ border: 0, borderRadius: '12px' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Centro Psicológico Integral Guevara - Independencia 211, Juliaca"
          ></iframe>
        </div>
        <p className="mapa-descripcion">
          📍 <strong>Independencia 211, Juliaca, Puno</strong><br/>
          Ubicación céntrica de fácil acceso • A pocos minutos del centro de la ciudad<br/>
          <small>Atención presencial y virtual disponible</small>
        </p>
      </div>

      <div className="urgencias-section">
        <h3>⚠️ En Caso de Emergencia</h3>
        <p>
          Si experimentas pensamientos de autolesión o crisis emocional severa, 
          busca ayuda inmediata en el servicio de emergencias más cercano o contacta:
        </p>
        <ul>
          <li><strong>Línea de Prevención del Suicidio:</strong> 113 (gratuito, 24 horas)</li>
          <li><strong>Emergencias:</strong> 105 (Policía Nacional)</li>
          <li><strong>Centro de Emergencias Mujer:</strong> 100 (gratuito, 24 horas)</li>
        </ul>
      </div>
    </div>
    </div>
  );
}
