const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/google', authController.loginGoogle);
router.post('/celular', authController.loginCelular);
router.post('/enviar-codigo', authController.enviarCodigoSMS);
router.post('/login-staff', authController.loginStaff); // Nuevo endpoint para staff

module.exports = router;
