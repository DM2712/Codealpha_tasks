const supabase = require('../config/supabase');
const TaskService = require('./taskService');
const ProjectService = require('./projectService');

class CommentService {
  /**
   * Add a comment to a task
   */
  static async createComment({ taskId, content }, userId) {
    if (!taskId) {
      const error = new Error('Task ID is required');
      error.statusCode = 400;
      throw error;
    }
    if (!content || !content.trim()) {
      const error = new Error('Comment content cannot be empty');
      error.statusCode = 400;
      throw error;
    }

    // Verify task exists and user has access to its project
    const task = await TaskService.getTaskById(taskId, userId);

    const { data: comment, error } = await supabase
      .from('comments')
      .insert([
        {
          task_id: taskId,
          user_id: userId,
          content: content.trim(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('[CommentService] Error adding comment:', error);
      throw new Error(`Failed to add comment: ${error.message}`);
    }

    // Fetch author profile
    const { data: author } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('clerk_user_id', userId)
      .single();

    return {
      ...comment,
      projectId: task.project_id,
      author: {
        userId: userId,
        name: author?.name || 'Collaborator',
        email: author?.email || '',
        avatarUrl: author?.avatar_url || '',
      },
    };
  }

  /**
   * Get all comments for a task in chronological order
   */
  static async getTaskComments(taskId, userId) {
    // Verify access
    await TaskService.getTaskById(taskId, userId);

    const { data: comments, error } = await supabase
      .from('comments')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[CommentService] Error fetching comments:', error);
      throw new Error('Failed to retrieve comments');
    }

    if (!comments || comments.length === 0) {
      return [];
    }

    // Fetch user profiles for authors
    const authorIds = Array.from(new Set(comments.map((c) => c.user_id)));
    let authorMap = {};

    if (authorIds.length > 0) {
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('*')
        .in('clerk_user_id', authorIds);

      if (profiles) {
        profiles.forEach((p) => {
          authorMap[p.clerk_user_id] = p;
        });
      }
    }

    return comments.map((c) => ({
      ...c,
      author: {
        userId: c.user_id,
        name: authorMap[c.user_id]?.name || 'Collaborator',
        email: authorMap[c.user_id]?.email || '',
        avatarUrl: authorMap[c.user_id]?.avatar_url || '',
      },
    }));
  }

  /**
   * Delete a comment (Author or Project Owner/Admin)
   */
  static async deleteComment(commentId, userId) {
    const { data: comment, error } = await supabase
      .from('comments')
      .select('*')
      .eq('id', commentId)
      .single();

    if (error || !comment) {
      const err = new Error('Comment not found');
      err.statusCode = 404;
      throw err;
    }

    // Fetch task and project for authorization
    const task = await TaskService.getTaskById(comment.task_id, userId);
    const project = await ProjectService.getProjectById(task.project_id, userId);

    const isAuthor = comment.user_id === userId;
    const isOwnerOrAdmin = project.userRole === 'owner' || project.userRole === 'admin';

    if (!isAuthor && !isOwnerOrAdmin) {
      const err = new Error('Forbidden. You can only delete your own comments.');
      err.statusCode = 403;
      throw err;
    }

    const { error: deleteError } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (deleteError) {
      console.error('[CommentService] Error deleting comment:', deleteError);
      throw new Error(`Failed to delete comment: ${deleteError.message}`);
    }

    return {
      success: true,
      message: 'Comment deleted successfully',
      taskId: comment.task_id,
      projectId: task.project_id,
    };
  }
}

module.exports = CommentService;
