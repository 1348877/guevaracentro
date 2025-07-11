import React from 'react';
import './Terms.css';

const Terms = () => {
  return (
    <div className="terms-container">
      <div className="terms-content">
        <h1>Términos y Condiciones de Servicio</h1>
        <p className="last-updated">Última actualización: {new Date().toLocaleDateString()}</p>
        
        <section>
          <h2>1. Aceptación de los términos</h2>
          <p>
            Al acceder y utilizar los servicios de Centro Psicológico Guevara, usted acepta 
            estar sujeto a estos términos y condiciones.
          </p>
        </section>

        <section>
          <h2>2. Descripción del servicio</h2>
          <p>
            Centro Psicológico Guevara proporciona servicios de atención psicológica 
            incluyendo consultas, terapias, y herramientas digitales para el bienestar mental.
          </p>
        </section>

        <section>
          <h2>3. Registro y cuenta de usuario</h2>
          <p>
            Para utilizar ciertos servicios, debe crear una cuenta proporcionando información 
            precisa y actualizada. Usted es responsable de mantener la confidencialidad de 
            su cuenta y contraseña.
          </p>
        </section>

        <section>
          <h2>4. Uso apropiado</h2>
          <p>Usted se compromete a:</p>
          <ul>
            <li>Usar los servicios únicamente para fines legítimos</li>
            <li>No interferir con el funcionamiento de los servicios</li>
            <li>Respetar los derechos de otros usuarios</li>
            <li>Proporcionar información veraz y actualizada</li>
          </ul>
        </section>

        <section>
          <h2>5. Privacidad y confidencialidad</h2>
          <p>
            Nos comprometemos a proteger su privacidad y mantener la confidencialidad de 
            su información personal y médica de acuerdo con nuestras políticas de privacidad 
            y las regulaciones aplicables.
          </p>
        </section>

        <section>
          <h2>6. Limitación de responsabilidad</h2>
          <p>
            Los servicios se proporcionan "tal como están". No garantizamos que los servicios 
            sean ininterrumpidos, seguros o libres de errores.
          </p>
        </section>

        <section>
          <h2>7. Modificaciones</h2>
          <p>
            Nos reservamos el derecho de modificar estos términos en cualquier momento. 
            Le notificaremos sobre cambios significativos a través de nuestros servicios.
          </p>
        </section>

        <section>
          <h2>8. Contacto</h2>
          <p>
            Para preguntas sobre estos términos, contacte: 
            <a href="mailto:legendsub888@gmail.com">legendsub888@gmail.com</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
