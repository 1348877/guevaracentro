const bcrypt = require('bcryptjs');
const { Usuario, Paciente, Psicologo, HorarioDisponible, Cita, BloqueoHorario } = require('../models/associations');

const createTestData = async () => {
  try {
    console.log('🌱 Creando datos de prueba...');

    // Limpiar datos existentes
    await BloqueoHorario.destroy({ where: {} });
    await Cita.destroy({ where: {} });
    await HorarioDisponible.destroy({ where: {} });
    await Psicologo.destroy({ where: {} });
    await Paciente.destroy({ where: {} });
    await Usuario.destroy({ where: {} });

    console.log('🧹 Datos anteriores limpiados');

    // Crear usuarios
    const saltRounds = 10;
    
    // Admin
    const adminUser = await Usuario.create({
      nombre: 'Administrador',
      apellido: 'Sistema',
      email: 'admin@guevara.com',
      password: await bcrypt.hash('admin123', saltRounds),
      rol: 'admin',
      telefono: '555-0000',
      activo: true
    });

    // Secretaria
    const secretariaUser = await Usuario.create({
      nombre: 'María',
      apellido: 'Secretaria',
      email: 'secretaria@guevara.com',
      password: await bcrypt.hash('secretaria123', saltRounds),
      rol: 'secretaria',
      telefono: '555-0001',
      activo: true
    });

    // Psicólogos
    const psicologo1User = await Usuario.create({
      nombre: 'Dr. Carlos',
      apellido: 'Guevara',
      email: 'carlos@guevara.com',
      password: await bcrypt.hash('psicologo123', saltRounds),
      rol: 'psicologo',
      telefono: '555-0002',
      activo: true
    });

    const psicologo2User = await Usuario.create({
      nombre: 'Dra. Ana',
      apellido: 'Rodríguez',
      email: 'ana@guevara.com',
      password: await bcrypt.hash('psicologo123', saltRounds),
      rol: 'psicologo',
      telefono: '555-0003',
      activo: true
    });

    // Pacientes
    const paciente1User = await Usuario.create({
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@email.com',
      password: await bcrypt.hash('paciente123', saltRounds),
      rol: 'paciente',
      telefono: '555-1001',
      activo: true
    });

    const paciente2User = await Usuario.create({
      nombre: 'María',
      apellido: 'González',
      email: 'maria@email.com',
      password: await bcrypt.hash('paciente123', saltRounds),
      rol: 'paciente',
      telefono: '555-1002',
      activo: true
    });

    console.log('👥 Usuarios creados');

    // Crear perfiles de psicólogos
    const psicologo1 = await Psicologo.create({
      usuarioId: psicologo1User.id,
      especialidad: 'Psicología Clínica',
      licencia: 'PSI-001',
      experiencia: 15,
      biografia: 'Especialista en terapia cognitivo-conductual con 15 años de experiencia.',
      tarifa: 80.00
    });

    const psicologo2 = await Psicologo.create({
      usuarioId: psicologo2User.id,
      especialidad: 'Psicología Infantil',
      licencia: 'PSI-002',
      experiencia: 10,
      biografia: 'Especializada en terapia infantil y adolescente.',
      tarifa: 75.00
    });

    console.log('👨‍⚕️ Psicólogos creados');

    // Crear perfiles de pacientes
    const paciente1 = await Paciente.create({
      usuarioId: paciente1User.id,
      fechaNacimiento: '1990-05-15',
      ocupacion: 'Ingeniero',
      contactoEmergencia: 'Ana Pérez - 555-2001',
      historialMedico: 'Sin antecedentes relevantes'
    });

    const paciente2 = await Paciente.create({
      usuarioId: paciente2User.id,
      fechaNacimiento: '1985-08-22',
      ocupacion: 'Profesora',
      contactoEmergencia: 'Carlos González - 555-2002',
      historialMedico: 'Ansiedad leve'
    });

    console.log('🏥 Pacientes creados');

    // Crear horarios disponibles para los psicólogos
    const horarios = [];
    const dias = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'];
    
    for (const psicologo of [psicologo1, psicologo2]) {
      for (const dia of dias) {
        // Horario de mañana: 9:00 - 12:00
        horarios.push({
          psicologoId: psicologo.id,
          diaSemana: dia,
          horaInicio: '09:00',
          horaFin: '12:00',
          activo: true
        });
        
        // Horario de tarde: 14:00 - 18:00
        horarios.push({
          psicologoId: psicologo.id,
          diaSemana: dia,
          horaInicio: '14:00',
          horaFin: '18:00',
          activo: true
        });
      }
    }

    await HorarioDisponible.bulkCreate(horarios);
    console.log('🕐 Horarios disponibles creados');

    // Crear algunas citas de ejemplo
    const fechaProxima = new Date();
    fechaProxima.setDate(fechaProxima.getDate() + 7); // Próxima semana

    const cita1 = await Cita.create({
      pacienteId: paciente1.id,
      psicologoId: psicologo1.id,
      fechaHora: new Date(fechaProxima.getFullYear(), fechaProxima.getMonth(), fechaProxima.getDate(), 10, 0),
      duracionMinutos: 60,
      tipoConsulta: 'presencial',
      estado: 'confirmada',
      motivo: 'Consulta inicial',
      observaciones: 'Primera cita del paciente'
    });

    const cita2 = await Cita.create({
      pacienteId: paciente2.id,
      psicologoId: psicologo2.id,
      fechaHora: new Date(fechaProxima.getFullYear(), fechaProxima.getMonth(), fechaProxima.getDate() + 1, 15, 0),
      duracionMinutos: 60,
      tipoConsulta: 'online',
      estado: 'pendiente',
      motivo: 'Seguimiento',
      observaciones: 'Paciente prefiere modalidad online'
    });

    console.log('📅 Citas de ejemplo creadas');

    // Crear un bloqueo de horario (vacaciones)
    const fechaBloqueo = new Date();
    fechaBloqueo.setDate(fechaBloqueo.getDate() + 14); // En dos semanas

    await BloqueoHorario.create({
      psicologoId: psicologo1.id,
      fechaInicio: fechaBloqueo,
      fechaFin: new Date(fechaBloqueo.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 días después
      motivo: 'Vacaciones programadas',
      tipoBloqueo: 'vacaciones'
    });

    console.log('🚫 Bloqueo de horario creado');

    console.log(`
    ✅ Datos de prueba creados exitosamente!
    
    👥 USUARIOS DE PRUEBA:
    
    🔑 Admin:
    Email: admin@guevara.com
    Password: admin123
    
    📋 Secretaria:
    Email: secretaria@guevara.com
    Password: secretaria123
    
    👨‍⚕️ Psicólogos:
    Email: carlos@guevara.com / Password: psicologo123
    Email: ana@guevara.com / Password: psicologo123
    
    🏥 Pacientes:
    Email: juan@email.com / Password: paciente123
    Email: maria@email.com / Password: paciente123
    
    📊 Datos incluidos:
    - ${horarios.length} horarios disponibles
    - 2 citas de ejemplo
    - 1 bloqueo de horario
    `);

  } catch (error) {
    console.error('❌ Error creando datos de prueba:', error);
    throw error;
  }
};

module.exports = { createTestData };
