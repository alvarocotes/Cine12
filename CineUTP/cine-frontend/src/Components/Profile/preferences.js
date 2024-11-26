import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../Context/logContext';

const Preferences = ({ userData, onUpdate }) => {
  const { logout } = useAuth();
  const [preferences, setPreferences] = useState({
    generos: userData.preferencias?.generos || [],
    notificaciones: userData.preferencias?.notificaciones || false,
    idiomaPref: userData.preferencias?.idiomaPref || 'es'
  });

  const [error, setError] = useState('');

  const generos = [
    'Acción', 'Aventura', 'Comedia', 'Drama', 'Terror', 
    'Ciencia Ficción', 'Romance', 'Animación'
  ];

  const handleGenreToggle = (genre) => {
    setPreferences(prev => ({
      ...prev,
      generos: prev.generos.includes(genre)
        ? prev.generos.filter(g => g !== genre)
        : [...prev.generos, genre]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/users/preferences',
        { preferencias: preferences },
        {
          headers: { 'x-auth-token': token }
        }
      );
      onUpdate();
      setError('');
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
      }
      setError(err.response?.data?.msg || 'Error al actualizar preferencias');
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title">Preferencias</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <h5>Géneros Favoritos</h5>
            <div className="d-flex flex-wrap gap-2">
              {generos.map(genre => (
                <button
                  key={genre}
                  type="button"
                  className={`btn ${preferences.generos.includes(genre) 
                    ? 'btn-primary' 
                    : 'btn-outline-primary'}`}
                  onClick={() => handleGenreToggle(genre)}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="notificaciones"
              checked={preferences.notificaciones}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                notificaciones: e.target.checked
              }))}
            />
            <label className="form-check-label" htmlFor="notificaciones">
              Recibir notificaciones de estrenos y promociones
            </label>
          </div>

          <div className="mb-3">
            <label className="form-label">Idioma Preferido</label>
            <select
              className="form-select"
              value={preferences.idiomaPref}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                idiomaPref: e.target.value
              }))}
            >
              <option value="es">Español</option>
              <option value="en">Inglés</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            Guardar Preferencias
          </button>
        </form>
      </div>
    </div>
  );
};

export default Preferences;