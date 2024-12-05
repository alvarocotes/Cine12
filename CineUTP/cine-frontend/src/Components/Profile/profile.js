import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Context/logContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Preferences from './preferences';
import PurchaseHistory from './history';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: ''
  });
  const [activeTab, setActiveTab] = useState('profile'); // Estado para manejar la pestaña activa

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/users/profile', {
        headers: {
          'x-auth-token': token
        }
      });

      setUserInfo(response.data);
      setFormData({
        nombre: response.data.nombre,
        email: response.data.email,
        telefono: response.data.telefono || ''
      });
      setError('');
    } catch (err) {
      console.error('Error al obtener perfil:', err);
      setError('Error al cargar la información del perfil');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/api/users/profile',
        formData,
        {
          headers: {
            'x-auth-token': token,
            'Content-Type': 'application/json'
          }
        }
      );

      setUserInfo(response.data);
      setIsEditing(false);
      setError('');
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      setError('Error al actualizar el perfil');
    }
  };

  const renderProfileContent = () => {
    if (activeTab === 'profile') {
      if (isEditing) {
        return (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
                placeholder={formData.telefono ? '' : 'No se tiene ningún número telefónico registrado'}
              />
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-success">
                Guardar Cambios
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    nombre: userInfo.nombre,
                    email: userInfo.email,
                    telefono: userInfo.telefono || ''
                  });
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        );
      }

      return (
        <div className="row mt-4">
          <div className="col-md-6">
            <p><strong>Nombre:</strong> {userInfo.nombre}</p>
            <p><strong>Email:</strong> {userInfo.email}</p>
            <p><strong>Teléfono:</strong> {userInfo.telefono || 'No registrado'}</p>
            <button 
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              Editar Perfil
            </button>
          </div>
        </div>
      );
    }

    // Renderizar contenido de preferencias o historial de compras
    if (activeTab === 'preferences' && userInfo) {
      return <Preferences userData={userInfo} onUpdate={fetchUserInfo} />;
    }

    if (activeTab === 'history') {
      return <PurchaseHistory />;
    }

    return null; // En caso de que no haya contenido que mostrar
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                Mi Perfil
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'preferences' ? 'active' : ''}`}
                onClick={() => setActiveTab('preferences')}
              >
                Preferencias
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                Historial de Compras
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {renderProfileContent()}
        </div>
      </div>
    </div>
  );
};

export default Profile;