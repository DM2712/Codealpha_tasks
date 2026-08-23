const { createClient } = require('@supabase/supabase-js');
const config = require('./env');

if (!config.supabase.url || (!config.supabase.serviceRoleKey && !config.supabase.anonKey)) {
  console.warn('[Supabase] Warning: Supabase credentials are missing or incomplete in environment variables.');
}

// Prefer serviceRoleKey for backend administrative/reliable operations, fallback to anonKey
const supabaseKey = config.supabase.serviceRoleKey || config.supabase.anonKey;

const supabase = createClient(config.supabase.url || 'https://placeholder.supabase.co', supabaseKey || 'placeholder-key', {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

module.exports = supabase;
