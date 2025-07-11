const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Psicologo = require('./Psicologo');

const HorarioDisponible = sequelize.define('HorarioDisponible', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  diaSemana: { 
    type: DataTypes.ENUM('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'),
    allowNull: false 
  },
  horaInicio: { type: DataTypes.TIME, allowNull: false },
  horaFin: { type: DataTypes.TIME, allowNull: false },
  fechaEspecifica: { type: DataTypes.DATEONLY }, // Para horarios especiales
  activo: { type: DataTypes.BOOLEAN, defaultValue: true },
  modalidad: {
    type: DataTypes.ENUM('presencial', 'virtual', 'ambas'),
    defaultValue: 'ambas'
  },
  duracionCita: { 
    type: DataTypes.INTEGER, 
    defaultValue: 60,
    comment: 'Duración de la cita en minutos'
  }
}, {
  tableName: 'horarios_disponibles',
  timestamps: true
});

// Relaciones
Psicologo.hasMany(HorarioDisponible, { foreignKey: 'psicologoId' });
HorarioDisponible.belongsTo(Psicologo, { foreignKey: 'psicologoId' });

module.exports = HorarioDisponible;
