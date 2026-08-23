const TaskService = require('../services/taskService');
const { emitToProject } = require('../sockets/socketHandler');

class TaskController {
  static async createTask(req, res, next) {
    try {
      const { projectId, title, description, assigned_to, status, priority, due_date } = req.body;
      const userId = req.user.userId;

      if (!projectId) {
        return res.status(400).json({ success: false, message: 'projectId is required' });
      }
      if (!title || !title.trim()) {
        return res.status(400).json({ success: false, message: 'title is required' });
      }

      const task = await TaskService.createTask(
        {
          projectId,
          title,
          description,
          assigned_to,
          status,
          priority,
          due_date,
        },
        userId
      );

      // Real-time notification
      emitToProject(projectId, 'task:created', task);

      return res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProjectTasks(req, res, next) {
    try {
      const { projectId } = req.params;
      const userId = req.user.userId;

      const tasks = await TaskService.getProjectTasks(projectId, userId);

      return res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTaskById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const task = await TaskService.getTaskById(id, userId);

      return res.status(200).json({
        success: true,
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateTask(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      const updateData = req.body;

      const updated = await TaskService.updateTask(id, userId, updateData);

      // Real-time update broadcast
      emitToProject(updated.project_id, 'task:updated', updated);

      return res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteTask(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const result = await TaskService.deleteTask(id, userId);

      // Real-time broadcast
      emitToProject(result.projectId, 'task:deleted', { taskId: id, projectId: result.projectId });

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TaskController;
