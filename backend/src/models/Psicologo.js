const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Psicologo = sequelize.define('Psicologo', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombres: { type: DataTypes.STRING, allowNull: false },
  apellidos: { type: DataTypes.STRING, allowNull: false },
  colegiatura: { type: DataTypes.STRING, allowNull: false, unique: true },
  especialidad: { type: DataTypes.STRING },
  telefono: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING }
}, {
  tableName: 'psicologos',
  timestamps: true
});

module.exports = Psicologo;
