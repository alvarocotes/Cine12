import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AuthProvider } from '../../Context/logContext';
import UserInfo from './userInfo';
import PurchaseHistory from './history';
import Preferences from './preferences';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('info');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { 'x-auth-token': token }
      });
      setUserData(response.data);
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
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
      <div className="row">
        <div className="col-md-3">
          <div className="list-group">
            <button
              className={`list-group-item list-group-item-action ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              Información Personal
            </button>
            <button
              className={`list-group-item list-group-item-action ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              Historial de Compras
            </button>
            <button
              className={`list-group-item list-group-item-action ${activeTab === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              Preferencias
            </button>
          </div>
        </div>
        <div className="col-md-9">
          {activeTab === 'info' && <UserInfo userData={userData} onUpdate={fetchUserData} />}
          {activeTab === 'history' && <PurchaseHistory />}
          {activeTab === 'preferences' && <Preferences userData={userData} onUpdate={fetchUserData} />}
        </div>
      </div>
    </div>
  );
};

export default Profile;