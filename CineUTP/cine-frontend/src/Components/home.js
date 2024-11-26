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
            <div className="card">
              {movie.image && (
                <img 
                  src={movie.image} 
                  className="card-img-top" 
                  alt={movie.title}
                  style={{ height: '300px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{movie.title}</h5>
                <p className="card-text">{movie.description}</p>
                <p className="card-text">
                  <small className="text-muted">
                    Género: {movie.genre}<br/>
                    Duración: {movie.duration} minutos
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