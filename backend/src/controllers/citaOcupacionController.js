// Endpoint para obtener la ocupación diaria de citas en un mes
// Responde con un array de objetos: [{ fecha: '2025-06-27', totalCitas: 5 }, ...]
// Se usará para pintar el calendario con colores según ocupación

const { Cita } = require('../models/Cita');
const { Op } = require('sequelize');

// Parámetros: req.query.mes (YYYY-MM), opcional: req.query.psicologoId
async function getOcupacionMensual(req, res) {
  try {
    const { mes, psicologoId } = req.query;
    if (!mes) return res.status(400).json({ error: 'Falta el parámetro mes (YYYY-MM)' });
    const start = new Date(`${mes}-01T00:00:00`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    // Filtro base
    const where = {
      fecha: {
        [Op.gte]: start,
        [Op.lt]: end
      }
    };
    if (psicologoId) where.psicologoId = psicologoId;

    // Traer todas las citas del mes
    const citas = await Cita.findAll({ where });

    // Agrupar por día
    const ocupacion = {};
    citas.forEach(cita => {
      const dia = cita.fecha.toISOString().slice(0, 10);
      ocupacion[dia] = (ocupacion[dia] || 0) + 1;
    });

    // Armar respuesta para todos los días del mes
    const diasMes = [];
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      const fecha = d.toISOString().slice(0, 10);
      diasMes.push({ fecha, totalCitas: ocupacion[fecha] || 0 });
    }

    res.json(diasMes);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener ocupación', details: err.message });
  }
}

module.exports = { getOcupacionMensual };
