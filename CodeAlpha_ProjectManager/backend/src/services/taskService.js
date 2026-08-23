const supabase = require('../config/supabase');
const ProjectService = require('./projectService');

class TaskService {
  /**
   * Helper to verify user membership in a project
   */
  static async verifyProjectAccess(projectId, userId) {
    const project = await ProjectService.getProjectById(projectId, userId);
    return project;
  }

  /**
   * Create a new task within a project
   */
  static async createTask(
    { projectId, title, description = '', assigned_to = null, status = 'todo', priority = 'medium', due_date = null },
    userId
  ) {
    if (!projectId) {
      const error = new Error('Project ID is required');
      error.statusCode = 400;
      throw error;
    }
    if (!title || !title.trim()) {
      const error = new Error('Task title is required');
      error.statusCode = 400;
      throw error;
    }

    // Verify access
    const project = await this.verifyProjectAccess(projectId, userId);

    // Validate status and priority
    const validStatuses = ['todo', 'in_progress', 'done'];
    const validPriorities = ['low', 'medium', 'high'];

    const taskStatus = validStatuses.includes(status) ? status : 'todo';
    const taskPriority = validPriorities.includes(priority) ? priority : 'medium';

    // If assignee specified, verify they belong to the project
    let assigneeId = assigned_to || null;
    if (assigneeId) {
      const isMember = project.members.some((m) => m.userId === assigneeId) || project.owner_id === assigneeId;
      if (!isMember) {
        assigneeId = null;
      }
    }

    const { data: task, error } = await supabase
      .from('tasks')
      .insert([
        {
          project_id: projectId,
          title: title.trim(),
          description: description ? description.trim() : '',
          assigned_to: assigneeId,
          status: taskStatus,
          priority: taskPriority,
          due_date: due_date || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('[TaskService] Error creating task:', error);
      throw new Error(`Failed to create task: ${error.message}`);
    }

    return await this.getTaskById(task.id, userId);
  }

  /**
   * Get all tasks for a project
   */
  static async getProjectTasks(projectId, userId) {
    await this.verifyProjectAccess(projectId, userId);

    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[TaskService] Error fetching tasks:', error);
      throw new Error('Failed to retrieve project tasks');
    }

    if (!tasks || tasks.length === 0) {
      return [];
    }

    // Fetch user profiles for all assignees
    const assigneeIds = Array.from(new Set(tasks.map((t) => t.assigned_to).filter(Boolean)));
    let userProfilesMap = {};

    if (assigneeIds.length > 0) {
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('*')
        .in('clerk_user_id', assigneeIds);

      if (profiles) {
        profiles.forEach((p) => {
          userProfilesMap[p.clerk_user_id] = p;
        });
      }
    }

    // Fetch comment counts for tasks
    const taskIds = tasks.map((t) => t.id);
    const { data: comments } = await supabase
      .from('comments')
      .select('task_id')
      .in('task_id', taskIds);

    const commentCounts = {};
    if (comments) {
      comments.forEach((c) => {
        commentCounts[c.task_id] = (commentCounts[c.task_id] || 0) + 1;
      });
    }

    return tasks.map((t) => ({
      ...t,
      assignee: t.assigned_to
        ? {
            userId: t.assigned_to,
            name: userProfilesMap[t.assigned_to]?.name || 'Assigned Member',
            email: userProfilesMap[t.assigned_to]?.email || '',
            avatarUrl: userProfilesMap[t.assigned_to]?.avatar_url || '',
          }
        : null,
      commentCount: commentCounts[t.id] || 0,
    }));
  }

  /**
   * Get single task by ID
   */
  static async getTaskById(taskId, userId) {
    const { data: task, error } = await supabase.from('tasks').select('*').eq('id', taskId).single();

    if (error || !task) {
      const err = new Error('Task not found');
      err.statusCode = 404;
      throw err;
    }

    // Check project access
    await this.verifyProjectAccess(task.project_id, userId);

    let assignee = null;
    if (task.assigned_to) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('clerk_user_id', task.assigned_to)
        .single();

      if (profile) {
        assignee = {
          userId: profile.clerk_user_id,
          name: profile.name,
          email: profile.email,
          avatarUrl: profile.avatar_url,
        };
      }
    }

    const { count: commentCount } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('task_id', taskId);

    return {
      ...task,
      assignee,
      commentCount: commentCount || 0,
    };
  }

  /**
   * Update task fields (status, priority, assigned_to, title, description, due_date)
   */
  static async updateTask(taskId, userId, updateData) {
    const existingTask = await this.getTaskById(taskId, userId);

    const validStatuses = ['todo', 'in_progress', 'done'];
    const validPriorities = ['low', 'medium', 'high'];

    const updates = {};
    if (updateData.title !== undefined) updates.title = updateData.title.trim();
    if (updateData.description !== undefined) updates.description = updateData.description.trim();
    if (updateData.status !== undefined && validStatuses.includes(updateData.status)) {
      updates.status = updateData.status;
    }
    if (updateData.priority !== undefined && validPriorities.includes(updateData.priority)) {
      updates.priority = updateData.priority;
    }
    if (updateData.assigned_to !== undefined) {
      updates.assigned_to = updateData.assigned_to || null;
    }
    if (updateData.due_date !== undefined) {
      updates.due_date = updateData.due_date || null;
    }
    if (updateData.order_index !== undefined) {
      updates.order_index = Number(updateData.order_index) || 0;
    }
    updates.updated_at = new Date().toISOString();

    const { error } = await supabase.from('tasks').update(updates).eq('id', taskId);

    if (error) {
      console.error('[TaskService] Error updating task:', error);
      throw new Error(`Failed to update task: ${error.message}`);
    }

    return await this.getTaskById(taskId, userId);
  }

  /**
   * Delete a task
   */
  static async deleteTask(taskId, userId) {
    const existingTask = await this.getTaskById(taskId, userId);

    const { error } = await supabase.from('tasks').delete().eq('id', taskId);

    if (error) {
      console.error('[TaskService] Error deleting task:', error);
      throw new Error(`Failed to delete task: ${error.message}`);
    }

    return { success: true, message: 'Task deleted successfully', projectId: existingTask.project_id };
  }
}

module.exports = TaskService;
