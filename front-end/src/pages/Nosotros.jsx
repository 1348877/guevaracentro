import React from 'react';
import './Nosotros.css';

export default function Nosotros() {
  return (
    <div className="nosotros-container">
      {/* Hero Section Mejorado */}
      <section className="nosotros-hero">
        <div className="hero-content">
          <div className="hero-badge">Excelencia en Salud Mental</div>
          <h1>Centro Psicológico Integral Guevara</h1>
          <p className="nosotros-subtitle">
            Fusionando el rigor científico de la psicología clínica con el poder transformador del coaching y la PNL
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">5+</span>
              <span className="stat-label">Años de Experiencia</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Pacientes Atendidos</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">3</span>
              <span className="stat-label">Especialidades</span>
            </div>
          </div>
        </div>
      </section>

      <div className="nosotros-content">
        {/* Misión y Visión Rediseñadas */}
        <section className="mision-vision">
          <div className="card mision-card">
            <div className="card-icon">🎯</div>
            <h2>Nuestra Misión</h2>
            <p>
              Proveer a la comunidad de Juliaca un soporte psicológico y de coaching comprensivo, empático y basado en la evidencia, 
              fomentando la resiliencia y el crecimiento personal a través de un enfoque integrado del bienestar mental.
            </p>
            <div className="card-highlight">Enfoque Integral</div>
          </div>
          <div className="card vision-card">
            <div className="card-icon">🌟</div>
            <h2>Nuestra Visión</h2>
            <p>
              Ser el centro de referencia líder y de mayor confianza para la atención psicológica integral en la región de Puno, 
              reconocido por nuestra excelencia profesional y nuestro profundo compromiso con el bienestar de nuestros clientes.
            </p>
            <div className="card-highlight">Excelencia Regional</div>
          </div>
        </section>

        {/* Filosofía Integral Mejorada */}
        <section className="filosofia-integral">
          <div className="section-header">
            <h2>Filosofía "Integral": Más que un nombre, una metodología</h2>
            <div className="section-line"></div>
          </div>
          <p className="filosofia-intro">
            Nuestro enfoque integral fusiona el rigor diagnóstico de la psicología clínica con las técnicas proactivas 
            y orientadas a metas del coaching y la PNL. Esta metodología, respaldada por una sólida comprensión del 
            sistema de salud, nos permite no solo explorar el origen de sus desafíos, sino también construir activamente 
            las herramientas para su futuro.
          </p>
          
          <div className="metodologia-grid">
            <div className="metodologia-item psicologia">
              <div className="metodologia-icon">🧠</div>
              <h3>Psicología Clínica</h3>
              <p>Diagnóstico profesional, tratamiento basado en evidencia y comprensión profunda de los procesos mentales.</p>
              <div className="metodologia-features">
                <span>✓ Evaluación profesional</span>
                <span>✓ Tratamiento basado en evidencia</span>
                <span>✓ Seguimiento personalizado</span>
              </div>
            </div>
            <div className="metodologia-item coaching">
              <div className="metodologia-icon">🚀</div>
              <h3>Coaching + PNL</h3>
              <p>Herramientas proactivas para el logro de metas, superación de limitaciones y desarrollo del potencial.</p>
              <div className="metodologia-features">
                <span>✓ Técnicas de PNL</span>
                <span>✓ Desarrollo de potencial</span>
                <span>✓ Logro de objetivos</span>
              </div>
            </div>
            <div className="metodologia-item gestion">
              <div className="metodologia-icon">🏥</div>
              <h3>Gestión en Salud</h3>
              <p>Comprensión integral del sistema de salud para una atención más eficiente y profesional.</p>
              <div className="metodologia-features">
                <span>✓ Gestión profesional</span>
                <span>✓ Procesos optimizados</span>
                <span>✓ Atención integral</span>
              </div>
            </div>
          </div>
        </section>

        {/* Valores Rediseñados */}
        <section className="valores">
          <div className="section-header">
            <h2>Nuestros Valores Fundamentales</h2>
            <div className="section-line"></div>
          </div>
          <div className="valores-grid">
            <div className="valor-item empatia">
              <div className="valor-icon">❤️</div>
              <h4>Empatía</h4>
              <p>Comprensión profunda y genuina de las necesidades de nuestros clientes</p>
            </div>
            <div className="valor-item integridad">
              <div className="valor-icon">🤝</div>
              <h4>Integridad</h4>
              <p>Compromiso ético y transparencia en todos nuestros procesos</p>
            </div>
            <div className="valor-item profesionalismo">
              <div className="valor-icon">🎓</div>
              <h4>Profesionalismo</h4>
              <p>Excelencia técnica y actualización continua en nuestras prácticas</p>
            </div>
            <div className="valor-item resiliencia">
              <div className="valor-icon">💪</div>
              <h4>Resiliencia</h4>
              <p>Fortalecimiento de la capacidad de adaptación y crecimiento</p>
            </div>
            <div className="valor-item confidencialidad">
              <div className="valor-icon">🔒</div>
              <h4>Confidencialidad</h4>
              <p>Absoluto respeto por la privacidad y dignidad de cada persona</p>
            </div>
          </div>
        </section>

        {/* Compromiso con la Comunidad Mejorado */}
        <section className="compromiso-comunidad">
          <div className="compromiso-header">
            <h2>Compromiso con Nuestra Comunidad</h2>
            <div className="compromiso-badge">Juliaca - Puno</div>
          </div>
          <p className="compromiso-intro">
            Como parte integral de la comunidad de Juliaca y la región de Puno, comprendemos profundamente los 
            desafíos específicos que enfrentamos. Nuestro centro no es solo un proveedor de servicios, sino un 
            recurso comunitario comprometido con fomentar la resiliencia colectiva, sanar en tiempos difíciles 
            y construir un futuro de bienestar para nuestra región.
          </p>
          
          <div className="ubicacion-info">
            <div className="ubicacion-header">
              <div className="ubicacion-icon">📍</div>
              <h3>Nuestra Ubicación</h3>
            </div>
            <div className="ubicacion-details">
              <div className="detail-item">
                <strong>Dirección:</strong> Independencia 211, Juliaca, Puno
              </div>
              <div className="detail-item">
                <strong>Modalidades:</strong> Atención presencial y virtual
              </div>
              <div className="detail-item">
                <strong>Cobertura:</strong> Juliaca, región de Puno y modalidad virtual a nivel nacional
              </div>
            </div>
            <div className="contact-actions">
              <button className="btn-contact-primary">Solicitar Cita</button>
              <button className="btn-contact-secondary">Ver Ubicación</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
