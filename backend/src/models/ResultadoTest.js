const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Paciente = require('./Paciente');
const Test = require('./Test');

const ResultadoTest = sequelize.define('ResultadoTest', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  respuestas: { type: DataTypes.JSONB, allowNull: false },
  fecha: { type: DataTypes.DATE, allowNull: false },
  observaciones: { type: DataTypes.TEXT }
}, {
  tableName: 'resultados_test',
  timestamps: true
});

Paciente.hasMany(ResultadoTest, { foreignKey: 'pacienteId' });
ResultadoTest.belongsTo(Paciente, { foreignKey: 'pacienteId' });
Test.hasMany(ResultadoTest, { foreignKey: 'testId' });
ResultadoTest.belongsTo(Test, { foreignKey: 'testId' });

module.exports = ResultadoTest;
