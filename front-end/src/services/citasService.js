const API_URL = 'http://localhost:3001/api/citas';

export async function getCitas() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Error al obtener citas');
  return response.json();
}

export async function createCita(data) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Error al crear cita');
  return response.json();
}
