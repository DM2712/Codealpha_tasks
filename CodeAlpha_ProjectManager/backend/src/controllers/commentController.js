const CommentService = require('../services/commentService');
const { emitToProject } = require('../sockets/socketHandler');

class CommentController {
  static async createComment(req, res, next) {
    try {
      const { taskId, content } = req.body;
      const userId = req.user.userId;

      if (!taskId) {
        return res.status(400).json({ success: false, message: 'taskId is required' });
      }
      if (!content || !content.trim()) {
        return res.status(400).json({ success: false, message: 'Comment content is required' });
      }

      const comment = await CommentService.createComment({ taskId, content }, userId);

      // Real-time broadcast to project room
      emitToProject(comment.projectId, 'comment:created', {
        taskId,
        comment,
      });

      return res.status(201).json({
        success: true,
        message: 'Comment added successfully',
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTaskComments(req, res, next) {
    try {
      const { taskId } = req.params;
      const userId = req.user.userId;

      const comments = await CommentService.getTaskComments(taskId, userId);

      return res.status(200).json({
        success: true,
        count: comments.length,
        data: comments,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteComment(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const result = await CommentService.deleteComment(id, userId);

      // Real-time broadcast
      emitToProject(result.projectId, 'comment:deleted', {
        commentId: id,
        taskId: result.taskId,
        projectId: result.projectId,
      });

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CommentController;
