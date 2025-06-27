const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

// Ruta para poblar pacientes de prueba (debe ir antes de las rutas con parámetro :id)
router.post('/seed', pacienteController.seedPacientes);

// Rutas para Paciente
router.get('/', pacienteController.getAllPacientes);
router.post('/', pacienteController.createPaciente);
router.get('/:id', pacienteController.getPacienteById);
router.delete('/:id', pacienteController.deletePaciente);

module.exports = router;
