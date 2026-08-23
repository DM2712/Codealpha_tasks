import React from 'react';
import { SignUp } from '@clerk/clerk-react';

const SignUpPage = () => {
  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-dark mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Create your ProjectManager Account
        </h2>
        <p className="text-secondary small mb-0">
          Get started with agile Kanban boards and group collaboration today.
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5 d-flex justify-content-center">
          <div className="shadow-sm rounded-4 overflow-hidden bg-white border">
            <SignUp
              routing="path"
              path="/sign-up"
              signInUrl="/sign-in"
              fallbackRedirectUrl="/dashboard"
              forceRedirectUrl="/dashboard"
              localization={{
                signUp: {
                  start: {
                    title: 'Create your ProjectManager account',
                    subtitle: 'Welcome! Please fill in the details to get started',
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

export default SignUpPage;
