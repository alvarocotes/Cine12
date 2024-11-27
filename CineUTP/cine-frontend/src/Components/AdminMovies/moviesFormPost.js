import React, { useState, useEffect } from "react";

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

const MovieForm = ({ movie, onSubmit, onCancel }) => {
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

    onSubmit(movieData);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
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

      <div className="mb-3">
        <label className="form-label">Sinopsis</label>
        <textarea
          className="form-control"
          name="sinopsis"
          value={formData.sinopsis}
          onChange={handleChange}
          required
          rows="3"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Géneros</label>
        <select
          className="form-select"
          name="generos"
          multiple
          value={formData.generos}
          onChange={(e) => {
            const selectedGenres = Array.from(
              e.target.selectedOptions,
              (option) => option.value
            );
            console.log("Géneros seleccionados:", selectedGenres); // Para depuración
            setFormData((prev) => ({
              ...prev,
              generos: selectedGenres,
            }));
          }}
          required
          size="5"
        >
          {generos.map((genero) => (
            <option key={genero} value={genero}>
              {genero}
            </option>
          ))}
        </select>
        <small className="form-text text-muted">
          Mantén presionado Ctrl (Windows) o Command (Mac) para seleccionar
          múltiples géneros
        </small>
      </div>

      <div className="row">
        <div className="col-md-4 mb-3">
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
        <div className="col-md-4 mb-3">
          <label className="form-label">Clasificación</label>
          <select
            className="form-select"
            name="clasificacion"
            value={formData.clasificacion}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar...</option>
            <option value="G">G (Todo público)</option>
            <option value="PG">PG (Guía parental)</option>
            <option value="PG-13">PG-13 (Mayores de 13)</option>
            <option value="R">R (Restringido)</option>
          </select>
        </div>
        <div className="col-md-4 mb-3">
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
      </div>

      <div className="mb-3">
        <label className="form-label">Actores (separados por comas)</label>
        <input
          type="text"
          className="form-control"
          name="actores"
          value={formData.actores}
          onChange={handleChange}
          placeholder="Actor 1, Actor 2, Actor 3"
        />
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">URL de la Imagen</label>
          <input
            type="url"
            className="form-control"
            name="imagen"
            value={formData.imagen}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">URL del Trailer</label>
          <input
            type="url"
            className="form-control"
            name="trailer"
            value={formData.trailer}
            onChange={handleChange}
          />
        </div>
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
