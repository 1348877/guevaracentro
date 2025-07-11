import React from 'react';
import './AnalisisCompetencia.css';

export default function AnalisisCompetencia() {
  const competidores = [
    {
      nombre: "Sana Clínica Psicológica",
      ubicacion: "Jr. San Román, Juliaca",
      servicios: "Psicología general, ansiedad, depresión",
      presenciaDigital: "No se encontró sitio web o redes activas",
      diferenciador: "Marca enfocada en la seguridad y confidencialidad",
      implicaciones: "Oportunidad de superar su presencia digital con un sitio web completo y profesional"
    },
    {
      nombre: "Centro \"Libérate\"",
      ubicacion: "Loreto 273, Juliaca",
      servicios: "Psicoterapia individual, pareja, familia; Psicoprofilaxis",
      presenciaDigital: "No se encontró sitio web o redes activas",
      diferenciador: "Alta especialización de la directora (Psicoterapia Sistémica)",
      implicaciones: "Posicionarse como el experto en terapia individual para adultos y coaching, un nicho complementario"
    },
    {
      nombre: "Ps. Lisbeth L. Chambi Q.",
      ubicacion: "Ramón Castilla, Juliaca",
      servicios: "Neurodesarrollo infantil (TEA, TDAH)",
      presenciaDigital: "No se encontró sitio web o redes activas",
      diferenciador: "Nicho de mercado muy específico (infantil)",
      implicaciones: "No es un competidor directo para la terapia de adultos, lo que clarifica el mercado objetivo"
    },
    {
      nombre: "Psicologiaymente.com",
      ubicacion: "En línea (Nacional)",
      servicios: "Directorio de psicólogos, terapia online",
      presenciaDigital: "Sitio web robusto, fuerte SEO",
      diferenciador: "Amplia variedad de profesionales y precios",
      implicaciones: "Competencia directa en búsquedas online. Se requiere un fuerte SEO local (\"en Juliaca\") para destacar"
    }
  ];

  return (
    <div className="analisis-container">
      <div className="analisis-hero">
        <h1>Análisis de Competencia</h1>
        <p className="analisis-subtitle">
          Panorama competitivo del mercado de salud mental en Juliaca y estrategias de diferenciación
        </p>
      </div>

      <div className="analisis-content">
        <div className="introduccion">
          <h2>Situación del Mercado</h2>
          <p>
            El mercado de servicios psicológicos en Juliaca presenta una oportunidad única. 
            Mientras existe demanda creciente de servicios de salud mental, la mayoría de competidores 
            locales carece de presencia digital sólida, creando una ventana estratégica para el 
            Centro Psicológico Integral Guevara.
          </p>
        </div>

        <div className="competidores-tabla">
          <h3>Análisis Detallado de Competidores</h3>
          <div className="tabla-competidores">
            <div className="tabla-header-comp">
              <div className="col-nombre">Competidor</div>
              <div className="col-ubicacion">Ubicación/Dirección</div>
              <div className="col-servicios">Servicios Clave/Especialidades</div>
              <div className="col-digital">Presencia Digital</div>
              <div className="col-diferenciador">Diferenciador Identificado</div>
              <div className="col-implicaciones">Implicaciones Estratégicas para Guevara</div>
            </div>

            {competidores.map((comp, index) => (
              <div key={index} className="tabla-row-comp">
                <div className="col-nombre">
                  <h4>{comp.nombre}</h4>
                </div>
                <div className="col-ubicacion">{comp.ubicacion}</div>
                <div className="col-servicios">{comp.servicios}</div>
                <div className="col-digital">{comp.presenciaDigital}</div>
                <div className="col-diferenciador">{comp.diferenciador}</div>
                <div className="col-implicaciones">{comp.implicaciones}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="ventajas-competitivas">
          <h2>Nuestras Ventajas Competitivas</h2>
          <div className="ventajas-grid">
            <div className="ventaja-item">
              <h4>🎯 Enfoque Integral Único</h4>
              <p>
                Somos los únicos en Juliaca que combinan psicología clínica, coaching y PNL 
                en un enfoque metodológico coherente y diferenciado.
              </p>
            </div>
            
            <div className="ventaja-item">
              <h4>🌐 Presencia Digital Profesional</h4>
              <p>
                Mientras la competencia local carece de presencia online, nosotros ofrecemos 
                una plataforma web completa, moderna y optimizada para SEO.
              </p>
            </div>
            
            <div className="ventaja-item">
              <h4>📚 Respaldo Académico</h4>
              <p>
                Formación de maestría en gestión de servicios de salud y experiencia 
                en investigación académica que respalda nuestra práctica.
              </p>
            </div>
            
            <div className="ventaja-item">
              <h4>🏥 Experiencia Institucional</h4>
              <p>
                Asociación con la prestigiosa Clínica Americana de Juliaca, 
                que transfiere credibilidad y confianza por solidez institucional.
              </p>
            </div>
            
            <div className="ventaja-item">
              <h4>🔗 Modalidad Híbrida</h4>
              <p>
                Oferta dual presencial y virtual que expande nuestro mercado 
                más allá de Juliaca hacia toda la región de Puno.
              </p>
            </div>
            
            <div className="ventaja-item">
              <h4>🎨 Comprensión Local</h4>
              <p>
                Profundo conocimiento de las necesidades específicas de salud mental 
                de la comunidad de Juliaca y región de Puno.
              </p>
            </div>
          </div>
        </div>

        <div className="estrategia-posicionamiento">
          <h2>Estrategia de Posicionamiento</h2>
          <div className="estrategia-content">
            <div className="posicionamiento-item">
              <h4>Propuesta Única de Venta (PUV)</h4>
              <p>
                "El único centro en Juliaca que fusiona el rigor científico de la psicología clínica 
                con el poder transformador del coaching con PNL, dirigido por un profesional con 
                experiencia institucional y comprensión profunda de las necesidades de nuestra comunidad."
              </p>
            </div>
            
            <div className="posicionamiento-item">
              <h4>Palabras Clave Estratégicas</h4>
              <ul>
                <li>"psicólogo en Juliaca"</li>
                <li>"terapia psicológica Juliaca"</li>
                <li>"centro psicológico Puno"</li>
                <li>"coach PNL Juliaca"</li>
                <li>"terapia de pareja Puno"</li>
                <li>"ayuda para ansiedad Juliaca"</li>
              </ul>
            </div>
            
            <div className="posicionamiento-item">
              <h4>Diferenciación en el Mercado</h4>
              <p>
                Mientras los competidores se enfocan en servicios tradicionales, nosotros 
                nos posicionamos como el centro "integral" que no solo trata problemas, 
                sino que construye activamente herramientas para el futuro y el crecimiento personal.
              </p>
            </div>
          </div>
        </div>

        <div className="conclusiones">
          <h2>Conclusiones y Oportunidades</h2>
          <div className="conclusion-grid">
            <div className="conclusion-item favorable">
              <h4>✅ Oportunidades Identificadas</h4>
              <ul>
                <li>Vacío digital en competencia local</li>
                <li>Nicho de coaching + PNL sin explotar</li>
                <li>Demanda creciente de servicios virtuales</li>
                <li>Necesidades específicas de la región sin atender</li>
              </ul>
            </div>
            
            <div className="conclusion-item desafio">
              <h4>⚠️ Desafíos a Considerar</h4>
              <ul>
                <li>Competencia online nacional establecida</li>
                <li>Necesidad de educación del mercado sobre PNL</li>
                <li>Construcción de confianza desde cero</li>
                <li>Diferenciación clara del coaching vs psicología</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
