import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Context/logContext';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchMovies = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/movies');
        setMovies(res.data);
      } catch (err) {
        setError('Error al cargar las películas');
      }
    };

    fetchMovies();
  }, [isAuthenticated, navigate]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Bienvenido {user?.name}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="row">
        {movies.map(movie => (
          <div key={movie._id} className="col-md-4 mb-4">
            <div className="card h-100">
              {movie.imagen && (
                <img 
                  src={movie.imagen} 
                  className="card-img-top" 
                  alt={movie.titulo}
                  style={{ height: '300px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{movie.titulo}</h5>
                <p className="card-text">{movie.sinopsis}</p>
                <p className="card-text">
                  <small className="text-muted">
                    Géneros: {Array.isArray(movie.generos) ? movie.generos.join(', ') : 'No disponible'}<br/>
                    Duración: {movie.duracion} minutos<br/>
                    Director: {movie.director}<br/>
                    Estado: {movie.estado}
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

export default Home;