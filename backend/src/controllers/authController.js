const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Login con Google
exports.loginGoogle = async (req, res) => {
  const { credential } = req.body;
  try {
    const ticket = await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    let usuario = await Usuario.findOne({ where: { email: payload.email } });
    if (!usuario) {
      usuario = await Usuario.create({ nombre: payload.name, email: payload.email, googleId: payload.sub });
    }
    // Incluir rol en el token
    const token = jwt.sign({ id: usuario.id, email: usuario.email, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, usuario });
  } catch (error) {
    res.status(401).json({ error: 'Token de Google inválido', detalle: error.message });
  }
};

// Login con celular (simulado, para conectar a SMS real luego)
exports.loginCelular = async (req, res) => {
  const { telefono, codigo } = req.body;
  // Aquí deberías validar el código recibido por SMS
  if (codigo !== '123456') return res.status(401).json({ error: 'Código inválido' });
  let usuario = await Usuario.findOne({ where: { telefono } });
  if (!usuario) {
    usuario = await Usuario.create({ telefono });
  }
  // Incluir rol en el token
  const token = jwt.sign({ id: usuario.id, telefono: usuario.telefono, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, usuario });
};

// Endpoint para enviar código SMS (simulado)
exports.enviarCodigoSMS = async (req, res) => {
  const { telefono } = req.body;
  // Aquí deberías integrar un proveedor SMS real
  // Por ahora, siempre envía 123456
  res.json({ message: 'Código enviado', codigo: '123456' });
};

// Login clásico para staff (usuario/contraseña)
exports.loginStaff = async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario || !usuario.password) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    // Solo staff puede acceder
    if (!['admin', 'secretaria', 'psicologo'].includes(usuario.rol)) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    const valid = await bcrypt.compare(password, usuario.password);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const token = jwt.sign({ id: usuario.id, email: usuario.email, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, usuario });
  } catch (error) {
    res.status(500).json({ error: 'Error en login staff', detalle: error.message });
  }
};
