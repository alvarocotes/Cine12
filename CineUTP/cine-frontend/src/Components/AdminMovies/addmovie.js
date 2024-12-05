import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from '../../Context/logContext';
import { useNavigate } from 'react-router-dom';

// Lista de géneros tomada de preferences.js
const generos = [
  "Acción",
  "Aventura",
  "Comedia",
  "Drama",
  "Terror",
  "Ciencia Ficción",
  "Romance",
  "Animación",
];

const AddMovie = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: "",
    sinopsis: "",
    generos: [],
    duracion: "",
    clasificacion: "",
    director: "",
    actores: "",
    imagen: "",
    trailer: "",
    fechaEstreno: "",
    estado: "Próximamente",
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const movieData = {
      ...formData,
      actores: formData.actores.split(",").map((actor) => actor.trim()),
      duracion: parseInt(formData.duracion),
      generos: Array.isArray(formData.generos) ? formData.generos : [],
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/movies', movieData, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      });
      console.log("Película agregada exitosamente");
      navigate('/movies'); // Redirigir a la pantalla de gestión de películas
    } catch (err) {
      console.error('Error al agregar película:', err);
      setError(err.response?.data?.msg || 'Error al agregar la película');
      if (err.response?.status === 401) {
        logout();
      }
    }
  };

  return (
    <div className="container mt-4">
      <h3>Agregar Nueva Película</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="mb-4">
        {/* Aquí va el formulario, similar al de MovieForm */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Título</label>
            <input
              type="text"
              className="form-control"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Director</label>
            <input
              type="text"
              className="form-control"
              name="director"
              value={formData.director}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        {/* Resto del formulario... */}
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            Crear Película
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/movies')}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMovie;