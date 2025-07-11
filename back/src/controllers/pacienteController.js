// Controlador para Paciente
const Paciente = require('../models/Paciente');

// Obtener todos los pacientes
exports.getAllPacientes = async (req, res) => {
  try {
    let pacientes;
    if (req.user.rol === 'paciente') {
      // Solo puede ver su propio registro (por email o telefono)
      pacientes = await Paciente.findAll({ where: { email: req.user.email } });
    } else if (req.user.rol === 'psicologo') {
      // Aquí se podría filtrar por pacientes asignados al psicólogo (requiere relación en DB)
      // Por ahora, denegar acceso hasta implementar asignación
      return res.status(403).json({ error: 'Acceso denegado: solo staff autorizado' });
    } else {
      // Secretaria y admin ven todo
      pacientes = await Paciente.findAll();
    }
    res.json(pacientes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pacientes', detalle: error.message });
  }
};

// Crear un nuevo paciente
exports.createPaciente = async (req, res) => {
  try {
    const paciente = await Paciente.create(req.body);
    res.status(201).json(paciente);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear paciente', detalle: error.message });
  }
};

// Obtener paciente por ID
exports.getPacienteById = async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id);
    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });
    if (req.user.rol === 'paciente' && paciente.email !== req.user.email) {
      return res.status(403).json({ error: 'Acceso denegado: solo puedes ver tu propio perfil' });
    }
    if (req.user.rol === 'psicologo') {
      // Aquí se podría validar si el paciente está asignado al psicólogo
      return res.status(403).json({ error: 'Acceso denegado: solo staff autorizado' });
    }
    res.json(paciente);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener paciente', detalle: error.message });
  }
};

// Eliminar paciente
exports.deletePaciente = async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id);
    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });
    await paciente.destroy();
    res.json({ message: 'Paciente eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar paciente', detalle: error.message });
  }
};

// Endpoint para poblar la base de datos con pacientes de prueba
exports.seedPacientes = async (req, res) => {
  try {
    const pacientes = [
      {
        nombres: 'Juan',
        apellidos: 'Pérez',
        dni: '12345678',
        fecha_nacimiento: '1990-01-01',
        sexo: 'M',
        direccion: 'Av. Siempre Viva 123',
        telefono: '987654321',
        email: 'juan.perez@email.com',
        historial_clinico: 'Sin antecedentes'
      },
      {
        nombres: 'Ana',
        apellidos: 'García',
        dni: '87654321',
        fecha_nacimiento: '1985-05-10',
        sexo: 'F',
        direccion: 'Calle Falsa 456',
        telefono: '912345678',
        email: 'ana.garcia@email.com',
        historial_clinico: 'Alergia a penicilina'
      }
    ];
    await Paciente.bulkCreate(pacientes, { ignoreDuplicates: true });
    res.json({ message: 'Pacientes de prueba insertados' });
  } catch (error) {
    res.status(500).json({ error: 'Error al insertar pacientes de prueba', detalle: error.message });
  }
};
