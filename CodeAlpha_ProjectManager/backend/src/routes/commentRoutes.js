const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/commentController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);

router.post('/', CommentController.createComment);
router.get('/task/:taskId', CommentController.getTaskComments);
router.delete('/:id', CommentController.deleteComment);

module.exports = router;
