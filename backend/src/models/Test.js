const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Test = sequelize.define('Test', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  descripcion: { type: DataTypes.TEXT },
  preguntas: { type: DataTypes.JSONB, allowNull: false }
}, {
  tableName: 'tests',
  timestamps: true
});

module.exports = Test;
