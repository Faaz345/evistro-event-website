// Immediate User Deletion Edge Function
// This function uses service role key to delete users completely with one API call

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Max-Age': '86400'
};

serve(async (req) => {
  // Handle CORS preflight requests properly
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: corsHeaders,
      status: 200
    });
  }

  try {
    // Get authorization header
    const authorization = req.headers.get('Authorization');
    if (!authorization) {
      return new Response(
        JSON.stringify({ error: 'Missing Authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the request body
    const requestData = await req.json().catch(() => ({}));
    const userId = requestData.userId || requestData.user_id || requestData.id;
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing userId in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing immediate deletion for user: ${userId}`);

    // Create authenticated client using user's token
    const userClient = createClient(
      Deno.env.get('SUPABASE_URL') || '', 
      Deno.env.get('SUPABASE_ANON_KEY') || '',
      {
        global: { headers: { Authorization: authorization } }
      }
    );
    
    // Get the user's email address for contact deletion
    const { data: { user } } = await userClient.auth.getUser();
    
    if (!user || user.id !== userId) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Can only delete your own account' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userEmail = user.email;
    console.log(`User email: ${userEmail}`);

    // Create admin client with service role
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Step 1: Delete all user data from tables
    console.log('Step 1: Deleting user data from tables');
    
    try {
      // Delete from event_registrations
      await adminClient
        .from('event_registrations')
        .delete()
        .eq('user_id', userId);
      
      // Delete from bookings
      await adminClient
        .from('bookings')
        .delete()
        .eq('user_id', userId);
      
      // Delete from contacts (if email matches)
      if (userEmail) {
        await adminClient
          .from('contacts')
          .delete()
          .eq('email', userEmail);
      }
      
      console.log('User data deleted from tables');
    } catch (dataError) {
      console.error('Error deleting user data:', dataError);
      // Continue with auth deletion even if data deletion fails
    }

    // Step 2: Delete the user from auth
    console.log('Step 2: Deleting user from auth system');
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error('Error deleting user from auth:', deleteError);
      return new Response(
        JSON.stringify({ error: deleteError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User successfully deleted');
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Account and all associated data permanently deleted' 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
