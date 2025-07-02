import React from 'react';
import './DrAlbertoProfile.css';

export default function DrAlbertoProfile() {
  return (
    <div className="doctor-profile">
      <div className="doctor-header">
        <h2>Dr. Alberto Emilio Guevara</h2>
        <p className="doctor-title">Psicólogo Clínico • Magíster en Gestión de Servicios de Salud • Coach Profesional PNL</p>
      </div>
      
      <div className="doctor-credentials">
        <div className="credential-item">
          <span className="credential-icon">🏛️</span>
          <div className="credential-content">
            <p><strong>Colegiatura N° 25961</strong> - Colegio de Psicólogos del Perú</p>
          </div>
        </div>
        
        <div className="credential-item">
          <span className="credential-icon">🌍</span>
          <div className="credential-content">
            <p><strong>Miembro AICM N° 13931</strong> - Asociación Internacional de Coaching y Mentoring</p>
          </div>
        </div>
        
        <div className="credential-item">
          <span className="credential-icon">🎓</span>
          <div className="credential-content">
            <p><strong>Universidad César Vallejo</strong> • Universidad Continental</p>
          </div>
        </div>
      </div>
      
      <p className="doctor-bio">
        Especialista en psicología organizacional de la salud, 
        psicología clínica y gestión de servicios sanitarios. Investigador 
        comprometido con el bienestar mental en el contexto comunitario, cuya 
        investigación "Salud mental en el contexto de COVID-19 y su impacto en 
        personal sanitario" marca un hito en la aplicación de conocimientos para 
        problemas reales de la comunidad.
      </p>
      
      <div className="doctor-specialties">
        <div className="specialty-item">
          <span className="specialty-icon">🎯</span>
          <p>Coaching Profesional con PNL</p>
        </div>
        
        <div className="specialty-item">
          <span className="specialty-icon">🏥</span>
          <p>Psicología Organizacional de la Salud</p>
        </div>
        
        <div className="specialty-item">
          <span className="specialty-icon">🧠</span>
          <p>Investigación Aplicada en Salud Mental</p>
        </div>
      </div>
      
      <a href="/equipo" className="profile-link-btn">Ver Perfil Completo y Credenciales</a>
    </div>
  );
}
