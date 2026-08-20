import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { ClerkProvider, useUser, useAuth, useClerk } from '@clerk/clerk-react';
import { setAuthTokenGetter, userService } from '../services/api';

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isClerkAvailable = !!(CLERK_PUBLISHABLE_KEY && !CLERK_PUBLISHABLE_KEY.includes('your_clerk_key'));

const CustomAuthContext = createContext(null);

// Session storage keys (cleared automatically when tab/browser closes)
const SESSION_AUTH_KEY = 'shopsphere_session_user';
const SESSION_ACTIVE_FLAG = 'shopsphere_active_session_flag';

// Fallback provider when Clerk key is not yet set
const FallbackAuthProvider = ({ children }) => {
  const [demoUser, setDemoUser] = useState(() => {
    try {
      // Use sessionStorage so when website is closed and re-opened, session starts logged out
      const saved = sessionStorage.getItem(SESSION_AUTH_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    // Clear any lingering localStorage from previous versions
    localStorage.removeItem('shopsphere_demo_user');

    if (demoUser && demoUser.isSignedIn) {
      sessionStorage.setItem(SESSION_AUTH_KEY, JSON.stringify(demoUser));
      sessionStorage.setItem(SESSION_ACTIVE_FLAG, 'true');
      setAuthTokenGetter(async () => 'mock_jwt_token_for_demo', demoUser.id);
      
      userService.syncProfile({
        clerk_user_id: demoUser.id,
        name: demoUser.fullName,
        email: demoUser.primaryEmailAddress?.emailAddress,
        avatar_url: demoUser.imageUrl
      }).catch((e) => console.warn('Could not sync demo user:', e.message));
    } else {
      sessionStorage.removeItem(SESSION_AUTH_KEY);
      sessionStorage.removeItem(SESSION_ACTIVE_FLAG);
      setAuthTokenGetter(null, null);
    }
  }, [demoUser]);

  const signIn = (email = 'alex.morgan@example.com', name = 'Alex Morgan') => {
    const user = {
      id: 'user_demo_codealpha',
      fullName: name,
      firstName: name.split(' ')[0],
      primaryEmailAddress: { emailAddress: email },
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isSignedIn: true
    };
    sessionStorage.setItem(SESSION_AUTH_KEY, JSON.stringify(user));
    sessionStorage.setItem(SESSION_ACTIVE_FLAG, 'true');
    setDemoUser(user);
  };

  const signOut = () => {
    setDemoUser(null);
    sessionStorage.removeItem(SESSION_AUTH_KEY);
    sessionStorage.removeItem(SESSION_ACTIVE_FLAG);
    localStorage.removeItem('shopsphere_demo_user');
  };

  return (
    <CustomAuthContext.Provider
      value={{
        isLoaded: true,
        isSignedIn: !!(demoUser && demoUser.isSignedIn),
        user: demoUser && demoUser.isSignedIn ? demoUser : null,
        userId: demoUser && demoUser.isSignedIn ? demoUser.id : null,
        getToken: async () => 'mock_jwt_token_for_demo',
        isClerkMode: false,
        signIn,
        signOut
      }}
    >
      {children}
    </CustomAuthContext.Provider>
  );
};

// Internal Clerk Consumer when Clerk is available
const ClerkAuthBridge = ({ children }) => {
  const { user: clerkUser, isLoaded, isSignedIn: clerkIsSignedIn } = useUser();
  const { getToken, userId: clerkUserId } = useAuth();
  const clerk = useClerk();
  const hasInitializedRef = useRef(false);

  // Session-scoped demo user
  const [demoUser, setDemoUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_AUTH_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // On fresh website open, ensure any previous unconfirmed sessions are cleared
  useEffect(() => {
    if (!hasInitializedRef.current && isLoaded) {
      hasInitializedRef.current = true;
      localStorage.removeItem('shopsphere_demo_user');

      const isSessionActive = sessionStorage.getItem(SESSION_ACTIVE_FLAG) === 'true';
      // If website opened anew without active session flag in sessionStorage, log out previous Clerk session
      if (!isSessionActive && clerkIsSignedIn && clerk) {
        clerk.signOut().catch(() => {});
      }
    }
  }, [isLoaded, clerkIsSignedIn, clerk]);

  const effectiveUser = (demoUser && demoUser.isSignedIn) ? demoUser : (sessionStorage.getItem(SESSION_ACTIVE_FLAG) === 'true' && clerkIsSignedIn ? clerkUser : null);
  const effectiveUserId = (demoUser && demoUser.isSignedIn) ? demoUser.id : (sessionStorage.getItem(SESSION_ACTIVE_FLAG) === 'true' && clerkIsSignedIn ? clerkUserId : null);
  const effectiveIsSignedIn = !!(demoUser && demoUser.isSignedIn) || (sessionStorage.getItem(SESSION_ACTIVE_FLAG) === 'true' && !!clerkIsSignedIn);

  useEffect(() => {
    if (isLoaded && effectiveIsSignedIn && effectiveUser) {
      setAuthTokenGetter(getToken, effectiveUserId);

      userService.syncProfile({
        clerk_user_id: effectiveUserId,
        name: effectiveUser.fullName || effectiveUser.username || 'Customer',
        email: effectiveUser.primaryEmailAddress?.emailAddress || '',
        avatar_url: effectiveUser.imageUrl || ''
      }).catch((e) => console.warn('Sync profile error:', e.message));
    } else {
      setAuthTokenGetter(null, null);
    }
  }, [isLoaded, effectiveIsSignedIn, effectiveUser, effectiveUserId, getToken]);

  const signIn = (email = 'alex.morgan@example.com', name = 'Alex Morgan') => {
    const user = {
      id: 'user_demo_codealpha',
      fullName: name,
      firstName: name.split(' ')[0],
      primaryEmailAddress: { emailAddress: email },
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isSignedIn: true
    };
    sessionStorage.setItem(SESSION_AUTH_KEY, JSON.stringify(user));
    sessionStorage.setItem(SESSION_ACTIVE_FLAG, 'true');
    setDemoUser(user);
  };

  const handleOpenSignIn = () => {
    sessionStorage.setItem(SESSION_ACTIVE_FLAG, 'true');
    if (clerk) clerk.openSignIn();
  };

  const handleOpenSignUp = () => {
    sessionStorage.setItem(SESSION_ACTIVE_FLAG, 'true');
    if (clerk) clerk.openSignUp();
  };

  const signOut = () => {
    setDemoUser(null);
    sessionStorage.removeItem(SESSION_AUTH_KEY);
    sessionStorage.removeItem(SESSION_ACTIVE_FLAG);
    localStorage.removeItem('shopsphere_demo_user');
    if (clerkIsSignedIn && clerk) {
      clerk.signOut();
    }
  };

  return (
    <CustomAuthContext.Provider
      value={{
        isLoaded,
        isSignedIn: effectiveIsSignedIn,
        user: effectiveUser,
        userId: effectiveUserId,
        getToken,
        isClerkMode: true,
        signIn,
        signOut,
        openSignIn: handleOpenSignIn,
        openSignUp: handleOpenSignUp,
        openUserProfile: () => clerk.openUserProfile()
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
