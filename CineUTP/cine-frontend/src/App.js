import React, { useEffect } from 'react';
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
  console.log('Navbar - Estado de autenticación:', isAuthenticated); // Debug
  console.log('Navbar - Usuario:', user); // Debug
  console.log('Navbar - Es admin:', user?.isAdmin); // Debug

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
                  onClick={() => {
                    console.log('Cerrando sesión...'); // Debug
                    logout();
                  }}
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

// Componente mejorado para rutas protegidas de administrador
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  console.log('AdminRoute - Verificando permisos...'); // Debug
  console.log('AdminRoute - Usuario autenticado:', isAuthenticated); // Debug
  console.log('AdminRoute - Información de usuario:', user); // Debug
  console.log('AdminRoute - Es admin:', user?.isAdmin); // Debug

  useEffect(() => {
    if (!isAuthenticated) {
      console.log('AdminRoute - Usuario no autenticado, redirigiendo a login'); // Debug
      return;
    }
    
    if (!user?.isAdmin) {
      console.log('AdminRoute - Usuario no es admin, redirigiendo a home'); // Debug
      return;
    }
    
    console.log('AdminRoute - Acceso permitido'); // Debug
  }, [isAuthenticated, user]);

  // Si está cargando, esperar
  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!user?.isAdmin) {
    return <Navigate to="/home" />;
  }

  return children;
};

// Componente para rutas protegidas generales
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  console.log('ProtectedRoute - Usuario autenticado:', isAuthenticated); // Debug
  
  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          {/* Rutas de administrador */}
          <Route 
            path="/admin/movies" 
            element={
              <AdminRoute>
                <MovieManagement />
              </AdminRoute>
            } 
          />

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;