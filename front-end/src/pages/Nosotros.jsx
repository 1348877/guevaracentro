import React from 'react';
import './Nosotros.css';

export default function Nosotros() {
  return (
    <div className="nosotros-container">
      <div className="nosotros-hero">
        <h1>Centro Psicológico Integral Guevara</h1>
        <p className="nosotros-subtitle">
          Fusionando el rigor científico de la psicología clínica con el poder transformador del coaching y la PNL
        </p>
      </div>

      <div className="nosotros-content">
        <section className="mision-vision">
          <div className="card">
            <h2>Nuestra Misión</h2>
            <p>
              Proveer a la comunidad de Juliaca un soporte psicológico y de coaching comprensivo, empático y basado en la evidencia, 
              fomentando la resiliencia y el crecimiento personal a través de un enfoque integrado del bienestar mental.
            </p>
          </div>
          
          <div className="card">
            <h2>Nuestra Visión</h2>
            <p>
              Ser el centro de referencia líder y de mayor confianza para la atención psicológica integral en la región de Puno, 
              reconocido por nuestra excelencia profesional y nuestro profundo compromiso con el bienestar de nuestros clientes.
            </p>
          </div>
        </section>

        <section className="filosofia-integral">
          <h2>Filosofía "Integral": Más que un nombre, una metodología</h2>
          <p>
            Nuestro enfoque integral fusiona el rigor diagnóstico de la psicología clínica con las técnicas proactivas 
            y orientadas a metas del coaching y la PNL. Esta metodología, respaldada por una sólida comprensión del 
            sistema de salud, nos permite no solo explorar el origen de sus desafíos, sino también construir activamente 
            las herramientas para su futuro.
          </p>
          
          <div className="metodologia-grid">
            <div className="metodologia-item">
              <h3>Psicología Clínica</h3>
              <p>Diagnóstico profesional, tratamiento basado en evidencia y comprensión profunda de los procesos mentales.</p>
            </div>
            <div className="metodologia-item">
              <h3>Coaching + PNL</h3>
              <p>Herramientas proactivas para el logro de metas, superación de limitaciones y desarrollo del potencial.</p>
            </div>
            <div className="metodologia-item">
              <h3>Gestión en Salud</h3>
              <p>Comprensión integral del sistema de salud para una atención más eficiente y profesional.</p>
            </div>
          </div>
        </section>

        <section className="valores">
          <h2>Nuestros Valores</h2>
          <div className="valores-grid">
            <div className="valor-item">
              <h4>Empatía</h4>
              <p>Comprensión profunda y genuina de las necesidades de nuestros clientes</p>
            </div>
            <div className="valor-item">
              <h4>Integridad</h4>
              <p>Compromiso ético y transparencia en todos nuestros procesos</p>
            </div>
            <div className="valor-item">
              <h4>Profesionalismo</h4>
              <p>Excelencia técnica y actualización continua en nuestras prácticas</p>
            </div>
            <div className="valor-item">
              <h4>Resiliencia</h4>
              <p>Fortalecimiento de la capacidad de adaptación y crecimiento</p>
            </div>
            <div className="valor-item">
              <h4>Confidencialidad</h4>
              <p>Absoluto respeto por la privacidad y dignidad de cada persona</p>
            </div>
          </div>
        </section>

        <section className="compromiso-comunidad">
          <h2>Compromiso con Nuestra Comunidad</h2>
          <p>
            Como parte integral de la comunidad de Juliaca y la región de Puno, comprendemos profundamente los 
            desafíos específicos que enfrentamos. Nuestro centro no es solo un proveedor de servicios, sino un 
            recurso comunitario comprometido con fomentar la resiliencia colectiva, sanar en tiempos difíciles 
            y construir un futuro de bienestar para nuestra región.
          </p>
          
          <div className="ubicacion-info">
            <h3>Nuestra Ubicación</h3>
            <p><strong>Dirección:</strong> Independencia 211, Juliaca, Puno</p>
            <p><strong>Modalidades:</strong> Atención presencial y virtual</p>
            <p><strong>Cobertura:</strong> Juliaca, región de Puno y modalidad virtual a nivel nacional</p>
          </div>
        </section>
      </div>
    </div>
  );
}
