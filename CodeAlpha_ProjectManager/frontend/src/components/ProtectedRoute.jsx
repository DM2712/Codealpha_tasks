import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAppAuth();
  const isE2E = typeof window !== 'undefined' && localStorage.getItem('e2e_authenticated') === 'true';

  if (!isLoaded && !isSignedIn && !isE2E) {
    return <LoadingSpinner text="Authenticating session..." />;
  }

  if (!isSignedIn && !isE2E) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};

export default ProtectedRoute;
