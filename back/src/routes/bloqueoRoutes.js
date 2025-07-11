const express = require('express');
const router = express.Router();
const bloqueoController = require('../controllers/bloqueoHorarioController');
const authMiddleware = require('../middleware/authMiddleware');

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware.authenticateToken);

// Rutas para bloqueos de horario
router.get('/psicologo/:psicologoId', 
  authMiddleware.authorize(['admin', 'secretaria', 'psicologo']), 
  bloqueoController.getBloqueosPsicologo
);

router.get('/', 
  authMiddleware.authorize(['admin', 'secretaria']), 
  bloqueoController.getAllBloqueos
);

router.post('/', 
  authMiddleware.authorize(['admin', 'secretaria', 'psicologo']), 
  bloqueoController.createBloqueo
);

router.put('/:id', 
  authMiddleware.authorize(['admin', 'secretaria', 'psicologo']), 
  bloqueoController.updateBloqueo
);

router.delete('/:id', 
  authMiddleware.authorize(['admin', 'secretaria', 'psicologo']), 
  bloqueoController.deleteBloqueo
);

router.post('/verificar-conflictos', 
  authMiddleware.authorize(['admin', 'secretaria', 'psicologo']), 
  bloqueoController.verificarConflictos
);

module.exports = router;
