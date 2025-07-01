require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('../config/database');

const app = express();
app.use(cors());
app.use(express.json());

// Importar modelos para sincronización
require('./models/Paciente');
require('./models/Psicologo');
require('./models/Usuario');
require('./models/Cita');
require('./models/Test');
require('./models/ResultadoTest');

// Importar rutas
const pacienteRoutes = require('./routes/pacienteRoutes');
const citaRoutes = require('./routes/citaRoutes');
const authRoutes = require('./routes/authRoutes');

// Rutas de ejemplo
app.get('/', (req, res) => {
  res.send('API Centro Psicológico Juliaca - Backend funcionando');
});

// Usar rutas
app.use('/api/pacientes', require('./routes/pacienteRoutes'));
app.use('/api/citas', require('./routes/citaRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

const PORT = process.env.PORT || 3001;

sequelize.sync({ force: false })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor backend escuchando en puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al conectar con la base de datos:', err);
  });
