import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../Context/logContext';
import { useNavigate } from 'react-router-dom';

const MovieManagement = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: '',
    description: '',
    genre: '',
    duration: '',
    image: '',
    releaseDate: '',
    director: '',
    cast: ''
  });

  useEffect(() => {
    console.log('Verificando permisos de admin...'); // Debug
    if (!user?.isAdmin) {
      console.log('Usuario no es admin, redirigiendo...'); // Debug
      navigate('/home');
      return;
    }
    console.log('Usuario es admin, cargando películas...'); // Debug
    fetchMovies();
  }, [user, navigate]);

  const fetchMovies = async () => {
    try {
      console.log('Obteniendo lista de películas...'); // Debug
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/movies', {
        headers: { 'x-auth-token': token }
      });
      console.log('Películas obtenidas:', response.data); // Debug
      setMovies(response.data);
      setError('');
    } catch (err) {
      console.error('Error al cargar películas:', err); // Debug
      setError('Error al cargar las películas');
      if (err.response?.status === 401) {
        console.log('Token inválido o expirado, cerrando sesión...'); // Debug
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewMovie({
      ...newMovie,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Intentando agregar nueva película:', newMovie); // Debug
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/movies',
        newMovie,
        {
          headers: { 'x-auth-token': token }
        }
      );
      console.log('Película agregada exitosamente:', response.data); // Debug
      
      setNewMovie({
        title: '',
        description: '',
        genre: '',
        duration: '',
        image: '',
        releaseDate: '',
        director: '',
        cast: ''
      });
      setShowAddForm(false);
      fetchMovies();
      setError('');
    } catch (err) {
      console.error('Error al agregar película:', err); // Debug
      setError(err.response?.data?.msg || 'Error al agregar la película');
      if (err.response?.status === 401) {
        logout();
      }
    }
  };

  // Verificación adicional de admin
  if (!user?.isAdmin) {
    console.log('Renderizado bloqueado: usuario no es admin'); // Debug
    return null;
  }

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Películas</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancelar' : 'Agregar Película'}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {showAddForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h3 className="card-title">Agregar Nueva Película</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Título</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={newMovie.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={newMovie.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Género</label>
                <input
                  type="text"
                  className="form-control"
                  name="genre"
                  value={newMovie.genre}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Duración (minutos)</label>
                <input
                  type="number"
                  className="form-control"
                  name="duration"
                  value={newMovie.duration}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">URL de la Imagen</label>
                <input
                  type="url"
                  className="form-control"
                  name="image"
                  value={newMovie.image}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Fecha de Estreno</label>
                <input
                  type="date"
                  className="form-control"
                  name="releaseDate"
                  value={newMovie.releaseDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Director</label>
                <input
                  type="text"
                  className="form-control"
                  name="director"
                  value={newMovie.director}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Reparto</label>
                <input
                  type="text"
                  className="form-control"
                  name="cast"
                  value={newMovie.cast}
                  onChange={handleInputChange}
                  placeholder="Separar actores por comas"
                  required
                />
              </div>
              <button type="submit" className="btn btn-success">
                Guardar Película
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="row">
        {movies.map(movie => (
          <div key={movie._id} className="col-md-4 mb-4">
            <div className="card h-100">
              <img 
                src={movie.image} 
                className="card-img-top" 
                alt={movie.title}
                style={{ height: '400px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{movie.title}</h5>
                <p className="card-text">{movie.description}</p>
                <p className="card-text">
                  <small className="text-muted">
                    Género: {movie.genre}<br/>
                    Duración: {movie.duration} minutos<br/>
                    Director: {movie.director}
                  </small>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieManagement;