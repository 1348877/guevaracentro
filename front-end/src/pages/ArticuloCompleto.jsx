import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ArticuloCompleto.css';

export default function ArticuloCompleto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleWhatsAppShare = () => {
    const url = window.location.href;
    const titulo = articulo?.titulo || 'Artículo interesante';
    const mensaje = `Te comparto este artículo que puede interesarte: "${titulo}" - ${url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleFacebookShare = () => {
    const url = window.location.href;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank');
  };

  // Base de datos de artículos completos
  const articulosCompletos = {
    "1": {
      titulo: "Manejando la Ansiedad en Tiempos de Incertidumbre en Puno",
      resumen: "Herramientas prácticas para enfrentar la ansiedad en el contexto social actual de nuestra región.",
      fechaPublicacion: "15 de Junio, 2025",
      tiempoLectura: "5 min",
      categoria: "Ansiedad",
      autor: "Lic. Alberto Guevara",
      contenido: `
        <h3>Introducción</h3>
        <p>La ansiedad se ha convertido en una experiencia común en nuestra región de Puno, especialmente después de los eventos sociopolíticos recientes y la pandemia del COVID-19. Como psicólogo clínico especialista en terapia cognitivo-conductual y técnicas de PNL, he observado un incremento significativo en los casos de ansiedad relacionados con la incertidumbre social y económica en nuestra comunidad de Juliaca.</p>
        
        <p>Según la <strong>Organización Mundial de la Salud (OMS, 2022)</strong>, los trastornos de ansiedad afectan al 4% de la población mundial, pero en contextos de crisis social, esta cifra puede incrementarse hasta un 25%. En Perú, el <strong>Instituto Nacional de Salud Mental (2020)</strong> reportó que el 29.6% de la población adulta en Lima presenta síntomas de ansiedad, cifra que se estima mayor en regiones con mayor vulnerabilidad socioeconómica como Puno.</p>
        
        <h3>¿Qué es la Ansiedad?</h3>
        <p>La ansiedad es una respuesta natural del cuerpo ante situaciones percibidas como amenazantes. Es parte de nuestro sistema de supervivencia y, en niveles apropiados, nos ayuda a estar alerta y preparados. Sin embargo, cuando esta respuesta se mantiene por períodos prolongados o se intensifica sin una causa aparente, puede interferir significativamente en nuestra vida diaria.</p>
        
        <p>Desde la perspectiva neurocientífica, <strong>LeDoux (2015)</strong> explica que la ansiedad involucra la activación de la amígdala cerebral, estructura responsable del procesamiento del miedo, y su interacción con el córtex prefrontal, área encargada del control ejecutivo y la toma de decisiones.</p>
        
        <h3>Manifestaciones de la Ansiedad en Nuestro Contexto Regional</h3>
        <p>En mi experiencia clínica en Juliaca, he identificado manifestaciones específicas de ansiedad relacionadas con nuestro contexto sociocultural:</p>
        
        <h4>Síntomas Físicos Comunes:</h4>
        <ul>
          <li><strong>Síntomas respiratorios intensificados por la altitud:</strong> La sensación de falta de aire se amplifica en poblaciones de altura como Juliaca (3,825 m.s.n.m.)</li>
          <li><strong>Tensión muscular:</strong> Especialmente en cuello, hombros y espalda</li>
          <li><strong>Problemas gastrointestinales:</strong> Náuseas, dolor abdominal, cambios en el apetito</li>
          <li><strong>Fatiga crónica:</strong> Agotamiento mental y físico persistente</li>
          <li><strong>Insomnio o alteraciones del sueño:</strong> Dificultad para conciliar el sueño o despertar frecuente</li>
        </ul>
        
        <h4>Síntomas Emocionales y Cognitivos:</h4>
        <ul>
          <li>Preocupación excesiva por la seguridad familiar y comunitaria</li>
          <li>Pensamientos catastróficos sobre el futuro económico</li>
          <li>Dificultad para concentrarse en el trabajo o estudios</li>
          <li>Irritabilidad aumentada en situaciones familiares</li>
          <li>Sensación de pérdida de control sobre las circunstancias</li>
        </ul>
        
        <h4>Síntomas Comportamentales:</h4>
        <ul>
          <li>Evitación de espacios públicos o eventos sociales</li>
          <li>Búsqueda excesiva de noticias o información</li>
          <li>Aislamiento social progresivo</li>
          <li>Procrastinación en actividades importantes</li>
          <li>Dependencia excesiva de familiares para actividades cotidianas</li>
        </ul>
        
        <h3>Herramientas Prácticas de PNL y Terapia Cognitivo-Conductual</h3>
        
        <h4>1. Técnica de Anclaje Emocional (PNL)</h4>
        <p>El anclaje es una herramienta poderosa de la Programación Neurolingüística desarrollada por <strong>Bandler y Grinder (1979)</strong> que permite acceder a estados emocionales positivos de manera consciente:</p>
        <ol>
          <li><strong>Identificación del estado recurso:</strong> Recuerda un momento específico en el que te sentiste completamente tranquilo, seguro y en control. Puede ser un momento en la naturaleza del Titicaca, una celebración familiar, o cualquier experiencia positiva.</li>
          <li><strong>Amplificación sensorial:</strong> Revive ese momento con todos tus sentidos:
            <ul>
              <li>¿Qué veías? (Colores, luces, formas, movimientos)</li>
              <li>¿Qué escuchabas? (Sonidos, música, voces, silencio)</li>
              <li>¿Qué sentías físicamente? (Temperatura, texturas, sensaciones)</li>
              <li>¿Había algún olor o sabor asociado?</li>
            </ul>
          </li>
          <li><strong>Creación del ancla física:</strong> En el momento de mayor intensidad emocional positiva, presiona suavemente tu pulgar contra tu dedo índice, mantén por 10 segundos.</li>
          <li><strong>Ruptura de estado:</strong> Cambia tu posición, piensa en algo neutral por 30 segundos.</li>
          <li><strong>Repetición:</strong> Repite este proceso 5-7 veces en diferentes sesiones.</li>
          <li><strong>Activación:</strong> En momentos de ansiedad, usa este mismo gesto físico para activar automáticamente el estado de calma.</li>
        </ol>
        
        <h4>2. Respiración 4-7-8 Adaptada para Altura</h4>
        <p>Basada en técnicas de pranayama del yoga y adaptada por el <strong>Dr. Andrew Weil (2011)</strong>, esta técnica es especialmente efectiva para poblaciones de altura:</p>
        <ol>
          <li><strong>Posición:</strong> Siéntate cómodamente con la espalda recta, pies apoyados en el suelo</li>
          <li><strong>Expulsión inicial:</strong> Exhala completamente por la boca</li>
          <li><strong>Inhalación:</strong> Inhala silenciosamente por la nariz contando hasta 4</li>
          <li><strong>Retención:</strong> Mantén la respiración contando hasta 7</li>
          <li><strong>Exhalación:</strong> Exhala completamente por la boca contando hasta 8, haciendo un sonido audible</li>
          <li><strong>Repetición:</strong> Completa 4-6 ciclos inicialmente, aumentando gradualmente</li>
        </ol>
        
        <p><strong>Nota importante:</strong> En altitudes como la de Juliaca, puede ser necesario adaptar los tiempos de retención. Si experimentas mareo, reduce el tiempo de retención o consulta con un profesional.</p>
        
        <h4>3. Reestructuración Cognitiva con Enfoque Culturalmente Adaptado</h4>
        <p>Basada en los principios de la Terapia Cognitivo-Conductual de <strong>Beck (1976)</strong> y adaptada para nuestro contexto cultural andino:</p>
        
        <h5>Paso 1: Identificación de Pensamientos Automáticos</h5>
        <p>Ejemplos comunes en nuestro contexto:</p>
        <ul>
          <li>"Todo está fuera de control en nuestro país"</li>
          <li>"Ya no hay seguridad en ningún lado"</li>
          <li>"Las cosas van a empeorar cada vez más"</li>
          <li>"No puedo proteger a mi familia"</li>
        </ul>
        
        <h5>Paso 2: Evaluación de la Evidencia</h5>
        <p>Preguntas clave:</p>
        <ul>
          <li>¿Qué evidencia real tengo de que esto es completamente cierto?</li>
          <li>¿Qué evidencia tengo en contra de este pensamiento?</li>
          <li>¿Estoy generalizando a partir de casos específicos?</li>
          <li>¿Qué me diría un amigo cercano sobre esta situación?</li>
        </ul>
        
        <h5>Paso 3: Reestructuración con Valores Culturales</h5>
        <p>Ejemplos de reestructuración:</p>
        <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #f5f5f5;">
            <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Pensamiento Ansioso</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Reestructuración Adaptativa</th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 12px;">"Todo está fuera de control"</td>
            <td style="border: 1px solid #ddd; padding: 12px;">"Aunque hay situaciones difíciles, puedo controlar mis acciones y respuestas. Mi comunidad tiene historia de resistencia y adaptación."</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 12px;">"No hay futuro para los jóvenes aquí"</td>
            <td style="border: 1px solid #ddd; padding: 12px;">"Los desafíos son reales, pero también existen oportunidades. Puedo trabajar para crear las condiciones que quiero ver."</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 12px;">"Soy débil por sentir ansiedad"</td>
            <td style="border: 1px solid #ddd; padding: 12px;">"Sentir ansiedad es una respuesta humana normal. Buscar ayuda y trabajar en mi bienestar requiere valentía."</td>
          </tr>
        </table>
        
        <h4>4. Técnica de Mindfulness Andino</h4>
        <p>Adaptación de técnicas de atención plena con elementos de nuestra cultura andina:</p>
        <ol>
          <li><strong>Conexión con la Pachamama:</strong> Siéntate en contacto con la tierra (jardín, patio, o imagínalo si estás en interior)</li>
          <li><strong>Respiración consciente:</strong> Inhala imaginando que recibes la energía de la montaña, exhala entregando tus preocupaciones a la tierra</li>
          <li><strong>Observación sin juicio:</strong> Observa tus pensamientos como nubes que pasan por el cielo del Titicaca</li>
          <li><strong>Afirmación cultural:</strong> "Soy parte de una comunidad fuerte, mis ancestros superaron desafíos mayores, yo también puedo"</li>
        </ol>
        
        <h3>Cuándo Buscar Ayuda Profesional</h3>
        <p>Según los criterios del <strong>DSM-5 (APA, 2013)</strong> y mi experiencia clínica, es importante buscar apoyo profesional cuando:</p>
        
        <h4>Criterios de Severidad:</h4>
        <ul>
          <li><strong>Duración:</strong> Los síntomas persisten por más de 6 meses o interfieren significativamente con la vida diaria por más de 2 semanas</li>
          <li><strong>Intensidad:</strong> Experimentas ataques de pánico (palpitaciones, sudoración, temblor, sensación de ahogo) más de una vez por semana</li>
          <li><strong>Interferencia funcional:</strong> La ansiedad afecta tu rendimiento laboral, relaciones familiares o actividades académicas</li>
          <li><strong>Evitación:</strong> Evitas constantemente situaciones normales de la vida (trabajo, estudios, eventos sociales)</li>
          <li><strong>Síntomas físicos:</strong> Presentas síntomas físicos persistentes (dolor de cabeza, problemas gastrointestinales, tensión muscular) sin causa médica identificada</li>
        </ul>
        
        <h4>Señales de Alerta Inmediata:</h4>
        <ul>
          <li>Pensamientos de autolesión o ideación suicida</li>
          <li>Ataques de pánico severos que requieren atención médica</li>
          <li>Aislamiento social completo por más de una semana</li>
          <li>Incapacidad para realizar actividades básicas de autocuidado</li>
        </ul>
        
        <h3>Recursos de Apoyo Especializado en Juliaca</h3>
        <p>En el Centro Psicológico Integral Guevara ofrecemos un enfoque integral que combina:</p>
        
        <h4>Servicios Especializados:</h4>
        <ul>
          <li><strong>Evaluación psicológica completa:</strong> Utilizando instrumentos validados como el Inventario de Ansiedad de Beck (BAI) y la Escala de Ansiedad de Hamilton</li>
          <li><strong>Terapia Cognitivo-Conductual (TCC):</strong> Enfoque basado en evidencia para el tratamiento de trastornos de ansiedad</li>
          <li><strong>Coaching con PNL:</strong> Herramientas prácticas para el desarrollo de recursos internos y manejo del estrés</li>
          <li><strong>Terapia de exposición gradual:</strong> Para casos de fobias específicas o agorafobia</li>
          <li><strong>Técnicas de relajación y mindfulness:</strong> Entrenamiento en habilidades de autorregulación emocional</li>
        </ul>
        
        <h4>Modalidades de Atención:</h4>
        <ul>
          <li><strong>Presencial:</strong> En nuestras instalaciones de Independencia 211, Juliaca</li>
          <li><strong>Virtual:</strong> Sesiones por videollamada para mayor accesibilidad</li>
          <li><strong>Horarios flexibles:</strong> Adaptados a las necesidades laborales y académicas</li>
          <li><strong>Tarifas accesibles:</strong> Conscientes de la realidad económica regional</li>
        </ul>
        
        <h3>Plan de Acción Inmediato</h3>
        <p>Si experimentas ansiedad en este momento, puedes:</p>
        <ol>
          <li><strong>Aplicar la técnica 5-4-3-2-1:</strong>
            <ul>
              <li>5 cosas que puedes ver</li>
              <li>4 cosas que puedes tocar</li>
              <li>3 cosas que puedes escuchar</li>
              <li>2 cosas que puedes oler</li>
              <li>1 cosa que puedes saborear</li>
            </ul>
          </li>
          <li><strong>Contactar a tu red de apoyo:</strong> Familia, amigos cercanos, o líderes comunitarios de confianza</li>
          <li><strong>Buscar ayuda profesional:</strong> Llamar al 962 376 425 o escribir a alberto.guevara.ps@gmail.com</li>
          <li><strong>En crisis inmediata:</strong> Línea de ayuda nacional 113 opción 5 (salud mental)</li>
        </ol>
        
        <h3>Conclusión</h3>
        <p>La ansiedad en tiempos de incertidumbre es una respuesta comprensible y, lo más importante, manejable. Como comunidad puneña, tenemos recursos culturales profundos y una historia de resistencia que puede fortalecernos en estos momentos difíciles. La combinación de técnicas psicológicas basadas en evidencia con nuestros valores comunitarios y familiares puede ser especialmente poderosa.</p>
        
        <p>Recuerda que buscar ayuda profesional no es un signo de debilidad, sino un acto de valentía y autocuidado. En nuestra cultura andina, cuidar del bienestar emocional es tan importante como cuidar del bienestar físico.</p>
        
        <p><em>Si este artículo te resultó útil y deseas profundizar en estas técnicas con un enfoque personalizado, no dudes en contactarnos. Estamos aquí para acompañarte en tu proceso de sanación y crecimiento personal.</em></p>
        
        <h3>Referencias Bibliográficas</h3>
        <ul style="font-size: 0.9rem; color: #666;">
          <li>American Psychiatric Association. (2013). <em>Diagnostic and Statistical Manual of Mental Disorders</em> (5th ed.). American Psychiatric Publishing.</li>
          <li>Bandler, R., & Grinder, J. (1979). <em>Frogs into Princes: Neuro Linguistic Programming</em>. Real People Press.</li>
          <li>Beck, A. T. (1976). <em>Cognitive Therapy and the Emotional Disorders</em>. International Universities Press.</li>
          <li>Instituto Nacional de Salud Mental. (2020). <em>Estudio epidemiológico de salud mental en Lima Metropolitana y Callao - Replicación 2012</em>. MINSA.</li>
          <li>LeDoux, J. (2015). <em>Anxious: Using the Brain to Understand and Treat Fear and Anxiety</em>. Viking.</li>
          <li>Organización Mundial de la Salud. (2022). <em>Mental Disorders Fact Sheets</em>. WHO Press.</li>
          <li>Weil, A. (2011). <em>Spontaneous Healing: How to Discover and Enhance Your Body's Natural Ability to Maintain and Heal Itself</em>. Ballantine Books.</li>
        </ul>
      `
    },
    "2": {
      titulo: "El Camino del Duelo: Herramientas para Sanar en Comunidad",
      resumen: "Cómo procesar el duelo colectivo y encontrar caminos hacia la sanación emocional en nuestra comunidad.",
      fechaPublicacion: "8 de Junio, 2025",
      tiempoLectura: "7 min",
      categoria: "Duelo",
      autor: "Lic. Alberto Guevara",
      contenido: `
        <h3>Entendiendo el Duelo Colectivo</h3>
        <p>El duelo no es solo una experiencia individual; también puede ser colectiva. Nuestra comunidad de Puno ha experimentado pérdidas significativas que han afectado a todos nosotros de diferentes maneras. Como especialista en salud mental con experiencia en investigación sobre el impacto del COVID-19 en nuestra región, comprendo la complejidad de estos procesos.</p>
        
        <h3>Fases del Duelo en Contexto Comunitario</h3>
        <p>El duelo comunitario pasa por etapas similares al duelo individual, pero con características específicas:</p>
        
        <h4>1. Negación Colectiva</h4>
        <p>La comunidad puede minimizar o negar el impacto de las pérdidas. Es común escuchar frases como "debemos ser fuertes" o "no podemos permitirnos sentir".</p>
        
        <h4>2. Ira y Búsqueda de Culpables</h4>
        <p>Surge la necesidad de encontrar responsables. Esta etapa puede dividir a la comunidad si no se maneja adecuadamente.</p>
        
        <h4>3. Negociación Comunitaria</h4>
        <p>La comunidad busca formas de "volver a como era antes" o establecer rituales para honrar a los perdidos.</p>
        
        <h4>4. Depresión Colectiva</h4>
        <p>Período de tristeza profunda, apatía social y pérdida de esperanza en el futuro común.</p>
        
        <h4>5. Aceptación y Reconstrucción</h4>
        <p>La comunidad acepta la nueva realidad y trabaja junta hacia la sanación y el crecimiento.</p>
        
        <h3>Herramientas de PNL para el Duelo</h3>
        
        <h4>Técnica de la Línea del Tiempo</h4>
        <p>Esta herramienta de PNL ayuda a procesar el duelo de manera saludable:</p>
        <ol>
          <li>Imagina una línea que representa tu vida, donde el pasado está a tu izquierda y el futuro a tu derecha</li>
          <li>Colócate en el presente (centro de la línea)</li>
          <li>Observa el evento de pérdida en el pasado, reconoce su impacto pero también su lugar en tu historia</li>
          <li>Mira hacia el futuro y visualiza cómo puedes honrar esa pérdida mientras sigues adelante</li>
          <li>Toma aprendizajes del pasado hacia tu futuro</li>
        </ol>
        
        <h4>Anclaje de Recursos Positivos</h4>
        <p>Crear anclas mentales para acceder a recuerdos positivos de la persona o situación perdida:</p>
        <ol>
          <li>Recuerda un momento feliz relacionado con lo que perdiste</li>
          <li>Intensifica esa memoria positiva</li>
          <li>Crea un gesto físico (como tocar tu corazón) mientras revives ese momento</li>
          <li>Úsalo cuando necesites conectar con el amor en lugar del dolor</li>
        </ol>
        
        <h3>Rituales de Sanación Comunitaria</h3>
        
        <h4>Círculos de Palabra</h4>
        <p>Espacios seguros donde los miembros de la comunidad pueden compartir sus experiencias sin juicio.</p>
        
        <h4>Memoriales Vivos</h4>
        <p>Proyectos comunitarios que honran a los perdidos mientras benefician a los vivos, como jardines, bibliotecas o programas de ayuda.</p>
        
        <h4>Ceremonias de Transición</h4>
        <p>Rituales que marcan el paso del dolor agudo hacia la integración saludable de la pérdida.</p>
        
        <h3>Señales de Duelo Complicado</h3>
        <p>Busca ayuda profesional si experimentas:</p>
        <ul>
          <li>Negación persistente de la pérdida después de varios meses</li>
          <li>Evitación extrema de cualquier recordatorio</li>
          <li>Ira intensa que no disminuye con el tiempo</li>
          <li>Depresión profunda que interfiere con la vida diaria</li>
          <li>Síntomas físicos persistentes sin causa médica</li>
        </ul>
        
        <h3>Apoyo Profesional Disponible</h3>
        <p>En el Centro Psicológico Integral Guevara ofrecemos:</p>
        <ul>
          <li>Terapia individual para el procesamiento del duelo</li>
          <li>Sesiones grupales de apoyo comunitario</li>
          <li>Técnicas especializadas de PNL para la sanación emocional</li>
          <li>Acompañamiento en la creación de rituales personales y familiares</li>
        </ul>
        
        <h3>Conclusión</h3>
        <p>El duelo es un proceso natural y necesario que, cuando se vive de manera saludable, puede fortalecer tanto al individuo como a la comunidad. No hay un cronograma fijo para sanar, pero con las herramientas adecuadas y el apoyo necesario, es posible encontrar significado y crecimiento incluso en las pérdidas más profundas.</p>
        
        <p><em>Recuerda: pedir ayuda no es signo de debilidad, sino de sabiduría y amor propio.</em></p>
      `
    },
    "3": {
      titulo: "¿Psicología o Coaching? Entendiendo qué Enfoque es para Ti",
      resumen: "Una guía clara para entender las diferencias y beneficios de cada metodología según tus necesidades.",
      fechaPublicacion: "1 de Junio, 2025",
      tiempoLectura: "4 min",
      categoria: "Educación",
      autor: "Lic. Alberto Guevara",
      contenido: `
        <h3>Introducción</h3>
        <p>Como profesional certificado tanto en psicología clínica como en coaching con PNL, frecuentemente recibo la pregunta: "¿Qué necesito, psicología o coaching?". La respuesta no es simple, ya que ambos enfoques tienen valor único y pueden ser complementarios.</p>
        
        <h3>¿Qué es la Psicología Clínica?</h3>
        <p>La psicología clínica se enfoca en:</p>
        <ul>
          <li><strong>Diagnóstico y tratamiento</strong> de trastornos mentales</li>
          <li><strong>Exploración del pasado</strong> para entender patrones actuales</li>
          <li><strong>Sanación de traumas</strong> y heridas emocionales</li>
          <li><strong>Trabajo profundo</strong> con emociones y pensamientos</li>
          <li><strong>Proceso terapéutico</strong> que puede ser de largo plazo</li>
        </ul>
        
        <h3>¿Qué es el Coaching con PNL?</h3>
        <p>El coaching se centra en:</p>
        <ul>
          <li><strong>Logro de objetivos específicos</strong> y metas futuras</li>
          <li><strong>Desarrollo de habilidades</strong> y competencias</li>
          <li><strong>Cambio de patrones</strong> de pensamiento y comportamiento</li>
          <li><strong>Optimización del rendimiento</strong> personal y profesional</li>
          <li><strong>Procesos orientados a resultados</strong> generalmente de corto a mediano plazo</li>
        </ul>
        
        <h3>Comparación Práctica</h3>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #ff6b35; color: white;">
              <th style="padding: 12px; border: 1px solid #ddd;">Aspecto</th>
              <th style="padding: 12px; border: 1px solid #ddd;">Psicología Clínica</th>
              <th style="padding: 12px; border: 1px solid #ddd;">Coaching con PNL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Enfoque temporal</td>
              <td style="padding: 12px; border: 1px solid #ddd;">Pasado → Presente</td>
              <td style="padding: 12px; border: 1px solid #ddd;">Presente → Futuro</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Duración típica</td>
              <td style="padding: 12px; border: 1px solid #ddd;">Meses a años</td>
              <td style="padding: 12px; border: 1px solid #ddd;">Semanas a meses</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Metodología</td>
              <td style="padding: 12px; border: 1px solid #ddd;">Análisis y reflexión profunda</td>
              <td style="padding: 12px; border: 1px solid #ddd;">Acción y técnicas específicas</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Ideal para</td>
              <td style="padding: 12px; border: 1px solid #ddd;">Problemas emocionales, traumas, trastornos</td>
              <td style="padding: 12px; border: 1px solid #ddd;">Metas, cambios de hábitos, rendimiento</td>
            </tr>
          </tbody>
        </table>
        
        <h3>¿Cuándo Elegir Psicología?</h3>
        <p>Considera la psicología clínica si:</p>
        <ul>
          <li>Experimentas síntomas de ansiedad, depresión o trauma</li>
          <li>Tienes patrones de pensamiento o comportamiento que te lastiman</li>
          <li>Necesitas procesar experiencias pasadas dolorosas</li>
          <li>Buscas entender profundamente tus emociones y reacciones</li>
          <li>Requieres un diagnóstico profesional</li>
        </ul>
        
        <h3>¿Cuándo Elegir Coaching?</h3>
        <p>El coaching es ideal si:</p>
        <ul>
          <li>Tienes metas claras que quieres alcanzar</li>
          <li>Necesitas mejorar tu rendimiento profesional o personal</li>
          <li>Quieres cambiar hábitos específicos</li>
          <li>Buscas desarrollar habilidades de liderazgo o comunicación</li>
          <li>Te sientes "estancado" pero sin problemas emocionales graves</li>
        </ul>
        
        <h3>El Enfoque Integral: Lo Mejor de Ambos Mundos</h3>
        <p>En el Centro Psicológico Integral Guevara, ofrecemos un enfoque único que combina ambas metodologías:</p>
        
        <h4>Ventajas del Enfoque Integral:</h4>
        <ul>
          <li><strong>Diagnóstico preciso:</strong> Identificamos si hay aspectos clínicos que atender</li>
          <li><strong>Sanación profunda:</strong> Trabajamos las raíces emocionales de los problemas</li>
          <li><strong>Herramientas prácticas:</strong> Aplicamos técnicas de PNL para cambios rápidos</li>
          <li><strong>Orientación a resultados:</strong> Mantenemos el foco en tus objetivos</li>
          <li><strong>Flexibilidad:</strong> Adaptamos el enfoque según tu progreso</li>
        </ul>
        
        <h3>Casos Prácticos</h3>
        
        <h4>Caso 1: María, 35 años</h4>
        <p><strong>Situación:</strong> Ansiedad severa que le impide trabajar eficientemente</p>
        <p><strong>Enfoque recomendado:</strong> Iniciar con psicología para manejar la ansiedad, luego coaching para optimizar su rendimiento laboral</p>
        
        <h4>Caso 2: Juan, 28 años</h4>
        <p><strong>Situación:</strong> Quiere mejorar sus habilidades de liderazgo para un ascenso</p>
        <p><strong>Enfoque recomendado:</strong> Coaching con PNL enfocado en desarrollo de habilidades interpersonales y confianza</p>
        
        <h4>Caso 3: Ana, 42 años</h4>
        <p><strong>Situación:</strong> Divorcio reciente, necesita sanar y redefinir sus metas de vida</p>
        <p><strong>Enfoque recomendado:</strong> Enfoque integral que combine terapia para el duelo con coaching para planificación de nueva vida</p>
        
        <h3>Conclusión</h3>
        <p>No existe una respuesta única a la pregunta "¿psicología o coaching?". La elección depende de tus necesidades específicas, tu situación actual y tus objetivos. En nuestro centro, realizamos una evaluación inicial gratuita para determinar el enfoque más beneficioso para ti.</p>
        
        <p>Recuerda: buscar ayuda profesional, sea psicológica o de coaching, es una inversión en tu bienestar y crecimiento personal. Ambos caminos pueden llevarte a una vida más plena y satisfactoria.</p>
        
        <p><em>¿Tienes dudas sobre cuál enfoque es mejor para ti? Contáctanos para una consulta inicial donde evaluaremos juntos el camino más adecuado para tus necesidades.</em></p>
      `
    },
    "4": {
      titulo: "Construyendo Resiliencia: Fortaleciendo Nuestra Capacidad de Adaptación",
      resumen: "Estrategias basadas en PNL para desarrollar resiliencia y enfrentar los desafíos con mayor fortaleza.",
      fechaPublicacion: "25 de Mayo, 2025",
      tiempoLectura: "6 min",
      categoria: "Desarrollo Personal",
      autor: "Lic. Alberto Guevara",
      contenido: `
        <h3>¿Qué es la Resiliencia?</h3>
        <p>La resiliencia es la capacidad humana de adaptarse positivamente a situaciones adversas, trauma, tragedia, amenazas o fuentes significativas de estrés. No se trata de evitar las dificultades, sino de aprender a navegar a través de ellas y emerger fortalecidos.</p>
        
        <p>Como psicólogo especialista en PNL y con experiencia en investigación sobre burnout en profesionales de la salud, he observado que la resiliencia no es un rasgo innato, sino una habilidad que se puede desarrollar y fortalecer a lo largo de la vida.</p>
        
        <h3>Los Pilares de la Resiliencia</h3>
        
        <h4>1. Autoconciencia Emocional</h4>
        <p>La capacidad de reconocer, entender y gestionar nuestras propias emociones es fundamental para la resiliencia.</p>
        
        <h4>2. Flexibilidad Cognitiva</h4>
        <p>La habilidad de adaptar nuestros pensamientos y perspectivas ante nuevas situaciones.</p>
        
        <h4>3. Conexiones Sociales Sólidas</h4>
        <p>Las relaciones de apoyo proporcionan recursos emocionales y prácticos durante tiempos difíciles.</p>
        
        <h4>4. Propósito y Significado</h4>
        <p>Tener un sentido claro de dirección y valores que guíen nuestras acciones.</p>
        
        <h4>5. Cuidado Personal</h4>
        <p>Mantener la salud física y mental como base para enfrentar desafíos.</p>
        
        <h3>Técnicas de PNL para Desarrollar Resiliencia</h3>
        
        <h4>Técnica 1: Reencuadre de Experiencias</h4>
        <p>Esta técnica de PNL te ayuda a cambiar la perspectiva sobre eventos difíciles:</p>
        <ol>
          <li><strong>Identifica el evento:</strong> Piensa en una situación difícil reciente</li>
          <li><strong>Encuentra el aprendizaje:</strong> Pregúntate "¿Qué he aprendido de esto?"</li>
          <li><strong>Busca el recurso:</strong> "¿Qué fortalezas descubrí en mí mismo?"</li>
          <li><strong>Proyecta al futuro:</strong> "¿Cómo me ayudará esta experiencia en el futuro?"</li>
        </ol>
        
        <h4>Técnica 2: Anclaje de Estados Resourceful</h4>
        <p>Crear acceso rápido a estados emocionales de fortaleza:</p>
        <ol>
          <li>Recuerda un momento en que te sentiste completamente capaz y fuerte</li>
          <li>Intensifica esa sensación con todos tus sentidos</li>
          <li>En el pico de esa sensación, crea un gesto físico (como cerrar el puño)</li>
          <li>Repite este proceso varias veces</li>
          <li>Usa el gesto cuando necesites acceder a esa fortaleza</li>
        </ol>
        
        <h4>Técnica 3: Modelado de Resiliencia</h4>
        <p>Aprender de personas resilientes en tu entorno:</p>
        <ol>
          <li>Identifica a alguien que admires por su capacidad de superar dificultades</li>
          <li>Observa sus estrategias mentales y comportamentales</li>
          <li>Pregúntale sobre su proceso interno</li>
          <li>Adapta sus estrategias a tu propio estilo</li>
        </ol>
        
        <h3>Ejercicios Prácticos Diarios</h3>
        
        <h4>Ejercicio 1: Diario de Gratitud Resiliente</h4>
        <p>Cada noche, escribe:</p>
        <ul>
          <li>3 cosas por las que te sientes agradecido</li>
          <li>1 desafío que enfrentaste y cómo lo manejaste</li>
          <li>1 fortaleza que descubriste o usaste hoy</li>
        </ul>
        
        <h4>Ejercicio 2: Visualización de Futuro Resiliente</h4>
        <p>Dedica 10 minutos diarios a visualizar:</p>
        <ol>
          <li>Tu yo futuro habiendo superado los desafíos actuales</li>
          <li>Las habilidades y fortalezas que habrás desarrollado</li>
          <li>Cómo estarás ayudando a otros con tu experiencia</li>
        </ol>
        
        <h4>Ejercicio 3: Red de Apoyo Consciente</h4>
        <p>Cada semana:</p>
        <ul>
          <li>Contacta a al menos una persona de tu red de apoyo</li>
          <li>Ofrece apoyo a alguien que lo necesite</li>
          <li>Identifica nuevas personas que podrían fortalecer tu red</li>
        </ul>
        
        <h3>Resiliencia en el Contexto de Puno</h3>
        <p>Nuestra región de Puno tiene una rica historia de resiliencia colectiva. Desde nuestros ancestros que sobrevivieron a conquistadores y colonizadores, hasta las comunidades actuales que enfrentan desafíos económicos y sociales con creatividad y unión.</p>
        
        <h4>Fortalezas Culturales que Nutren la Resiliencia:</h4>
        <ul>
          <li><strong>Ayni (reciprocidad):</strong> El principio de apoyo mutuo</li>
          <li><strong>Sumak Kausay (buen vivir):</strong> Una visión holística del bienestar</li>
          <li><strong>Conexión con la naturaleza:</strong> La Pachamama como fuente de fortaleza</li>
          <li><strong>Sabiduría ancestral:</strong> Conocimientos transmitidos por generaciones</li>
          <li><strong>Celebración comunitaria:</strong> Fiestas y rituales que fortalecen lazos</li>
        </ul>
        
        <h3>Cuándo Buscar Ayuda Profesional</h3>
        <p>Aunque la resiliencia se puede desarrollar independientemente, considera buscar apoyo profesional si:</p>
        <ul>
          <li>Te sientes abrumado por mucho tiempo</li>
          <li>Los desafíos interfieren significativamente con tu vida diaria</li>
          <li>Experimentas síntomas de depresión o ansiedad persistentes</li>
          <li>Sientes que no puedes hacer frente a las demandas de la vida</li>
          <li>Quieres desarrollar habilidades específicas de resiliencia</li>
        </ul>
        
        <h3>Conclusión</h3>
        <p>La resiliencia no es la ausencia de dolor o dificultad; es la capacidad de crecer a través de ellos. Como comunidad puneña, tenemos recursos únicos y profundos para desarrollar esta capacidad. La combinación de nuestras fortalezas culturales con técnicas modernas de PNL puede crear una resiliencia poderosa y auténtica.</p>
        
        <p>Recuerda: cada desafío superado se convierte en una prueba de tu capacidad y una herramienta para futuros obstáculos. Tu resiliencia no solo te beneficia a ti, sino que inspira y fortalece a toda tu comunidad.</p>
        
        <p><em>Si deseas desarrollar tu resiliencia de manera más profunda y personalizada, nuestro enfoque integral de psicología y coaching puede proporcionarte las herramientas específicas que necesitas.</em></p>
      `
    },
    "5": {
      titulo: "Comunicación en Pareja: Discutir con Estilo y Respeto",
      resumen: "Técnicas efectivas para mejorar la comunicación en la relación y resolver conflictos constructivamente.",
      fechaPublicacion: "18 de Mayo, 2025",
      tiempoLectura: "5 min",
      categoria: "Relaciones",
      autor: "Lic. Alberto Guevara",
      contenido: `
        <h3>La Metodología "Discutir con Estilo"</h3>
        <p>Como parte de mi investigación de pregrado, desarrollé y validé científicamente el programa "Discutir con Estilo", una metodología innovadora para mejorar los estilos de manejo de conflictos en parejas. Esta técnica ha demostrado eficacia significativa en el Centro de Salud Mental Comunitario de Juliaca.</p>
        
        <h3>Los Cuatro Estilos de Conflicto Destructivos</h3>
        <p>Según la investigación del Dr. John Gottman, existen cuatro patrones que predicen problemas graves en las relaciones:</p>
        
        <h4>1. La Crítica Destructiva</h4>
        <p><strong>Qué es:</strong> Atacar el carácter o personalidad de la pareja en lugar del comportamiento específico.</p>
        <p><strong>Ejemplo destructivo:</strong> "Siempre eres irresponsable y egoísta"</p>
        <p><strong>Alternativa constructiva:</strong> "Me siento preocupado cuando no avisas que llegarás tarde"</p>
        
        <h4>2. La Defensividad</h4>
        <p><strong>Qué es:</strong> Responder a las quejas como si fueras una víctima inocente.</p>
        <p><strong>Ejemplo destructivo:</strong> "Yo no tengo la culpa, tú también lo haces"</p>
        <p><strong>Alternativa constructiva:</strong> "Entiendo tu punto, déjame explicarte mi perspectiva"</p>
        
        <h4>3. El Desprecio</h4>
        <p><strong>Qué es:</strong> Hablar desde una posición de superioridad moral o intelectual.</p>
        <p><strong>Ejemplo destructivo:</strong> Sarcasmo, burlas, insultos</p>
        <p><strong>Alternativa constructiva:</strong> Expresar desacuerdo manteniendo el respeto</p>
        
        <h4>4. El Muro de Piedra</h4>
        <p><strong>Qué es:</strong> Cerrarse emocionalmente y no responder a la pareja.</p>
        <p><strong>Ejemplo destructivo:</strong> Ignorar completamente a la pareja</p>
        <p><strong>Alternativa constructiva:</strong> "Necesito un momento para procesar esto, hablemos en 20 minutos"</p>
        
        <h3>Las 7 Reglas de "Discutir con Estilo"</h3>
        
        <h4>Regla 1: Usa Declaraciones "Yo" en Lugar de "Tú"</h4>
        <p><strong>En lugar de:</strong> "Tú nunca me escuchas"</p>
        <p><strong>Di:</strong> "Yo me siento no escuchado cuando hablamos mientras ves televisión"</p>
        
        <h4>Regla 2: Sé Específico y Concreto</h4>
        <p><strong>En lugar de:</strong> "Siempre haces lo mismo"</p>
        <p><strong>Di:</strong> "Esta mañana dejaste los platos sucios después de desayunar"</p>
        
        <h4>Regla 3: Expresa Emociones, No Juicios</h4>
        <p><strong>En lugar de:</strong> "Eres un desconsiderado"</p>
        <p><strong>Di:</strong> "Me siento triste cuando siento que mis necesidades no son importantes"</p>
        
        <h4>Regla 4: Busca Soluciones, No Culpables</h4>
        <p><strong>En lugar de:</strong> "Es tu culpa que esto esté mal"</p>
        <p><strong>Di:</strong> "¿Cómo podemos manejar esto mejor la próxima vez?"</p>
        
        <h4>Regla 5: Timing Adecuado</h4>
        <p>Elige momentos apropiados para conversaciones importantes:</p>
        <ul>
          <li>Cuando ambos estén descansados</li>
          <li>Sin distracciones (teléfonos, TV, niños)</li>
          <li>En un espacio privado y cómodo</li>
          <li>Con tiempo suficiente para la conversación</li>
        </ul>
        
        <h4>Regla 6: Escucha para Entender, No para Responder</h4>
        <p>Técnica de escucha activa:</p>
        <ol>
          <li>Mantén contacto visual</li>
          <li>Parafrasea lo que escuchaste: "Entiendo que te sientes..."</li>
          <li>Pregunta para aclarar: "¿Puedes explicarme más sobre...?"</li>
          <li>Valida las emociones: "Tiene sentido que te sientas así"</li>
        </ol>
        
        <h4>Regla 7: Toma Descansos Cuando sea Necesario</h4>
        <p>Si la conversación se intensifica:</p>
        <ul>
          <li>Reconoce la necesidad de pausa</li>
          <li>Acuerda un tiempo específico para retomar</li>
          <li>Usa el tiempo para calmarte, no para preparar argumentos</li>
          <li>Regresa con una actitud de colaboración</li>
        </ul>
        
        <h3>Técnicas de PNL para Parejas</h3>
        
        <h4>Técnica 1: Calibración Emocional</h4>
        <p>Aprender a "leer" las señales no verbales de tu pareja:</p>
        <ul>
          <li>Observa cambios en el tono de voz</li>
          <li>Nota las expresiones faciales</li>
          <li>Presta atención a la postura corporal</li>
          <li>Ajusta tu comunicación según estas señales</li>
        </ul>
        
        <h4>Técnica 2: Matching y Mirroring</h4>
        <p>Crear rapport a través del lenguaje corporal:</p>
        <ul>
          <li>Adopta una postura similar a tu pareja</li>
          <li>Iguala el ritmo de respiración</li>
          <li>Usa un tono de voz complementario</li>
          <li>Esto crea conexión subconsciente</li>
        </ul>
        
        <h4>Técnica 3: Anclaje de Estados Positivos</h4>
        <p>Crear "anclas" para momentos de conexión:</p>
        <ol>
          <li>En momentos de gran conexión y amor</li>
          <li>Creen juntos un gesto especial (tocarse la mano de cierta manera)</li>
          <li>Repitan este gesto en otros momentos positivos</li>
          <li>Úsenlo durante conflictos para recordar su conexión</li>
        </ol>
        
        <h3>Ejercicios Prácticos para Parejas</h3>
        
        <h4>Ejercicio 1: Apreciación Diaria</h4>
        <p>Cada día, cada miembro de la pareja comparte:</p>
        <ul>
          <li>Una cosa específica que apreció del otro</li>
          <li>Cómo esa acción o cualidad los hizo sentir</li>
          <li>Por qué es importante para la relación</li>
        </ul>
        
        <h4>Ejercicio 2: La Reunión Semanal de Pareja</h4>
        <p>Dediquen 30 minutos semanales para:</p>
        <ol>
          <li><strong>Apreciaciones (5 min):</strong> Compartir lo que valoraron</li>
          <li><strong>Temas pendientes (15 min):</strong> Discutir asuntos importantes</li>
          <li><strong>Planificación (5 min):</strong> Coordinar la semana siguiente</li>
          <li><strong>Conexión (5 min):</strong> Actividad física de conexión</li>
        </ol>
        
        <h4>Ejercicio 3: El Mapa de Amor</h4>
        <p>Crear y actualizar regularmente información sobre:</p>
        <ul>
          <li>Sueños y aspiraciones de tu pareja</li>
          <li>Sus mayores temores y preocupaciones</li>
          <li>Eventos importantes en su historia</li>
          <li>Sus preferencias y gustos actuales</li>
        </ul>
        
        <h3>Señales de Alerta: Cuándo Buscar Ayuda</h3>
        <p>Considera terapia de pareja si:</p>
        <ul>
          <li>Los conflictos se vuelven frecuentes y destructivos</li>
          <li>Sienten que no pueden comunicarse sin pelear</li>
          <li>Uno o ambos consideran terminar la relación</li>
          <li>Hay patrones de comportamiento dañinos</li>
          <li>Eventos específicos han dañado la confianza</li>
        </ul>
        
        <h3>Conclusión</h3>
        <p>La comunicación efectiva en pareja es una habilidad que se aprende y se practica. La metodología "Discutir con Estilo" ha demostrado que con las herramientas adecuadas, las parejas pueden transformar sus conflictos en oportunidades de crecimiento y conexión más profunda.</p>
        
        <p>Recuerden: el objetivo no es evitar los desacuerdos, sino aprender a navegarlos de manera que fortalezcan su relación en lugar de debilitarla.</p>
        
        <p><em>Si desean profundizar en estas técnicas con acompañamiento profesional, ofrecemos terapia de pareja especializada en la metodología "Discutir con Estilo" y técnicas de PNL para relaciones.</em></p>
      `
    },
    "6": {
      titulo: "La Importancia de la Salud Mental en el Trabajo",
      resumen: "Cómo mantener el bienestar emocional en el entorno laboral y prevenir el burnout.",
      fechaPublicacion: "10 de Mayo, 2025",
      tiempoLectura: "4 min",
      categoria: "Bienestar Laboral",
      autor: "Lic. Alberto Guevara",
      contenido: `
        <h3>El Burnout: Una Epidemia Silenciosa</h3>
        <p>Como especialista que ha investigado el burnout y desempeño laboral en profesionales de la salud del Hospital Carlos Monge Medrano de Juliaca, he observado de primera mano cómo el agotamiento profesional afecta no solo a los trabajadores, sino a la calidad de los servicios que brindan.</p>
        
        <p>El burnout, definido por la OMS como un síndrome de agotamiento ocupacional, se caracteriza por tres dimensiones principales: agotamiento emocional, despersonalización y baja realización personal.</p>
        
        <h3>Señales de Alerta del Burnout</h3>
        
        <h4>Síntomas Físicos:</h4>
        <ul>
          <li>Fatiga crónica que no mejora con el descanso</li>
          <li>Dolores de cabeza frecuentes</li>
          <li>Problemas gastrointestinales</li>
          <li>Insomnio o alteraciones del sueño</li>
          <li>Enfermarse con frecuencia</li>
        </ul>
        
        <h4>Síntomas Emocionales:</h4>
        <ul>
          <li>Sensación de agotamiento emocional</li>
          <li>Cinismo hacia el trabajo y colegas</li>
          <li>Irritabilidad aumentada</li>
          <li>Sentimientos de incompetencia</li>
          <li>Pérdida de motivación</li>
        </ul>
        
        <h4>Síntomas Comportamentales:</h4>
        <ul>
          <li>Ausentismo laboral</li>
          <li>Disminución en la productividad</li>
          <li>Aislamiento de colegas</li>
          <li>Aumento en el uso de sustancias</li>
          <li>Procrastinación en tareas importantes</li>
        </ul>
        
        <h3>Factores de Riesgo en Nuestro Contexto</h3>
        <p>En mi investigación en Juliaca, identifiqué factores específicos de nuestra región:</p>
        
        <h4>Factores Organizacionales:</h4>
        <ul>
          <li>Sobrecarga de trabajo debido a recursos limitados</li>
          <li>Falta de autonomía en la toma de decisiones</li>
          <li>Recompensas inadecuadas por el esfuerzo</li>
          <li>Ambiente laboral conflictivo</li>
          <li>Inseguridad laboral</li>
        </ul>
        
        <h4>Factores Individuales:</h4>
        <ul>
          <li>Perfeccionismo excesivo</li>
          <li>Dificultad para establecer límites</li>
          <li>Falta de estrategias de afrontamiento</li>
          <li>Pocas actividades de autocuidado</li>
          <li>Expectativas irrealistas sobre el trabajo</li>
        </ul>
        
        <h3>Estrategias de Prevención Individual</h3>
        
        <h4>1. Técnicas de Manejo del Estrés</h4>
        
        <h5>Respiración Consciente en el Trabajo:</h5>
        <ol>
          <li>Cada 2 horas, toma 3 respiraciones profundas</li>
          <li>Inhala por 4 segundos, retén por 4, exhala por 6</li>
          <li>Visualiza que exhalas la tensión</li>
          <li>Regresa a tus actividades con mayor calma</li>
        </ol>
        
        <h5>Micro-pausas Restauradoras:</h5>
        <ul>
          <li>Cada 50 minutos, toma 10 minutos de pausa</li>
          <li>Camina, estírate o mira por la ventana</li>
          <li>Evita revisar redes sociales durante estas pausas</li>
          <li>Enfócate en actividades que relajen tu mente</li>
        </ul>
        
        <h4>2. Establecimiento de Límites Saludables</h4>
        
        <h5>Límites de Tiempo:</h5>
        <ul>
          <li>Define horarios claros de inicio y fin del trabajo</li>
          <li>Evita revisar correos de trabajo fuera del horario</li>
          <li>Aprende a decir "no" a compromisos adicionales</li>
          <li>Delega tareas cuando sea posible</li>
        </ul>
        
        <h5>Límites Emocionales:</h5>
        <ul>
          <li>No lleves los problemas del trabajo a casa</li>
          <li>Desarrolla rituales de transición (cambio de ropa, música)</li>
          <li>Practica la compartimentalización mental</li>
          <li>Busca apoyo profesional si es necesario</li>
        </ul>
        
        <h4>3. Autocuidado Integral</h4>
        
        <h5>Cuidado Físico:</h5>
        <ul>
          <li>Mantén horarios regulares de sueño (7-8 horas)</li>
          <li>Aliméntate adecuadamente durante el día laboral</li>
          <li>Incluye actividad física regular</li>
          <li>Mantente hidratado</li>
        </ul>
        
        <h5>Cuidado Mental:</h5>
        <ul>
          <li>Practica mindfulness o meditación</li>
          <li>Lee libros no relacionados con el trabajo</li>
          <li>Desarrolla hobbies que te apasionen</li>
          <li>Mantén conexiones sociales fuera del trabajo</li>
        </ul>
        
        <h5>Cuidado Emocional:</h5>
        <ul>
          <li>Expresa tus emociones de manera saludable</li>
          <li>Busca apoyo en amigos y familia</li>
          <li>Considera terapia preventiva</li>
          <li>Practica la autocompasión</li>
        </ul>
        
        <h3>Técnicas de PNL para el Ambiente Laboral</h3>
        
        <h4>Técnica 1: Anclaje de Estados Productivos</h4>
        <ol>
          <li>Recuerda un momento de alta productividad y satisfacción laboral</li>
          <li>Revive esa experiencia con todos tus sentidos</li>
          <li>En el pico de esa sensación, toca tu muñeca izquierda</li>
          <li>Repite este proceso varias veces</li>
          <li>Usa el ancla cuando necesites motivación</li>
        </ol>
        
        <h4>Técnica 2: Reencuadre de Situaciones Estresantes</h4>
        <p>Cuando enfrentes una situación laboral difícil:</p>
        <ol>
          <li>Pregúntate: "¿Qué puedo aprender de esto?"</li>
          <li>"¿Cómo me está ayudando a crecer profesionalmente?"</li>
          <li>"¿Qué habilidades estoy desarrollando?"</li>
          <li>"¿Cómo puedo usar esta experiencia para ayudar a otros?"</li>
        </ol>
        
        <h4>Técnica 3: Visualización del Día Ideal</h4>
        <p>Cada mañana, dedica 5 minutos a visualizar:</p>
        <ul>
          <li>Tu día laboral transcurriendo de manera fluida</li>
          <li>Completando tareas con eficiencia y satisfacción</li>
          <li>Interacciones positivas con colegas</li>
          <li>Terminando el día sintiéndote realizado</li>
        </ul>
        
        <h3>Creando una Cultura de Bienestar en el Trabajo</h3>
        
        <h4>Como Líder o Supervisor:</h4>
        <ul>
          <li>Modela comportamientos de autocuidado</li>
          <li>Reconoce y valora el esfuerzo de tu equipo</li>
          <li>Facilita la comunicación abierta</li>
          <li>Ofrece flexibilidad cuando sea posible</li>
          <li>Proporciona recursos de apoyo</li>
        </ul>
        
        <h4>Como Compañero de Trabajo:</h4>
        <ul>
          <li>Ofrece apoyo a colegas que lo necesiten</li>
          <li>Comparte estrategias de manejo del estrés</li>
          <li>Crea un ambiente de trabajo positivo</li>
          <li>Respeta los límites de otros</li>
          <li>Celebra los logros del equipo</li>
        </ul>
        
        <h3>Cuándo Buscar Ayuda Profesional</h3>
        <p>Considera apoyo psicológico si:</p>
        <ul>
          <li>Los síntomas persisten por más de 3 meses</li>
          <li>Afectan significativamente tu rendimiento</li>
          <li>Impactan tus relaciones personales</li>
          <li>Experimentas síntomas físicos sin causa médica</li>
          <li>Tienes pensamientos de autolesión</li>
        </ul>
        
        <h3>Conclusión</h3>
        <p>La salud mental en el trabajo no es un lujo, es una necesidad. Como profesionales, tenemos la responsabilidad de cuidar nuestro bienestar emocional, no solo por nosotros mismos, sino por las personas a quienes servimos.</p>
        
        <p>Basado en mi investigación, he observado que cuando los profesionales cuidan su salud mental, no solo mejora su calidad de vida, sino también la calidad de su trabajo y su capacidad para contribuir positivamente a su organización y comunidad.</p>
        
        <p><em>Si estás experimentando burnout o estrés laboral crónico, recuerda que buscar ayuda es un signo de fortaleza, no de debilidad. Estamos aquí para apoyarte en tu proceso de recuperación y desarrollo de estrategias sostenibles de bienestar laboral.</em></p>
      `
    }
  };

  const articulo = articulosCompletos[id];

  if (!articulo) {
    return (
      <div className="articulo-container">
        {/* Breadcrumb Navigation */}
        <nav className="breadcrumb-nav">
          <span className="breadcrumb-item">
            <button onClick={() => navigate('/')} className="breadcrumb-link">
              Inicio
            </button>
          </span>
          <span className="breadcrumb-separator">→</span>
          <span className="breadcrumb-item">
            <button onClick={() => navigate('/blog')} className="breadcrumb-link">
              Blog
            </button>
          </span>
          <span className="breadcrumb-separator">→</span>
          <span className="breadcrumb-current">Artículo no encontrado</span>
        </nav>

        <div className="articulo-not-found">
          <div className="not-found-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h2>Artículo no encontrado</h2>
          <p>El artículo que buscas no existe o ha sido movido.</p>
          <button onClick={() => navigate('/blog')} className="btn-volver-blog">
            <i className="fas fa-arrow-left"></i>
            Volver al Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="articulo-container">
      {/* Breadcrumb Navigation - Actualizado */}
      <nav className="breadcrumb-nav">
        <span className="breadcrumb-item">
          <button onClick={() => navigate('/')} className="breadcrumb-link">
            Inicio
          </button>
        </span>
        <span className="breadcrumb-separator">→</span>
        <span className="breadcrumb-item">
          <button onClick={() => navigate('/blog')} className="breadcrumb-link">
            Blog
          </button>
        </span>
        <span className="breadcrumb-separator">→</span>
        <span className="breadcrumb-current">{articulo.categoria}</span>
      </nav>

      {/* Article Header */}
      <header className="articulo-header">
        <div className="articulo-meta-top">
          <span className="categoria-badge">{articulo.categoria}</span>
          <div className="meta-info">
            <span className="fecha">
              <i className="fas fa-calendar-alt"></i>
              {articulo.fechaPublicacion}
            </span>
            <span className="tiempo-lectura">
              <i className="fas fa-clock"></i>
              {articulo.tiempoLectura} de lectura
            </span>
          </div>
        </div>
        
        <h1 className="articulo-titulo">{articulo.titulo}</h1>
        <p className="articulo-resumen">{articulo.resumen}</p>
        
        <div className="autor-section">
          <div className="autor-avatar">
            <i className="fas fa-user-md"></i>
          </div>
          <div className="autor-details">
            <span className="autor-nombre">{articulo.autor}</span>
            <span className="autor-especialidad">Psicólogo Clínico Especialista</span>
          </div>
        </div>
      </header>

      <div className="articulo-contenido">
        <div dangerouslySetInnerHTML={{ __html: articulo.contenido }} />
      </div>

      <div className="articulo-footer">
        <div className="compartir-section">
          <h4>¿Te resultó útil este artículo?</h4>
          <p>Compártelo con alguien que pueda beneficiarse de esta información.</p>
          <div className="compartir-buttons">
            <button 
              className="btn-compartir whatsapp"
              onClick={handleWhatsAppShare}
            >
              <i className="fab fa-whatsapp"></i>
              Compartir en WhatsApp
            </button>
            <button 
              className="btn-compartir facebook"
              onClick={handleFacebookShare}
            >
              <i className="fab fa-facebook-f"></i>
              Compartir en Facebook
            </button>
          </div>
        </div>
        
        <div className="contacto-cta">
          <h4>¿Necesitas ayuda personalizada?</h4>
          <p>Si este artículo resonó contigo y deseas profundizar en estas técnicas con acompañamiento profesional, estamos aquí para ayudarte.</p>
          <button 
            onClick={() => navigate('/contacto')} 
            className="btn-contacto"
          >
            <i className="fas fa-calendar-plus"></i>
            Solicitar Consulta
          </button>
        </div>
      </div>
    </div>
  );
}
