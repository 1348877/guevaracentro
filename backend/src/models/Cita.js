const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Paciente = require('./Paciente');
const Psicologo = require('./Psicologo');

const Cita = sequelize.define('Cita', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  fecha: { type: DataTypes.DATE, allowNull: false },
  estado: { type: DataTypes.ENUM('pendiente', 'atendida', 'cancelada'), defaultValue: 'pendiente' },
  motivo: { type: DataTypes.STRING },
  notas: { type: DataTypes.TEXT }
}, {
  tableName: 'citas',
  timestamps: true
});

Paciente.hasMany(Cita, { foreignKey: 'pacienteId' });
Cita.belongsTo(Paciente, { foreignKey: 'pacienteId' });
Psicologo.hasMany(Cita, { foreignKey: 'psicologoId' });
Cita.belongsTo(Psicologo, { foreignKey: 'psicologoId' });

module.exports = Cita;
