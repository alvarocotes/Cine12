const Movie = require('../Models/movie');

// Obtener todas las películas
exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json(movies);
  } catch (err) {
    console.error('Error al obtener películas:', err);
    res.status(500).json({ msg: 'Error al obtener películas' });
  }
};

// Agregar una nueva película
exports.addMovie = async (req, res) => {
  try {
    console.log('Datos recibidos:', req.body); // Debug

    const {
      titulo,
      sinopsis,
      generos,
      duracion,
      clasificacion,
      director,
      actores,
      imagen,
      trailer,
      fechaEstreno,
      estado
    } = req.body;

    // Validaciones básicas
    if (!titulo || !sinopsis || !generos || !duracion) {
      return res.status(400).json({ 
        msg: 'Todos los campos son requeridos' 
      });
    }

    // Crear nueva película
    const movie = new Movie({
      titulo,
      sinopsis,
      generos,
      duracion,
      clasificacion,
      director,
      actores,
      imagen,
      trailer,
      fechaEstreno,
      estado
    });

    await movie.save();
    console.log('Película guardada:', movie); // Debug
    res.json(movie);
  } catch (err) {
    console.error('Error al agregar película:', err);
    res.status(500).json({ msg: 'Error al agregar película' });
  }
};
// Actualizar película
exports.updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!movie) {
      return res.status(404).json({ msg: 'Película no encontrada' });
    }

    res.json(movie);
  } catch (err) {
    console.error('Error al actualizar película:', err);
    res.status(500).json({ msg: 'Error al actualizar película' });
  }
};

// Eliminar película
exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    
    if (!movie) {
      return res.status(404).json({ msg: 'Película no encontrada' });
    }

    res.json({ msg: 'Película eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar película:', err);
    res.status(500).json({ msg: 'Error al eliminar película' });
  }
};