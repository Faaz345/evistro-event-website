import { supabase } from '../lib/supabase';

/**
 * Check if a user has admin privileges
 * This would typically be an API endpoint, but for this example
 * we'll create a function that can be called directly
 */
export async function checkAdminStatus(userId: string) {
  try {
    // Check if the user exists in the admin_users table
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error checking admin status:', error);
      return { isAdmin: false };
    }
    
    return { isAdmin: !!data };
  } catch (err) {
    console.error('Error in admin check:', err);
    return { isAdmin: false };
  }
} 