-- Fix and update the delete_user function for direct API access
-- This script should be run in the Supabase SQL Editor

-- First, check if the function already exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'delete_user') THEN
    -- Drop the existing function if it's causing issues
    DROP FUNCTION IF EXISTS delete_user();
    RAISE NOTICE 'Existing delete_user function dropped';
  END IF;
END $$;

-- Create a simplified version of the delete_user function that doesn't depend on HTTP
CREATE OR REPLACE FUNCTION delete_user()
RETURNS json AS $$
DECLARE
  current_user_id UUID;
  current_user_email TEXT;
BEGIN
  -- Get the current user's ID
  current_user_id := auth.uid();
  
  -- Check if the user is authenticated
  IF current_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  
  -- Get the user's email for deleting from contacts
  SELECT email INTO current_user_email 
  FROM auth.users 
  WHERE id = current_user_id;

  -- Delete user data from tables
  DELETE FROM public.event_registrations WHERE user_id = current_user_id;
  
  -- Delete bookings
  DELETE FROM public.bookings WHERE user_id = current_user_id;
  
  -- Delete contacts (if email matches)
  IF current_user_email IS NOT NULL THEN
    DELETE FROM public.contacts WHERE email = current_user_email;
  END IF;
  
  -- Mark the user as deleted in their metadata
  -- This is important since we can't actually delete the auth user directly from RPC
  UPDATE auth.users
  SET raw_user_meta_data = 
    COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"deleted": true}'::jsonb
  WHERE id = current_user_id;
    
  -- Return success
  RETURN json_build_object('success', true, 'message', 'User data deleted and account marked for deletion');
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_user() TO authenticated;

-- Verify the function was created
SELECT pg_get_functiondef('delete_user'::regproc);

-- Add a helpful message
DO $$
BEGIN
  RAISE NOTICE 'delete_user function has been fixed and updated';
  RAISE NOTICE 'Important: This function marks the user as deleted but does not remove them from auth.users';
  RAISE NOTICE 'For complete deletion, you''ll need to periodically run a cleanup script using the service role';
END $$; 