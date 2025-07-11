import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTiktok, faWhatsapp, faInstagram, faYoutube, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Centro Psicológico Integral Guevara</h3>
          <p>Acompañándote en tu bienestar mental y emocional</p>
          <div className="contact-info">
            <p><FontAwesomeIcon icon={faPhone} /> 962 376 425 | 977 527 381</p>
            <p><FontAwesomeIcon icon={faEnvelope} /> alberto.guevara.ps@gmail.com</p>
            <p>📍 Independencia 211, Juliaca 21104, Puno</p>
          </div>
          
          <div className="social-media">
            <h4>Síguenos en Redes Sociales</h4>
            <div className="social-icons">
              <a href="https://www.facebook.com/CentroPsicologicoGuevara" target="_blank" rel="noopener noreferrer" className="social-icon facebook" title="Facebook">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="https://www.tiktok.com/@consultorioamar" target="_blank" rel="noopener noreferrer" className="social-icon tiktok" title="TikTok">
                <FontAwesomeIcon icon={faTiktok} />
              </a>
              <a href="https://www.instagram.com/centropsicologicoguevara" target="_blank" rel="noopener noreferrer" className="social-icon instagram" title="Instagram">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="https://www.youtube.com/@centropsicologicoguevara" target="_blank" rel="noopener noreferrer" className="social-icon youtube" title="YouTube">
                <FontAwesomeIcon icon={faYoutube} />
              </a>
              <a href="https://www.linkedin.com/in/alberto-guevara-psicologo" target="_blank" rel="noopener noreferrer" className="social-icon linkedin" title="LinkedIn">
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
              <a href="https://wa.me/51962376425" target="_blank" rel="noopener noreferrer" className="social-icon whatsapp" title="WhatsApp">
                <FontAwesomeIcon icon={faWhatsapp} />
              </a>
              <a href="mailto:alberto.guevara.ps@gmail.com" className="social-icon email" title="Email">
                <FontAwesomeIcon icon={faEnvelope} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Servicios</h4>
          <ul>
            <li>Psicoterapia Individual</li>
            <li>Terapia de Pareja</li>
            <li>Terapia Familiar</li>
            <li>Evaluaciones Psicológicas</li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Enlaces Útiles</h4>
          <ul>
            <li><a href="/nosotros">Sobre Nosotros</a></li>
            <li><a href="/equipo">Nuestro Equipo</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/faq">Preguntas Frecuentes</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Horarios de Atención</h4>
          <div className="schedule">
            <p>Lunes - Viernes: 8:00 AM - 7:00 PM</p>
            <p>Sábados: 8:00 AM - 1:00 PM</p>
            <p>Domingos: Solo emergencias</p>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2025 Centro Psicológico Integral Guevara. Todos los derechos reservados.</p>
        <div className="footer-links">
          <a href="/privacy">Política de Privacidad</a>
          <span>|</span>
          <a href="/terms">Términos de Servicio</a>
        </div>
      </div>
    </footer>
  );
}
