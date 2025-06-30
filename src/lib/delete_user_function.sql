-- Create a secure function to delete users
-- This needs to be run in the Supabase SQL Editor

-- First, enable the HTTP extension if it's not already enabled
CREATE EXTENSION IF NOT EXISTS http;

-- Create a simpler delete_user function with security definer
CREATE OR REPLACE FUNCTION delete_user()
RETURNS json AS $$
DECLARE
  current_user_id UUID;
BEGIN
  -- Get the current user's ID from the auth.uid() function
  current_user_id := auth.uid();
  
  -- Check if the user is authenticated
  IF current_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  -- First, clean up user data
  -- Delete from event_registrations
  DELETE FROM public.event_registrations WHERE user_id = current_user_id;
  
  -- Delete from contacts if the user has an associated email
  DELETE FROM public.contacts 
  WHERE email = (SELECT email FROM auth.users WHERE id = current_user_id);
  
  -- Use the Supabase Auth API to delete the user
  -- This must be run with service role permissions
  PERFORM 
    http_post(
      'https://xiudkintsxvqtowiggpq.supabase.co/auth/v1/admin/users/' || current_user_id,
      '{}',
      'application/json',
      array[
        http_header('Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY_HERE')
      ]
    );
    
  -- Return success
  RETURN json_build_object('success', true);
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the webhook function that will be called via the service role
CREATE OR REPLACE FUNCTION delete_user_by_id(id UUID)
RETURNS json AS $$
DECLARE
  url text;
  auth text;
  result json;
BEGIN
  -- Set the URL and authorization
  url := CONCAT(current_setting('app.settings.supabase_url'), '/auth/v1/admin/users/', id);
  auth := CONCAT('Bearer ', current_setting('app.settings.service_role_key'));
  
  -- Make the HTTP request
  result := supabase_functions.http(
    'DELETE',
    url,
    ARRAY[
      ARRAY['Content-Type', 'application/json'],
      ARRAY['Authorization', auth]
    ]
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Store the necessary settings (run this with your actual values)
-- DO $$
-- BEGIN
--   PERFORM set_config('app.settings.supabase_url', 'https://xiudkintsxvqtowiggpq.supabase.co', FALSE);
--   PERFORM set_config('app.settings.service_role_key', 'your-service-role-key', FALSE);
-- END $$; 