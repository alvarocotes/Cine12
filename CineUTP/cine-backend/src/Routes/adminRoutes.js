import { Navigate } from 'react-router-dom';
import { useAuth } from '../../Context/logContext';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  console.log('Estado de autenticación:', isAuthenticated); // Debug
  console.log('Información del usuario:', user); // Debug
  console.log('Es admin:', user?.isAdmin); // Debug

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!user?.isAdmin) {
    console.log('Usuario no es admin, redirigiendo...'); // Debug
    return <Navigate to="/home" />;
  }

  return children;
};

export default AdminRoute;