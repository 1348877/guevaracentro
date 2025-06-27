const Cita = require('../models/Cita');

// Obtener todas las citas
exports.getAllCitas = async (req, res) => {
  try {
    const citas = await Cita.findAll({ include: ['Paciente', 'Psicologo'] });
    res.json(citas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener citas', detalle: error.message });
  }
};

// Crear una nueva cita
exports.createCita = async (req, res) => {
  try {
    const cita = await Cita.create(req.body);
    res.status(201).json(cita);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear cita', detalle: error.message });
  }
};

// Obtener cita por ID
exports.getCitaById = async (req, res) => {
  try {
    const cita = await Cita.findByPk(req.params.id, { include: ['Paciente', 'Psicologo'] });
    if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });
    res.json(cita);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cita', detalle: error.message });
  }
};

// Eliminar cita
exports.deleteCita = async (req, res) => {
  try {
    const cita = await Cita.findByPk(req.params.id);
    if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });
    await cita.destroy();
    res.json({ message: 'Cita eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar cita', detalle: error.message });
  }
};
