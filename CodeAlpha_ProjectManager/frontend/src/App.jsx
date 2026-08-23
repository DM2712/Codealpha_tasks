import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import CreateProjectModal from './components/CreateProjectModal';

import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ProjectBoardPage from './pages/ProjectBoardPage';
import ProfilePage from './pages/ProfilePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import NotFoundPage from './pages/NotFoundPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ReturnPolicyPage from './pages/ReturnPolicyPage';
import HelpPage from './pages/HelpPage';

const CLERK_PUBLISHABLE_KEY =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  'pk_test_cmVndWxhci1jYXRmaXNoLTcyMDAuY2xlcmsuYWNjb3VudHMuZGV2JA';

const clerkLocalization = {
  signIn: {
    start: {
      title: 'Sign in to ProjectManager',
      subtitle: 'Welcome back! Please sign in to continue',
    },
  },
  signUp: {
    start: {
      title: 'Create your ProjectManager account',
      subtitle: 'Welcome! Please fill in the details to get started',
    },
  },
};

const clerkAppearance = {
  variables: {
    colorPrimary: '#2563eb',
    fontFamily: 'Inter, system-ui, sans-serif',
    borderRadius: '0.625rem',
  },
};

function AppContent() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar onOpenCreateProject={() => setIsCreateModalOpen(true)} />

      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/return-policy" element={<ReturnPolicyPage />} />
          <Route path="/help" element={<HelpPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage
                  isCreateModalOpen={isCreateModalOpen}
                  setIsCreateModalOpen={setIsCreateModalOpen}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute>
                <ProjectBoardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Global Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onProjectCreated={(newProject) => {
          setIsCreateModalOpen(false);
          navigate(`/projects/${newProject.id}`);
        }}
      />
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      navigate={(to) => navigate(to)}
      localization={clerkLocalization}
      appearance={clerkAppearance}
    >
      <AuthProvider>
        <SocketProvider>
          <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
          <AppContent />
        </SocketProvider>
      </AuthProvider>
    </ClerkProvider>
  );
}
