import React, { useState, useEffect } from 'react';
import PacientesService from '../services/pacientesService';
import { createCita } from '../services/citasService';
import CalendarioOcupacion from '../components/CalendarioOcupacion';
import { useNavigate } from 'react-router-dom';
import { getBloqueosDia, bloquearHorario, liberarHorario } from '../services/bloqueoHorarioService';

export default function AgendarCita() {
  const [pacientes, setPacientes] = useState([]);
  const [form, setForm] = useState({ pacienteId: '', fecha: '', motivo: '', notas: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [mes, setMes] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 7); // 'YYYY-MM'
  });
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [horaSeleccionada, setHoraSeleccionada] = useState('');
  const [bloqueos, setBloqueos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    PacientesService.getPacientes().then(setPacientes);
  }, []);

  // Guardar datos de cita en localStorage
  const saveCitaDraft = (draft) => {
    localStorage.setItem('citaDraft', JSON.stringify(draft));
  };

  // Recuperar draft si existe
  useEffect(() => {
    const draft = localStorage.getItem('citaDraft');
    if (draft) {
      try {
        const data = JSON.parse(draft);
        setForm(data);
        if (data.fecha) setFechaSeleccionada(data.fecha.split('T')[0]);
      } catch {}
    }
  }, []);

  // Cargar bloqueos y horas disponibles al seleccionar fecha
  useEffect(() => {
    if (!fechaSeleccionada) return;
    // Horario: 8am a 7pm (última cita inicia 18:00)
    const horas = [];
    for (let h = 8; h <= 18; h++) {
      horas.push(`${h.toString().padStart(2, '0')}:00`);
    }
    setHorasDisponibles(horas);
    getBloqueosDia(fechaSeleccionada).then(setBloqueos);
  }, [fechaSeleccionada]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Al seleccionar hora, intentar bloquearla
  const handleSelectHora = async (hora) => {
    const userId = localStorage.getItem('token') || 'anon';
    const fechaHora = `${fechaSeleccionada}T${hora}`;
    try {
      await bloquearHorario(fechaHora, userId);
      setHoraSeleccionada(hora);
    } catch (e) {
      alert('Esta hora está temporalmente bloqueada. Elige otra.');
    }
  };

  // Al cancelar o cambiar de hora, liberar bloqueo anterior
  useEffect(() => {
    return () => {
      if (fechaSeleccionada && horaSeleccionada) {
        const userId = localStorage.getItem('token') || 'anon';
        const fechaHora = `${fechaSeleccionada}T${horaSeleccionada}`;
        liberarHorario(fechaHora, userId);
      }
    };
  }, [fechaSeleccionada, horaSeleccionada]);

  // Al enviar el formulario, liberar el bloqueo (ya se agenda la cita)
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    const token = localStorage.getItem('token');
    if (!token) {
      saveCitaDraft(form);
      navigate('/login-redirect');
      setLoading(false);
      return;
    }
    try {
      await createCita({ ...form, estado: 'pendiente' });
      setSuccess('Cita agendada correctamente');
      setForm({ pacienteId: '', fecha: '', motivo: '', notas: '' });
      localStorage.removeItem('citaDraft');
      // Liberar bloqueo
      if (fechaSeleccionada && horaSeleccionada) {
        const userId = token;
        const fechaHora = `${fechaSeleccionada}T${horaSeleccionada}`;
        await liberarHorario(fechaHora, userId);
      }
    } catch (err) {
      setError('Error al agendar cita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
      <h2>Agendar Cita</h2>
      <p>Aquí podrás agendar una nueva cita para un paciente.</p>
      <h2>Selecciona una fecha</h2>
      <CalendarioOcupacion mes={mes} onSelectDia={setFechaSeleccionada} />
      {fechaSeleccionada && (
        <div style={{ margin: '1rem 0' }}>
          <h3>Selecciona una hora</h3>
          {horasDisponibles.map(hora => {
            const bloqueada = bloqueos.some(b => b.fechaHora.endsWith(hora));
            return (
              <button
                key={hora}
                onClick={() => handleSelectHora(hora)}
                disabled={bloqueada}
                style={{ margin: 4, padding: 8, borderRadius: 6, background: bloqueada ? '#ccc' : (horaSeleccionada === hora ? '#222' : '#fff'), color: bloqueada ? '#888' : '#222', border: '1px solid #ddd' }}
              >
                {hora}
              </button>
            );
          })}
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <select name="pacienteId" value={form.pacienteId} onChange={handleChange} required>
          <option value="">Selecciona un paciente</option>
          {pacientes.map(p => (
            <option key={p.id} value={p.id}>{p.nombres} {p.apellidos}</option>
          ))}
        </select>
        <input type="hidden" name="fecha" value={fechaSeleccionada && horaSeleccionada ? `${fechaSeleccionada}T${horaSeleccionada}` : ''} />
        <input type="text" name="motivo" value={form.motivo} onChange={handleChange} placeholder="Motivo" required />
        <textarea name="notas" value={form.notas} onChange={handleChange} placeholder="Notas adicionales" />
        <button type="submit" disabled={loading}>{loading ? 'Agendando...' : 'Agendar Cita'}</button>
      </form>
      {success && <p style={{color:'green'}}>{success}</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
    </div>
  );
}
