import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Agregamos estado de carga

  // Verificar autenticación al cargar/recargar la página
  useEffect(() => {
    const verifyAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          console.log('Token verificado:', decodedToken);
          console.log('Usuario:', decodedToken.user);
          console.log('Es admin:', decodedToken.user.isAdmin);
          
          setUser(decodedToken.user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error al verificar token:', error);
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    verifyAuth();
  }, []);

  const login = async (token) => {
    try {
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      setUser(decoded.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error en login:', error);
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const logout = () => {
    console.log('Cerrando sesión...');
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Si está cargando, mostramos un loading o null
  if (isLoading) {
    return <div>Cargando...</div>; // O puedes retornar null
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};