import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../Context/logContext';
import { useNavigate } from 'react-router-dom';
import MovieForm from './moviesFormPost';

const MovieManagement = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newMovie, setNewMovie] = useState({
    titulo: '',
    sinopsis: '',
    generos: [],
    duracion: '',
    clasificacion: '',
    director: '',
    actores: [],
    imagen: '',
    fechaEstreno: '',
    estado: 'Próximamente'
  });

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/home');
      return;
    }
    fetchMovies();
  }, [user, navigate]);

  const fetchMovies = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/movies', {
        headers: { 'x-auth-token': token }
      });
      setMovies(response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar las películas');
      if (err.response?.status === 401) {
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

  const handleSubmit = async (movieData) => {
    try {
      const token = localStorage.getItem('token');

      if (isEditing) {
        const response = await axios.put(
          `http://localhost:5000/api/movies/${newMovie._id}`,
          movieData,
          {
            headers: { 
              'x-auth-token': token,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('Película actualizada:', response.data);
      } else {
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
        console.log('Película agregada:', response.data);
      }

      setNewMovie({
        titulo: '',
        sinopsis: '',
        generos: [],
        duracion: '',
        clasificacion: '',
        director: '',
        actores: [],
        imagen: '',
        fechaEstreno: '',
        estado: 'Próximamente'
      });
      setShowAddForm(false);
      setIsEditing(false);
      fetchMovies();
      setError('');
    } catch (err) {
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
    setNewMovie(movie);
    setShowAddForm(true);
    setIsEditing(true);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Gestión de Películas</h2>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button 
          className="btn btn-primary"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setIsEditing(false);
          }}
        >
          {showAddForm ? 'Cancelar' : 'Agregar Película'}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {showAddForm ? (
        <MovieForm 
          movie={newMovie} 
          onSubmit={handleSubmit} // Pasa la función directamente
          onCancel={() => {
            setShowAddForm(false);
            setIsEditing(false);
            setNewMovie({
              titulo: '',
              sinopsis: '',
              generos: [],
              duracion: '',
              clasificacion: '',
              director: '',
              actores: [],
              imagen: '',
              fechaEstreno: '',
              estado: 'Próximamente'
            });
          }} 
        />
      ) : (
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
      )}
    </div>
  );
};

export default MovieManagement;