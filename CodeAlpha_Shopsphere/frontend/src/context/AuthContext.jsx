import React, { createContext, useContext, useEffect } from 'react';
import { ClerkProvider, useUser, useAuth, useClerk } from '@clerk/clerk-react';
import { setAuthTokenGetter, userService } from '../services/api';

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isClerkAvailable = !!(CLERK_PUBLISHABLE_KEY && !CLERK_PUBLISHABLE_KEY.includes('your_clerk_key'));

const CustomAuthContext = createContext(null);

// Fallback provider when Clerk key is missing
const FallbackAuthProvider = ({ children }) => {
  return (
    <CustomAuthContext.Provider
      value={{
        isLoaded: true,
        isSignedIn: false,
        user: null,
        userId: null,
        getToken: async () => null,
        isClerkMode: false,
        openSignIn: () => console.warn('Clerk publishable key required in .env'),
        openSignUp: () => console.warn('Clerk publishable key required in .env'),
        signOut: () => {},
      }}
    >
      {children}
    </CustomAuthContext.Provider>
  );
};

// Internal Clerk Consumer
const ClerkAuthBridge = ({ children }) => {
  const { user: clerkUser, isLoaded, isSignedIn: clerkIsSignedIn } = useUser();
  const { getToken, userId: clerkUserId } = useAuth();
  const clerk = useClerk();

  const isSignedIn = Boolean(clerkIsSignedIn);

  useEffect(() => {
    if (isLoaded && isSignedIn && clerkUser) {
      setAuthTokenGetter(getToken, clerkUserId);

      userService.syncProfile({
        clerk_user_id: clerkUserId,
        name: clerkUser.fullName || clerkUser.username || 'Customer',
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        avatar_url: clerkUser.imageUrl || '',
      }).catch((e) => console.warn('Sync profile note:', e.message));
    } else {
      setAuthTokenGetter(null, null);
    }
  }, [isLoaded, isSignedIn, clerkUser, clerkUserId, getToken]);

  const handleOpenSignIn = () => {
    if (clerk) clerk.openSignIn();
  };

  const handleOpenSignUp = () => {
    if (clerk) clerk.openSignUp();
  };

  const handleSignOut = () => {
    if (clerkIsSignedIn && clerk) {
      clerk.signOut();
    }
  };

  return (
    <CustomAuthContext.Provider
      value={{
        isLoaded,
        isSignedIn,
        user: clerkUser,
        userId: clerkUserId,
        getToken,
        isClerkMode: true,
        signOut: handleSignOut,
        openSignIn: handleOpenSignIn,
        openSignUp: handleOpenSignUp,
        openUserProfile: () => clerk?.openUserProfile(),
      }}
    >
      {children}
    </CustomAuthContext.Provider>
  );
};

export const AuthProvider = ({ children }) => {
  if (isClerkAvailable) {
    return (
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        <ClerkAuthBridge>{children}</ClerkAuthBridge>
      </ClerkProvider>
    );
  }

  return <FallbackAuthProvider>{children}</FallbackAuthProvider>;
};

export const useAppAuth = () => {
  const context = useContext(CustomAuthContext);
  if (!context) {
    throw new Error('useAppAuth must be used within an AuthProvider');
  }
  return context;
};
