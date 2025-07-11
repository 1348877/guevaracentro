import React from 'react';
import './Servicios.css';

export default function Servicios() {
  return (
    <div className="servicios-container">
      <div className="servicios-hero">
        <h1>Nuestros Servicios</h1>
        <p className="servicios-subtitle">
          Atención psicológica integral con enfoque personalizado. Modalidades presencial y virtual.
        </p>
      </div>

      <div className="servicios-tabla">
        <div className="tabla-header">
          <div className="col-servicio">Servicio</div>
          <div className="col-descripcion">Descripción Breve</div>
          <div className="col-modalidad">Modalidad</div>
          <div className="col-duracion">Duración Estimada</div>
          <div className="col-inversion">Inversión (a confirmar)</div>
        </div>

        <div className="tabla-row">
          <div className="col-servicio">
            <h3>Psicoterapia Individual</h3>
          </div>
          <div className="col-descripcion">
            Un espacio confidencial para explorar tus desafíos personales, desarrollar herramientas de afrontamiento y mejorar tu bienestar emocional.
          </div>
          <div className="col-modalidad">
            Presencial (Juliaca) / Virtual
          </div>
          <div className="col-duracion">50 minutos</div>
          <div className="col-inversion">S/ 180.00</div>
        </div>

        <div className="tabla-row">
          <div className="col-servicio">
            <h3>Terapia de Pareja</h3>
          </div>
          <div className="col-descripcion">
            Un entorno estructurado para mejorar la comunicación, resolver conflictos y fortalecer el vínculo afectivo en la relación.
          </div>
          <div className="col-modalidad">
            Presencial (Juliaca) / Virtual
          </div>
          <div className="col-duracion">60 minutos</div>
          <div className="col-inversion">S/ 220.00</div>
        </div>

        <div className="tabla-row">
          <div className="col-servicio">
            <h3>Sesión de Coaching (PNL)</h3>
          </div>
          <div className="col-descripcion">
            Un proceso dinámico y enfocado en metas para superar limitaciones, potenciar tus recursos y alcanzar tu máximo potencial personal o profesional.
          </div>
          <div className="col-modalidad">
            Presencial (Juliaca) / Virtual
          </div>
          <div className="col-duracion">50 minutos</div>
          <div className="col-inversion">S/ 180.00</div>
        </div>

        <div className="tabla-row">
          <div className="col-servicio">
            <h3>Evaluación Inicial</h3>
          </div>
          <div className="col-descripcion">
            Una primera sesión para conocer tu caso, definir objetivos terapéuticos y establecer un plan de trabajo personalizado.
          </div>
          <div className="col-modalidad">
            Presencial (Juliaca) / Virtual
          </div>
          <div className="col-duracion">60 minutos</div>
          <div className="col-inversion">S/ 180.00</div>
        </div>
      </div>

      <div className="servicios-cta">
        <h2>¿Listo para comenzar tu proceso de bienestar?</h2>
        <p>Contáctanos para agendar tu primera sesión y dar el primer paso hacia el cambio positivo.</p>
        <button className="btn-agendar">Agendar Cita</button>
      </div>

      <div className="servicios-notas">
        <h3>Información Importante</h3>
        <ul>
          <li>Todas las sesiones son estrictamente confidenciales</li>
          <li>Modalidad virtual disponible para toda la región de Puno</li>
          <li>Enfoque integral: psicología clínica + coaching con PNL</li>
          <li>Primera consulta incluye evaluación y plan de trabajo personalizado</li>
        </ul>
      </div>
    </div>
  );
}
