import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppAuth } from '../context/AuthContext';
import { UserButton } from '@clerk/clerk-react';
import { Plus, User, LogIn, LayoutDashboard } from 'lucide-react';

const Navbar = ({ onOpenCreateProject }) => {
  const { isSignedIn, userName, userEmail } = useAppAuth();
  const location = useLocation();

  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <header className="header-saas">
      <div className="header-container">
        {/* Left Side: Brand Logo & Navigation */}
        <div className="d-flex align-items-center gap-4">
          <Link className="header-brand" to="/">
            <div className="header-brand-icon">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                space_dashboard
              </span>
            </div>
            <div className="d-flex align-items-center">
              <span className="header-brand-text">ProjectManager</span>
              <span className="header-tag d-none d-sm-inline-block">v1.0</span>
            </div>
          </Link>

          {/* Navigation Links */}
          {isSignedIn && (
            <nav className="header-nav d-none d-md-flex">
              <Link
                to="/dashboard"
                className={`nav-link-saas ${isDashboard ? 'active' : ''}`}
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>
            </nav>
          )}
        </div>

        {/* Right Side: Actions & User Controls */}
        <div className="header-actions">
          {isSignedIn ? (
            <>
              {/* New Project CTA */}
              {onOpenCreateProject && (
                <button
                  className="btn-saas-primary"
                  onClick={onOpenCreateProject}
                >
                  <Plus size={16} />
                  <span>New Project</span>
                </button>
              )}

              {/* Profile Link */}
              <Link
                to="/profile"
                className="btn-saas-secondary d-none d-sm-inline-flex"
              >
                <User size={15} />
                <span>Profile</span>
              </Link>

              {/* User Identity Chip */}
              <div className="user-identity-chip">
                <UserButton afterSignOutUrl="/" />

                <div className="d-none d-lg-block text-start lh-1 pe-1">
                  <div className="fw-bold text-dark text-truncate" style={{ maxWidth: '120px', fontSize: '0.8rem' }}>
                    {userName}
                  </div>
                  <div className="text-muted text-truncate font-mono" style={{ maxWidth: '120px', fontSize: '0.68rem' }}>
                    {userEmail}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <Link
                to="/sign-in"
                className="btn-saas-secondary"
                style={{ fontSize: '0.82rem', padding: '0.4rem 0.8rem' }}
              >
                <LogIn size={15} />
                <span>Sign In</span>
              </Link>

              <Link
                to="/sign-up"
                className="btn-saas-primary"
                style={{ fontSize: '0.82rem', padding: '0.4rem 0.9rem' }}
              >
                <span>Get Started</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
