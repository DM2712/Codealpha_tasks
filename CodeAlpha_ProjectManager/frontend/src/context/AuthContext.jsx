import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useUser, useAuth, useClerk } from '@clerk/clerk-react';
import { setAuthTokenGetter, syncUserProfile } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { user: clerkUser, isLoaded: clerkLoaded, isSignedIn: clerkSignedIn } = useUser();
  const { getToken: clerkGetToken } = useAuth();
  const { signOut: clerkSignOut } = useClerk();

  const [synced, setSynced] = useState(false);

  const isSignedIn = Boolean(clerkSignedIn);
  const isLoaded = clerkLoaded;

  const currentUserId = clerkUser?.id || null;
  const currentUserName = clerkUser?.fullName || clerkUser?.firstName || clerkUser?.username || 'Team Member';
  const currentUserEmail = clerkUser?.primaryEmailAddress?.emailAddress || clerkUser?.emailAddresses?.[0]?.emailAddress || '';
  const currentUserAvatar = clerkUser?.imageUrl || '';

  // Setup token & info getter for Axios interceptor
  useEffect(() => {
    const tokenGetter = async () => {
      if (clerkSignedIn && clerkGetToken) {
        try {
          const token = await clerkGetToken();
          return token;
        } catch {
          return null;
        }
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
        };
      }
      return null;
    };

    setAuthTokenGetter(tokenGetter, userInfoGetter);
  }, [clerkSignedIn, clerkGetToken, isSignedIn, currentUserId, currentUserName, currentUserEmail, currentUserAvatar]);

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
          // Offline resilience: silent sync
        }
      }
    };

    if (isSignedIn && isLoaded) {
      sync();
    }
  }, [isSignedIn, isLoaded, currentUserId, currentUserName, currentUserEmail, currentUserAvatar, synced]);

  const handleSignOut = useCallback(async () => {
    setSynced(false);
    if (clerkSignedIn && clerkSignOut) {
      await clerkSignOut();
    }
  }, [clerkSignedIn, clerkSignOut]);

  return (
    <AuthContext.Provider
      value={{
        user: clerkUser,
        isLoaded,
        isSignedIn,
        signOut: handleSignOut,
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
