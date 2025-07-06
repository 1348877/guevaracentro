const bcrypt = require('bcryptjs');
const { Usuario, Psicologo, Paciente, HorarioDisponible, Cita } = require('../models');

const seedData = async () => {
  try {
    console.log('🌱 Iniciando seed de datos...');

    // Limpiar datos existentes
    await Cita.destroy({ where: {} });
    await HorarioDisponible.destroy({ where: {} });
    await Paciente.destroy({ where: {} });
    await Psicologo.destroy({ where: {} });
    await Usuario.destroy({ where: {} });

    // Crear usuarios
    const passwordHash = await bcrypt.hash('123456', 10);
    
    const usuarios = await Usuario.bulkCreate([
      {
        nombre: 'Admin',
        apellido: 'Sistema',
        email: 'admin@psicologiaguevara.com',
        telefono: '3001234567',
        password: passwordHash,
        rol: 'admin',
        activo: true
      },
      {
        nombre: 'María',
        apellido: 'Secretaria',
        email: 'secretaria@psicologiaguevara.com',
        telefono: '3001234568',
        password: passwordHash,
        rol: 'secretaria',
        activo: true
      },
      {
        nombre: 'Dr. Carlos',
        apellido: 'Guevara',
        email: 'carlos@psicologiaguevara.com',
        telefono: '3001234569',
        password: passwordHash,
        rol: 'psicologo',
        activo: true
      },
      {
        nombre: 'Dra. Ana',
        apellido: 'Rodríguez',
        email: 'ana@psicologiaguevara.com',
        telefono: '3001234570',
        password: passwordHash,
        rol: 'psicologo',
        activo: true
      },
      {
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@email.com',
        telefono: '3001234571',
        password: passwordHash,
        rol: 'paciente',
        activo: true
      },
      {
        nombre: 'Laura',
        apellido: 'González',
        email: 'laura@email.com',
        telefono: '3001234572',
        password: passwordHash,
        rol: 'paciente',
        activo: true
      }
    ]);

    // Crear psicólogos
    const psicologos = await Psicologo.bulkCreate([
      {
        usuarioId: usuarios[2].id, // Dr. Carlos
        nombres: 'Carlos',
        apellidos: 'Guevara',
        colegiatura: '12345',
        especialidad: 'Psicología Clínica',
        telefono: '3001234569',
        email: 'carlos@psicologiaguevara.com'
      },
      {
        usuarioId: usuarios[3].id, // Dra. Ana
        nombres: 'Ana',
        apellidos: 'Rodríguez',
        colegiatura: '12346',
        especialidad: 'Psicología Infantil',
        telefono: '3001234570',
        email: 'ana@psicologiaguevara.com'
      }
    ]);

    // Crear pacientes
    const pacientes = await Paciente.bulkCreate([
      {
        usuarioId: usuarios[4].id, // Juan
        nombres: 'Juan',
        apellidos: 'Pérez',
        dni: '12345678',
        fecha_nacimiento: '1990-05-15',
        sexo: 'M',
        direccion: 'Calle 123 #45-67',
        telefono: '3001234571',
        email: 'juan@email.com',
        historial_clinico: 'Manejo de ansiedad'
      },
      {
        usuarioId: usuarios[5].id, // Laura
        nombres: 'Laura',
        apellidos: 'González',
        dni: '87654321',
        fecha_nacimiento: '1985-08-22',
        sexo: 'F',
        direccion: 'Carrera 45 #12-34',
        telefono: '3001234572',
        email: 'laura@email.com',
        historial_clinico: 'Terapia de pareja'
      }
    ]);

    // Crear horarios disponibles
    const horarios = [];
    const diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
    const horas = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

    for (const psicologo of psicologos) {
      for (const dia of diasSemana) {
        for (const hora of horas) {
          horarios.push({
            psicologoId: psicologo.id,
            diaSemana: dia,
            horaInicio: hora,
            horaFin: `${parseInt(hora.split(':')[0]) + 1}:00`,
            activo: true
          });
        }
      }
    }

    await HorarioDisponible.bulkCreate(horarios);

    // Crear algunas citas de ejemplo
    const fechaManana = new Date();
    fechaManana.setDate(fechaManana.getDate() + 1);
    
    const fechaSemanaProxima = new Date();
    fechaSemanaProxima.setDate(fechaSemanaProxima.getDate() + 7);

    // Crear citas individuales para que se ejecuten los hooks
    const cita1 = await Cita.create({
      pacienteId: pacientes[0].id,
      psicologoId: psicologos[0].id,
      fecha: fechaManana,
      hora: '09:00',
      tipoCita: 'primera_consulta',
      modalidad: 'presencial',
      estado: 'confirmada',
      motivo: 'Consulta inicial - Manejo de ansiedad',
      notas: 'Primera sesión con el paciente'
    });

    const cita2 = await Cita.create({
      pacienteId: pacientes[1].id,
      psicologoId: psicologos[1].id,
      fecha: fechaSemanaProxima,
      hora: '14:00',
      tipoCita: 'terapia_pareja',
      modalidad: 'virtual',
      estado: 'confirmada',
      motivo: 'Terapia de pareja',
      notas: 'Continuar con el proceso terapéutico'
    });

    console.log('✅ Seed completado exitosamente!');
    console.log('📊 Datos creados:');
    console.log(`- ${usuarios.length} usuarios`);
    console.log(`- ${psicologos.length} psicólogos`);
    console.log(`- ${pacientes.length} pacientes`);
    console.log(`- ${horarios.length} horarios disponibles`);
    console.log('- 2 citas de ejemplo');
    console.log('\n🔐 Credenciales de prueba:');
    console.log('Admin: admin@psicologiaguevara.com / 123456');
    console.log('Secretaria: secretaria@psicologiaguevara.com / 123456');
    console.log('Psicólogo 1: carlos@psicologiaguevara.com / 123456');
    console.log('Psicólogo 2: ana@psicologiaguevara.com / 123456');
    console.log('Paciente 1: juan@email.com / 123456');
    console.log('Paciente 2: laura@email.com / 123456');

  } catch (error) {
    console.error('❌ Error en seed:', error);
  }
};

module.exports = seedData;
