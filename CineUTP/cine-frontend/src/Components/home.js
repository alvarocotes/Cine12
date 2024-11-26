import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [moviesCartelera, setMoviesCartelera] = useState([]);
  const [moviesProximos, setMoviesProximos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/movies');
      // Filtrar películas según su estado
      const enCartelera = response.data.filter(movie => movie.estado === 'En Cartelera');
      const proximos = response.data.filter(movie => movie.estado === 'Próximamente');
      
      setMoviesCartelera(enCartelera);
      setMoviesProximos(proximos);
    } catch (error) {
      console.error('Error al obtener películas:', error);
    } finally {
      setLoading(false);
    }
  };

  const MovieCard = ({ movie }) => (
    <div className="col">
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
            <small className="text-muted">{movie.generos.join(', ')}</small>
          </p>
          <p className="card-text">{movie.sinopsis.substring(0, 100)}...</p>
        </div>
        <div className="card-footer">
          <button className="btn btn-primary w-100">Ver Detalles</button>
        </div>
      </div>
    </div>
  );

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
      <h1>Bienvenido a CineUTP</h1>
      <p className="lead">Aquí podrás encontrar las mejores películas y comprar tus entradas.</p>

      <section className="mb-5">
        <h2>Películas en Cartelera</h2>
        {moviesCartelera.length === 0 ? (
          <p>No hay películas en cartelera en este momento.</p>
        ) : (
          <div className="row row-cols-1 row-cols-md-4 g-4">
            {moviesCartelera.map(movie => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2>Próximos Estrenos</h2>
        {moviesProximos.length === 0 ? (
          <p>No hay próximos estrenos programados.</p>
        ) : (
          <div className="row row-cols-1 row-cols-md-4 g-4">
            {moviesProximos.map(movie => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;