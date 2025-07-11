const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Ruta para poblar pacientes de prueba (solo admin)
router.post('/seed', authenticateToken, authorizeRoles('admin'), pacienteController.seedPacientes);

// Rutas para Paciente (solo secretaria, admin, psicologo)
router.get('/', authenticateToken, authorizeRoles('secretaria', 'admin', 'psicologo'), pacienteController.getAllPacientes);
router.post('/', authenticateToken, authorizeRoles('secretaria', 'admin'), pacienteController.createPaciente);
router.get('/:id', authenticateToken, authorizeRoles('secretaria', 'admin', 'psicologo'), pacienteController.getPacienteById);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), pacienteController.deletePaciente);

module.exports = router;
