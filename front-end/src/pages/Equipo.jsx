import React from 'react';
import './Equipo.css';

export default function Equipo() {
  return (
    <div className="equipo-container">
      <div className="equipo-hero">
        <h1>Dr. Alberto Emilio Guevara Delgado</h1>
        <p className="equipo-subtitle">
          Excelencia Académica • Innovación Clínica • Liderazgo Científico
        </p>
        <div className="hero-badges">
          <span className="badge">Psicólogo Clínico</span>
          <span className="badge">Magíster en Gestión</span>
          <span className="badge">Coach Profesional PNL</span>
          <span className="badge">Investigador</span>
        </div>
      </div>

      <div className="profesional-profile">
        <div className="profile-header">
          <div className="profile-image">
            <div className="image-placeholder">
              <span>Dr. Alberto Emilio Guevara Delgado</span>
            </div>
          </div>
          
          <div className="profile-info">
            <h2>Dr. Alberto Emilio Guevara Delgado</h2>
            <p className="titulo-principal">
              Psicólogo Clínico • Magíster en Gestión de Servicios de Salud • Coach Profesional PNL
            </p>
            
            <div className="credenciales-principales">
              <div className="credencial-destacada">
                <span className="credencial-icon">🏛️</span>
                <div>
                  <strong>Colegio de Psicólogos del Perú</strong>
                  <p>Colegiatura N° 25961 - CDR III Arequipa y Moquegua</p>
                  <p className="status-vigente">Status: Habilitado (Vigente hasta Dic. 2025)</p>
                </div>
              </div>
              
              <div className="credencial-destacada">
                <span className="credencial-icon">🌍</span>
                <div>
                  <strong>Asociación Internacional de Coaching y Mentoring (AICM)</strong>
                  <p>Miembro N° 13931</p>
                  <p>Especialización: Programación Neurolingüística (PNL)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-content">
          <section className="trayectoria-academica">
            <h3>Trayectoria Académica de Excelencia</h3>
            <div className="timeline-academica">
              <div className="timeline-item">
                <div className="timeline-date">2019-2022</div>
                <div className="timeline-content">
                  <h4>Maestría en Gestión de los Servicios de la Salud</h4>
                  <p><strong>Universidad César Vallejo</strong></p>
                  <p className="detalle-academico">
                    Tesis: <em>"Burnout y Desempeño Laboral en Profesionales de la Salud del Hospital Carlos Monge Medrano de Juliaca, 2022"</em>
                  </p>
                  <p className="logro-destacado">
                    <strong>Logro Destacado:</strong> Investigación pionera en el análisis del síndrome de burnout 
                    en el contexto sanitario regional, estableciendo correlaciones significativas entre bienestar 
                    profesional y calidad asistencial.
                  </p>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-date">2013-2018</div>
                <div className="timeline-content">
                  <h4>Licenciatura en Psicología</h4>
                  <p><strong>Universidad Peruana Unión (UPeU)</strong></p>
                  <p className="detalle-academico">
                    Tesis: <em>"Discutir con Estilo: Programa de Intervención para mejorar los estilos de manejo 
                    de conflictos en parejas del Centro de Salud Mental Comunitario Juliaca, 2018"</em>
                  </p>
                  <p className="logro-destacado">
                    <strong>Innovación Metodológica:</strong> Desarrollo de un programa de intervención original 
                    que integra técnicas de comunicación asertiva con principios de terapia de pareja, 
                    demostrando eficacia clínica significativa.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="perfil-investigador">
            <h3>Perfil como Investigador-Practicante</h3>
            <div className="investigacion-destacada">
              <div className="investigacion-card">
                <span className="inv-icon">🔬</span>
                <h4>Líneas de Investigación Activas</h4>
                <ul>
                  <li><strong>Psicología Organizacional de la Salud:</strong> Burnout, bienestar laboral y desempeño en equipos sanitarios</li>
                  <li><strong>Terapia de Pareja:</strong> Innovación en metodologías de resolución de conflictos relacionales</li>
                  <li><strong>Coaching Aplicado:</strong> Integración de PNL en procesos de desarrollo personal y profesional</li>
                  <li><strong>Salud Mental Comunitaria:</strong> Intervenciones psicosociales en contextos regionales</li>
                </ul>
              </div>
              
              <div className="metodologia-card">
                <span className="met-icon">📊</span>
                <h4>Enfoque Metodológico</h4>
                <p>
                  Especialista en <strong>investigación cuantitativa aplicada</strong>, con dominio avanzado de 
                  análisis estadístico mediante SPSS y metodologías de investigación científica rigurosa. 
                  Su aproximación combina evidencia empírica sólida con aplicación clínica directa, 
                  estableciendo un puente efectivo entre la academia y la práctica profesional.
                </p>
              </div>
            </div>
          </section>

          <section className="especializaciones-clinicas">
            <h3>Especialización Clínica Integral</h3>
            <div className="especializaciones-grid">
              <div className="especializacion-card premium">
                <span className="esp-icon">🧠</span>
                <h4>Psicología Clínica Avanzada</h4>
                <div className="esp-content">
                  <p><strong>Enfoques Terapéuticos:</strong></p>
                  <ul>
                    <li>Terapia Cognitivo-Conductual (TCC)</li>
                    <li>Intervenciones basadas en Mindfulness</li>
                    <li>Terapia de Regulación Emocional</li>
                    <li>Tratamiento especializado de Trauma y TEPT</li>
                  </ul>
                  <p><strong>Poblaciones Especializadas:</strong> Adultos, profesionales de la salud, parejas</p>
                </div>
              </div>
              
              <div className="especializacion-card premium">
                <span className="esp-icon">💑</span>
                <h4>Terapia de Pareja Innovadora</h4>
                <div className="esp-content">
                  <p><strong>Metodología "Discutir con Estilo":</strong></p>
                  <ul>
                    <li>Programa de intervención validado científicamente</li>
                    <li>Técnicas de comunicación asertiva avanzada</li>
                    <li>Resolución constructiva de conflictos</li>
                    <li>Reconstrucción de vínculos emocionales</li>
                  </ul>
                  <p><strong>Resultados Comprobados:</strong> Mejora significativa en estilos de manejo de conflictos</p>
                </div>
              </div>
              
              <div className="especializacion-card premium">
                <span className="esp-icon">🎯</span>
                <h4>Coaching Profesional con PNL</h4>
                <div className="esp-content">
                  <p><strong>Certificación Internacional AICM:</strong></p>
                  <ul>
                    <li>Programación Neurolingüística aplicada</li>
                    <li>Desarrollo de liderazgo ejecutivo</li>
                    <li>Transformación de patrones limitantes</li>
                    <li>Optimización del rendimiento profesional</li>
                  </ul>
                  <p><strong>Especialidad:</strong> Coaching para profesionales de la salud y ejecutivos</p>
                </div>
              </div>
              
              <div className="especializacion-card premium">
                <span className="esp-icon">🏥</span>
                <h4>Psicología Organizacional Sanitaria</h4>
                <div className="esp-content">
                  <p><strong>Área de Experticia Única:</strong></p>
                  <ul>
                    <li>Prevención y tratamiento del Burnout médico</li>
                    <li>Optimización del clima laboral hospitalario</li>
                    <li>Desarrollo de resiliencia organizacional</li>
                    <li>Gestión del estrés en equipos sanitarios</li>
                  </ul>
                  <p><strong>Impacto:</strong> Mejora documentada del bienestar y desempeño profesional</p>
                </div>
              </div>
            </div>
          </section>

          <section className="filosofia-profesional">
            <h3>Filosofía y Enfoque Profesional</h3>
            <div className="filosofia-content">
              <blockquote className="cita-principal">
                <p>"No vale la pena vivir bajo los escombros de lo que pudo haber sido y nunca fue, 
                sal de ahí y vuelve a construir de nuevo"</p>
                <cite>— Dr. Alberto Emilio Guevara Delgado</cite>
              </blockquote>
              
              <div className="principios-grid">
                <div className="principio-item">
                  <span className="principio-icon">�</span>
                  <h4>Evidencia Científica</h4>
                  <p>Cada intervención está respaldada por investigación rigurosa y metodologías validadas empíricamente.</p>
                </div>
                
                <div className="principio-item">
                  <span className="principio-icon">🎯</span>
                  <h4>Enfoque Integral</h4>
                  <p>Integración holística de psicología clínica, coaching profesional y gestión organizacional.</p>
                </div>
                
                <div className="principio-item">
                  <span className="principio-icon">💡</span>
                  <h4>Innovación Continua</h4>
                  <p>Desarrollo constante de nuevas metodologías y adaptación a las necesidades emergentes.</p>
                </div>
                
                <div className="principio-item">
                  <span className="principio-icon">🤝</span>
                  <h4>Compromiso Social</h4>
                  <p>Contribución activa al bienestar comunitario y desarrollo de la psicología regional.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="modalidades-atencion">
            <h3>Modalidades de Atención Profesional</h3>
            <div className="modalidades-grid">
              <div className="modalidad-card">
                <span className="modalidad-icon">🏢</span>
                <h4>Consultas Presenciales</h4>
                <div className="modalidad-details">
                  <p><strong>Ubicación:</strong> Juliaca, Puno</p>
                  <p><strong>Dirección:</strong> Independencia 211</p>
                  <p><strong>Especialidad:</strong> Atención clínica integral y coaching presencial</p>
                  <div className="horarios">
                    <p><strong>Horarios:</strong> Coordinación previa - Flexibilidad profesional</p>
                  </div>
                </div>
              </div>
              
              <div className="modalidad-card">
                <span className="modalidad-icon">💻</span>
                <h4>Terapia Virtual</h4>
                <div className="modalidad-details">
                  <p><strong>Plataforma:</strong> Tecnología segura y confidencial</p>
                  <p><strong>Cobertura:</strong> Nacional e internacional</p>
                  <p><strong>Ventajas:</strong> Accesibilidad, flexibilidad horaria, seguimiento continuo</p>
                  <div className="tecnologia">
                    <p><strong>Garantía:</strong> Confidencialidad y privacidad total</p>
                  </div>
                </div>
              </div>
              
              <div className="modalidad-card">
                <span className="modalidad-icon">🎯</span>
                <h4>Coaching Ejecutivo</h4>
                <div className="modalidad-details">
                  <p><strong>Modalidad:</strong> Presencial y virtual</p>
                  <p><strong>Duración:</strong> Programas personalizados</p>
                  <p><strong>Especialidad:</strong> Liderazgo, desarrollo profesional, gestión del estrés</p>
                  <div className="coaching-features">
                    <p><strong>Metodología:</strong> PNL + Coaching científico</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="contacto-profesional">
            <h3>Contacto Directo</h3>
            <div className="contacto-info">
              <div className="contacto-item">
                <span className="contacto-icon">📞</span>
                <div>
                  <h4>Teléfono Directo</h4>
                  <p className="contacto-dato">962 376 425</p>
                  <p className="contacto-descripcion">Atención directa y coordinación de citas</p>
                </div>
              </div>
              
              <div className="contacto-item">
                <span className="contacto-icon">📧</span>
                <div>
                  <h4>Email Profesional</h4>
                  <p className="contacto-dato">alberto.guevara.ps@gmail.com</p>
                  <p className="contacto-descripcion">Consultas, información y coordinación</p>
                </div>
              </div>
              
              <div className="contacto-item">
                <span className="contacto-icon">⏰</span>
                <div>
                  <h4>Disponibilidad</h4>
                  <p className="contacto-dato">Lunes a Sábado</p>
                  <p className="contacto-descripcion">Horarios flexibles según necesidades del paciente</p>
                </div>
              </div>
            </div>
          </section>

          <section className="credenciales-completas">
            <h3>Credenciales y Membresías Profesionales</h3>
            <div className="credenciales-grid">
              <div className="credencial-card oficial">
                <span className="cred-icon">🏛️</span>
                <h4>Colegio de Psicólogos del Perú</h4>
                <p><strong>Colegiatura N° 25961</strong></p>
                <p>Consejo Directivo Regional III - Arequipa y Moquegua</p>
                <p className="vigencia">Habilitado hasta Diciembre 2025</p>
              </div>
              
              <div className="credencial-card internacional">
                <span className="cred-icon">🌍</span>
                <h4>Asociación Internacional de Coaching y Mentoring</h4>
                <p><strong>Miembro N° 13931</strong></p>
                <p>Especialización en Programación Neurolingüística (PNL)</p>
                <p className="certificacion">Certificación Internacional Vigente</p>
              </div>
              
              <div className="credencial-card academica">
                <span className="cred-icon">🎓</span>
                <h4>Credenciales Académicas</h4>
                <p><strong>Magíster en Gestión de Servicios de Salud</strong></p>
                <p>Universidad César Vallejo</p>
                <p className="especializacion">Investigación en Burnout y Desempeño Laboral</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
