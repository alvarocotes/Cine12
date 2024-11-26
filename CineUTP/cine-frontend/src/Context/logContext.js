import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// Crear el contexto
export const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Decodifica el token para obtener la información del usuario
      const decodedToken = jwtDecode(token);
      setUser(decodedToken.user);
    }
  }, []);

  const login = (token) => {
    try {
      localStorage.setItem('token', token);
      const decodedToken = jwtDecode(token);
      console.log('Usuario decodificado:', decodedToken.user); // Debug general
      
      setUser(decodedToken.user);
      setIsAuthenticated(true);
  
      // Validación específica para admin
      if (decodedToken.user.isAdmin) {
        console.log('¡Usuario Administrador detectado!');
        console.log('Permisos de administración activados');
        console.log('Usuario:', decodedToken.user.nombre);
        console.log('Email:', decodedToken.user.email);
      }
    } catch (error) {
      console.error('Error al procesar el token:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};