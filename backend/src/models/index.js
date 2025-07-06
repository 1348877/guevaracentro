const sequelize = require('../../config/database');
const Usuario = require('./Usuario');
const Psicologo = require('./Psicologo');
const Paciente = require('./Paciente');
const HorarioDisponible = require('./HorarioDisponible');
const BloqueoHorario = require('./BloqueoHorario');
const Cita = require('./Cita');
const Test = require('./Test');
const ResultadoTest = require('./ResultadoTest');

// Importar asociaciones
require('./associations');

module.exports = {
  sequelize,
  Usuario,
  Psicologo,
  Paciente,
  HorarioDisponible,
  BloqueoHorario,
  Cita,
  Test,
  ResultadoTest
};
