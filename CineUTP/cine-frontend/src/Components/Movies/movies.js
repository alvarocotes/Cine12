import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MovieCatalog = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const generos = [
    'Acción', 'Aventura', 'Comedia', 'Drama', 'Terror', 
    'Ciencia Ficción', 'Romance', 'Animación'
  ];

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/movies');
      setMovies(response.data);
    } catch (error) {
      console.error('Error al obtener películas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenreToggle = (genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const filteredMovies = movies.filter(movie => {
    const matchesGenres = selectedGenres.length === 0 || 
      selectedGenres.some(genre => movie.generos.includes(genre));
    
    const matchesSearch = movie.titulo.toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesGenres && matchesSearch;
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Catálogo de Películas</h2>
      
      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar películas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <div className="d-flex flex-wrap gap-2">
            {generos.map(genre => (
              <button
                key={genre}
                className={`btn ${selectedGenres.includes(genre) 
                  ? 'btn-primary' 
                  : 'btn-outline-primary'}`}
                onClick={() => handleGenreToggle(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-4 g-4">
        {filteredMovies.map(movie => (
          <div key={movie._id} className="col">
            <div className="card h-100">
              <img
                src={movie.imagen}
                className="card-img-top"
                alt={movie.titulo}
                style={{ height: '400px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{movie.titulo}</h5>
                <p className="card-text">
                  <small className="text-muted">
                    {movie.generos.join(', ')}
                  </small>
                </p>
                <p className="card-text">
                  {movie.sinopsis.substring(0, 100)}...
                </p>
              </div>
              <div className="card-footer">
                <button className="btn btn-primary w-100">
                  Ver Detalles
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieCatalog;