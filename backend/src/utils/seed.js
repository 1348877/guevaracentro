const seedData = require('./seedData');
const { sequelize } = require('../models');

const seedDatabase = async () => {
  try {
    console.log('🔄 Sincronizando base de datos...');
    await sequelize.sync({ force: true });
    
    console.log('🌱 Ejecutando seed de datos...');
    await seedData();
    
    console.log('✅ Proceso de seed completado exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en proceso de seed:', error);
    process.exit(1);
  }
};

// Ejecutar seed si este archivo es llamado directamente
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
