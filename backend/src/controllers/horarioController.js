const HorarioDisponible = require('../models/HorarioDisponible');
const Psicologo = require('../models/Psicologo');
const { Op } = require('sequelize');

// Obtener horarios de un psicólogo
exports.getHorariosPsicologo = async (req, res) => {
  try {
    const { psicologoId } = req.params;
    
    // Validar permisos
    if (req.user.rol === 'psicologo' && req.user.id !== parseInt(psicologoId)) {
      return res.status(403).json({ error: 'No puedes acceder a horarios de otro psicólogo' });
    }

    const horarios = await HorarioDisponible.findAll({
      where: { psicologoId, activo: true },
      include: [{ model: Psicologo, attributes: ['nombre', 'especialidad'] }],
      order: [['diaSemana'], ['horaInicio']]
    });

    res.json(horarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener horarios', detalle: error.message });
  }
};

// Crear horario disponible
exports.createHorario = async (req, res) => {
  try {
    const {
      psicologoId,
      diaSemana,
      horaInicio,
      horaFin,
      modalidad,
      fechaEspecifica,
      duracionCita
    } = req.body;

    // Validar permisos
    if (req.user.rol === 'psicologo' && req.user.id !== psicologoId) {
      return res.status(403).json({ error: 'No puedes crear horarios para otro psicólogo' });
    }

    // Validar que la hora de inicio sea menor que la de fin
    if (horaInicio >= horaFin) {
      return res.status(400).json({ error: 'La hora de inicio debe ser menor que la de fin' });
    }

    // Validar solapamiento con horarios existentes
    const solapamiento = await HorarioDisponible.findOne({
      where: {
        psicologoId,
        [Op.or]: [
          { diaSemana, fechaEspecifica: null },
          { fechaEspecifica }
        ],
        activo: true,
        [Op.or]: [
          {
            horaInicio: { [Op.lte]: horaInicio },
            horaFin: { [Op.gt]: horaInicio }
          },
          {
            horaInicio: { [Op.lt]: horaFin },
            horaFin: { [Op.gte]: horaFin }
          },
          {
            horaInicio: { [Op.gte]: horaInicio },
            horaFin: { [Op.lte]: horaFin }
          }
        ]
      }
    });

    if (solapamiento) {
      return res.status(400).json({ error: 'Existe solapamiento con otro horario disponible' });
    }

    const horario = await HorarioDisponible.create({
      psicologoId,
      diaSemana,
      horaInicio,
      horaFin,
      modalidad: modalidad || 'presencial',
      fechaEspecifica,
      duracionCita: duracionCita || 60
    });

    const horarioCompleto = await HorarioDisponible.findByPk(horario.id, {
      include: [{ model: Psicologo, attributes: ['nombre', 'especialidad'] }]
    });

    res.status(201).json({
      message: 'Horario creado exitosamente',
      horario: horarioCompleto
    });
  } catch (error) {
    res.status(400).json({ error: 'Error al crear horario', detalle: error.message });
  }
};

// Actualizar horario
exports.updateHorario = async (req, res) => {
  try {
    const { id } = req.params;
    const { diaSemana, horaInicio, horaFin, modalidad, activo, duracionCita } = req.body;

    const horario = await HorarioDisponible.findByPk(id);
    if (!horario) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }

    // Validar permisos
    if (req.user.rol === 'psicologo' && req.user.id !== horario.psicologoId) {
      return res.status(403).json({ error: 'No puedes modificar horarios de otro psicólogo' });
    }

    // Si se están cambiando las horas, validar solapamiento
    if (horaInicio && horaFin) {
      if (horaInicio >= horaFin) {
        return res.status(400).json({ error: 'La hora de inicio debe ser menor que la de fin' });
      }

      const solapamiento = await HorarioDisponible.findOne({
        where: {
          id: { [Op.ne]: id },
          psicologoId: horario.psicologoId,
          [Op.or]: [
            { diaSemana: diaSemana || horario.diaSemana, fechaEspecifica: null },
            { fechaEspecifica: horario.fechaEspecifica }
          ],
          activo: true,
          [Op.or]: [
            {
              horaInicio: { [Op.lte]: horaInicio },
              horaFin: { [Op.gt]: horaInicio }
            },
            {
              horaInicio: { [Op.lt]: horaFin },
              horaFin: { [Op.gte]: horaFin }
            },
            {
              horaInicio: { [Op.gte]: horaInicio },
              horaFin: { [Op.lte]: horaFin }
            }
          ]
        }
      });

      if (solapamiento) {
        return res.status(400).json({ error: 'Existe solapamiento con otro horario disponible' });
      }
    }

    const updateData = {};
    if (diaSemana !== undefined) updateData.diaSemana = diaSemana;
    if (horaInicio !== undefined) updateData.horaInicio = horaInicio;
    if (horaFin !== undefined) updateData.horaFin = horaFin;
    if (modalidad !== undefined) updateData.modalidad = modalidad;
    if (activo !== undefined) updateData.activo = activo;
    if (duracionCita !== undefined) updateData.duracionCita = duracionCita;

    await horario.update(updateData);

    const horarioActualizado = await HorarioDisponible.findByPk(id, {
      include: [{ model: Psicologo, attributes: ['nombre', 'especialidad'] }]
    });

    res.json({
      message: 'Horario actualizado exitosamente',
      horario: horarioActualizado
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar horario', detalle: error.message });
  }
};

// Eliminar horario (desactivar)
exports.deleteHorario = async (req, res) => {
  try {
    const { id } = req.params;
    
    const horario = await HorarioDisponible.findByPk(id);
    if (!horario) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }

    // Validar permisos
    if (req.user.rol === 'psicologo' && req.user.id !== horario.psicologoId) {
      return res.status(403).json({ error: 'No puedes eliminar horarios de otro psicólogo' });
    }

    await horario.update({ activo: false });
    res.json({ message: 'Horario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar horario', detalle: error.message });
  }
};

// Obtener horarios disponibles para citas
exports.getHorariosDisponiblesCitas = async (req, res) => {
  try {
    const { psicologoId, fecha, modalidad } = req.query;

    if (!psicologoId || !fecha) {
      return res.status(400).json({ error: 'PsicologoId y fecha son requeridos' });
    }

    const fechaObj = new Date(fecha);
    const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const diaSemana = diasSemana[fechaObj.getDay()];

    let whereClause = {
      psicologoId,
      [Op.or]: [
        { diaSemana, fechaEspecifica: null },
        { fechaEspecifica: fecha }
      ],
      activo: true
    };

    if (modalidad) {
      whereClause.modalidad = modalidad;
    }

    const horarios = await HorarioDisponible.findAll({
      where: whereClause,
      include: [{ model: Psicologo, attributes: ['nombre', 'especialidad'] }],
      order: [['horaInicio']]
    });

    // Generar slots disponibles
    const slots = [];
    for (const horario of horarios) {
      const horaInicio = new Date(`1970-01-01 ${horario.horaInicio}`);
      const horaFin = new Date(`1970-01-01 ${horario.horaFin}`);
      const duracion = horario.duracionCita || 60; // minutos
      
      let current = new Date(horaInicio);
      while (current < horaFin) {
        const horaSlot = current.toTimeString().substring(0, 5);
        
        // Aquí podrías agregar validación adicional de disponibilidad
        slots.push({
          hora: horaSlot,
          modalidad: horario.modalidad,
          duracion: duracion
        });
        
        current.setMinutes(current.getMinutes() + duracion);
      }
    }

    res.json({ 
      fecha,
      psicologo: horarios[0]?.Psicologo || null,
      slots 
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener horarios disponibles', detalle: error.message });
  }
};

module.exports = exports;
