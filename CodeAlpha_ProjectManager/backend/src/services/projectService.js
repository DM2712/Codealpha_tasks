const supabase = require('../config/supabase');

class ProjectService {
  /**
   * Create a new project and add creator as owner in project_members
   */
  static async createProject({ name, description = '', ownerId }) {
    if (!name || !name.trim()) {
      const error = new Error('Project name is required');
      error.statusCode = 400;
      throw error;
    }

    // 1. Insert project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert([
        {
          name: name.trim(),
          description: description ? description.trim() : '',
          owner_id: ownerId,
        },
      ])
      .select()
      .single();

    if (projectError) {
      console.error('[ProjectService] Error creating project:', projectError);
      throw new Error(`Failed to create project: ${projectError.message}`);
    }

    // 2. Add owner to project_members
    const { error: memberError } = await supabase.from('project_members').insert([
      {
        project_id: project.id,
        user_id: ownerId,
        role: 'owner',
      },
    ]);

    if (memberError) {
      console.error('[ProjectService] Error adding owner member:', memberError);
    }

    return project;
  }

  /**
   * Get all projects accessible to the user (as owner or member)
   */
  static async getUserProjects(userId) {
    // 1. Get project IDs where user is member or owner
    const { data: memberships, error: memError } = await supabase
      .from('project_members')
      .select('project_id, role')
      .eq('user_id', userId);

    if (memError) {
      console.error('[ProjectService] Error fetching memberships:', memError);
      throw new Error('Failed to retrieve project list');
    }

    const memberProjectIds = memberships ? memberships.map((m) => m.project_id) : [];

    // Also get projects owned directly
    const { data: ownedProjects, error: ownError } = await supabase
      .from('projects')
      .select('*')
      .eq('owner_id', userId);

    if (ownError) {
      console.error('[ProjectService] Error fetching owned projects:', ownError);
    }

    const ownedIds = ownedProjects ? ownedProjects.map((p) => p.id) : [];
    const allProjectIds = Array.from(new Set([...memberProjectIds, ...ownedIds]));

    if (allProjectIds.length === 0) {
      return [];
    }

    // Fetch all project details
    const { data: projects, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .in('id', allProjectIds)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('[ProjectService] Error fetching projects:', fetchError);
      throw new Error('Failed to retrieve projects');
    }

    // Enhance each project with task stats & member count
    const enrichedProjects = await Promise.all(
      projects.map(async (project) => {
        // Members count
        const { count: memberCount } = await supabase
          .from('project_members')
          .select('*', { count: 'exact', head: true })
          .eq('project_id', project.id);

        // Tasks stats
        const { data: tasks } = await supabase
          .from('tasks')
          .select('id, status')
          .eq('project_id', project.id);

        const totalTasks = tasks ? tasks.length : 0;
        const doneTasks = tasks ? tasks.filter((t) => t.status === 'done').length : 0;
        const inProgressTasks = tasks ? tasks.filter((t) => t.status === 'in_progress').length : 0;
        const todoTasks = tasks ? tasks.filter((t) => t.status === 'todo').length : 0;

        const userMembership = memberships?.find((m) => m.project_id === project.id);
        const userRole = project.owner_id === userId ? 'owner' : userMembership?.role || 'member';

        return {
          ...project,
          userRole,
          isOwner: project.owner_id === userId,
          memberCount: memberCount || 1,
          taskStats: {
            total: totalTasks,
            done: doneTasks,
            inProgress: inProgressTasks,
            todo: todoTasks,
            progressPercentage: totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0,
          },
        };
      })
    );

    return enrichedProjects;
  }

  /**
   * Get project details and members by project ID
   */
  static async getProjectById(projectId, userId) {
    // 1. Fetch project
    const { data: project, error: projError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (projError || !project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    // 2. Check user authorization (must be owner or member)
    const isOwner = project.owner_id === userId;
    const { data: memberCheck } = await supabase
      .from('project_members')
      .select('*')
      .eq('project_id', projectId)
      .eq('user_id', userId)
      .single();

    if (!isOwner && !memberCheck) {
      const error = new Error('Access denied. You are not a member of this project.');
      error.statusCode = 403;
      throw error;
    }

    // 3. Fetch all project members with their profiles
    const { data: members, error: memError } = await supabase
      .from('project_members')
      .select('id, user_id, role, created_at')
      .eq('project_id', projectId);

    const userIds = members ? members.map((m) => m.user_id) : [];

    let profilesMap = {};
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('*')
        .in('clerk_user_id', userIds);

      if (profiles) {
        profiles.forEach((p) => {
          profilesMap[p.clerk_user_id] = p;
        });
      }
    }

    const formattedMembers = (members || []).map((m) => ({
      id: m.id,
      userId: m.user_id,
      role: m.role,
      joinedAt: m.created_at,
      name: profilesMap[m.user_id]?.name || 'Collaborator',
      email: profilesMap[m.user_id]?.email || '',
      avatarUrl: profilesMap[m.user_id]?.avatar_url || '',
    }));

    return {
      ...project,
      isOwner,
      userRole: isOwner ? 'owner' : memberCheck?.role || 'member',
      members: formattedMembers,
    };
  }

  /**
   * Update project details (Owner or Admin only)
   */
  static async updateProject(projectId, userId, { name, description }) {
    const project = await this.getProjectById(projectId, userId);

    if (project.userRole !== 'owner' && project.userRole !== 'admin') {
      const error = new Error('Only project owners and admins can update project information.');
      error.statusCode = 403;
      throw error;
    }

    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (description !== undefined) updates.description = description.trim();
    updates.updated_at = new Date().toISOString();

    const { data: updated, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update project: ${error.message}`);
    }

    return updated;
  }

  /**
   * Delete project (Owner only)
   */
  static async deleteProject(projectId, userId) {
    const { data: project, error: findError } = await supabase
      .from('projects')
      .select('owner_id')
      .eq('id', projectId)
      .single();

    if (findError || !project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    if (project.owner_id !== userId) {
      const error = new Error('Forbidden. Only the project owner can delete this project.');
      error.statusCode = 403;
      throw error;
    }

    const { error: deleteError } = await supabase.from('projects').delete().eq('id', projectId);

    if (deleteError) {
      throw new Error(`Failed to delete project: ${deleteError.message}`);
    }

    return { success: true, message: 'Project deleted successfully.' };
  }

  /**
   * Add a member to the project
   */
  static async addMember(projectId, requesterId, { email, role = 'member' }) {
    if (!email || !email.trim()) {
      const error = new Error('Member email is required');
      error.statusCode = 400;
      throw error;
    }

    // Check requester permission (must be owner or admin)
    const project = await this.getProjectById(projectId, requesterId);
    if (project.userRole !== 'owner' && project.userRole !== 'admin') {
      const error = new Error('Only project owners and admins can add new members.');
      error.statusCode = 403;
      throw error;
    }

    // Look up user by email in user_profiles
    const { data: targetUser, error: userError } = await supabase
      .from('user_profiles')
      .select('*')
      .ilike('email', email.trim())
      .single();

    if (userError || !targetUser) {
      const error = new Error(`User with email "${email}" has not signed up or logged in to the platform yet.`);
      error.statusCode = 404;
      throw error;
    }

    // Check if already a member
    const { data: existing } = await supabase
      .from('project_members')
      .select('*')
      .eq('project_id', projectId)
      .eq('user_id', targetUser.clerk_user_id)
      .single();

    if (existing) {
      const error = new Error('User is already a member of this project.');
      error.statusCode = 400;
      throw error;
    }

    // Insert into project_members
    const { data: member, error: insertError } = await supabase
      .from('project_members')
      .insert([
        {
          project_id: projectId,
          user_id: targetUser.clerk_user_id,
          role: ['admin', 'member'].includes(role) ? role : 'member',
        },
      ])
      .select()
      .single();

    if (insertError) {
      throw new Error(`Failed to add project member: ${insertError.message}`);
    }

    return {
      id: member.id,
      userId: targetUser.clerk_user_id,
      role: member.role,
      name: targetUser.name,
      email: targetUser.email,
      avatarUrl: targetUser.avatar_url,
      joinedAt: member.created_at,
    };
  }

  /**
   * Remove a member from the project
   */
  static async removeMember(projectId, requesterId, targetUserId) {
    const project = await this.getProjectById(projectId, requesterId);

    // Target cannot be the project owner
    if (targetUserId === project.owner_id) {
      const error = new Error('Cannot remove the project owner.');
      error.statusCode = 400;
      throw error;
    }

    // Requester must be owner/admin or the member removing themselves
    const isSelf = requesterId === targetUserId;
    const isOwnerOrAdmin = project.userRole === 'owner' || project.userRole === 'admin';

    if (!isSelf && !isOwnerOrAdmin) {
      const error = new Error('You do not have permission to remove this member.');
      error.statusCode = 403;
      throw error;
    }

    const { error: delError } = await supabase
      .from('project_members')
      .delete()
      .eq('project_id', projectId)
      .eq('user_id', targetUserId);

    if (delError) {
      throw new Error(`Failed to remove member: ${delError.message}`);
    }

    // Unassign tasks assigned to this user in this project
    await supabase
      .from('tasks')
      .update({ assigned_to: null })
      .eq('project_id', projectId)
      .eq('assigned_to', targetUserId);

    return { success: true, message: 'Member removed from project.' };
  }
}

module.exports = ProjectService;
