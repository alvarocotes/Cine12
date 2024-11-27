const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('URI de MongoDB:', process.env.MONGO_URI ? 'Definida' : 'No definida');
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('MongoDB Conectado:');
    console.log('Host:', conn.connection.host);
    console.log('Base de datos:', conn.connection.name);
    console.log('Estado:', conn.connection.readyState === 1 ? 'Conectado' : 'Desconectado');

  } catch (error) {
    console.error('Error de conexión a MongoDB:', error.message);
    process.exit(1);
  }
};

// Eventos de conexión
mongoose.connection.on('connected', () => {
  console.log('Mongoose conectado a MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Error de Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose desconectado de MongoDB');
});

module.exports = connectDB;