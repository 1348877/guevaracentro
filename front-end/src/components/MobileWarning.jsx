import React, { useState, useEffect } from 'react';
import './MobileWarning.css';

export default function MobileWarning() {
  const [show, setShow] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  
  useEffect(() => {
    // Solo mostrar en dispositivos móviles con pantalla pequeña
    const checkMobile = () => {
      const portrait = window.innerHeight > window.innerWidth;
      setIsPortrait(portrait);
      
      if (window.innerWidth < 600) {
        setShow(true);
        
        // Ocultar después de 15 segundos si el usuario no cierra manualmente
        const timer = setTimeout(() => {
          handleClose();
        }, 15000);
        
        return () => clearTimeout(timer);
      } else {
        setShow(false);
      }
    };
    
    checkMobile();
    
    // Verificar también en cambios de orientación
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);
  
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShow(false);
      setIsClosing(false);
    }, 500); // Duración de la animación de cierre
  };
  
  if (!show) return null;
  
  return (
    <div className={`mobile-warning ${isClosing ? 'closing' : ''} ${isPortrait ? 'portrait-mode' : ''}`}>
      <div className="warning-content">
        <div className="warning-icon">
          {isPortrait ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="3" width="14" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="7" x2="15" y2="7"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          )}
        </div>
        <div className="warning-text">
          <h4>Optimización Móvil</h4>
          {isPortrait ? (
            <p>
              Para una mejor experiencia, le recomendamos <strong>rotar su dispositivo horizontalmente</strong> o utilizar un dispositivo con pantalla más grande.
            </p>
          ) : (
            <p>
              Gracias por rotar su dispositivo. Esta orientación brinda una mejor experiencia visual para nuestro contenido.
            </p>
          )}
          <div className="device-icon">
            <div className="rotate-animation"></div>
          </div>
        </div>
        <button onClick={handleClose} className="close-warning" aria-label="Cerrar aviso">
          <span>Entendido</span>
        </button>
      </div>
    </div>
  );
}
