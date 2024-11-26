import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../Context/logContext';

const PurchaseHistory = () => {
  const { logout } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/purchases', {
        headers: { 'x-auth-token': token }
      });
      setPurchases(response.data);
    } catch (error) {
      console.error('Error al obtener historial de compras:', error);
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Cargando historial...</div>;
  }

  if (purchases.length === 0) {
    return (
      <div className="card">
        <div className="card-body">
          <h3 className="card-title">Historial de Compras</h3>
          <p className="text-muted">No hay compras registradas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title">Historial de Compras</h3>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Película</th>
                <th>Función</th>
                <th>Asientos</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase) => (
                <tr key={purchase._id}>
                  <td>{new Date(purchase.fechaCompra).toLocaleDateString()}</td>
                  <td>{purchase.pelicula.titulo}</td>
                  <td>{`${new Date(purchase.funcion.fecha).toLocaleDateString()} ${purchase.funcion.hora}`}</td>
                  <td>{purchase.asientos.map(a => `${a.fila}${a.numero}`).join(', ')}</td>
                  <td>${purchase.totalPagado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistory;