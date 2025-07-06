const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Usuario = sequelize.define('Usuario', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  rol: { type: DataTypes.ENUM('psicologo', 'secretaria', 'admin', 'paciente'), defaultValue: 'paciente' },
  googleId: { type: DataTypes.STRING },
  telefono: { type: DataTypes.STRING, unique: true }
}, {
  tableName: 'usuarios',
  timestamps: true
});

module.exports = Usuario;
