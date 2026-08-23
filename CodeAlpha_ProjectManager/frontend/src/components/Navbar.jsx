import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppAuth, DEMO_ACCOUNTS } from '../context/AuthContext';
import { UserButton } from '@clerk/clerk-react';
import { Plus, User, LogIn, LogOut, Sparkles, LayoutDashboard, ChevronDown } from 'lucide-react';

const Navbar = ({ onOpenCreateProject }) => {
  const { isSignedIn, isDemo, userName, userEmail, userAvatar, signOut, signInDemo } = useAppAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isDashboard = location.pathname.startsWith('/dashboard');

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const handleSelectDemo = (account) => {
    signInDemo(account);
    navigate('/dashboard');
  };

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
                {!isDemo ? (
                  <UserButton afterSignOutUrl="/" />
                ) : (
                  userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="user-avatar-sm"
                      style={{ width: '28px', height: '28px' }}
                    />
                  ) : (
                    <div
                      className="user-avatar-initials"
                      style={{ width: '28px', height: '28px', fontSize: '0.75rem' }}
                    >
                      {getInitials(userName)}
                    </div>
                  )
                )}

                <div className="d-none d-lg-block text-start lh-1 pe-1">
                  <div className="fw-bold text-dark text-truncate" style={{ maxWidth: '120px', fontSize: '0.8rem' }}>
                    {userName}
                  </div>
                  <div className="text-muted text-truncate font-mono" style={{ maxWidth: '120px', fontSize: '0.68rem' }}>
                    {userEmail}
                  </div>
                </div>

                {/* Demo Sign Out Button */}
                {isDemo && (
                  <button
                    className="btn btn-link text-danger p-0 ms-1 border-0"
                    title="Sign Out"
                    onClick={signOut}
                  >
                    <LogOut size={14} />
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="d-flex align-items-center gap-2">
              {/* Quick Demo Switcher */}
              <div className="dropdown">
                <button
                  className="btn-saas-secondary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ fontSize: '0.82rem', padding: '0.4rem 0.75rem' }}
                >
                  <Sparkles size={14} className="text-warning" />
                  <span className="d-none d-sm-inline">Quick Demo</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-3 p-2 mt-2" style={{ minWidth: '240px' }}>
                  <li className="dropdown-header small text-uppercase fw-bold text-muted px-2 pb-1">
                    Select Test Persona
                  </li>
                  {DEMO_ACCOUNTS.map((acc) => (
                    <li key={acc.id}>
                      <button
                        className="dropdown-item rounded-2 py-1.5 px-2 d-flex align-items-center gap-2"
                        onClick={() => handleSelectDemo(acc)}
                      >
                        <img src={acc.avatarUrl} alt={acc.name} className="user-avatar-sm" style={{ width: '24px', height: '24px' }} />
                        <div className="lh-1">
                          <div className="fw-semibold small">{acc.name}</div>
                          <small className="text-muted" style={{ fontSize: '0.7rem' }}>{acc.role}</small>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

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
