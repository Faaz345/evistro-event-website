// Follow the Supabase Edge Function deployment guide: 
// https://supabase.com/docs/guides/functions

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get authorization header
    const authorization = req.headers.get('Authorization')
    if (!authorization) {
      return new Response(
        JSON.stringify({ error: 'Missing Authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get the request body
    const requestData = await req.json().catch(() => ({}));
    const userId = requestData.userId || requestData.user_id || requestData.id;
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing userId in request body. Expected one of: userId, user_id, or id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Attempting to delete user with ID: ${userId}`)

    // Create a Supabase client with the Auth context of the logged-in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') || '', 
      Deno.env.get('SUPABASE_ANON_KEY') || '',
      {
        global: {
          headers: { Authorization: authorization }
        },
        auth: {
          persistSession: false
        }
      }
    );

    // Get the authenticated user to verify permissions
    const { data: { user: authUser }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !authUser) {
      return new Response(
        JSON.stringify({ error: 'Authentication failed', details: authError?.message }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Only allow users to delete their own accounts (unless they're admins)
    const isAdmin = authUser.app_metadata?.is_admin === true;
    if (userId !== authUser.id && !isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: You can only delete your own account' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create admin client for delete operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // First delete user data from tables
    console.log('Deleting user data from tables...');
    
    try {
      // Delete from event_registrations
      const { error: regError } = await supabaseAdmin
        .from('event_registrations')
        .delete()
        .eq('user_id', userId);
      
      if (regError) {
        console.error('Error deleting registrations:', regError);
      }
      
      // Delete from bookings
      const { error: bookingsError } = await supabaseAdmin
        .from('bookings')
        .delete()
        .eq('user_id', userId);
      
      if (bookingsError) {
        console.error('Error deleting bookings:', bookingsError);
      }
      
      // Get user email to delete from contacts
      const { data: userData, error: userError } = await supabaseAdmin
        .auth.admin.getUserById(userId);
      
      if (userError) {
        console.error('Error fetching user data:', userError);
      } else if (userData?.user?.email) {
        const { error: contactsError } = await supabaseAdmin
          .from('contacts')
          .delete()
          .eq('email', userData.user.email);
        
        if (contactsError) {
          console.error('Error deleting contacts:', contactsError);
        }
      }
    } catch (dataError) {
      console.error('Error deleting user data:', dataError);
      // Continue with user deletion even if data deletion fails
    }

    // Mark user as deleted in metadata before actual deletion
    try {
      const { error: metaError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        { user_metadata: { deleted: true } }
      );
      
      if (metaError) {
        console.error('Error updating user metadata:', metaError);
      }
    } catch (metaError) {
      console.error('Failed to update user metadata:', metaError);
    }

    // Now delete the actual user
    console.log('Deleting user from Auth...');
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
      console.error('Error deleting user:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User successfully deleted');
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}); 