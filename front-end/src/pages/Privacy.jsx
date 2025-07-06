import React from 'react';
import './Privacy.css';

const Privacy = () => {
  return (
    <div className="privacy-container">
      <div className="privacy-content">
        <h1>Política de Privacidad</h1>
        <p className="last-updated">Última actualización: {new Date().toLocaleDateString()}</p>
        
        <section>
          <h2>1. Información que recopilamos</h2>
          <p>
            Centro Psicológico Guevara recopila información personal que usted nos proporciona 
            directamente, como su nombre, correo electrónico, y información de contacto cuando 
            utiliza nuestros servicios.
          </p>
        </section>

        <section>
          <h2>2. Cómo utilizamos su información</h2>
          <p>Utilizamos su información para:</p>
          <ul>
            <li>Proporcionar y mejorar nuestros servicios</li>
            <li>Comunicarnos con usted sobre citas y servicios</li>
            <li>Cumplir con nuestras obligaciones legales</li>
            <li>Proteger la seguridad y privacidad de nuestros usuarios</li>
          </ul>
        </section>

        <section>
          <h2>3. Autenticación con Google</h2>
          <p>
            Cuando utiliza el inicio de sesión con Google, recopilamos información básica 
            de su perfil (nombre, correo electrónico) para crear y mantener su cuenta. 
            Esta información se utiliza únicamente para proporcionar nuestros servicios.
          </p>
        </section>

        <section>
          <h2>4. Protección de datos</h2>
          <p>
            Implementamos medidas de seguridad técnicas y organizativas apropiadas para 
            proteger su información personal contra el acceso no autorizado, alteración, 
            divulgación o destrucción.
          </p>
        </section>

        <section>
          <h2>5. Sus derechos</h2>
          <p>Usted tiene derecho a:</p>
          <ul>
            <li>Acceder a su información personal</li>
            <li>Rectificar datos inexactos</li>
            <li>Solicitar la eliminación de sus datos</li>
            <li>Oponerse al procesamiento de sus datos</li>
          </ul>
        </section>

        <section>
          <h2>6. Contacto</h2>
          <p>
            Si tiene preguntas sobre esta política de privacidad, puede contactarnos en: 
            <a href="mailto:legendsub888@gmail.com">legendsub888@gmail.com</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
