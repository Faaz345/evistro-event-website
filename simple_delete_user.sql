-- Simplified User Deletion Function
-- Run this in the Supabase SQL Editor

-- Create a simplified function that handles everything
CREATE OR REPLACE FUNCTION complete_delete_user()
RETURNS json AS $$
DECLARE
  current_user_id UUID;
  current_user_email TEXT;
BEGIN
  -- Get current user's ID
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  
  -- Get user email
  SELECT email INTO current_user_email FROM auth.users WHERE id = current_user_id;
  
  -- Delete all user data
  DELETE FROM public.event_registrations WHERE user_id = current_user_id;
  DELETE FROM public.bookings WHERE user_id = current_user_id;
  IF current_user_email IS NOT NULL THEN
    DELETE FROM public.contacts WHERE email = current_user_email;
  END IF;
  
  -- Flag user as deleted (so they can't log in anymore)
  UPDATE auth.users
  SET raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{deleted}', 'true'::jsonb)
  WHERE id = current_user_id;
  
  RETURN json_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION complete_delete_user() TO authenticated; 