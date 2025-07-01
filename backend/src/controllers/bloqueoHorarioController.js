const { Cita } = require('../models/Cita');
const { Op } = require('sequelize');

// Estructura en memoria para bloqueos temporales: { '2025-06-27T10:00': { userId, expiresAt } }
const bloqueos = {};
const BLOQUEO_MINUTOS = 10;

// Bloquear una franja horaria
async function bloquearHorario(req, res) {
  const { fechaHora, userId } = req.body;
  if (!fechaHora || !userId) return res.status(400).json({ error: 'Faltan datos' });
  // Verificar si ya está bloqueado
  if (bloqueos[fechaHora] && bloqueos[fechaHora].expiresAt > Date.now()) {
    return res.status(409).json({ error: 'Horario temporalmente bloqueado' });
  }
  // Bloquear
  bloqueos[fechaHora] = {
    userId,
    expiresAt: Date.now() + BLOQUEO_MINUTOS * 60 * 1000
  };
  return res.json({ ok: true, expiresAt: bloqueos[fechaHora].expiresAt });
}

// Liberar bloqueo (opcional, por si cancela)
async function liberarHorario(req, res) {
  const { fechaHora, userId } = req.body;
  if (bloqueos[fechaHora] && bloqueos[fechaHora].userId === userId) {
    delete bloqueos[fechaHora];
    return res.json({ ok: true });
  }
  return res.status(404).json({ error: 'No existe bloqueo' });
}

// Consultar bloqueos activos para un día
async function getBloqueosDia(req, res) {
  const { fecha } = req.query; // '2025-06-27'
  const activos = Object.entries(bloqueos)
    .filter(([k, v]) => k.startsWith(fecha) && v.expiresAt > Date.now())
    .map(([k, v]) => ({ fechaHora: k, expiresAt: v.expiresAt }));
  res.json(activos);
}

module.exports = { bloquearHorario, liberarHorario, getBloqueosDia };
