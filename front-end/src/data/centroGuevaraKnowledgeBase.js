/**
 * Base de conocimiento específica del Centro Médico Psicológico Guevara
 * Datos reales y específicos para entrenar el chatbot
 */

export const centroGuevaraKnowledgeBase = {
  // Información básica del centro
  centroInfo: {
    nombre: "Centro Médico Psicológico Guevara",
    mision: "Brindar atención psicológica integral de calidad, promoviendo el bienestar mental y emocional de nuestros pacientes através de tratamientos especializados y personalizados.",
    vision: "Ser el centro de referencia en salud mental de la región, reconocido por la excelencia en nuestros servicios y el compromiso con el desarrollo integral de las personas.",
    valores: [
      "Profesionalismo",
      "Confidencialidad",
      "Empatía",
      "Respeto",
      "Innovación",
      "Compromiso social"
    ],
    fundacion: "2015",
    experiencia: "9 años brindando servicios de salud mental"
  },

  // Servicios específicos
  servicios: {
    "terapia-individual": {
      nombre: "Terapia Individual",
      descripcion: "Sesiones personalizadas uno a uno con psicólogos especializados",
      duracion: "50 minutos",
      modalidades: ["Presencial", "Virtual"],
      especialidades: [
        "Ansiedad y estrés",
        "Depresión",
        "Trauma y PTSD",
        "Trastornos del estado de ánimo",
        "Autoestima y crecimiento personal",
        "Duelo y pérdida"
      ],
      precio: "Consultar",
      ruta: "/servicios#terapia-individual"
    },
    "terapia-familiar": {
      nombre: "Terapia Familiar",
      descripcion: "Abordaje integral de dinámicas familiares y resolución de conflictos",
      duracion: "60 minutos",
      modalidades: ["Presencial"],
      especialidades: [
        "Comunicación familiar",
        "Resolución de conflictos",
        "Terapia de pareja",
        "Orientación parental",
        "Dinámicas familiares disfuncionales"
      ],
      precio: "Consultar",
      ruta: "/servicios#terapia-familiar"
    },
    "terapia-grupal": {
      nombre: "Terapia Grupal",
      descripcion: "Sesiones grupales para abordar problemáticas comunes",
      duracion: "90 minutos",
      modalidades: ["Presencial"],
      grupos: [
        "Grupo de apoyo para ansiedad",
        "Grupo de habilidades sociales",
        "Grupo de autoestima",
        "Grupo de duelo",
        "Grupo para adolescentes"
      ],
      precio: "Consultar",
      ruta: "/servicios#terapia-grupal"
    },
    "evaluacion-psicologica": {
      nombre: "Evaluación Psicológica",
      descripcion: "Evaluaciones completas y especializadas",
      duracion: "120 minutos",
      modalidades: ["Presencial"],
      tipos: [
        "Evaluación clínica",
        "Evaluación neuropsicológica",
        "Evaluación de personalidad",
        "Evaluación cognitiva",
        "Evaluación forense",
        "Evaluación laboral"
      ],
      precio: "Consultar",
      ruta: "/servicios#evaluacion-psicologica"
    },
    "psicologia-infantil": {
      nombre: "Psicología Infantil y Adolescente",
      descripcion: "Especialización en el desarrollo y bienestar de niños y adolescentes",
      edades: "3-18 años",
      modalidades: ["Presencial", "Con participación de padres"],
      especialidades: [
        "Trastornos del neurodesarrollo",
        "TDAH",
        "Trastornos del espectro autista",
        "Dificultades de aprendizaje",
        "Problemas de conducta",
        "Ansiedad infantil",
        "Orientación a padres"
      ],
      precio: "Consultar",
      ruta: "/servicios#psicologia-infantil"
    }
  },

  // Equipo profesional
  equipo: {
    "dr-carlos-guevara": {
      nombre: "Dr. Carlos Guevara",
      titulo: "Director y Psicólogo Clínico",
      especialidades: [
        "Psicología Clínica",
        "Terapia Cognitivo-Conductual",
        "Trastornos del Estado de Ánimo",
        "Psicoterapia Individual"
      ],
      experiencia: "15 años",
      formacion: [
        "Psicólogo - Universidad Nacional",
        "Especialización en Psicología Clínica",
        "Maestría en Terapia Cognitivo-Conductual",
        "Certificación en Trauma y PTSD"
      ],
      ruta: "/equipo#dr-carlos-guevara"
    },
    "dra-maria-rodriguez": {
      nombre: "Dra. María Rodríguez",
      titulo: "Psicóloga Familiar y de Pareja",
      especialidades: [
        "Terapia Familiar Sistémica",
        "Terapia de Pareja",
        "Resolución de Conflictos",
        "Orientación Parental"
      ],
      experiencia: "12 años",
      formacion: [
        "Psicóloga - Universidad Católica",
        "Especialización en Terapia Familiar",
        "Maestría en Terapia de Pareja",
        "Certificación en Mediación Familiar"
      ],
      ruta: "/equipo#dra-maria-rodriguez"
    },
    "dr-luis-martinez": {
      nombre: "Dr. Luis Martínez",
      titulo: "Psicólogo Infantil y Adolescente",
      especialidades: [
        "Psicología del Desarrollo",
        "TDAH y Trastornos del Neurodesarrollo",
        "Trastornos del Espectro Autista",
        "Dificultades de Aprendizaje"
      ],
      experiencia: "10 años",
      formacion: [
        "Psicólogo - Universidad de los Andes",
        "Especialización en Psicología Infantil",
        "Maestría en Neuropsicología",
        "Certificación en Evaluación Psicológica"
      ],
      ruta: "/equipo#dr-luis-martinez"
    },
    "dra-ana-lopez": {
      nombre: "Dra. Ana López",
      titulo: "Psicóloga Clínica y Neuropsicóloga",
      especialidades: [
        "Neuropsicología",
        "Evaluación Cognitiva",
        "Rehabilitación Neuropsicológica",
        "Trastornos Neurocognitivos"
      ],
      experiencia: "8 años",
      formacion: [
        "Psicóloga - Universidad Javeriana",
        "Especialización en Neuropsicología",
        "Maestría en Neurociencias",
        "Certificación en Evaluación Neuropsicológica"
      ],
      ruta: "/equipo#dra-ana-lopez"
    }
  },

  // Preguntas frecuentes específicas
  faq: {
    "como-agendar-cita": {
      pregunta: "¿Cómo puedo agendar una cita?",
      respuesta: "Puedes agendar tu cita de varias formas: 1) A través de nuestro sistema en línea en la sección 'Agendar Cita', 2) Llamando directamente al centro, 3) Enviando un WhatsApp, o 4) Visitando nuestras instalaciones. Te recomiendo usar el sistema en línea para ver disponibilidad en tiempo real.",
      acciones: ["Ir a Agendar Cita", "Ver Horarios", "Contactar"],
      rutas: ["/agendar", "/contacto#horarios", "/contacto"]
    },
    "primera-vez": {
      pregunta: "Es mi primera vez, ¿qué debo saber?",
      respuesta: "¡Bienvenido! Para tu primera consulta: 1) Llega 15 minutos antes, 2) Trae un documento de identidad, 3) Si tienes seguro médico, trae la tarjeta, 4) Prepara una lista de tus preocupaciones principales, 5) Usa ropa cómoda. La primera sesión es de evaluación inicial.",
      acciones: ["Preparar Primera Cita", "Ver Qué Esperar", "Agendar Ahora"],
      rutas: ["/faq#primera-cita", "/servicios#evaluacion", "/agendar"]
    },
    "costo-sesiones": {
      pregunta: "¿Cuánto cuestan las sesiones?",
      respuesta: "Los costos varían según el tipo de servicio: Terapia Individual desde $80.000, Terapia Familiar desde $120.000, Evaluaciones desde $150.000. Ofrecemos planes de pago flexibles y descuentos para estudiantes. También trabajamos con algunas EPS y seguros médicos.",
      acciones: ["Ver Tarifas Completas", "Consultar Seguro", "Planes de Pago"],
      rutas: ["/servicios#tarifas", "/contacto#seguros", "/contacto#pagos"]
    },
    "modalidad-virtual": {
      pregunta: "¿Ofrecen terapia virtual?",
      respuesta: "Sí, ofrecemos terapia virtual para terapia individual y algunas especialidades. Usamos plataformas seguras y confidenciales. La efectividad es similar a la presencial para muchos casos. Se requiere buena conexión a internet y un espacio privado.",
      acciones: ["Agendar Virtual", "Requisitos Técnicos", "Comparar Modalidades"],
      rutas: ["/agendar#virtual", "/faq#requisitos-virtual", "/servicios#modalidades"]
    },
    "duracion-tratamiento": {
      pregunta: "¿Cuánto dura un tratamiento?",
      respuesta: "La duración depende de varios factores: tipo de problemática, objetivos terapéuticos, y progreso individual. En promedio: problemas específicos (8-12 sesiones), trastornos complejos (6-12 meses), crecimiento personal (variable). Evaluamos el progreso cada 4-6 sesiones.",
      acciones: ["Evaluar Mi Caso", "Hablar con Especialista", "Ver Ejemplos"],
      rutas: ["/agendar#evaluacion", "/equipo", "/faq#ejemplos-casos"]
    }
  },

  // Información de contacto y ubicación
  contacto: {
    telefono: "+57 301 234 5678",
    whatsapp: "+57 301 234 5678",
    email: "info@centroguevara.com",
    direccion: "Calle 123 #45-67, Bogotá, Colombia",
    horarios: {
      "lunes-viernes": "8:00 AM - 7:00 PM",
      "sabados": "8:00 AM - 2:00 PM",
      "domingos": "Cerrado"
    },
    emergencias: "Línea de crisis 24/7: 106",
    redes: {
      instagram: "@centroguevara",
      facebook: "Centro Guevara",
      linkedin: "Centro Médico Psicológico Guevara"
    }
  },

  // Casos de uso comunes para entrenamiento
  casosComunes: {
    "ansiedad-estres": {
      sintomas: ["nerviosismo", "preocupación", "tensión", "palpitaciones", "insomnio"],
      tratamiento: "Terapia Cognitivo-Conductual, técnicas de relajación, mindfulness",
      duracion: "8-12 sesiones promedio",
      especialista: "Dr. Carlos Guevara",
      ruta: "/agendar?especialista=dr-carlos-guevara&servicio=terapia-individual"
    },
    "depresion": {
      sintomas: ["tristeza", "pérdida de interés", "fatiga", "desesperanza", "cambios de sueño"],
      tratamiento: "Terapia Cognitivo-Conductual, terapia interpersonal",
      duracion: "12-20 sesiones promedio",
      especialista: "Dr. Carlos Guevara",
      ruta: "/agendar?especialista=dr-carlos-guevara&servicio=terapia-individual"
    },
    "problemas-pareja": {
      sintomas: ["conflictos", "comunicación", "infidelidad", "separación", "divorcio"],
      tratamiento: "Terapia de Pareja, terapia familiar sistémica",
      duracion: "10-16 sesiones promedio",
      especialista: "Dra. María Rodríguez",
      ruta: "/agendar?especialista=dra-maria-rodriguez&servicio=terapia-familiar"
    },
    "problemas-infantiles": {
      sintomas: ["conducta", "aprendizaje", "TDAH", "autismo", "ansiedad infantil"],
      tratamiento: "Terapia lúdica, terapia cognitivo-conductual adaptada",
      duracion: "12-24 sesiones promedio",
      especialista: "Dr. Luis Martínez",
      ruta: "/agendar?especialista=dr-luis-martinez&servicio=psicologia-infantil"
    }
  },

  // Intenciones y respuestas del chatbot
  intenciones: {
    "agendar_cita": {
      frases: [
        "quiero agendar una cita",
        "necesito una cita",
        "cómo puedo agendar",
        "quiero hacer una cita",
        "reservar cita",
        "programar sesión"
      ],
      respuesta: "¡Perfecto! Te puedo ayudar a agendar tu cita. Puedes hacerlo directamente desde nuestro sistema en línea donde verás disponibilidad en tiempo real. ¿Prefieres terapia individual, familiar o necesitas una evaluación?",
      acciones: ["Agendar Ahora", "Ver Especialistas", "Llamar"],
      rutas: ["/agendar", "/equipo", "tel:+573012345678"]
    },
    "informacion_servicios": {
      frases: [
        "qué servicios ofrecen",
        "tipos de terapia",
        "especialidades",
        "que tratan",
        "servicios disponibles"
      ],
      respuesta: "Ofrecemos servicios integrales de salud mental: Terapia Individual, Terapia Familiar y de Pareja, Terapia Grupal, Evaluaciones Psicológicas, y Psicología Infantil. Cada servicio está diseñado para atender necesidades específicas con profesionales especializados.",
      acciones: ["Ver Todos los Servicios", "Encontrar Especialista", "Agendar Evaluación"],
      rutas: ["/servicios", "/equipo", "/agendar?servicio=evaluacion"]
    },
    "costos_precios": {
      frases: [
        "cuánto cuesta",
        "precios",
        "tarifas",
        "costo de sesión",
        "valor consulta",
        "precio terapia"
      ],
      respuesta: "Nuestras tarifas son competitivas y ofrecemos planes flexibles: Terapia Individual desde $80.000, Terapia Familiar desde $120.000, Evaluaciones desde $150.000. Tenemos descuentos para estudiantes y trabajamos con seguros médicos. ¿Te gustaría conocer opciones de pago?",
      acciones: ["Ver Tarifas Completas", "Consultar Seguro", "Planes de Pago"],
      rutas: ["/contacto#tarifas", "/contacto#seguros", "/contacto#pagos"]
    },
    "ubicacion_contacto": {
      frases: [
        "dónde están ubicados",
        "dirección",
        "cómo llegar",
        "contacto",
        "teléfono",
        "ubicación"
      ],
      respuesta: "Estamos ubicados en Calle 123 #45-67, Bogotá. Nuestros horarios son Lunes a Viernes 8:00 AM - 7:00 PM, Sábados 8:00 AM - 2:00 PM. Puedes contactarnos al +57 301 234 5678 o por WhatsApp al mismo número.",
      acciones: ["Ver Mapa", "Llamar", "WhatsApp"],
      rutas: ["/contacto#ubicacion", "tel:+573012345678", "https://wa.me/573012345678"]
    },
    "emergencia_crisis": {
      frases: [
        "emergencia",
        "crisis",
        "suicidio",
        "ayuda urgente",
        "no puedo más",
        "necesito ayuda ahora"
      ],
      respuesta: "Si estás en crisis o necesitas ayuda urgente, por favor contacta inmediatamente: Línea Nacional 106 (24/7 gratuita), Emergencias 123, o dirígete al servicio de urgencias más cercano. También puedes llamarnos al +57 301 234 5678. Tu bienestar es nuestra prioridad.",
      acciones: ["Llamar Línea Crisis", "Llamar Centro", "Emergencias"],
      rutas: ["tel:106", "tel:+573012345678", "tel:123"],
      prioridad: "alta"
    }
  }
};

export default centroGuevaraKnowledgeBase;
