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
      <h2 style={{ fontSize: '2.2rem', marginBottom: 8 }}>Pacientes</h2>
      <p style={{ fontSize: '1.2rem', marginBottom: 24 }}>Listado de pacientes registrados en el centro psicológico.</p>
      {loading && <p style={{ fontSize: '1.1rem' }}>Cargando...</p>}
      {error && <p style={{color:'red', fontSize: '1.1rem'}}>Error: {error}</p>}
      {!loading && !error && (
        <table style={{ margin: '0 auto', borderCollapse: 'collapse', minWidth: '60%', fontSize: '1.15rem', boxShadow: '0 2px 12px #0001', borderRadius: 12, overflow: 'hidden' }}>
          <thead style={{ background: '#f5f5f5' }}>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '14px 10px' }}>Nombres</th>
              <th style={{ border: '1px solid #ccc', padding: '14px 10px' }}>Apellidos</th>
              <th style={{ border: '1px solid #ccc', padding: '14px 10px' }}>DNI</th>
              <th style={{ border: '1px solid #ccc', padding: '14px 10px' }}>Teléfono</th>
              <th style={{ border: '1px solid #ccc', padding: '14px 10px' }}>Email</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map(p => (
              <tr key={p.id}>
                <td style={{ border: '1px solid #eee', padding: '12px 10px' }}>{p.nombres}</td>
                <td style={{ border: '1px solid #eee', padding: '12px 10px' }}>{p.apellidos}</td>
                <td style={{ border: '1px solid #eee', padding: '12px 10px' }}>{p.dni}</td>
                <td style={{ border: '1px solid #eee', padding: '12px 10px' }}>{p.telefono}</td>
                <td style={{ border: '1px solid #eee', padding: '12px 10px' }}>{p.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
