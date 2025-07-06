const { createTestData } = require('./src/utils/testData');
const { sequelize } = require('./src/models/associations');

const runTestData = async () => {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa a la base de datos');

    console.log('🔄 Sincronizando modelos...');
    await sequelize.sync({ force: false }); // No forzar, preservar datos existentes si los hay
    console.log('✅ Modelos sincronizados');

    await createTestData();
    
    console.log('🎉 ¡Proceso completado exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en el proceso:', error);
    process.exit(1);
  }
};

runTestData();
