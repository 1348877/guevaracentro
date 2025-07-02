import React, { useEffect } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';
import DrAlbertoProfile from '../components/DrAlbertoProfile';
import MobileWarning from '../components/MobileWarning';

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    window.onerror = (msg, url, line, col, error) => {
      console.error('Error global en App:', msg, url, line, col, error);
    };
    return () => { window.onerror = null; };
  }, []);

  return (
    <div className="home-container">
      <MobileWarning />
      {/* SOLO HERO SECTION PARA PRUEBA */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Centro Psicológico
            <span className="hero-accent">Integral Guevara</span>
          </h1>
          <p className="hero-subtitle">
            Acompañándote en tu bienestar mental y emocional con un enfoque integral 
            que combina psicología clínica, coaching profesional y PNL
          </p>
          <div className="hero-actions">
            <button 
              className="btn-primary-hero"
              onClick={() => navigate('/solicitar-cita')}
            >
              Solicitar Cita
            </button>
            <button 
              className="btn-secondary-hero"
              onClick={() => navigate('/nosotros')}
            >
              Conoce Más
            </button>
          </div>
          <div className="hero-info">
            <div className="info-item">
              <span className="info-icon">📍</span>
              <span>Independencia 211, Juliaca</span>
            </div>
            <div className="info-item">
              <span className="info-icon">📞</span>
              <span>962 376 425</span>
            </div>
            <div className="info-item">
              <span className="info-icon">💻</span>
              <span>Presencial y Virtual</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="services-preview">
        <div className="section-container">
          <h2 className="section-title">Servicios Especializados</h2>
          <p className="section-subtitle">
            Ofrecemos atención integral con metodologías modernas y enfoques personalizados 
            para cada etapa de tu proceso de bienestar mental
          </p>
          <div className="services-grid">
            <div className="service-card" onClick={() => navigate('/servicios')}>
              <div className="service-icon">🧠</div>
              <h3>Psicoterapia Individual</h3>
              <p>Tratamiento especializado para ansiedad, depresión, trastornos del estado de ánimo y desarrollo personal</p>
              <div className="service-features">
                <span>• Terapia Cognitivo Conductual</span>
                <span>• Técnicas de relajación</span>
                <span>• Sesiones presenciales y virtuales</span>
              </div>
            </div>
            <div className="service-card" onClick={() => navigate('/servicios')}>
              <div className="service-icon">💑</div>
              <h3>Terapia de Pareja</h3>
              <p>Fortalecimiento de relaciones con metodología "Discutir con Estilo" y comunicación asertiva</p>
              <div className="service-features">
                <span>• Resolución de conflictos</span>
                <span>• Comunicación efectiva</span>
                <span>• Reconstrucción de vínculos</span>
              </div>
            </div>
            <div className="service-card" onClick={() => navigate('/servicios')}>
              <div className="service-icon">🎯</div>
              <h3>Coaching con PNL</h3>
              <p>Desarrollo personal y profesional con Programación Neurolingüística y técnicas de vanguardia</p>
              <div className="service-features">
                <span>• Cambio de patrones limitantes</span>
                <span>• Objetivos y metas claras</span>
                <span>• Liderazgo y motivación</span>
              </div>
            </div>
          </div>
          <div className="services-cta">
            <button 
              className="btn-view-all"
              onClick={() => navigate('/servicios')}
            >
              Ver Todos los Servicios
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <h2 className="section-title">¿Por qué elegir nuestro centro?</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">👨‍⚕️</div>
              <h3>Experiencia Comprobada</h3>
              <p>5+ años de experiencia en psicología clínica con especialización en PNL y coaching profesional</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📱</div>
              <h3>Modalidad Flexible</h3>
              <p>Sesiones presenciales en Juliaca y virtuales para mayor comodidad y accesibilidad</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🏥</div>
              <h3>Respaldo Institucional</h3>
              <p>Experiencia en Clínica Americana de Juliaca y membresía activa en AICM</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔬</div>
              <h3>Métodos Científicos</h3>
              <p>Aplicación de técnicas basadas en evidencia y enfoques terapéuticos modernos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-container">
          <h2 className="section-title">Lo que dicen nuestros pacientes</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"El Dr. Guevara me ayudó a superar mi ansiedad con técnicas que realmente funcionan. Su enfoque profesional y empático hizo toda la diferencia en mi proceso de recuperación."</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">ME</div>
                  <div className="testimonial-info">
                    <strong>María Elena</strong>
                    <span>Paciente - Terapia Individual</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Las sesiones de coaching con PNL transformaron mi perspectiva profesional. Logré metas que parecían imposibles y desarrollé herramientas para el éxito continuo."</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">CM</div>
                  <div className="testimonial-info">
                    <strong>Carlos Mendoza</strong>
                    <span>Coaching Empresarial</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"La terapia de pareja nos enseñó a comunicarnos de manera efectiva. Aprendimos a 'discutir con estilo' y fortalecimos nuestra relación significativamente."</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">A&J</div>
                  <div className="testimonial-info">
                    <strong>Ana y Jorge</strong>
                    <span>Terapia de Pareja</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Preview - Enhanced Premium Doctor Profile */}
      <section className="about-preview">
        <div className="section-container">
          <h2 className="section-title">Dirección Médica de Excelencia</h2>
          <p className="section-subtitle">Conoce al profesional detrás del Centro Psicológico Integral Guevara</p>
          
          <DrAlbertoProfile />
          
          <div className="about-stats-container">
            <div className="about-stats">
              <div className="stat-item">
                <span className="stat-number">5+</span>
                <span className="stat-label">Años de Experiencia Clínica</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">2</span>
                <span className="stat-label">Títulos de Posgrado</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">300+</span>
                <span className="stat-label">Pacientes Atendidos</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">2021</span>
                <span className="stat-label">Publicación de Investigación</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <div className="section-container">
          <h2 className="section-title">¿Necesitas ayuda profesional?</h2>
          <div className="actions-grid">
            <div className="action-card emergency" onClick={() => navigate('/contacto')}>
              <div className="action-icon">🚨</div>
              <h3>Situación de Emergencia</h3>
              <p>Contacto inmediato para crisis emocionales</p>
              <span className="action-link">Contactar Ahora</span>
            </div>
            <div className="action-card appointment" onClick={() => navigate('/solicitar-cita')}>
              <div className="action-icon">📅</div>
              <h3>Agendar Consulta</h3>
              <p>Solicita tu cita presencial o virtual</p>
              <span className="action-link">Solicitar Cita</span>
            </div>
            <div className="action-card info" onClick={() => navigate('/blog')}>
              <div className="action-icon">📚</div>
              <h3>Recursos y Blog</h3>
              <p>Artículos especializados y herramientas</p>
              <span className="action-link">Explorar</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="contact-cta">
        <div className="section-container">
          <div className="cta-content">
            <h2>¿Listo para comenzar tu proceso de bienestar?</h2>
            <p>Te acompañamos en cada paso hacia una vida más plena y equilibrada</p>
            <div className="cta-actions">
              <button 
                className="btn-primary-cta"
                onClick={() => navigate('/solicitar-cita')}
              >
                Solicitar Primera Cita
              </button>
              <button 
                className="btn-secondary-cta"
                onClick={() => navigate('/contacto')}
              >
                Más Información
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
