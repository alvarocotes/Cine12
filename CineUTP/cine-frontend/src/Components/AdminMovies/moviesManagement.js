import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieForm from './moviesFormPost';

const MovieManagement = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/movies', {
        headers: { 'x-auth-token': token }
      });
      setMovies(response.data);
    } catch (error) {
      console.error('Error al obtener películas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (movieId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta película?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/movies/${movieId}`, {
          headers: { 'x-auth-token': token }
        });
        fetchMovies();
      } catch (error) {
        console.error('Error al eliminar película:', error);
      }
    }
  };

  const handleEdit = (movie) => {
    setSelectedMovie(movie);
    setShowForm(true);
  };

  const handleFormSubmit = async (movieData) => {
    try {
      const token = localStorage.getItem('token');
      if (selectedMovie) {
        await axios.put(
          `http://localhost:5000/api/movies/${selectedMovie._id}`,
          movieData,
          { headers: { 'x-auth-token': token } }
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/movies',
          movieData,
          { headers: { 'x-auth-token': token } }
        );
      }
      setShowForm(false);
      setSelectedMovie(null);
      fetchMovies();
    } catch (error) {
      console.error('Error al guardar película:', error);
    }
  };

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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Películas</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setSelectedMovie(null);
            setShowForm(true);
          }}
        >
          Agregar Película
        </button>
      </div>

      {showForm ? (
        <MovieForm
          movie={selectedMovie}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setSelectedMovie(null);
          }}
        />
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Título</th>
                <th>Género</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie._id}>
                  <td>
                    <img
                      src={movie.imagen}
                      alt={movie.titulo}
                      style={{ width: '50px', height: '75px', objectFit: 'cover' }}
                    />
                  </td>
                  <td>{movie.titulo}</td>
                  <td>{movie.generos.join(', ')}</td>
                  <td>{movie.estado}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => handleEdit(movie)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(movie._id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MovieManagement;