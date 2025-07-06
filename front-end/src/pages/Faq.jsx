import React, { useState } from 'react';
import './Faq.css';

export default function Faq() {
  const [openItem, setOpenItem] = useState(null);

  const toggleItem = (index) => {
    setOpenItem(openItem === index ? null : index);
  };

  const faqItems = [
    {
      question: "¿Cómo es la primera sesión?",
      answer: "La primera sesión es una evaluación inicial de 60 minutos donde conocemos tu situación, definimos objetivos terapéuticos y establecemos un plan de trabajo personalizado. Es un espacio seguro para que compartas tu motivo de consulta sin compromiso."
    },
    {
      question: "¿Mi información es confidencial?",
      answer: "Absolutamente. Toda la información compartida está protegida por el secreto profesional y las normas éticas del Colegio de Psicólogos del Perú. Tu privacidad y confidencialidad son nuestra prioridad máxima."
    },
    {
      question: "¿Cuál es la diferencia entre psicología y coaching?",
      answer: "La psicología clínica se enfoca en el diagnóstico y tratamiento de problemas emocionales y mentales. El coaching se centra en el desarrollo de habilidades y logro de metas específicas. Nuestro enfoque integral combina ambas metodologías según tus necesidades."
    },
    {
      question: "¿Qué métodos de pago aceptan?",
      answer: "Aceptamos efectivo, transferencias bancarias y pagos digitales. El pago se realiza al inicio de cada sesión. Para terapia de pareja, el costo puede dividirse entre ambos participantes."
    },
    {
      question: "¿Ofrecen sesiones virtuales?",
      answer: "Sí, ofrecemos sesiones tanto presenciales en Juliaca como virtuales a través de videollamada. Las sesiones virtuales son ideales para personas de toda la región de Puno o aquellas que prefieren la comodidad de su hogar."
    },
    {
      question: "¿Con qué frecuencia debo asistir?",
      answer: "La frecuencia se determina según tu situación particular. Generalmente recomendamos sesiones semanales al inicio, espaciándolas gradualmente según el progreso. En la evaluación inicial definiremos el plan más adecuado para ti."
    },
    {
      question: "¿Qué es la PNL y cómo me puede ayudar?",
      answer: "La Programación Neurolingüística (PNL) es un conjunto de técnicas para mejorar la comunicación, superar limitaciones mentales y alcanzar objetivos. Es especialmente útil para desarrollo personal, liderazgo y cambio de patrones de pensamiento."
    },
    {
      question: "¿Atienden a parejas?",
      answer: "Sí, ofrecemos terapia de pareja especializada. Las sesiones duran 60 minutos y se enfocan en mejorar la comunicación, resolver conflictos y fortalecer la relación. Ambos miembros de la pareja deben estar comprometidos con el proceso."
    },
    {
      question: "¿Puedo cancelar o reprogramar una cita?",
      answer: "Sí, puedes reprogramar tu cita con al menos 24 horas de anticipación sin costo adicional. Las cancelaciones con menos tiempo pueden estar sujetas a una tarifa según nuestras políticas."
    },
    {
      question: "¿Trabajan con seguros de salud?",
      answer: "Actualmente trabajamos de forma particular. Podemos proporcionarte la documentación necesaria para que puedas solicitar reembolso a tu seguro si tu póliza cubre atención psicológica."
    },
    {
      question: "¿Cuánto tiempo dura el tratamiento?",
      answer: "La duración varía según cada caso. Algunos consultan por situaciones específicas que se resuelven en pocas sesiones, otros requieren un proceso más largo. En la evaluación inicial te daremos una estimación personalizada."
    },
    {
      question: "¿Qué pasa si tengo una crisis emocional?",
      answer: "Si experimentas una crisis severa, contáctanos inmediatamente. Para emergencias fuera de horario, dirígete al servicio de emergencias más cercano o llama a la Línea de Prevención del Suicidio: 113 (gratuito, 24 horas)."
    }
  ];

  return (
    <div className="page-wrapper">
      <div className="faq-container">
        <div className="faq-hero">
          <h1>Preguntas Frecuentes</h1>
          <p className="faq-subtitle">
            Encuentra respuestas a las dudas más comunes sobre nuestros servicios y procesos
          </p>
        </div>

      <div className="faq-content">
        <div className="faq-intro">
          <p>
            Sabemos que buscar ayuda psicológica puede generar dudas y ansiedad. 
            Aquí encontrarás respuestas a las preguntas más frecuentes para que te sientas 
            más tranquilo/a al dar este importante paso hacia tu bienestar.
          </p>
        </div>

        <div className="faq-list">
          {faqItems.map((item, index) => (
            <div 
              key={index} 
              className={`faq-item ${openItem === index ? 'active' : ''}`}
            >
              <button 
                className="faq-question"
                onClick={() => toggleItem(index)}
                aria-expanded={openItem === index}
              >
                <span>{item.question}</span>
                <span className="faq-icon">
                  {openItem === index ? '−' : '+'}
                </span>
              </button>
              <div className={`faq-answer ${openItem === index ? 'open' : ''}`}>
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="faq-contact">
          <h3>¿No encontraste lo que buscabas?</h3>
          <p>
            Si tienes otras preguntas o necesitas información más específica, 
            no dudes en contactarnos directamente.
          </p>
          <div className="contact-options">
            <a href="tel:977527381" className="contact-btn">
              📞 Llamar: 977 527 381
            </a>
            <a href="mailto:alberto.guevara.ps@gmail.com" className="contact-btn">
              ✉️ Email: alberto.guevara.ps@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
