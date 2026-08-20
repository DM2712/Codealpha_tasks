import express from 'express';
import { userController } from '../controllers/userController.js';
import { requireAuth, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/user/sync (sync clerk user metadata into user_profiles table)
router.post('/sync', optionalAuth, userController.syncUser);

// GET /api/user/profile (get user profile info)
router.get('/profile', optionalAuth, userController.getProfile);

export default router;
