require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('../config/database');

const app = express();

// Configuración de CORS más específica
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://accounts.google.com',
    'https://www.google.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json());

// Importar modelos para sincronización
require('./models/Paciente');
require('./models/Psicologo');
require('./models/Usuario');
require('./models/Cita');
require('./models/HorarioDisponible');
require('./models/BloqueoHorario');
require('./models/Test');
require('./models/ResultadoTest');

// Configurar asociaciones
const { setupAssociations } = require('./models/associations');
setupAssociations();

// Importar rutas
const pacienteRoutes = require('./routes/pacienteRoutes');
const citaRoutes = require('./routes/citaRoutes');
const authRoutes = require('./routes/authRoutes');
const horarioRoutes = require('./routes/horarioRoutes');
const bloqueoRoutes = require('./routes/bloqueoRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Rutas de ejemplo
app.get('/', (req, res) => {
  res.send('API Centro Psicológico Integral Guevara - Backend funcionando');
});

// Endpoint de health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend funcionando correctamente',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Usar rutas
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/citas', citaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/horarios', horarioRoutes);
app.use('/api/bloqueos', bloqueoRoutes);
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 3001;

sequelize.sync({ force: false })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor backend escuchando en puerto ${PORT}`);
      console.log('API endpoints disponibles:');
      console.log('- /api/auth (autenticación)');
      console.log('- /api/pacientes (gestión de pacientes)');
      console.log('- /api/citas (gestión de citas)');
      console.log('- /api/horarios (horarios disponibles)');
      console.log('- /api/bloqueos (bloqueos de horario)');
      console.log('- /api/dashboard (dashboards por rol)');
    });
  })
  .catch(err => {
    console.error('Error al conectar con la base de datos:', err);
  });
