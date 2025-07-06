const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Psicologo = require('./Psicologo');

const BloqueoHorario = sequelize.define('BloqueoHorario', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  fechaInicio: { type: DataTypes.DATE, allowNull: false },
  fechaFin: { type: DataTypes.DATE, allowNull: false },
  motivo: { 
    type: DataTypes.ENUM('vacaciones', 'enfermedad', 'capacitacion', 'personal', 'mantenimiento'),
    allowNull: false 
  },
  descripcion: { type: DataTypes.TEXT },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'bloqueos_horario',
  timestamps: true
});

// Relaciones
Psicologo.hasMany(BloqueoHorario, { foreignKey: 'psicologoId' });
BloqueoHorario.belongsTo(Psicologo, { foreignKey: 'psicologoId' });

module.exports = BloqueoHorario;
