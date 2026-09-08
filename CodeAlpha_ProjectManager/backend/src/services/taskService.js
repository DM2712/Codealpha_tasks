const supabase = require('../config/supabase');

const fallbackTasks = new Map();

// Seed initial fallback tasks
const initialTasks = [
  {
    id: 'task_001',
    project_id: 'proj_alpha_launch_001',
    title: 'Configure Clerk & Supabase RLS Policies',
    description: 'Ensure row level security is enabled for multi-tenant data isolation.',
    status: 'done',
    priority: 'high',
    assigned_to: 'user_alex',
    due_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    created_at: new Date().toISOString(),
  },
  {
    id: 'task_002',
    project_id: 'proj_alpha_launch_001',
    title: 'Implement Kanban Board Drag & Drop',
    description: 'Interactive sprint board with columns: To Do, In Progress, Done.',
    status: 'in_progress',
    priority: 'medium',
    assigned_to: 'user_sarah',
    due_date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    created_at: new Date().toISOString(),
  },
  {
    id: 'task_003',
    project_id: 'proj_alpha_launch_001',
    title: 'Add Automated Selenium E2E Test Suite',
    description: 'Verify all project management flows and user journeys in headless Chrome.',
    status: 'in_progress',
    priority: 'high',
    assigned_to: 'user_alex',
    due_date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    created_at: new Date().toISOString(),
  },
  {
    id: 'task_004',
    project_id: 'proj_alpha_launch_001',
    title: 'Polish Mobile Responsive Navigation & Modals',
    description: 'Ensure buttons and modal controls align symmetrically across all viewports.',
    status: 'todo',
    priority: 'low',
    assigned_to: 'user_david',
    due_date: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
    created_at: new Date().toISOString(),
  },
  // Tasks for Kinetic Logic UI Design System (2 Done, 1 In Progress = 67% complete)
  {
    id: 'task_ds_001',
    project_id: 'proj_design_system_002',
    title: 'Design Token Architecture & CSS Variables',
    description: 'Establish typography scales, kinetic color palette, and elevation tokens.',
    status: 'done',
    priority: 'high',
    assigned_to: 'user_david',
    due_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    created_at: new Date().toISOString(),
  },
  {
    id: 'task_ds_002',
    project_id: 'proj_design_system_002',
    title: 'Responsive Grid & Card Primitives',
    description: 'Build flexible grid layouts, KPI metric tiles, and progress indicators.',
    status: 'done',
    priority: 'medium',
    assigned_to: 'user_alex',
    due_date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    created_at: new Date().toISOString(),
  },
  {
    id: 'task_ds_003',
    project_id: 'proj_design_system_002',
    title: 'Interactive Modal & Drawer Animation Hooks',
    description: 'Create smooth Framer-like transition utilities for slide-over panels.',
    status: 'in_progress',
    priority: 'high',
    assigned_to: 'user_david',
    due_date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    created_at: new Date().toISOString(),
  },
];

initialTasks.forEach((t) => fallbackTasks.set(t.id, t));

class TaskService {
  /**
   * Helper to retrieve fallback tasks for a project
   */
  static getFallbackTasks(projectId) {
    return Array.from(fallbackTasks.values()).filter(
      (t) => String(t.project_id || t.projectId) === String(projectId)
    );
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

    const validStatuses = ['todo', 'in_progress', 'done'];
    const validPriorities = ['low', 'medium', 'high'];

    const taskStatus = validStatuses.includes(status) ? status : 'todo';
    const taskPriority = validPriorities.includes(priority) ? priority : 'medium';

    try {
      const { data: task, error } = await supabase
        .from('tasks')
        .insert([
          {
            project_id: projectId,
            title: title.trim(),
            description: description ? description.trim() : '',
            assigned_to: assigned_to || null,
            status: taskStatus,
            priority: taskPriority,
            due_date: due_date || null,
            created_by: userId,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return task;
    } catch {
      const newTask = {
        id: `task_${Date.now()}`,
        project_id: projectId,
        title: title.trim(),
        description: description ? description.trim() : '',
        assigned_to: assigned_to || null,
        status: taskStatus,
        priority: taskPriority,
        due_date: due_date || null,
        created_by: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        assignee: {
          userId: userId || 'user_alex',
          name: 'Alex Thompson',
          email: 'alex.thompson@projectmanager.io',
        },
        commentCount: 0,
      };

      fallbackTasks.set(newTask.id, newTask);
      return newTask;
    }
  }

  /**
   * Get all tasks for a project
   */
  static async getProjectTasks(projectId, userId) {
    let dbTasks = [];

    try {
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      dbTasks = tasks || [];
    } catch {}

    const localTasks = TaskService.getFallbackTasks(projectId);

    const merged = [...dbTasks];
    localTasks.forEach((lt) => {
      const existingIndex = merged.findIndex((mt) => String(mt.id) === String(lt.id));
      if (existingIndex >= 0) {
        // Prefer the latest update
        merged[existingIndex] = { ...merged[existingIndex], ...lt };
      } else {
        merged.push(lt);
      }
    });

    return merged.map((t) => ({
      ...t,
      assignee: t.assigned_to
        ? {
            userId: t.assigned_to,
            name: 'Alex Thompson',
            email: 'alex.thompson@projectmanager.io',
            avatarUrl: '',
          }
        : null,
      commentCount: 0,
    }));
  }

  /**
   * Get task by ID
   */
  static async getTaskById(taskId, userId) {
    let task = null;

    try {
      const { data } = await supabase.from('tasks').select('*').eq('id', taskId).single();
      task = data;
    } catch {}

    if (!task) {
      task = fallbackTasks.get(taskId);
    }

    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    return {
      ...task,
      assignee: task.assigned_to
        ? {
            userId: task.assigned_to,
            name: 'Alex Thompson',
            email: 'alex.thompson@projectmanager.io',
          }
        : null,
      comments: [],
    };
  }

  /**
   * Update task
   */
  static async updateTask(taskId, updates, userId) {
    let projectId = updates?.project_id || updates?.projectId;

    if (fallbackTasks.has(taskId)) {
      const current = fallbackTasks.get(taskId);
      projectId = current.project_id || projectId;
      const updated = {
        ...current,
        ...updates,
        project_id: projectId,
        updated_at: new Date().toISOString(),
      };
      fallbackTasks.set(taskId, updated);
      return updated;
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId)
        .select()
        .single();
      if (error) throw error;
      if (data) {
        fallbackTasks.set(taskId, data);
        return data;
      }
    } catch {}

    const fallbackUpdated = {
      id: taskId,
      project_id: projectId,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    fallbackTasks.set(taskId, fallbackUpdated);
    return fallbackUpdated;
  }

  /**
   * Delete task
   */
  static async deleteTask(taskId, userId) {
    let projectId = null;
    if (fallbackTasks.has(taskId)) {
      projectId = fallbackTasks.get(taskId)?.project_id;
      fallbackTasks.delete(taskId);
    }
    try {
      const { data } = await supabase.from('tasks').select('project_id').eq('id', taskId).single();
      if (data) projectId = data.project_id || projectId;
      await supabase.from('tasks').delete().eq('id', taskId);
    } catch {}
    return { success: true, projectId };
  }
}

module.exports = TaskService;
