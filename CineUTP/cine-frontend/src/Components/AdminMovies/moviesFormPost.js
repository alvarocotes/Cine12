import React, { useState, useEffect } from 'react';

const MovieForm = ({ movie, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    sinopsis: '',
    generos: [],
    duracion: '',
    clasificacion: '',
    director: '',
    actores: '',
    imagen: '',
    fechaEstreno: '',
    estado: 'Próximamente',
  });

  useEffect(() => {
    if (movie) {
      setFormData({
        ...movie,
        actores: movie.actores.join(", "),
        fechaEstreno: movie.fechaEstreno.split("T")[0],
      });
    }
  }, [movie]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const movieData = {
      ...formData,
      actores: formData.actores.split(",").map((actor) => actor.trim()),
      duracion: parseInt(formData.duracion),
      generos: Array.isArray(formData.generos) ? formData.generos : [],
    };

    console.log("Datos de la película a enviar:", movieData);
    onSubmit(movieData); // Llama a la función de envío
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-3">
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
      <div className="mb-3">
        <label className="form-label">Sinopsis</label>
        <textarea
          className="form-control"
          name="sinopsis"
          value={formData.sinopsis}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Géneros</label>
        <input
          type="text"
          className="form-control"
          name="generos"
          value={formData.generos.join(', ')}
          onChange={handleChange}
          placeholder="Separar géneros por comas"
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Duración (minutos)</label>
        <input
          type="number"
          className="form-control"
          name="duracion"
          value={formData.duracion}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Clasificación</label>
        <input
          type="text"
          className="form-control"
          name="clasificacion"
          value={formData.clasificacion}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
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
      <div className="mb-3">
        <label className="form-label">Actores</label>
        <input
          type="text"
          className="form-control"
          name="actores"
          value={formData.actores}
          onChange={handleChange}
          placeholder="Separar actores por comas"
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Imagen URL</label>
        <input
          type="text"
          className="form-control"
          name="imagen"
          value={formData.imagen}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Fecha de Estreno</label>
        <input
          type="date"
          className="form-control"
          name="fechaEstreno"
          value={formData.fechaEstreno}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Estado</label>
        <select
          className="form-select"
          name="estado"
          value={formData.estado}
          onChange={handleChange}
          required
        >
          <option value="Próximamente">Próximamente</option>
          <option value="En Cartelera">En Cartelera</option>
          <option value="Finalizada">Finalizada</option>
        </select>
      </div>
      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary">
          {movie ? "Actualizar" : "Crear"} Película
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default MovieForm;