import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children, role }) {
  const { role: userRole, loading } = useContext(AuthContext);

  if (loading) return <div>Cargando...</div>;

  if (!userRole) return <Navigate to="/login" />;

  if (role && userRole !== role) return <Navigate to="/login" />;

  return children;
}