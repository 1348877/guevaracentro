const sequelize = require('../../config/database');
const Paciente = require('../models/Paciente');
const Psicologo = require('../models/Psicologo');
const Usuario = require('../models/Usuario');
const Test = require('../models/Test');

async function seed() {
  await sequelize.sync({ force: true });

  // Psicólogos
  const psicologos = await Psicologo.bulkCreate([
    { nombres: 'Juan', apellidos: 'Quispe Mamani', colegiatura: 'CPSP12345', especialidad: 'Test de personalidad', telefono: '951234567', email: 'juan.quispe@centropsi.pe' },
    { nombres: 'María', apellidos: 'Flores Huanca', colegiatura: 'CPSP67890', especialidad: 'Terapia catártica', telefono: '952345678', email: 'maria.flores@centropsi.pe' }
  ]);

  // Usuarios
  await Usuario.bulkCreate([
    { nombre: 'secretaria', email: 'secretaria@centropsi.pe', password: '123456', rol: 'secretaria' },
    { nombre: 'admin', email: 'admin@centropsi.pe', password: 'admin123', rol: 'admin' },
    { nombre: 'juan.quispe', email: 'juan.quispe@centropsi.pe', password: 'psico123', rol: 'psicologo' },
    { nombre: 'maria.flores', email: 'maria.flores@centropsi.pe', password: 'psico456', rol: 'psicologo' }
  ]);

  // Pacientes
  await Paciente.bulkCreate([
    { nombres: 'Carlos', apellidos: 'Ramos Soto', dni: '12345678', fecha_nacimiento: '1990-05-10', sexo: 'M', direccion: 'Av. Tacna 123', telefono: '953456789', email: 'carlos.ramos@gmail.com', historial_clinico: 'Ansiedad generalizada.' },
    { nombres: 'Lucía', apellidos: 'Vargas Paredes', dni: '87654321', fecha_nacimiento: '1985-11-22', sexo: 'F', direccion: 'Jr. Moquegua 456', telefono: '954567890', email: 'lucia.vargas@gmail.com', historial_clinico: 'Depresión moderada.' }
  ]);

  // Test de ejemplo
  await Test.create({
    nombre: 'Test de Personalidad',
    descripcion: 'Test estándar de 190 preguntas.',
    preguntas: Array.from({ length: 190 }, (_, i) => `Pregunta ${i + 1}`)
  });

  console.log('Datos ficticios insertados correctamente.');
  process.exit();
}

seed();
