const BloqueoHorario = require('../models/BloqueoHorario');
const Psicologo = require('../models/Psicologo');
const Cita = require('../models/Cita');
const { Op } = require('sequelize');

// Obtener bloqueos de un psicólogo
exports.getBloqueosPsicologo = async (req, res) => {
  try {
    const { psicologoId } = req.params;
    const { fechaInicio, fechaFin, activo } = req.query;
    
    // Validar permisos
    if (req.user.rol === 'psicologo' && req.user.id !== parseInt(psicologoId)) {
      return res.status(403).json({ error: 'No puedes acceder a bloqueos de otro psicólogo' });
    }

    let whereClause = { psicologoId };
    
    if (activo !== undefined) {
      whereClause.activo = activo === 'true';
    }

    if (fechaInicio && fechaFin) {
      whereClause[Op.or] = [
        {
          fechaInicio: { [Op.between]: [fechaInicio, fechaFin] }
        },
        {
          fechaFin: { [Op.between]: [fechaInicio, fechaFin] }
        },
        {
          fechaInicio: { [Op.lte]: fechaInicio },
          fechaFin: { [Op.gte]: fechaFin }
        }
      ];
    }

    const bloqueos = await BloqueoHorario.findAll({
      where: whereClause,
      include: [{ model: Psicologo, attributes: ['nombre', 'especialidad'] }],
      order: [['fechaInicio', 'ASC']]
    });

    res.json(bloqueos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener bloqueos', detalle: error.message });
  }
};

// Crear bloqueo de horario
exports.createBloqueo = async (req, res) => {
  try {
    const {
      psicologoId,
      fechaInicio,
      fechaFin,
      tipoBloqueo,
      motivo,
      descripcion
    } = req.body;

    // Validar permisos
    if (req.user.rol === 'psicologo' && req.user.id !== psicologoId) {
      return res.status(403).json({ error: 'No puedes crear bloqueos para otro psicólogo' });
    }

    // Validar fechas
    if (new Date(fechaInicio) >= new Date(fechaFin)) {
      return res.status(400).json({ error: 'La fecha de inicio debe ser menor que la de fin' });
    }

    // Verificar si hay citas confirmadas en el período
    const citasAfectadas = await Cita.findAll({
      where: {
        psicologoId,
        fechaHora: {
          [Op.between]: [fechaInicio, fechaFin]
        },
        estado: { [Op.in]: ['confirmada', 'solicitada'] }
      }
    });

    if (citasAfectadas.length > 0) {
      return res.status(400).json({
        error: 'Existen citas confirmadas en el período que deseas bloquear',
        citasAfectadas: citasAfectadas.length,
        citas: citasAfectadas.map(cita => ({
          id: cita.id,
          fecha: cita.fecha,
          hora: cita.hora,
          estado: cita.estado
        }))
      });
    }

    const bloqueo = await BloqueoHorario.create({
      psicologoId,
      fechaInicio,
      fechaFin,
      tipoBloqueo: tipoBloqueo || 'personal',
      motivo,
      descripcion
    });

    const bloqueoCompleto = await BloqueoHorario.findByPk(bloqueo.id, {
      include: [{ model: Psicologo, attributes: ['nombre', 'especialidad'] }]
    });

    res.status(201).json({
      message: 'Bloqueo creado exitosamente',
      bloqueo: bloqueoCompleto
    });
  } catch (error) {
    res.status(400).json({ error: 'Error al crear bloqueo', detalle: error.message });
  }
};

// Actualizar bloqueo
exports.updateBloqueo = async (req, res) => {
  try {
    const { id } = req.params;
    const { fechaInicio, fechaFin, tipoBloqueo, motivo, descripcion, activo } = req.body;

    const bloqueo = await BloqueoHorario.findByPk(id);
    if (!bloqueo) {
      return res.status(404).json({ error: 'Bloqueo no encontrado' });
    }

    // Validar permisos
    if (req.user.rol === 'psicologo' && req.user.id !== bloqueo.psicologoId) {
      return res.status(403).json({ error: 'No puedes modificar bloqueos de otro psicólogo' });
    }

    // Si se están cambiando las fechas, validar citas existentes
    if (fechaInicio && fechaFin) {
      if (new Date(fechaInicio) >= new Date(fechaFin)) {
        return res.status(400).json({ error: 'La fecha de inicio debe ser menor que la de fin' });
      }

      // Solo verificar si el bloqueo está activo o se está activando
      if (bloqueo.activo || activo) {
        const citasAfectadas = await Cita.findAll({
          where: {
            psicologoId: bloqueo.psicologoId,
            fechaHora: {
              [Op.between]: [fechaInicio, fechaFin]
            },
            estado: { [Op.in]: ['confirmada', 'solicitada'] }
          }
        });

        if (citasAfectadas.length > 0) {
          return res.status(400).json({
            error: 'Existen citas confirmadas en el nuevo período',
            citasAfectadas: citasAfectadas.length
          });
        }
      }
    }

    const updateData = {};
    if (fechaInicio !== undefined) updateData.fechaInicio = fechaInicio;
    if (fechaFin !== undefined) updateData.fechaFin = fechaFin;
    if (tipoBloqueo !== undefined) updateData.tipoBloqueo = tipoBloqueo;
    if (motivo !== undefined) updateData.motivo = motivo;
    if (descripcion !== undefined) updateData.descripcion = descripcion;
    if (activo !== undefined) updateData.activo = activo;

    await bloqueo.update(updateData);

    const bloqueoActualizado = await BloqueoHorario.findByPk(id, {
      include: [{ model: Psicologo, attributes: ['nombre', 'especialidad'] }]
    });

    res.json({
      message: 'Bloqueo actualizado exitosamente',
      bloqueo: bloqueoActualizado
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar bloqueo', detalle: error.message });
  }
};

// Eliminar bloqueo
exports.deleteBloqueo = async (req, res) => {
  try {
    const { id } = req.params;
    
    const bloqueo = await BloqueoHorario.findByPk(id);
    if (!bloqueo) {
      return res.status(404).json({ error: 'Bloqueo no encontrado' });
    }

    // Validar permisos
    if (req.user.rol === 'psicologo' && req.user.id !== bloqueo.psicologoId) {
      return res.status(403).json({ error: 'No puedes eliminar bloqueos de otro psicólogo' });
    }

    // Si es admin, permitir eliminación física, si no, solo desactivar
    if (req.user.rol === 'admin') {
      await bloqueo.destroy();
      res.json({ message: 'Bloqueo eliminado permanentemente' });
    } else {
      await bloqueo.update({ activo: false });
      res.json({ message: 'Bloqueo desactivado exitosamente' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar bloqueo', detalle: error.message });
  }
};

// Obtener todos los bloqueos (solo admin/secretaria)
exports.getAllBloqueos = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, tipoBloqueo, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = {};

    if (fechaInicio && fechaFin) {
      whereClause[Op.or] = [
        {
          fechaInicio: { [Op.between]: [fechaInicio, fechaFin] }
        },
        {
          fechaFin: { [Op.between]: [fechaInicio, fechaFin] }
        },
        {
          fechaInicio: { [Op.lte]: fechaInicio },
          fechaFin: { [Op.gte]: fechaFin }
        }
      ];
    }

    if (tipoBloqueo) {
      whereClause.tipoBloqueo = tipoBloqueo;
    }

    const { count, rows: bloqueos } = await BloqueoHorario.findAndCountAll({
      where: whereClause,
      include: [{ model: Psicologo, attributes: ['nombre', 'especialidad'] }],
      limit: parseInt(limit),
      offset,
      order: [['fechaInicio', 'DESC']]
    });

    res.json({
      bloqueos,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener bloqueos', detalle: error.message });
  }
};

// Verificar conflictos de horario
exports.verificarConflictos = async (req, res) => {
  try {
    const { psicologoId, fechaInicio, fechaFin } = req.body;

    if (!psicologoId || !fechaInicio || !fechaFin) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }

    // Buscar citas en el período
    const citas = await Cita.findAll({
      where: {
        psicologoId,
        fechaHora: {
          [Op.between]: [fechaInicio, fechaFin]
        },
        estado: { [Op.in]: ['confirmada', 'solicitada'] }
      },
      attributes: ['id', 'fecha', 'hora', 'estado'],
      include: [
        {
          model: require('../models/Paciente'),
          attributes: ['nombre', 'telefono']
        }
      ]
    });

    // Buscar otros bloqueos que se solapen
    const bloqueos = await BloqueoHorario.findAll({
      where: {
        psicologoId,
        activo: true,
        [Op.or]: [
          {
            fechaInicio: { [Op.between]: [fechaInicio, fechaFin] }
          },
          {
            fechaFin: { [Op.between]: [fechaInicio, fechaFin] }
          },
          {
            fechaInicio: { [Op.lte]: fechaInicio },
            fechaFin: { [Op.gte]: fechaFin }
          }
        ]
      }
    });

    res.json({
      tieneConflictos: citas.length > 0 || bloqueos.length > 0,
      citas,
      bloqueos,
      resumen: {
        citasAfectadas: citas.length,
        bloqueosExistentes: bloqueos.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al verificar conflictos', detalle: error.message });
  }
};

module.exports = exports;
