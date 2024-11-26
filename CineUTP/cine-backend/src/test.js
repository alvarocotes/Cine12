const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conexión exitosa a MongoDB');
    console.log(`Host: ${conn.connection.host}`);
    console.log(`Base de datos: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ Error de conexión:');
    console.error(error);
    process.exit(1);
  }
};

// Ejecutar la prueba
connectDB();

// Cerrar la conexión después de 5 segundos
setTimeout(() => {
  mongoose.connection.close();
  console.log('Conexión cerrada');
  process.exit(0);
}, 5000);