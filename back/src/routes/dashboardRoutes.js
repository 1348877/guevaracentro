const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

// Aplicar middleware de autenticación
router.use(authMiddleware.authenticateToken);

// Ruta principal del dashboard que redirige según el rol
router.get('/', dashboardController.getDashboard);

// Rutas específicas por rol (opcionales, para acceso directo)
router.get('/admin', 
  authMiddleware.authorize(['admin']), 
  dashboardController.getDashboardAdmin
);

router.get('/secretaria', 
  authMiddleware.authorize(['admin', 'secretaria']), 
  dashboardController.getDashboardSecretaria
);

router.get('/psicologo', 
  authMiddleware.authorize(['admin', 'psicologo']), 
  dashboardController.getDashboardPsicologo
);

router.get('/paciente', 
  authMiddleware.authorize(['admin', 'paciente']), 
  dashboardController.getDashboardPaciente
);

module.exports = router;
