const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citaController');
const authMiddleware = require('../middleware/authMiddleware');

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware.authenticateToken);

// Rutas para gestión de citas
router.get('/', 
  authMiddleware.authorize(['admin', 'secretaria', 'psicologo', 'paciente']), 
  citaController.getAllCitas
);

router.post('/', 
  authMiddleware.authorize(['admin', 'secretaria', 'psicologo', 'paciente']), 
  citaController.createCita
);

router.get('/horarios-disponibles', 
  citaController.getHorariosDisponibles
);

router.get('/:id', 
  authMiddleware.authorize(['admin', 'secretaria', 'psicologo', 'paciente']), 
  citaController.getCitaById
);

router.put('/:id/confirmar', 
  authMiddleware.authorize(['admin', 'secretaria', 'psicologo']), 
  citaController.confirmarCita
);

router.put('/:id/cancelar', 
  authMiddleware.authorize(['admin', 'secretaria', 'psicologo', 'paciente']), 
  citaController.cancelarCita
);

router.put('/:id/estado', 
  authMiddleware.authorize(['admin', 'secretaria', 'psicologo']), 
  citaController.actualizarEstadoCita
);

router.delete('/:id', 
  authMiddleware.authorize(['admin']), 
  citaController.deleteCita
);

module.exports = router;
