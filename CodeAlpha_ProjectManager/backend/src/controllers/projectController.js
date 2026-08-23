const ProjectService = require('../services/projectService');
const { emitToProject } = require('../sockets/socketHandler');

class ProjectController {
  static async createProject(req, res, next) {
    try {
      const { name, description } = req.body;
      const ownerId = req.user.userId;

      if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: 'Project name is required' });
      }

      const project = await ProjectService.createProject({
        name,
        description,
        ownerId,
      });

      return res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProjects(req, res, next) {
    try {
      const userId = req.user.userId;
      const projects = await ProjectService.getUserProjects(userId);

      return res.status(200).json({
        success: true,
        count: projects.length,
        data: projects,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProjectById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const project = await ProjectService.getProjectById(id, userId);

      return res.status(200).json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProject(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      const { name, description } = req.body;

      const updated = await ProjectService.updateProject(id, userId, { name, description });

      emitToProject(id, 'project:updated', updated);

      return res.status(200).json({
        success: true,
        message: 'Project updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteProject(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const result = await ProjectService.deleteProject(id, userId);

      emitToProject(id, 'project:deleted', { projectId: id });

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async addMember(req, res, next) {
    try {
      const { id } = req.params;
      const requesterId = req.user.userId;
      const { email, role } = req.body;

      if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required to add a member' });
      }

      const member = await ProjectService.addMember(id, requesterId, { email, role });

      emitToProject(id, 'member:added', { projectId: id, member });

      return res.status(201).json({
        success: true,
        message: 'Member added successfully',
        data: member,
      });
    } catch (error) {
      next(error);
    }
  }

  static async removeMember(req, res, next) {
    try {
      const { id, userId: targetUserId } = req.params;
      const requesterId = req.user.userId;

      const result = await ProjectService.removeMember(id, requesterId, targetUserId);

      emitToProject(id, 'member:removed', { projectId: id, userId: targetUserId });

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProjectController;
