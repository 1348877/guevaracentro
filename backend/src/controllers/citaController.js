const Cita = require('../models/Cita');
const Paciente = require('../models/Paciente');
const Psicologo = require('../models/Psicologo');
const HorarioDisponible = require('../models/HorarioDisponible');
const BloqueoHorario = require('../models/BloqueoHorario');
const { Op } = require('sequelize');

// Obtener todas las citas con filtros
exports.getAllCitas = async (req, res) => {
  try {
    const { fecha, estado, pacienteId, psicologoId, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = {};
    let include = [
      { model: Paciente, attributes: ['id', 'nombre', 'email', 'telefono'] },
      { model: Psicologo, attributes: ['id', 'nombre', 'especialidad'] }
    ];

    // Filtros según rol
    if (req.user.rol === 'paciente') {
      whereClause.pacienteId = req.user.id;
    } else if (req.user.rol === 'psicologo') {
      whereClause.psicologoId = req.user.id;
    }

    // Filtros adicionales
    if (fecha) whereClause.fecha = fecha;
    if (estado) whereClause.estado = estado;
    if (pacienteId && ['admin', 'secretaria'].includes(req.user.rol)) {
      whereClause.pacienteId = pacienteId;
    }
    if (psicologoId && ['admin', 'secretaria'].includes(req.user.rol)) {
      whereClause.psicologoId = psicologoId;
    }

    const { count, rows: citas } = await Cita.findAndCountAll({
      where: whereClause,
      include,
      limit: parseInt(limit),
      offset,
      order: [['fechaHora', 'ASC']]
    });

    res.json({
      citas,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener citas', detalle: error.message });
  }
};

// Crear una nueva cita (solicitud)
exports.createCita = async (req, res) => {
  try {
    const { fecha, hora, tipoCita, modalidad, motivo, psicologoId } = req.body;
    
    // Validar que el horario esté disponible
    const disponible = await validarDisponibilidad(fecha, hora, psicologoId);
    if (!disponible.esDisponible) {
      return res.status(400).json({ error: disponible.motivo });
    }

    // Crear la cita
    const citaData = {
      fecha,
      hora,
      tipoCita,
      modalidad: modalidad || 'presencial',
      motivo,
      psicologoId,
      estado: 'solicitada'
    };

    // Si es paciente, asignar su ID
    if (req.user.rol === 'paciente') {
      citaData.pacienteId = req.user.id;
    } else {
      citaData.pacienteId = req.body.pacienteId;
    }

    const cita = await Cita.create(citaData);
    const citaCompleta = await Cita.findByPk(cita.id, {
      include: [
        { model: Paciente, attributes: ['id', 'nombre', 'email', 'telefono'] },
        { model: Psicologo, attributes: ['id', 'nombre', 'especialidad'] }
      ]
    });

    res.status(201).json({
      message: 'Cita solicitada exitosamente',
      cita: citaCompleta
    });
  } catch (error) {
    res.status(400).json({ error: 'Error al crear cita', detalle: error.message });
  }
};

// Obtener horarios disponibles
exports.getHorariosDisponibles = async (req, res) => {
  try {
    const { psicologoId, fecha } = req.query;
    
    if (!psicologoId || !fecha) {
      return res.status(400).json({ error: 'PsicologoId y fecha son requeridos' });
    }

    const horariosDisponibles = await obtenerHorariosDisponibles(psicologoId, fecha);
    res.json({ horarios: horariosDisponibles });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener horarios', detalle: error.message });
  }
};

// Confirmar cita (solo admin/secretaria/psicologo)
exports.confirmarCita = async (req, res) => {
  try {
    const { id } = req.params;
    const { enlaceVirtual, notas } = req.body;

    const cita = await Cita.findByPk(id);
    if (!cita) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    if (cita.estado !== 'solicitada') {
      return res.status(400).json({ error: 'Solo se pueden confirmar citas solicitadas' });
    }

    const updateData = { estado: 'confirmada' };
    if (enlaceVirtual) updateData.enlaceVirtual = enlaceVirtual;
    if (notas) updateData.notas = notas;

    await cita.update(updateData);
    
    const citaActualizada = await Cita.findByPk(id, {
      include: [
        { model: Paciente, attributes: ['id', 'nombre', 'email', 'telefono'] },
        { model: Psicologo, attributes: ['id', 'nombre', 'especialidad'] }
      ]
    });

    res.json({
      message: 'Cita confirmada exitosamente',
      cita: citaActualizada
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al confirmar cita', detalle: error.message });
  }
};

// Cancelar cita
exports.cancelarCita = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;

    const cita = await Cita.findByPk(id);
    if (!cita) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    // Validar permisos
    if (req.user.rol === 'paciente' && cita.pacienteId !== req.user.id) {
      return res.status(403).json({ error: 'No puedes cancelar esta cita' });
    }

    if (['completada', 'cancelada'].includes(cita.estado)) {
      return res.status(400).json({ error: 'No se puede cancelar esta cita' });
    }

    await cita.update({
      estado: 'cancelada',
      notas: motivo ? `Cancelada: ${motivo}` : 'Cita cancelada'
    });

    res.json({ message: 'Cita cancelada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al cancelar cita', detalle: error.message });
  }
};

// Obtener cita por ID
exports.getCitaById = async (req, res) => {
  try {
    const cita = await Cita.findByPk(req.params.id, {
      include: [
        { model: Paciente, attributes: ['id', 'nombre', 'email', 'telefono'] },
        { model: Psicologo, attributes: ['id', 'nombre', 'especialidad'] }
      ]
    });
    
    if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });
    
    // Validar permisos
    if (req.user.rol === 'paciente' && cita.pacienteId !== req.user.id) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    if (req.user.rol === 'psicologo' && cita.psicologoId !== req.user.id) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    res.json(cita);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cita', detalle: error.message });
  }
};

// Actualizar estado de cita
exports.actualizarEstadoCita = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, notas, notasPrivadas } = req.body;

    const cita = await Cita.findByPk(id);
    if (!cita) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    const updateData = { estado };
    if (notas !== undefined) updateData.notas = notas;
    if (notasPrivadas !== undefined && ['psicologo', 'admin'].includes(req.user.rol)) {
      updateData.notasPrivadas = notasPrivadas;
    }

    await cita.update(updateData);
    res.json({ message: 'Estado de cita actualizado', cita });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar cita', detalle: error.message });
  }
};

