const express = require('express');
const router = express.Router();
const { getMovies, addMovie, updateMovie, deleteMovie } = require('../Controllers/movieController');
const auth = require('../Middleware/auth');
const admin = require('../Middleware/admin');

// Rutas públicas
router.get('/', getMovies);

// Rutas protegidas (requieren autenticación y ser admin)
router.post('/', [auth, admin], addMovie);
router.put('/:id', [auth, admin], updateMovie);
router.delete('/:id', [auth, admin], deleteMovie);

module.exports = router;