const express = require('express');
const router = express.Router();
const horarioController = require('../controllers/horarioController');
const authMiddleware = require('../middleware/authMiddleware');

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware.authenticateToken);

// Rutas para horarios disponibles
router.get('/psicologo/:psicologoId', 
  authMiddleware.authorize(['admin', 'secretaria', 'psicologo']), 
  horarioController.getHorariosPsicologo
);

router.post('/', 
  authMiddleware.authorize(['admin', 'secretaria', 'psicologo']), 
  horarioController.createHorario
);

router.put('/:id', 
  authMiddleware.authorize(['admin', 'secretaria', 'psicologo']), 
  horarioController.updateHorario
);

router.delete('/:id', 
  authMiddleware.authorize(['admin', 'secretaria', 'psicologo']), 
  horarioController.deleteHorario
);

// Ruta pública para obtener horarios disponibles para citas
router.get('/disponibles', horarioController.getHorariosDisponiblesCitas);

module.exports = router;
