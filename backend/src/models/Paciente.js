const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Paciente = sequelize.define('Paciente', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombres: { type: DataTypes.STRING, allowNull: false },
  apellidos: { type: DataTypes.STRING, allowNull: false },
  dni: { type: DataTypes.STRING(8), allowNull: false, unique: true },
  fecha_nacimiento: { type: DataTypes.DATEONLY, allowNull: false },
  sexo: { type: DataTypes.ENUM('M', 'F', 'Otro'), allowNull: false },
  direccion: { type: DataTypes.STRING },
  telefono: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  historial_clinico: { type: DataTypes.TEXT }
}, {
  tableName: 'pacientes',
  timestamps: true
});

module.exports = Paciente;
