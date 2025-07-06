// Ejemplo de servicio para lógica de negocio de Paciente
const { Paciente } = require('../models/Paciente');

exports.findAll = () => Paciente.findAll();
exports.create = (data) => Paciente.create(data);
exports.findById = (id) => Paciente.findByPk(id);
exports.deleteById = async (id) => {
  const paciente = await Paciente.findByPk(id);
  if (paciente) {
    await paciente.destroy();
    return true;
  }
  return false;
};
