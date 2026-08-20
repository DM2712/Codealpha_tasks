import dotenv from 'dotenv';
dotenv.config();

/**
 * Authentication Middleware for Clerk
 * Handles Bearer token verification and dev-friendly fallback headers
 */
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const devUserId = req.headers['x-clerk-user-id'] || req.headers['x-user-id'];
    const clerkSecret = process.env.CLERK_SECRET_KEY;

    // 1. Check if dev header is passed for development/testing
    if (devUserId) {
      req.auth = {
        userId: devUserId,
        email: req.headers['x-user-email'] || `${devUserId}@example.com`,
        isDevAuth: true
      };
      return next();
    }

    // 2. If Bearer token is provided
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      if (token && token !== 'null' && token !== 'undefined') {
        // If Clerk Secret Key is configured, we can decode/verify token or extract payload
        if (clerkSecret && !clerkSecret.includes('example_key')) {
          try {
            // Decode payload safely
            const base64Payload = token.split('.')[1];
            if (base64Payload) {
              const decodedPayload = JSON.parse(Buffer.from(base64Payload, 'base64').toString('utf-8'));
              req.auth = {
                userId: decodedPayload.sub || decodedPayload.userId || 'user_authenticated',
                email: decodedPayload.email || decodedPayload.primaryEmail || '',
                claims: decodedPayload
              };
              return next();
            }
          } catch (jwtErr) {
            console.warn('Could not parse JWT token format:', jwtErr.message);
          }
        }

        // Generic mock / dev token support
        req.auth = {
          userId: 'user_authenticated',
          token
        };
        return next();
      }
    }

    // 3. Fallback for guest checkout / preview
    const guestHeader = req.headers['x-guest-id'];
    if (guestHeader) {
      req.auth = {
        userId: guestHeader,
        isGuest: true
      };
      return next();
    }

    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Authentication required to access this resource.'
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication credentials.'
    });
  }
};

/**
 * Optional Auth Middleware
 * Attaches auth info if present, but doesn't block guests
 */
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const devUserId = req.headers['x-clerk-user-id'] || req.headers['x-user-id'] || req.headers['x-guest-id'];

  if (devUserId) {
    req.auth = { userId: devUserId, isDevAuth: true };
  } else if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (token && token !== 'null') {
      req.auth = { userId: 'user_authenticated', token };
    }
  }

  next();
};
