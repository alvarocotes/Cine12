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
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // Nuevo estado para saber si estamos editando

  // Lista predefinida de géneros
  const genresList = [
    'Acción',
    'Aventura',
    'Comedia',
    'Drama',
    'Ciencia Ficción',
    'Terror',
    'Romance',
    'Animación',
    'Documental',
    'Suspenso',
    'Fantasía'
  ];

  const [newMovie, setNewMovie] = useState({
    titulo: '',
    sinopsis: '',
    generos: [],
    duracion: '',
    clasificacion: '',
    director: '',
    actores: [],
    imagen: '',
    trailer: '',
    fechaEstreno: '',
    estado: 'Próximamente'
  });

  useEffect(() => {
    console.log('Verificando permisos de admin...');
    if (!user?.isAdmin) {
      console.log('Usuario no es admin, redirigiendo...');
      navigate('/home');
      return;
    }
    console.log('Usuario es admin, cargando películas...');
    fetchMovies();
  }, [user, navigate]);

  const fetchMovies = async () => {
    try {
      console.log('Obteniendo lista de películas...');
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/movies', {
        headers: { 'x-auth-token': token }
      });
      console.log('Películas obtenidas:', response.data);
      setMovies(response.data);
      setError('');
    } catch (err) {
      console.error('Error al cargar películas:', err);
      setError('Error al cargar las películas');
      if (err.response?.status === 401) {
        console.log('Token inválido o expirado, cerrando sesión...');
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'actores') {
      setNewMovie({
        ...newMovie,
        [name]: value.split(',').map(actor => actor.trim())
      });
    } else {
      setNewMovie({
        ...newMovie,
        [name]: value
      });
    }
  };

  const handleGenreChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedGenres(value);
    setNewMovie({
      ...newMovie,
      generos: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Formatear los datos en formato JSON válido
      const movieData = {
        "titulo": newMovie.titulo.trim(),
        "sinopsis": newMovie.sinopsis.trim(),
        "generos": newMovie.generos,
        "duracion": parseInt(newMovie.duracion),
        "clasificacion": newMovie.clasificacion,
        "director": newMovie.director.trim(),
        "actores": newMovie.actores.map(actor => actor.trim()),
        "imagen": newMovie.imagen.trim(),
        "trailer": newMovie.trailer.trim(),
        "fechaEstreno": newMovie.fechaEstreno,
        "estado": newMovie.estado
      };

      const token = localStorage.getItem('token');

      if (isEditing) {
        // Actualizar película existente
        const response = await axios.put(
          `http://localhost:5000/api/movies/${newMovie._id}`, // Usar el ID de la película
          movieData,
          {
            headers: { 
              'x-auth-token': token,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('Película actualizada exitosamente:', response.data);
      } else {
        // Crear nueva película
        const response = await axios.post(
          'http://localhost:5000/api/movies',
          movieData,
          {
            headers: { 
              'x-auth-token': token,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('Película agregada exitosamente:', response.data);
      }

      // Resetear el formulario
      setNewMovie({
        titulo: '',
        sinopsis: '',
        generos: [],
        duracion: '',
        clasificacion: '',
        director: '',
        actores: [],
        imagen: '',
        trailer: '',
        fechaEstreno: '',
        estado: 'Próximamente'
      });
      setSelectedGenres([]);
      setShowAddForm(false);
      setIsEditing(false); // Resetear el estado de edición
      fetchMovies();
      setError('');
    } catch (err) {
      console.error('Error al guardar película:', err);
      setError(err.response?.data?.msg || 'Error al guardar la película');
      if (err.response?.status === 401) {
        logout();
      }
    }
  };

  const handleDeleteMovie = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/movies/${id}`, {
        headers: { 'x-auth-token': token }
      });
      fetchMovies(); // Refrescar la lista de películas
    } catch (err) {
      console.error('Error al eliminar película:', err);
      setError('Error al eliminar la película');
    }
  };

  const handleEditMovie = (movie) => {
    setNewMovie(movie); // Prellenar el formulario con los datos de la película
    setShowAddForm(true); // Mostrar el formulario de agregar película
    setIsEditing(true); // Cambiar el estado a edición
  };

  if (!user?.isAdmin) {
    console.log('Renderizado bloqueado: usuario no es admin');
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
          onClick={() => {
            setShowAddForm(!showAddForm);
            setIsEditing(false); // Resetear el estado de edición al cerrar el formulario
          }}
        >
          {showAddForm ? 'Cancelar' : 'Agregar Película'}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {showAddForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h3 className="card-title">{isEditing ? 'Editar Película' : 'Agregar Nueva Película'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Título</label>
                <input
                  type="text"
                  className="form-control"
                  name="titulo"
                  value={newMovie.titulo}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Sinopsis</label>
                <textarea
                  className="form-control"
                  name="sinopsis"
                  value={newMovie.sinopsis}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Géneros</label>
                <select
                  multiple
                  className="form-select"
                  name="generos"
                  value={selectedGenres}
                  onChange={handleGenreChange}
                  required
                  size="5"
                >
                  {genresList.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
                <small className="form-text text-muted">
                  Mantén presionado Ctrl (Cmd en Mac) para seleccionar múltiples géneros
                </small>
              </div>
              <div className="mb-3">
                <label className="form-label">Duración (minutos)</label>
                <input
                  type="number"
                  className="form-control"
                  name="duracion"
                  value={newMovie.duracion}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Clasificación</label>
                <select
                  className="form-select"
                  name="clasificacion"
                  value={newMovie.clasificacion}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar clasificación</option>
                  <option value="G">G (Apto para todo público)</option>
                  <option value="PG">PG (Guía parental)</option>
                  <option value="PG-13">PG-13 (Mayores de 13)</option>
                  <option value="R">R (Restringido)</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">URL de la Imagen</label>
                <input
                  type="url"
                  className="form-control"
                  name="imagen"
                  value={newMovie.imagen}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">URL del Trailer</label>
                <input
                  type="url"
                  className="form-control"
                  name="trailer"
                  value={newMovie.trailer}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Fecha de Estreno</label>
                <input
                  type="date"
                  className="form-control"
                  name="fechaEstreno"
                  value={newMovie.fechaEstreno}
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
                <label className="form-label">Actores</label>
                <input
                  type="text"
                  className="form-control"
                  name="actores"
                  value={newMovie.actores.join(', ')}
                  onChange={handleInputChange}
                  placeholder="Separar actores por comas"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Estado</label>
                <select
                  className="form-select"
                  name="estado"
                  value={newMovie.estado}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Próximamente">Próximamente</option>
                  <option value="En Cartelera">En Cartelera</option>
                  <option value="Finalizada">Finalizada</option>
                </select>
              </div>
              <button type="submit" className="btn btn-success">
                {isEditing ? 'Actualizar Película' : 'Guardar Película'}
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
                src={movie.imagen} 
                className="card-img-top" 
                alt={movie.titulo}
                style={{ height: '400px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{movie.titulo}</h5>
                <p className="card-text">{movie.sinopsis}</p>
                <p className="card-text">
                  <small className="text-muted">
                    Géneros: {movie.generos.join(', ')}<br/>
                    Duración: {movie.duracion} minutos<br/>
                    Director: {movie.director}<br/>
                    Estado: {movie.estado}
                  </small>
                </p>
                <button className="btn btn-warning" onClick={() => handleEditMovie(movie)}>Editar</button>
                <button className="btn btn-danger" onClick={() => handleDeleteMovie(movie._id)}>Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieManagement;