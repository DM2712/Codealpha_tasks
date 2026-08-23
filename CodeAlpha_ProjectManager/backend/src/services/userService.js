const supabase = require('../config/supabase');

class UserService {
  /**
   * Sync user profile from frontend/Clerk
   */
  static async syncProfile({ clerkUserId, name, email, avatarUrl }) {
    if (!clerkUserId) {
      throw new Error('clerkUserId is required');
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(
        {
          clerk_user_id: clerkUserId,
          name: name || 'Project User',
          email: email || '',
          avatar_url: avatarUrl || '',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'clerk_user_id' }
      )
      .select()
      .single();

    if (error) {
      console.error('[UserService] Error syncing user profile:', error);
      throw new Error(`Failed to sync profile: ${error.message}`);
    }

    return data;
  }

  /**
   * Search users by email or name (for adding to project)
   */
  static async searchUsers(query, excludeUserId) {
    let q = supabase.from('user_profiles').select('clerk_user_id, name, email, avatar_url').limit(10);

    if (query && query.trim()) {
      q = q.or(`email.ilike.%${query.trim()}%,name.ilike.%${query.trim()}%`);
    }

    if (excludeUserId) {
      q = q.neq('clerk_user_id', excludeUserId);
    }

    const { data, error } = await q;

    if (error) {
      console.error('[UserService] Error searching users:', error);
      return [];
    }

    return (data || []).map((u) => ({
      userId: u.clerk_user_id,
      name: u.name,
      email: u.email,
      avatarUrl: u.avatar_url,
    }));
  }

  /**
   * Get user profile by Clerk user ID
   */
  static async getProfileByUserId(userId) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('clerk_user_id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      userId: data.clerk_user_id,
      name: data.name,
      email: data.email,
      avatarUrl: data.avatar_url,
      createdAt: data.created_at,
    };
  }
}

module.exports = UserService;
