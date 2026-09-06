import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export function HomePage() {
  const { user } = useAuth();
  return <Navigate to={user?.role === 'ADMIN' ? '/admin' : '/forms'} replace />;
}
