import React, { useState } from 'react';
import axios from 'axios';

const UserInfo = ({ userData, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: userData.nombre,
    email: userData.email,
    telefono: userData.telefono || '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/users/profile',
        formData,
        {
          headers: { 'x-auth-token': token }
        }
      );
      onUpdate();
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error al actualizar perfil');
    }
  };

  if (!isEditing) {
    return (
      <div className="card">
        <div className="card-body">
          <h3 className="card-title">Información Personal</h3>
          <div className="mb-3">
            <strong>Nombre:</strong> {userData.nombre}
          </div>
          <div className="mb-3">
            <strong>Email:</strong> {userData.email}
          </div>
          <div className="mb-3">
            <strong>Teléfono:</strong> {userData.telefono || 'No Ingresado'}
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setIsEditing(true)}
          >
            Editar Información
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title">Editar Información</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Teléfono</label>
            <input
              type="tel"
              className="form-control"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary">
              Guardar Cambios
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsEditing(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserInfo;