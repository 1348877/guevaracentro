// Configuración de asociaciones entre modelos
const sequelize = require('../../config/database');
const Usuario = require('./Usuario');
const Paciente = require('./Paciente');
const Psicologo = require('./Psicologo');
const Cita = require('./Cita');
const HorarioDisponible = require('./HorarioDisponible');
const BloqueoHorario = require('./BloqueoHorario');
const Test = require('./Test');
const ResultadoTest = require('./ResultadoTest');

// Configurar todas las asociaciones
function setupAssociations() {
  // Usuario como modelo base
  Usuario.hasOne(Paciente, { foreignKey: 'usuarioId', onDelete: 'CASCADE' });
  Usuario.hasOne(Psicologo, { foreignKey: 'usuarioId', onDelete: 'CASCADE' });
  
  Paciente.belongsTo(Usuario, { foreignKey: 'usuarioId' });
  Psicologo.belongsTo(Usuario, { foreignKey: 'usuarioId' });

  // Citas
  Paciente.hasMany(Cita, { foreignKey: 'pacienteId' });
  Psicologo.hasMany(Cita, { foreignKey: 'psicologoId' });
  
  Cita.belongsTo(Paciente, { foreignKey: 'pacienteId' });
  Cita.belongsTo(Psicologo, { foreignKey: 'psicologoId' });

  // Horarios disponibles
  Psicologo.hasMany(HorarioDisponible, { foreignKey: 'psicologoId' });
  HorarioDisponible.belongsTo(Psicologo, { foreignKey: 'psicologoId' });

  // Bloqueos de horario
  Psicologo.hasMany(BloqueoHorario, { foreignKey: 'psicologoId' });
  BloqueoHorario.belongsTo(Psicologo, { foreignKey: 'psicologoId' });

  // Tests y resultados
  if (Test && ResultadoTest) {
    Test.hasMany(ResultadoTest, { foreignKey: 'testId' });
    Paciente.hasMany(ResultadoTest, { foreignKey: 'pacienteId' });
    
    ResultadoTest.belongsTo(Test, { foreignKey: 'testId' });
    ResultadoTest.belongsTo(Paciente, { foreignKey: 'pacienteId' });
  }
}

// Ejecutar configuración automáticamente
setupAssociations();

module.exports = { 
  setupAssociations, 
  sequelize,
  Usuario,
  Paciente,
  Psicologo,
  Cita,
  HorarioDisponible,
  BloqueoHorario,
  Test,
  ResultadoTest
};
