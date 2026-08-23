import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAppAuth();

  if (!isLoaded && !isSignedIn) {
    return <LoadingSpinner text="Authenticating session..." />;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};

export default ProtectedRoute;
