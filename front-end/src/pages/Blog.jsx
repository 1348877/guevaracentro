import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Blog.css';

export default function Blog() {
  const navigate = useNavigate();
  
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (email) {
      // Simular envío del newsletter
      alert('¡Gracias por suscribirte! Recibirás nuestros artículos más recientes en tu correo.');
      e.target.reset();
    }
  };
  
  const articulos = [
    {
      id: 1,
      titulo: "Manejando la Ansiedad en Tiempos de Incertidumbre en Puno",
      resumen: "Herramientas prácticas para enfrentar la ansiedad en el contexto social actual de nuestra región.",
      fechaPublicacion: "15 de Junio, 2025",
      tiempoLectura: "5 min",
      categoria: "Ansiedad",
      autor: "Lic. Alberto Guevara"
    },
    {
      id: 2,
      titulo: "El Camino del Duelo: Herramientas para Sanar en Comunidad",
      resumen: "Cómo procesar el duelo colectivo y encontrar caminos hacia la sanación emocional en nuestra comunidad.",
      fechaPublicacion: "8 de Junio, 2025",
      tiempoLectura: "7 min",
      categoria: "Duelo",
      autor: "Lic. Alberto Guevara"
    },
    {
      id: 3,
      titulo: "¿Psicología o Coaching? Entendiendo qué Enfoque es para Ti",
      resumen: "Una guía clara para entender las diferencias y beneficios de cada metodología según tus necesidades.",
      fechaPublicacion: "1 de Junio, 2025",
      tiempoLectura: "4 min",
      categoria: "Educación",
      autor: "Lic. Alberto Guevara"
    },
    {
      id: 4,
      titulo: "Construyendo Resiliencia: Fortaleciendo Nuestra Capacidad de Adaptación",
      resumen: "Estrategias basadas en PNL para desarrollar resiliencia y enfrentar los desafíos con mayor fortaleza.",
      fechaPublicacion: "25 de Mayo, 2025",
      tiempoLectura: "6 min",
      categoria: "Desarrollo Personal",
      autor: "Lic. Alberto Guevara"
    },
    {
      id: 5,
      titulo: "Comunicación en Pareja: Discutir con Estilo y Respeto",
      resumen: "Técnicas efectivas para mejorar la comunicación en la relación y resolver conflictos constructivamente.",
      fechaPublicacion: "18 de Mayo, 2025",
      tiempoLectura: "5 min",
      categoria: "Relaciones",
      autor: "Lic. Alberto Guevara"
    },
    {
      id: 6,
      titulo: "La Importancia de la Salud Mental en el Trabajo",
      resumen: "Cómo mantener el bienestar emocional en el entorno laboral y prevenir el burnout.",
      fechaPublicacion: "10 de Mayo, 2025",
      tiempoLectura: "4 min",
      categoria: "Bienestar Laboral",
      autor: "Lic. Alberto Guevara"
    }
  ];

  return (
    <div className="blog-container">
      <div className="blog-hero">
        <h1>Blog y Recursos</h1>
        <p className="blog-subtitle">
          Artículos especializados y recursos para tu bienestar emocional y crecimiento personal
        </p>
      </div>

      <div className="blog-content">
        <div className="blog-intro">
          <h2>Contenido Especializado para Nuestra Comunidad</h2>
          <p>
            Nuestros artículos están diseñados específicamente para abordar las necesidades 
            y desafíos de la comunidad de Juliaca y la región de Puno. Combinamos el conocimiento 
            psicológico con técnicas de coaching y PNL para ofrecerte herramientas prácticas 
            y aplicables a tu realidad.
          </p>
        </div>

        <div className="articulos-grid">
          {articulos.map((articulo) => (
            <article key={articulo.id} className="articulo-card">
              <div className="articulo-header">
                <span className="categoria">{articulo.categoria}</span>
                <span className="tiempo-lectura">{articulo.tiempoLectura} lectura</span>
              </div>
              
              <h3 className="articulo-titulo">{articulo.titulo}</h3>
              
              <p className="articulo-resumen">{articulo.resumen}</p>
              
              <div className="articulo-footer">
                <div className="autor-info">
                  <span className="autor">{articulo.autor}</span>
                  <span className="fecha">{articulo.fechaPublicacion}</span>
                </div>
                <button 
                  className="btn-leer-mas"
                  onClick={() => navigate(`/blog/${articulo.id}`)}
                >
                  Leer Artículo
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="recursos-adicionales">
          <h2>Recursos Adicionales</h2>
          <div className="recursos-grid">
            <div className="recurso-item">
              <h4>📋 Ejercicios de Mindfulness</h4>
              <p>Técnicas de atención plena para reducir el estrés y mejorar la concentración.</p>
              <button 
                className="recurso-link"
                onClick={() => window.open('mailto:alberto.guevara.ps@gmail.com?subject=Solicitud de Ejercicios de Mindfulness&body=Hola, me interesa recibir los ejercicios de mindfulness. Gracias.', '_blank')}
              >
                Solicitar por Email
              </button>
            </div>
            
            <div className="recurso-item">
              <h4>🎯 Planificador de Metas con PNL</h4>
              <p>Herramienta práctica para definir y alcanzar tus objetivos personales y profesionales.</p>
              <button 
                className="recurso-link"
                onClick={() => window.open('mailto:alberto.guevara.ps@gmail.com?subject=Solicitud de Planificador de Metas PNL&body=Hola, me interesa recibir el planificador de metas con PNL. Gracias.', '_blank')}
              >
                Solicitar por Email
              </button>
            </div>
            
            <div className="recurso-item">
              <h4>💑 Guía de Comunicación en Pareja</h4>
              <p>Estrategias para mejorar la comunicación y fortalecer la relación de pareja.</p>
              <button 
                className="recurso-link"
                onClick={() => window.open('mailto:alberto.guevara.ps@gmail.com?subject=Solicitud de Guía de Comunicación en Pareja&body=Hola, me interesa recibir la guía de comunicación en pareja. Gracias.', '_blank')}
              >
                Solicitar por Email
              </button>
            </div>
            
            <div className="recurso-item">
              <h4>🔄 Test de Resiliencia Personal</h4>
              <p>Evaluación para conocer tu nivel de resiliencia y áreas de mejora.</p>
              <button 
                className="recurso-link"
                onClick={() => navigate('/contacto')}
              >
                Realizar Test Online
              </button>
            </div>
          </div>
        </div>

        <div className="newsletter-section">
          <h3>Mantente Informado</h3>
          <p>
            Suscríbete para recibir nuestros artículos más recientes y recursos exclusivos 
            directamente en tu correo electrónico.
          </p>
          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <input 
              type="email" 
              name="email"
              placeholder="Tu correo electrónico" 
              className="newsletter-input"
              required
            />
            <button type="submit" className="newsletter-btn">Suscribirse</button>
          </form>
        </div>
      </div>
    </div>
  );
}
