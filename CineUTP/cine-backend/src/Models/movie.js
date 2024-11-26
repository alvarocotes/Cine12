const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  sinopsis: {
    type: String,
    required: true
  },
  generos: [{
    type: String,
    required: true
  }],
  duracion: {
    type: Number,
    required: true
  },
  clasificacion: {
    type: String,
    required: true
  },
  director: {
    type: String,
    required: true
  },
  actores: [{
    type: String
  }],
  imagen: {
    type: String,
    required: true
  },
  trailer: {
    type: String
  },
  fechaEstreno: {
    type: Date,
    required: true
  },
  estado: {
    type: String,
    enum: ['Próximamente', 'En Cartelera', 'Finalizada'],
    default: 'Próximamente'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Movie', movieSchema);