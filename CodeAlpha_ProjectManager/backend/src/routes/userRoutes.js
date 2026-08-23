const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);

router.post('/sync', UserController.syncProfile);
router.get('/search', UserController.searchUsers);
router.get('/profile', UserController.getProfile);

module.exports = router;
