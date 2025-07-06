const Cita = require('../models/Cita');
const Paciente = require('../models/Paciente');
const Psicologo = require('../models/Psicologo');
const Usuario = require('../models/Usuario');
const HorarioDisponible = require('../models/HorarioDisponible');
const BloqueoHorario = require('../models/BloqueoHorario');
const { Op } = require('sequelize');
const sequelize = require('../../config/database');

// Dashboard para Admin
exports.getDashboardAdmin = async (req, res) => {
  try {
    const fechaHoy = new Date();
    const inicioDeSemana = new Date(fechaHoy.setDate(fechaHoy.getDate() - fechaHoy.getDay()));
    const finDeSemana = new Date(inicioDeSemana);
    finDeSemana.setDate(finDeSemana.getDate() + 6);

    const inicioDelMes = new Date(fechaHoy.getFullYear(), fechaHoy.getMonth(), 1);
    const finDelMes = new Date(fechaHoy.getFullYear(), fechaHoy.getMonth() + 1, 0);

    // Estadísticas generales
    const totalPacientes = await Paciente.count();
    const totalPsicologos = await Psicologo.count();
    const totalCitas = await Cita.count();
    const citasHoy = await Cita.count({
      where: {
        fecha: new Date().toISOString().split('T')[0]
      }
    });

    // Citas por estado
    const citasPorEstado = await Cita.findAll({
      attributes: [
        'estado',
        [sequelize.fn('COUNT', sequelize.col('estado')), 'cantidad']
      ],
      group: ['estado']
    });

    // Ingresos del mes (estimado basado en citas confirmadas/completadas)
    const citasFacturables = await Cita.count({
      where: {
        estado: { [Op.in]: ['confirmada', 'completada'] },
        createdAt: { [Op.between]: [inicioDelMes, finDelMes] }
      }
    });

    // Citas de esta semana
    const citasEstaSemana = await Cita.findAll({
      where: {
        fechaHora: { [Op.between]: [inicioDeSemana, finDeSemana] }
      },
      include: [
        { model: Paciente, attributes: ['nombres', 'apellidos'] },
        { model: Psicologo, attributes: ['nombres', 'apellidos', 'especialidad'] }
      ],
      order: [['fechaHora', 'ASC']],
      limit: 10
    });

    // Psicólogos más activos
    const psicologosActivos = await Cita.findAll({
      attributes: [
        'psicologoId',
        [sequelize.fn('COUNT', sequelize.col('psicologoId')), 'totalCitas']
      ],
      where: {
        createdAt: { [Op.between]: [inicioDelMes, finDelMes] }
      },
      include: [{ model: Psicologo, attributes: ['nombres', 'apellidos', 'especialidad'] }],
      group: ['psicologoId', 'Psicologo.id'],
      order: [[sequelize.fn('COUNT', sequelize.col('psicologoId')), 'DESC']],
      limit: 5
    });

    // Próximas citas por confirmar
    const citasPorConfirmar = await Cita.count({
      where: {
        estado: 'solicitada',
        fechaHora: { [Op.gte]: new Date() }
      }
    });

    res.json({
      resumen: {
        totalPacientes,
        totalPsicologos,
        totalCitas,
        citasHoy,
        citasPorConfirmar,
        ingresoEstimadoMes: citasFacturables * 50 // Precio promedio estimado
      },
      citasPorEstado: citasPorEstado.map(c => ({
        estado: c.estado,
        cantidad: parseInt(c.dataValues.cantidad)
      })),
      citasEstaSemana,
      psicologosActivos: psicologosActivos.map(p => ({
        psicologo: p.Psicologo,
        totalCitas: parseInt(p.dataValues.totalCitas)
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener dashboard de admin', detalle: error.message });
  }
};

// Dashboard para Secretaria
exports.getDashboardSecretaria = async (req, res) => {
  try {
    const fechaHoy = new Date().toISOString().split('T')[0];
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    const fechaManana = manana.toISOString().split('T')[0];

    // Citas de hoy
    const citasHoy = await Cita.findAll({
      where: { fecha: fechaHoy },
      include: [
        { model: Paciente, attributes: ['nombres', 'apellidos', 'telefono'] },
        { model: Psicologo, attributes: ['nombres', 'apellidos'] }
      ],
      order: [['hora', 'ASC']]
    });

    // Citas de mañana
    const citasManana = await Cita.findAll({
      where: { fecha: fechaManana },
      include: [
        { model: Paciente, attributes: ['nombres', 'apellidos', 'telefono'] },
        { model: Psicologo, attributes: ['nombres', 'apellidos'] }
      ],
      order: [['hora', 'ASC']]
    });

    // Citas pendientes de confirmar
    const citasPendientes = await Cita.findAll({
      where: {
        estado: 'solicitada',
        fechaHora: { [Op.gte]: new Date() }
      },
      include: [
        { model: Paciente, attributes: ['nombres', 'apellidos', 'telefono', 'email'] },
        { model: Psicologo, attributes: ['nombres', 'apellidos'] }
      ],
      order: [['fechaHora', 'ASC']],
      limit: 10
    });

    // Resumen por estado
    const resumenEstados = await Cita.findAll({
      attributes: [
        'estado',
        [sequelize.fn('COUNT', sequelize.col('estado')), 'cantidad']
      ],
      where: {
        fecha: { [Op.gte]: fechaHoy }
      },
      group: ['estado']
    });

    // Próximos recordatorios (citas confirmadas para mañana)
    const recordatorios = await Cita.findAll({
      where: {
        fecha: fechaManana,
        estado: 'confirmada'
      },
      include: [
        { model: Paciente, attributes: ['nombres', 'apellidos', 'telefono'] },
        { model: Psicologo, attributes: ['nombres', 'apellidos'] }
      ],
      order: [['hora', 'ASC']]
    });

    res.json({
      citasHoy: {
        total: citasHoy.length,
        citas: citasHoy
      },
      citasManana: {
        total: citasManana.length,
        citas: citasManana
      },
      citasPendientes: {
        total: citasPendientes.length,
        citas: citasPendientes
      },
      resumenEstados: resumenEstados.map(r => ({
        estado: r.estado,
        cantidad: parseInt(r.dataValues.cantidad)
      })),
      recordatorios: {
        total: recordatorios.length,
        citas: recordatorios
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener dashboard de secretaria', detalle: error.message });
  }
};

// Dashboard para Psicólogo
exports.getDashboardPsicologo = async (req, res) => {
  try {
    const psicologoId = req.user.id;
    const fechaHoy = new Date().toISOString().split('T')[0];
    const inicioDeSemana = new Date();
    inicioDeSemana.setDate(inicioDeSemana.getDate() - inicioDeSemana.getDay());
    const finDeSemana = new Date(inicioDeSemana);
    finDeSemana.setDate(finDeSemana.getDate() + 6);

    // Citas de hoy
    const citasHoy = await Cita.findAll({
      where: {
        psicologoId,
        fecha: fechaHoy
      },
      include: [{ model: Paciente, attributes: ['nombres', 'apellidos', 'telefono'] }],
      order: [['hora', 'ASC']]
    });

    // Próximas citas (próximos 7 días)
    const proximasCitas = await Cita.findAll({
      where: {
        psicologoId,
        fechaHora: {
          [Op.between]: [new Date(), finDeSemana]
        },
        estado: { [Op.in]: ['confirmada', 'solicitada'] }
      },
      include: [{ model: Paciente, attributes: ['nombres', 'apellidos', 'telefono'] }],
      order: [['fechaHora', 'ASC']],
      limit: 10
    });

    // Citas pendientes de confirmar
    const citasPendientes = await Cita.findAll({
      where: {
        psicologoId,
        estado: 'solicitada',
        fechaHora: { [Op.gte]: new Date() }
      },
      include: [{ model: Paciente, attributes: ['nombres', 'apellidos', 'telefono', 'email'] }],
      order: [['fechaHora', 'ASC']]
    });

    // Estadísticas de la semana
    const citasEstaSemana = await Cita.count({
      where: {
        psicologoId,
        fechaHora: { [Op.between]: [inicioDeSemana, finDeSemana] }
      }
    });

    const citasCompletadas = await Cita.count({
      where: {
        psicologoId,
        estado: 'completada',
        fechaHora: { [Op.between]: [inicioDeSemana, finDeSemana] }
      }
    });

    // Horarios de hoy
    const fechaHoyObj = new Date();
    const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const diaSemana = diasSemana[fechaHoyObj.getDay()];

    const horariosHoy = await HorarioDisponible.findAll({
      where: {
        psicologoId,
        [Op.or]: [
          { diaSemana, fechaEspecifica: null },
          { fechaEspecifica: fechaHoy }
        ],
        activo: true
      },
      order: [['horaInicio', 'ASC']]
    });

    // Bloqueos activos
    const bloqueosActivos = await BloqueoHorario.findAll({
      where: {
        psicologoId,
        activo: true,
        fechaInicio: { [Op.lte]: new Date() },
        fechaFin: { [Op.gte]: new Date() }
      }
    });

    res.json({
      citasHoy: {
        total: citasHoy.length,
        citas: citasHoy
      },
      proximasCitas: {
        total: proximasCitas.length,
        citas: proximasCitas
      },
      citasPendientes: {
        total: citasPendientes.length,
        citas: citasPendientes
      },
      estadisticas: {
        citasEstaSemana,
        citasCompletadas,
        tasaComplecion: citasEstaSemana > 0 ? Math.round((citasCompletadas / citasEstaSemana) * 100) : 0
      },
      horariosHoy,
      bloqueosActivos: bloqueosActivos.length > 0 ? bloqueosActivos : null
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener dashboard de psicólogo', detalle: error.message });
  }
};

// Dashboard para Paciente
exports.getDashboardPaciente = async (req, res) => {
  try {
    const pacienteId = req.user.id;

    // Próximas citas
    const proximasCitas = await Cita.findAll({
      where: {
        pacienteId,
        fechaHora: { [Op.gte]: new Date() },
        estado: { [Op.in]: ['confirmada', 'solicitada'] }
      },
      include: [{ model: Psicologo, attributes: ['nombres', 'apellidos', 'especialidad'] }],
      order: [['fechaHora', 'ASC']],
      limit: 5
    });

    // Historial de citas (últimas 10)
    const historialCitas = await Cita.findAll({
      where: {
        pacienteId,
        estado: { [Op.in]: ['completada', 'cancelada'] }
      },
      include: [{ model: Psicologo, attributes: ['nombres', 'apellidos', 'especialidad'] }],
      order: [['fechaHora', 'DESC']],
      limit: 10
    });

    // Citas pendientes de confirmación
    const citasPendientes = await Cita.findAll({
      where: {
        pacienteId,
        estado: 'solicitada',
        fechaHora: { [Op.gte]: new Date() }
      },
      include: [{ model: Psicologo, attributes: ['nombres', 'apellidos', 'especialidad'] }],
      order: [['fechaHora', 'ASC']]
    });

    // Estadísticas
    const totalCitas = await Cita.count({
      where: { pacienteId }
    });

    const citasCompletadas = await Cita.count({
      where: {
        pacienteId,
        estado: 'completada'
      }
    });

    const citasCanceladas = await Cita.count({
      where: {
        pacienteId,
        estado: 'cancelada'
      }
    });

    // Próxima cita (la más cercana)
    const proximaCita = proximasCitas.length > 0 ? proximasCitas[0] : null;

    res.json({
      proximaCita,
      proximasCitas: {
        total: proximasCitas.length,
        citas: proximasCitas
      },
      citasPendientes: {
        total: citasPendientes.length,
        citas: citasPendientes
      },
      historialCitas: {
        total: historialCitas.length,
        citas: historialCitas
      },
      estadisticas: {
        totalCitas,
        citasCompletadas,
        citasCanceladas,
        asistencia: totalCitas > 0 ? Math.round((citasCompletadas / totalCitas) * 100) : 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener dashboard de paciente', detalle: error.message });
  }
};

// Obtener dashboard según el rol del usuario
exports.getDashboard = async (req, res) => {
  try {
    const { rol } = req.user;

    switch (rol) {
      case 'admin':
        return exports.getDashboardAdmin(req, res);
      case 'secretaria':
        return exports.getDashboardSecretaria(req, res);
      case 'psicologo':
        return exports.getDashboardPsicologo(req, res);
      case 'paciente':
        return exports.getDashboardPaciente(req, res);
      default:
        return res.status(400).json({ error: 'Rol no válido' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener dashboard', detalle: error.message });
  }
};

module.exports = exports;
