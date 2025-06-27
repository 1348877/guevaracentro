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

// Rutas de ejemplo
app.get('/', (req, res) => {
  res.send('API Centro Psicológico Juliaca - Backend funcionando');
});

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
