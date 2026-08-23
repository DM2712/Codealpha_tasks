const UserService = require('../services/userService');

class UserController {
  static async syncProfile(req, res, next) {
    try {
      const { clerkUserId, name, email, avatarUrl } = req.body;
      const effectiveUserId = clerkUserId || req.user.userId;

      const profile = await UserService.syncProfile({
        clerkUserId: effectiveUserId,
        name: name || req.user.name,
        email: email || req.user.email,
        avatarUrl: avatarUrl || req.user.avatarUrl,
      });

      return res.status(200).json({
        success: true,
        message: 'Profile synchronized',
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  static async searchUsers(req, res, next) {
    try {
      const { q } = req.query;
      const currentUserId = req.user.userId;

      const users = await UserService.searchUsers(q, currentUserId);

      return res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req, res, next) {
    try {
      const userId = req.user.userId;
      const profile = await UserService.getProfileByUserId(userId);

      return res.status(200).json({
        success: true,
        data: profile || req.user,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
