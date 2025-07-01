const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citaController');
const { getOcupacionMensual } = require('../controllers/citaOcupacionController');
const { bloquearHorario, liberarHorario, getBloqueosDia } = require('../controllers/bloqueoHorarioController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Rutas para Cita
// Listar y ver citas: psicologo, secretaria, admin pueden ver todas; paciente solo las suyas (esto se refina en el controlador)
router.get('/', authenticateToken, authorizeRoles('secretaria', 'admin', 'psicologo'), citaController.getAllCitas);
router.post('/', authenticateToken, authorizeRoles('secretaria', 'admin', 'psicologo', 'paciente'), citaController.createCita);
router.get('/:id', authenticateToken, authorizeRoles('secretaria', 'admin', 'psicologo', 'paciente'), citaController.getCitaById);
router.delete('/:id', authenticateToken, authorizeRoles('secretaria', 'admin'), citaController.deleteCita);

// Ocupación y bloqueos: solo staff
router.get('/ocupacion', authenticateToken, authorizeRoles('secretaria', 'admin', 'psicologo'), getOcupacionMensual);
router.post('/bloquear', authenticateToken, authorizeRoles('secretaria', 'admin'), bloquearHorario);
router.post('/liberar', authenticateToken, authorizeRoles('secretaria', 'admin'), liberarHorario);
router.get('/bloqueos', authenticateToken, authorizeRoles('secretaria', 'admin', 'psicologo'), getBloqueosDia);

module.exports = router;
