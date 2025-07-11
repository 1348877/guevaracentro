// Email Notification Service
class EmailNotificationService {
  constructor() {
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-backend-url.com/api' 
      : 'http://localhost:3000/api';
    this.templates = {
      CITA_CONFIRMADA: 'cita_confirmada',
      CITA_CANCELADA: 'cita_cancelada',
      CITA_RECORDATORIO: 'cita_recordatorio',
      NUEVO_MENSAJE: 'nuevo_mensaje',
      BIENVENIDA: 'bienvenida',
      RECUPERAR_PASSWORD: 'recuperar_password',
      CAMBIO_HORARIO: 'cambio_horario',
      EVALUACION_PENDIENTE: 'evaluacion_pendiente'
    };
  }

  // Enviar email de confirmación de cita
  async sendAppointmentConfirmation(appointmentData) {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify({
          template: this.templates.CITA_CONFIRMADA,
          to: appointmentData.email,
          data: {
            nombrePaciente: appointmentData.nombrePaciente,
            fechaCita: appointmentData.fecha,
            horaCita: appointmentData.hora,
            psicologo: appointmentData.psicologo,
            tipoTerapia: appointmentData.tipoTerapia,
            modalidad: appointmentData.modalidad,
            instrucciones: appointmentData.instrucciones,
            linkReunion: appointmentData.linkReunion
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Error al enviar email: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Email de confirmación enviado:', result);
      return result;
    } catch (error) {
      console.error('❌ Error al enviar email de confirmación:', error);
      throw error;
    }
  }

  // Enviar email de cancelación de cita
  async sendAppointmentCancellation(appointmentData) {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify({
          template: this.templates.CITA_CANCELADA,
          to: appointmentData.email,
          data: {
            nombrePaciente: appointmentData.nombrePaciente,
            fechaCita: appointmentData.fecha,
            horaCita: appointmentData.hora,
            psicologo: appointmentData.psicologo,
            motivoCancelacion: appointmentData.motivo,
            linkReagendar: appointmentData.linkReagendar
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Error al enviar email: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Email de cancelación enviado:', result);
      return result;
    } catch (error) {
      console.error('❌ Error al enviar email de cancelación:', error);
      throw error;
    }
  }

  // Enviar recordatorio de cita
  async sendAppointmentReminder(appointmentData) {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify({
          template: this.templates.CITA_RECORDATORIO,
          to: appointmentData.email,
          data: {
            nombrePaciente: appointmentData.nombrePaciente,
            fechaCita: appointmentData.fecha,
            horaCita: appointmentData.hora,
            psicologo: appointmentData.psicologo,
            tipoTerapia: appointmentData.tipoTerapia,
            modalidad: appointmentData.modalidad,
            linkReunion: appointmentData.linkReunion,
            instrucciones: appointmentData.instrucciones
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Error al enviar email: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Email de recordatorio enviado:', result);
      return result;
    } catch (error) {
      console.error('❌ Error al enviar email de recordatorio:', error);
      throw error;
    }
  }

  // Enviar notificación de nuevo mensaje
  async sendNewMessageNotification(messageData) {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify({
          template: this.templates.NUEVO_MENSAJE,
          to: messageData.recipientEmail,
          data: {
            nombreRemitente: messageData.senderName,
            mensaje: messageData.message,
            fechaMensaje: messageData.timestamp,
            linkChat: messageData.chatLink
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Error al enviar email: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Email de nuevo mensaje enviado:', result);
      return result;
    } catch (error) {
      console.error('❌ Error al enviar email de nuevo mensaje:', error);
      throw error;
    }
  }

  // Enviar email de bienvenida
  async sendWelcomeEmail(userData) {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify({
          template: this.templates.BIENVENIDA,
          to: userData.email,
          data: {
            nombreCompleto: userData.nombreCompleto,
            tipoUsuario: userData.tipoUsuario,
            linkPlataforma: userData.linkPlataforma,
            linkSoporte: userData.linkSoporte,
            siguientesPasos: userData.siguientesPasos
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Error al enviar email: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Email de bienvenida enviado:', result);
      return result;
    } catch (error) {
      console.error('❌ Error al enviar email de bienvenida:', error);
      throw error;
    }
  }

  // Enviar email de recuperación de contraseña
  async sendPasswordRecovery(userData) {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          template: this.templates.RECUPERAR_PASSWORD,
          to: userData.email,
          data: {
            nombreCompleto: userData.nombreCompleto,
            resetToken: userData.resetToken,
            linkReset: userData.linkReset,
            expiracion: userData.expiracion
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Error al enviar email: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Email de recuperación enviado:', result);
      return result;
    } catch (error) {
      console.error('❌ Error al enviar email de recuperación:', error);
      throw error;
    }
  }

  // Enviar notificación de cambio de horario
  async sendScheduleChange(appointmentData) {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify({
          template: this.templates.CAMBIO_HORARIO,
          to: appointmentData.email,
          data: {
            nombrePaciente: appointmentData.nombrePaciente,
            fechaAnterior: appointmentData.fechaAnterior,
            horaAnterior: appointmentData.horaAnterior,
            fechaNueva: appointmentData.fechaNueva,
            horaNueva: appointmentData.horaNueva,
            psicologo: appointmentData.psicologo,
            motivoCambio: appointmentData.motivo,
            linkReunion: appointmentData.linkReunion
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Error al enviar email: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Email de cambio de horario enviado:', result);
      return result;
    } catch (error) {
      console.error('❌ Error al enviar email de cambio de horario:', error);
      throw error;
    }
  }

  // Enviar notificación de evaluación pendiente
  async sendEvaluationReminder(evaluationData) {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify({
          template: this.templates.EVALUACION_PENDIENTE,
          to: evaluationData.email,
          data: {
            nombrePaciente: evaluationData.nombrePaciente,
            tipoEvaluacion: evaluationData.tipoEvaluacion,
            fechaLimite: evaluationData.fechaLimite,
            linkEvaluacion: evaluationData.linkEvaluacion,
            psicologo: evaluationData.psicologo,
            instrucciones: evaluationData.instrucciones
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Error al enviar email: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Email de evaluación enviado:', result);
      return result;
    } catch (error) {
      console.error('❌ Error al enviar email de evaluación:', error);
      throw error;
    }
  }

  // Enviar email personalizado
  async sendCustomEmail(emailData) {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/email/custom`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify({
          to: emailData.to,
          cc: emailData.cc,
          bcc: emailData.bcc,
          subject: emailData.subject,
          htmlContent: emailData.htmlContent,
          textContent: emailData.textContent,
          attachments: emailData.attachments
        })
      });

      if (!response.ok) {
        throw new Error(`Error al enviar email: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Email personalizado enviado:', result);
      return result;
    } catch (error) {
      console.error('❌ Error al enviar email personalizado:', error);
      throw error;
    }
  }

  // Obtener estado de entrega de email
  async getEmailStatus(emailId) {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/email/${emailId}/status`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error al obtener estado: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('❌ Error al obtener estado del email:', error);
      throw error;
    }
  }

  // Obtener historial de emails
  async getEmailHistory(userId = null, limit = 50) {
    try {
      const params = new URLSearchParams({
        limit: limit.toString()
      });
      
      if (userId) {
        params.append('userId', userId);
      }

      const response = await fetch(`${this.baseUrl}/notifications/email/history?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error al obtener historial: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('❌ Error al obtener historial de emails:', error);
      throw error;
    }
  }

  // Configurar preferencias de notificación
  async setNotificationPreferences(preferences) {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify(preferences)
      });

      if (!response.ok) {
        throw new Error(`Error al configurar preferencias: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Preferencias de notificación actualizadas:', result);
      return result;
    } catch (error) {
      console.error('❌ Error al configurar preferencias:', error);
      throw error;
    }
  }

  // Obtener preferencias de notificación
  async getNotificationPreferences() {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/preferences`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error al obtener preferencias: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('❌ Error al obtener preferencias:', error);
      throw error;
    }
  }

  // Obtener token de autenticación
  getToken() {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  }

  // Validar formato de email
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Obtener templates disponibles
  getAvailableTemplates() {
    return Object.keys(this.templates).map(key => ({
      key,
      value: this.templates[key],
      name: key.replace(/_/g, ' ').toLowerCase()
    }));
  }
}

// Instancia singleton
const emailNotificationService = new EmailNotificationService();
export default emailNotificationService;
