import React, { useEffect, useState } from 'react';
import { getOcupacionCitas } from '../services/ocupacionCitasService';

// Utilidad para determinar color según cantidad de citas
function getColor(totalCitas) {
  if (totalCitas === 0) return 'green';
  if (totalCitas <= 4) return 'yellow'; // <=4 citas: ocupación media
  return 'red'; // >4 citas: alta ocupación
}

// Genera los días del mes
function getDiasMes(year, month) {
  const dias = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    dias.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return dias;
}

export default function CalendarioOcupacion({ mes, onSelectDia }) {
  // mes: 'YYYY-MM'
  const [ocupacion, setOcupacion] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getOcupacionCitas(mes).then(data => {
      if (!Array.isArray(data)) {
        setOcupacion([]);
      } else {
        setOcupacion(data);
      }
      setLoading(false);
    }).catch(() => {
      setOcupacion([]);
      setLoading(false);
    });
  }, [mes]);

  if (loading) return <div>Cargando calendario...</div>;

  const [year, month] = mes.split('-').map(Number);
  const dias = getDiasMes(year, month - 1);

  return (
    <div className="calendario-ocupacion">
      {dias.map(dia => {
        const fechaStr = dia.toISOString().slice(0, 10);
        const info = ocupacion.find(o => o.fecha === fechaStr) || { totalCitas: 0 };
        const color = getColor(info.totalCitas);
        return (
          <button
            key={fechaStr}
            style={{ background: color, margin: 2, padding: 8, borderRadius: 6, border: 'none', color: '#222' }}
            onClick={() => onSelectDia(fechaStr)}
          >
            {dia.getDate()}
          </button>
        );
      })}
    </div>
  );
}
