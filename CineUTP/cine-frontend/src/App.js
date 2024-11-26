import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Auth/login';
import Register from './Components/Auth/register';
import Home from './Components/home';
import Profile from './Components/Profile/profile';
import MovieManagement from './Components/AdminMovies/moviesManagement';
import { AuthProvider, useAuth } from './Context/logContext';
import 'bootstrap/dist/css/bootstrap.min.css';

// Componente para la barra de navegación
const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  console.log('Estado de autenticación:', isAuthenticated); // Debug
  console.log('Usuario:', user); // Debug

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <span className="navbar-brand">CineUTP</span>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          {isAuthenticated ? (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="/home">Inicio</a>
              </li>
              {user && user.isAdmin && (
                <li className="nav-item">
                  <a className="nav-link" href="/admin/movies">Gestionar Películas</a>
                </li>
              )}
              <li className="nav-item">
                <a className="nav-link" href="/profile">Mi Perfil</a>
              </li>
              <li className="nav-item">
                <button 
                  className="btn btn-outline-light ms-2" 
                  onClick={logout}
                >
                  Cerrar Sesión
                </button>
              </li>
            </ul>
          ) : (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="/login">Iniciar Sesión</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/register">Registrarse</a>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

// Componente para rutas de administrador
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!user?.isAdmin) return <Navigate to="/home" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Rutas existentes */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          
          <Route 
            path="/admin/movies" 
            element={
              <AdminRoute>
                <MovieManagement />
              </AdminRoute>
            } 
          />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;