import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem('accessToken');
  const location = useLocation();

  if (!token) {
    const fullPath = `${location.pathname}${location.search}${location.hash}`;

    sessionStorage.setItem('postLoginRedirect', fullPath);

    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;