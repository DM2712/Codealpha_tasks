import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { useAppAuth, DEMO_ACCOUNTS } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

const SignInPage = () => {
  const { signInDemo } = useAppAuth();
  const navigate = useNavigate();

  const handleDemoClick = (account) => {
    signInDemo(account);
    navigate('/dashboard');
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-dark mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Sign In to ProjectManager
        </h2>
        <p className="text-secondary small mb-0">
          Collaborate on projects, manage Kanban tasks, and work with your team.
        </p>
      </div>

      <div className="row justify-content-center g-4 align-items-start">
        {/* Clerk Sign In Card */}
        <div className="col-12 col-md-6 col-lg-5 d-flex justify-content-center">
          <div className="shadow-sm rounded-4 overflow-hidden bg-white border">
            <SignIn
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
              fallbackRedirectUrl="/dashboard"
              forceRedirectUrl="/dashboard"
            />
          </div>
        </div>

        {/* Quick Demo Access Card */}
        <div className="col-12 col-md-6 col-lg-4">
          <div className="pm-card p-4 bg-white shadow-sm border rounded-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="p-2 rounded-3 bg-primary-subtle text-primary">
                <Sparkles size={20} />
              </div>
              <div>
                <h5 className="fw-bold mb-0 text-dark" style={{ fontFamily: 'var(--font-display)' }}>
                  Quick Demo Access
                </h5>
                <small className="text-muted">Instant login for review & testing</small>
              </div>
            </div>

            <p className="text-secondary small mb-3">
              Skip registration and immediately explore the interactive Kanban board with pre-configured team accounts:
            </p>

            <div className="d-flex flex-column gap-2.5 mb-3">
              {DEMO_ACCOUNTS.map((account, idx) => (
                <button
                  key={account.id}
                  id={`demo-user-${idx}`}
                  data-testid={`demo-account-${account.name.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => handleDemoClick(account)}
                  className="btn btn-light border text-start p-2.5 rounded-3 d-flex align-items-center justify-content-between hover:bg-light transition-all"
                >
                  <div className="d-flex align-items-center gap-2.5">
                    <img
                      src={account.avatarUrl}
                      alt={account.name}
                      className="user-avatar-sm"
                      style={{ width: '34px', height: '34px' }}
                    />
                    <div>
                      <div className="fw-bold text-dark small">{account.name}</div>
                      <small className="text-secondary" style={{ fontSize: '0.72rem' }}>
                        {account.role}
                      </small>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-primary" />
                </button>
              ))}
            </div>

            <div className="p-2.5 rounded-3 bg-light border small text-secondary d-flex align-items-center gap-2">
              <ShieldCheck size={16} className="text-success flex-shrink-0" />
              <span style={{ fontSize: '0.75rem' }}>
                Full Supabase PostgreSQL persistence enabled for all sessions.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
