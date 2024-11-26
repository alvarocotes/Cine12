const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Configuración CORS más específica
app.use(cors({
  origin: 'http://localhost:3000', // URL de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api/auth', require('./Routes/logRoute'));
app.use('/api/users', require('./Routes/userRoute'));

// Middleware para manejar errores CORS
app.use((err, req, res, next) => {
  if (err.name === 'CORSError') {
    res.status(500).json({ msg: 'Error CORS: ' + err.message });
  } else {
    next(err);
  }
});
 
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});