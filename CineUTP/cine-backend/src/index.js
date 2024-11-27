require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./Config/db');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', require('./Routes/logRoute'));
app.use('/api/users', require('./Routes/userRoute')); // Asegúrate de que esta línea esté presente
app.use('/api/movies', require('./Routes/movieRoute'));

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error global:', err);
  res.status(500).json({ 
    msg: 'Error del servidor', 
    error: err.message 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});