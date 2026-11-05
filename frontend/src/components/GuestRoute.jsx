import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner } from './Ui';

// Login/Register pages: logged-in users go straight to the dashboard
export default function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner label="Checking session..." />;
  return user ? <Navigate to="/dashboard" replace /> : children;
}
