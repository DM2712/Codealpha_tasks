import React from 'react';
import { SignIn } from '@clerk/clerk-react';

const SignInPage = () => {
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

      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5 d-flex justify-content-center">
          <div className="shadow-sm rounded-4 overflow-hidden bg-white border">
            <SignIn
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
              fallbackRedirectUrl="/dashboard"
              forceRedirectUrl="/dashboard"
              localization={{
                signIn: {
                  start: {
                    title: 'Sign in to ProjectManager',
                    subtitle: 'Welcome back! Please sign in to continue',
                  },
                },
              }}
              appearance={{
                variables: {
                  colorPrimary: '#2563eb',
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
