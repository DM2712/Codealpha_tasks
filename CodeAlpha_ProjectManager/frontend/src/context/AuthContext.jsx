import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useUser, useAuth, useClerk } from '@clerk/clerk-react';
import { setAuthTokenGetter, syncUserProfile } from '../api/client';

const AuthContext = createContext(null);

const DEMO_USER_KEY = 'project_manager_demo_user';

export const DEMO_ACCOUNTS = [
  {
    id: 'user_alex_thompson_lead',
    name: 'Alex Thompson',
    email: 'alex.thompson@projectmanager.io',
    role: 'Lead Project Manager',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user_sarah_connor_dev',
    name: 'Sarah Connor',
    email: 'sarah.connor@projectmanager.io',
    role: 'Full-Stack Engineer',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user_david_kim_designer',
    name: 'David Kim',
    email: 'david.kim@projectmanager.io',
    role: 'Product Designer',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
];

export const AuthProvider = ({ children }) => {
  const { user: clerkUser, isLoaded: clerkLoaded, isSignedIn: clerkSignedIn } = useUser();
  const { getToken: clerkGetToken } = useAuth();
  const { signOut: clerkSignOut } = useClerk();

  // Demo user state
  const [demoUser, setDemoUser] = useState(() => {
    try {
      const saved = localStorage.getItem(DEMO_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [synced, setSynced] = useState(false);

  const isDemo = Boolean(demoUser && !clerkSignedIn);
  const isSignedIn = Boolean(clerkSignedIn || isDemo);
  const isLoaded = clerkLoaded;

  const currentUserId = clerkSignedIn
    ? clerkUser?.id
    : demoUser?.id;

  const currentUserName = clerkSignedIn
    ? clerkUser?.fullName || clerkUser?.firstName || clerkUser?.username || 'Project User'
    : demoUser?.name || 'Demo User';

  const currentUserEmail = clerkSignedIn
    ? clerkUser?.primaryEmailAddress?.emailAddress || clerkUser?.emailAddresses?.[0]?.emailAddress || ''
    : demoUser?.email || 'demo@projectmanager.io';

  const currentUserAvatar = clerkSignedIn
    ? clerkUser?.imageUrl || ''
    : demoUser?.avatarUrl || '';

  // Setup token & info getter for Axios interceptor
  useEffect(() => {
    const tokenGetter = async () => {
      if (clerkSignedIn && clerkGetToken) {
        try {
          const token = await clerkGetToken();
          return token;
        } catch (e) {
          console.warn('[AuthProvider] Clerk token error:', e);
        }
      }
      if (demoUser) {
        return `demo_token_${demoUser.id}`;
      }
      return null;
    };

    const userInfoGetter = () => {
      if (isSignedIn) {
        return {
          userId: currentUserId,
          name: currentUserName,
          email: currentUserEmail,
          avatarUrl: currentUserAvatar,
          isDemo,
        };
      }
      return null;
    };

    setAuthTokenGetter(tokenGetter, userInfoGetter);
  }, [clerkSignedIn, clerkGetToken, demoUser, isSignedIn, currentUserId, currentUserName, currentUserEmail, currentUserAvatar, isDemo]);

  // Sync user profile to Supabase backend
  useEffect(() => {
    const sync = async () => {
      if (isSignedIn && currentUserId && !synced) {
        try {
          await syncUserProfile({
            clerkUserId: currentUserId,
            name: currentUserName,
            email: currentUserEmail,
            avatarUrl: currentUserAvatar,
          });
          setSynced(true);
        } catch (err) {
          console.warn('[AuthProvider] Sync warning:', err.message);
        }
      }
    };

    if (isSignedIn && isLoaded) {
      sync();
    }
  }, [isSignedIn, isLoaded, currentUserId, currentUserName, currentUserEmail, currentUserAvatar, synced]);

  const signInDemo = useCallback((account) => {
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(account));
    setDemoUser(account);
    setSynced(false);
  }, []);

  const handleSignOut = useCallback(async () => {
    localStorage.removeItem(DEMO_USER_KEY);
    setDemoUser(null);
    setSynced(false);
    if (clerkSignedIn && clerkSignOut) {
      await clerkSignOut();
    }
  }, [clerkSignedIn, clerkSignOut]);

  return (
    <AuthContext.Provider
      value={{
        user: clerkUser || demoUser,
        isLoaded,
        isSignedIn,
        isDemo,
        signOut: handleSignOut,
        signInDemo,
        userId: currentUserId,
        userEmail: currentUserEmail,
        userName: currentUserName,
        userAvatar: currentUserAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAppAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAppAuth must be used within an AuthProvider');
  }
  return context;
};
