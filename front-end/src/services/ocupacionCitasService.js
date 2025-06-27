// Servicio para obtener la ocupación de citas por mes
import axios from 'axios';

export async function getOcupacionCitas(mes) {
  // mes: 'YYYY-MM'
  const res = await axios.get(`/api/citas/ocupacion?mes=${mes}`);
  return res.data; // [{ fecha: '2025-06-27', totalCitas: 5 }, ...]
}
