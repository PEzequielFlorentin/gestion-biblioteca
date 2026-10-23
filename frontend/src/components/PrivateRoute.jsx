import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <p>Cargando...</p>;
  // replace evita que el botón "atrás" vuelva a la página protegida
  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;