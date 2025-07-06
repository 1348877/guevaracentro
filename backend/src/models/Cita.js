const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Paciente = require('./Paciente');
const Psicologo = require('./Psicologo');

const Cita = sequelize.define('Cita', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  fecha: { type: DataTypes.DATEONLY, allowNull: false },
  hora: { type: DataTypes.TIME, allowNull: false },
  fechaHora: { type: DataTypes.DATE, allowNull: true }, // Campo combinado para consultas
  estado: { 
    type: DataTypes.ENUM('solicitada', 'confirmada', 'en_curso', 'completada', 'cancelada', 'no_asistio'), 
    defaultValue: 'solicitada' 
  },
  tipoCita: {
    type: DataTypes.ENUM('primera_consulta', 'seguimiento', 'terapia_individual', 'terapia_pareja', 'coaching', 'evaluacion'),
    allowNull: false
  },
  modalidad: {
    type: DataTypes.ENUM('presencial', 'virtual'),
    defaultValue: 'presencial'
  },
  motivo: { type: DataTypes.TEXT, allowNull: false },
  notas: { type: DataTypes.TEXT },
  notasPrivadas: { type: DataTypes.TEXT }, // Solo visible para psicólogo/admin
  duracionMinutos: { type: DataTypes.INTEGER, defaultValue: 60 },
  precio: { type: DataTypes.DECIMAL(10, 2) },
  pagado: { type: DataTypes.BOOLEAN, defaultValue: false },
  enlaceVirtual: { type: DataTypes.STRING }, // Para citas virtuales
  recordatorioEnviado: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: 'citas',
  timestamps: true,
  hooks: {
    beforeCreate: (cita, options) => {
      // Combinar fecha y hora en fechaHora
      if (cita.fecha && cita.hora) {
        const fecha = new Date(cita.fecha);
        const [horas, minutos] = cita.hora.split(':');
        fecha.setHours(parseInt(horas), parseInt(minutos), 0, 0);
        cita.fechaHora = fecha;
      }
    },
    beforeUpdate: (cita, options) => {
      if (cita.changed('fecha') || cita.changed('hora')) {
        if (cita.fecha && cita.hora) {
          const fecha = new Date(cita.fecha);
          const [horas, minutos] = cita.hora.split(':');
          fecha.setHours(parseInt(horas), parseInt(minutos), 0, 0);
          cita.fechaHora = fecha;
        }
      }
    },
    beforeValidate: (cita, options) => {
      // Asegurar que fechaHora se genere antes de la validación
      if (cita.fecha && cita.hora && !cita.fechaHora) {
        const fecha = new Date(cita.fecha);
        const [horas, minutos] = cita.hora.split(':');
        fecha.setHours(parseInt(horas), parseInt(minutos), 0, 0);
        cita.fechaHora = fecha;
      }
    }
  }
});

Paciente.hasMany(Cita, { foreignKey: 'pacienteId' });
Cita.belongsTo(Paciente, { foreignKey: 'pacienteId' });
Psicologo.hasMany(Cita, { foreignKey: 'psicologoId' });
Cita.belongsTo(Psicologo, { foreignKey: 'psicologoId' });

module.exports = Cita;
