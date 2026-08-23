import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAppAuth } from '../../context/AuthContext';
import { ShieldAlert, LogIn } from 'lucide-react';

export const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded, openSignIn } = useAppAuth();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-container"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-card text-center">
        <div className="w-16 h-16 bg-primary-fixed rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-on-background mb-2">Authentication Required</h2>
        <p className="text-secondary text-sm mb-6">
          Please sign in with your account to access your shopping cart checkout and personalized order history.
        </p>

        <button
          onClick={() => openSignIn()}
          className="w-full py-3 px-6 bg-primary-container text-on-primary font-semibold rounded-xl hover:bg-primary transition-all shadow-md flex items-center justify-center gap-2"
        >
          <LogIn className="w-5 h-5" /> Sign In
        </button>
      </div>
    );
  }

  return children;
};
