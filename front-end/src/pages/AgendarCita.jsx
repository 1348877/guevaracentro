import React, { useState, useEffect } from 'react';
import { getPacientes } from '../services/pacientesService';
import { createCita } from '../services/citasService';

export default function AgendarCita() {
  const [pacientes, setPacientes] = useState([]);
  const [form, setForm] = useState({ pacienteId: '', fecha: '', motivo: '', notas: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPacientes().then(setPacientes);
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await createCita({ ...form, estado: 'pendiente' });
      setSuccess('Cita agendada correctamente');
      setForm({ pacienteId: '', fecha: '', motivo: '', notas: '' });
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
      <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <select name="pacienteId" value={form.pacienteId} onChange={handleChange} required>
          <option value="">Selecciona un paciente</option>
          {pacientes.map(p => (
            <option key={p.id} value={p.id}>{p.nombres} {p.apellidos}</option>
          ))}
        </select>
        <input type="datetime-local" name="fecha" value={form.fecha} onChange={handleChange} required />
        <input type="text" name="motivo" value={form.motivo} onChange={handleChange} placeholder="Motivo" required />
        <textarea name="notas" value={form.notas} onChange={handleChange} placeholder="Notas adicionales" />
        <button type="submit" disabled={loading}>{loading ? 'Agendando...' : 'Agendar Cita'}</button>
      </form>
      {success && <p style={{color:'green'}}>{success}</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
    </div>
  );
}
