const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.loginStaff); // Endpoint básico de login
router.post('/google', authController.loginGoogle);
router.post('/celular', authController.loginCelular);
router.post('/enviar-codigo', authController.enviarCodigoSMS);
router.post('/login-staff', authController.loginStaff); // Nuevo endpoint para staff
router.get('/health', (req, res) => res.json({ status: 'OK', message: 'Backend funcionando correctamente' }));

module.exports = router;
