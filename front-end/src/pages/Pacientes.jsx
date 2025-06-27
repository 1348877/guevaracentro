import React, { useEffect, useState } from 'react';
import { getPacientes } from '../services/pacientesService';

export default function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPacientes()
      .then(setPacientes)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
      <h2>Pacientes</h2>
      <p>Listado de pacientes registrados en el centro psicológico.</p>
      {loading && <p>Cargando...</p>}
      {error && <p style={{color:'red'}}>Error: {error}</p>}
      {!loading && !error && (
        <table style={{ margin: '0 auto', borderCollapse: 'collapse', minWidth: '60%' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Nombres</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Apellidos</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>DNI</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Teléfono</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Email</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map(p => (
              <tr key={p.id}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{p.nombres}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{p.apellidos}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{p.dni}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{p.telefono}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{p.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
