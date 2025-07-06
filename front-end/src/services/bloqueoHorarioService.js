import axios from 'axios';

export async function getBloqueosDia(fecha) {
  const res = await axios.get(`/api/citas/bloqueos?fecha=${fecha}`);
  return res.data; // [{ fechaHora, expiresAt }]
}

export async function bloquearHorario(fechaHora, userId) {
  const res = await axios.post('/api/citas/bloquear', { fechaHora, userId });
  return res.data;
}

export async function liberarHorario(fechaHora, userId) {
  const res = await axios.post('/api/citas/liberar', { fechaHora, userId });
  return res.data;
}
