import React, { useState } from 'react';
import './ChatFeedback.css';

const ChatFeedback = ({ message, onFeedback, onClose }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);
    
    try {
      await onFeedback({
        messageId: message.id,
        rating,
        comment,
        timestamp: new Date().toISOString(),
        messageContent: message.content,
        userMessage: message.userMessage
      });
      
      onClose();
    } catch (error) {
      console.error('Error al enviar feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (value) => {
    setRating(value);
  };

  return (
    <div className="chat-feedback-overlay">
      <div className="chat-feedback-modal">
        <div className="feedback-header">
          <h3>¿Cómo fue esta respuesta?</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="feedback-content">
          <div className="message-preview">
            <p><strong>Tu pregunta:</strong> {message.userMessage}</p>
            <p><strong>Respuesta:</strong> {message.content}</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="rating-section">
              <label>Calificación:</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star ${rating >= star ? 'active' : ''}`}
                    onClick={() => handleRatingClick(star)}
                  >
                    ★
                  </button>
                ))}
              </div>
              <span className="rating-text">
                {rating === 0 && 'Selecciona una calificación'}
                {rating === 1 && 'Muy mala'}
                {rating === 2 && 'Mala'}
                {rating === 3 && 'Regular'}
                {rating === 4 && 'Buena'}
                {rating === 5 && 'Excelente'}
              </span>
            </div>
            
            <div className="comment-section">
              <label>Comentarios (opcional):</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="¿Cómo podríamos mejorar esta respuesta?"
                rows="3"
              />
            </div>
            
            <div className="feedback-actions">
              <button type="button" onClick={onClose} className="cancel-btn">
                Cancelar
              </button>
              <button 
                type="submit" 
                className="submit-btn" 
                disabled={rating === 0 || isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Feedback'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatFeedback;
