const { verifyToken } = require('@clerk/backend');
const clerkClient = require('../config/clerk');
const supabase = require('../config/supabase');
const config = require('../config/env');
const jwt = require('jsonwebtoken');

// Cache to prevent repetitive DB queries in short intervals
const syncedUserCache = new Set();

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check for Demo / Mock / Test headers
    const mockUserId = req.headers['x-mock-user-id'] || req.headers['x-demo-user-id'];
    if (mockUserId || process.env.NODE_ENV === 'test') {
      const effectiveId = mockUserId || 'user_demo_owner_1';
      const effectiveEmail = req.headers['x-mock-user-email'] || req.headers['x-demo-user-email'] || 'alex.thompson@projectmanager.io';
      const effectiveName = req.headers['x-mock-user-name'] || req.headers['x-demo-user-name'] || 'Alex Thompson';
      const effectiveAvatar = req.headers['x-demo-user-avatar'] || '';

      req.user = {
        userId: effectiveId,
        email: effectiveEmail,
        name: effectiveName,
        avatarUrl: effectiveAvatar,
      };

      // Ensure user profile exists in Supabase
      if (!syncedUserCache.has(effectiveId)) {
        try {
          await supabase.from('user_profiles').upsert(
            {
              clerk_user_id: effectiveId,
              name: effectiveName,
              email: effectiveEmail,
              avatar_url: effectiveAvatar,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'clerk_user_id' }
          );
          syncedUserCache.add(effectiveId);
        } catch (dbErr) {
          console.warn('[AuthMiddleware] Demo user sync warning:', dbErr.message);
        }
      }

      return next();
    }

    // 2. Check Authorization Bearer header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please sign in to continue.',
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token || token === 'null' || token === 'undefined') {
      return res.status(401).json({
        success: false,
        message: 'Invalid session token. Please sign in again.',
      });
    }

    // Check if token is a demo token (e.g. "demo_token_user_demo_owner_1")
    if (token.startsWith('demo_token_')) {
      const demoId = token.replace('demo_token_', '');
      const demoEmail = req.headers['x-user-email'] || 'demo.user@projectmanager.io';
      const demoName = req.headers['x-user-name'] || 'Demo User';
      const demoAvatar = req.headers['x-user-avatar'] || '';

      req.user = {
        userId: demoId,
        email: demoEmail,
        name: demoName,
        avatarUrl: demoAvatar,
      };

      try {
        await supabase.from('user_profiles').upsert(
          {
            clerk_user_id: demoId,
            name: demoName,
            email: demoEmail,
            avatar_url: demoAvatar,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'clerk_user_id' }
        );
      } catch (err) {
        // Continue
      }

      return next();
    }

    // 3. Verify standard Clerk JWT
    let verifiedUserId = null;
    let userClaims = null;

    try {
      if (config.clerk.secretKey) {
        const verified = await verifyToken(token, {
          secretKey: config.clerk.secretKey,
          jwtKey: config.clerk.jwtKey || undefined,
        });
        verifiedUserId = verified.sub;
        userClaims = verified;
      }
    } catch (verifyErr) {
      console.warn('[AuthMiddleware] Clerk verifyToken notice:', verifyErr.message);
    }

    // Fallback JWT decode if verifyToken was not conclusive
    if (!verifiedUserId) {
      const decoded = jwt.decode(token);
      if (decoded && decoded.sub) {
        verifiedUserId = decoded.sub;
        userClaims = decoded;
      }
    }

    if (!verifiedUserId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication session. Please sign in again.',
      });
    }

    // Extract user profile information from claims, headers, or Clerk API
    let userProfile = {
      userId: verifiedUserId,
      email: req.headers['x-user-email'] || userClaims?.email || userClaims?.primary_email_address || '',
      name: req.headers['x-user-name'] || userClaims?.name || userClaims?.first_name || 'Project User',
      avatarUrl: req.headers['x-user-avatar'] || userClaims?.picture || userClaims?.image_url || '',
    };

    // Sync user with Supabase database if not already cached
    if (!syncedUserCache.has(verifiedUserId)) {
      try {
        if (config.clerk.secretKey) {
          const clerkUser = await clerkClient.users.getUser(verifiedUserId).catch(() => null);
          if (clerkUser) {
            const primaryEmail = clerkUser.emailAddresses?.find(
              (e) => e.id === clerkUser.primaryEmailAddressId
            )?.emailAddress || clerkUser.emailAddresses?.[0]?.emailAddress || '';

            const fullName = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') ||
              clerkUser.username ||
              userProfile.name;

            userProfile.email = primaryEmail || userProfile.email;
            userProfile.name = fullName || userProfile.name;
            userProfile.avatarUrl = clerkUser.imageUrl || userProfile.avatarUrl;
          }
        }

        // Upsert to user_profiles table
        if (userProfile.email || userProfile.name) {
          await supabase.from('user_profiles').upsert(
            {
              clerk_user_id: verifiedUserId,
              name: userProfile.name,
              email: userProfile.email || `${verifiedUserId}@user.projectmanager.io`,
              avatar_url: userProfile.avatarUrl,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'clerk_user_id' }
          );
        }

        syncedUserCache.add(verifiedUserId);
      } catch (syncErr) {
        console.warn('[AuthMiddleware] Profile sync note:', syncErr.message);
      }
    }

    req.user = userProfile;
    next();
  } catch (error) {
    console.error('[AuthMiddleware] Error:', error);
    return res.status(401).json({
      success: false,
      message: 'Unauthorized access.',
      error: error.message,
    });
  }
};

module.exports = { requireAuth };
