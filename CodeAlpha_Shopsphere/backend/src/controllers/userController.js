import { storeService } from '../services/storeService.js';

export const userController = {
  // POST /api/user/sync
  async syncUser(req, res) {
    try {
      const clerk_user_id = req.auth?.userId || req.body.clerk_user_id;
      const { name, email, phone, avatar_url } = req.body;

      if (!clerk_user_id) {
        return res.status(400).json({
          success: false,
          message: 'Clerk User ID is required'
        });
      }

      const profile = await storeService.upsertUserProfile({
        clerk_user_id,
        name,
        email,
        phone,
        avatar_url
      });

      return res.status(200).json({
        success: true,
        message: 'User profile synced successfully',
        profile
      });
    } catch (error) {
      console.error('Error syncing user profile:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to sync user profile',
        error: error.message
      });
    }
  },

  // GET /api/user/profile
  async getProfile(req, res) {
    try {
      const clerk_user_id = req.auth?.userId || req.query.clerk_user_id;

      if (!clerk_user_id) {
        return res.status(400).json({
          success: false,
          message: 'Clerk User ID is required'
        });
      }

      const profile = await storeService.getUserProfile(clerk_user_id);

      return res.status(200).json({
        success: true,
        profile: profile || {
          clerk_user_id,
          name: 'Shopper',
          email: ''
        }
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve profile',
        error: error.message
      });
    }
  }
};
