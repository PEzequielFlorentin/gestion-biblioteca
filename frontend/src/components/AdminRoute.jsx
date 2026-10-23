import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <p>Cargando...</p>;
  if (!user) return <Navigate to="/login" replace />;
  // Si no es admin, lo mandamos al catálogo (también con replace)
  return user.role === 'admin' ? children : <Navigate to="/" replace />;
};

export default AdminRoute;