// Eliminar cita (solo admin)
exports.deleteCita = async (req, res) => {
  try {
    const cita = await Cita.findByPk(req.params.id);
    if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });
    
    await cita.destroy();
    res.json({ message: 'Cita eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar cita', detalle: error.message });
  }
};

// Funciones auxiliares
async function validarDisponibilidad(fecha, hora, psicologoId) {
  try {
    // 1. Verificar si ya hay una cita en ese horario
    const citaExistente = await Cita.findOne({
      where: {
        fecha,
        hora,
        psicologoId,
        estado: { [Op.not]: 'cancelada' }
      }
    });

    if (citaExistente) {
      return { esDisponible: false, motivo: 'Ya existe una cita en ese horario' };
    }

    // 2. Verificar horarios disponibles del psicólogo
    const fechaObj = new Date(fecha);
    const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const diaSemana = diasSemana[fechaObj.getDay()];

    const horarioDisponible = await HorarioDisponible.findOne({
      where: {
        psicologoId,
        [Op.or]: [
          { diaSemana, fechaEspecifica: null },
          { fechaEspecifica: fecha }
        ],
        horaInicio: { [Op.lte]: hora },
        horaFin: { [Op.gt]: hora },
        activo: true
      }
    });

    if (!horarioDisponible) {
      return { esDisponible: false, motivo: 'El psicólogo no está disponible en ese horario' };
    }

    // 3. Verificar bloqueos
    const fechaHora = new Date(`${fecha} ${hora}`);
    const bloqueo = await BloqueoHorario.findOne({
      where: {
        psicologoId,
        fechaInicio: { [Op.lte]: fechaHora },
        fechaFin: { [Op.gte]: fechaHora },
        activo: true
      }
    });

    if (bloqueo) {
      return { esDisponible: false, motivo: 'Horario bloqueado por el psicólogo' };
    }

    return { esDisponible: true };
  } catch (error) {
    return { esDisponible: false, motivo: 'Error al validar disponibilidad' };
  }
}

async function obtenerHorariosDisponibles(psicologoId, fecha) {
  try {
    const fechaObj = new Date(fecha);
    const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const diaSemana = diasSemana[fechaObj.getDay()];

    // Obtener horarios del día
    const horarios = await HorarioDisponible.findAll({
      where: {
        psicologoId,
        [Op.or]: [
          { diaSemana, fechaEspecifica: null },
          { fechaEspecifica: fecha }
        ],
        activo: true
      }
    });

    if (horarios.length === 0) return [];

    // Generar slots de tiempo (cada 60 minutos por defecto)
    const slots = [];
    for (const horario of horarios) {
      const horaInicio = new Date(`1970-01-01 ${horario.horaInicio}`);
      const horaFin = new Date(`1970-01-01 ${horario.horaFin}`);
      
      let current = new Date(horaInicio);
      while (current < horaFin) {
        const horaSlot = current.toTimeString().substring(0, 5);
        
        // Verificar disponibilidad del slot
        const disponible = await validarDisponibilidad(fecha, horaSlot, psicologoId);
        if (disponible.esDisponible) {
          slots.push({
            hora: horaSlot,
            disponible: true,
            modalidad: horario.modalidad
          });
        }
        
        current.setHours(current.getHours() + 1); // Incrementar 1 hora
      }
    }

    return slots;
  } catch (error) {
    console.error('Error al obtener horarios disponibles:', error);
    return [];
  }
}

module.exports = exports;
