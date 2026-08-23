import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="container py-5 text-center d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '70vh' }}>
      <div className="d-inline-flex p-3 rounded-circle bg-warning-subtle text-warning-emphasis mb-3">
        <AlertTriangle size={48} />
      </div>
      <h1 className="display-5 fw-bold text-dark mb-2">404 - Page Not Found</h1>
      <p className="text-muted mb-4" style={{ maxWidth: '460px' }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/dashboard" className="btn btn-primary-pm d-flex align-items-center gap-2">
        <Home size={18} />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;
