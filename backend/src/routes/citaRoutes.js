const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citaController');

// Rutas para Cita
router.get('/', citaController.getAllCitas);
router.post('/', citaController.createCita);
router.get('/:id', citaController.getCitaById);
router.delete('/:id', citaController.deleteCita);

module.exports = router;
