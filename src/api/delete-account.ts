import { createClient } from '@supabase/supabase-js';

// This endpoint should be deployed to a secure server environment (like Vercel Edge Functions)
// It cannot run in the browser as it requires service role credentials

// This is an example implementation that would need to run on the server
export default async function handler(req: any, res: any) {
  // Verify request method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { user_id, auth_token } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'Missing user ID' });
    }

    // Verify the auth token to ensure the request is legitimate
    // This is a basic check; you might want to implement more robust verification
    if (!auth_token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Initialize Supabase with service role (must be kept secure on server)
    // These would be environment variables on your server
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Delete the user with admin privileges
    const { error } = await supabaseAdmin.auth.admin.deleteUser(user_id);

    if (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in delete account endpoint:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    });
  }
} 