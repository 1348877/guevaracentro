const API_URL = 'http://localhost:3001/api/pacientes';

export async function getPacientes() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Error al obtener pacientes');
  return response.json();
}
