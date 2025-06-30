-- Complete User Deletion System
-- This script creates a system to completely remove users from auth.users
-- Run this script in the SQL Editor as a Supabase admin

-- 1. Create a table to track deletion requests
CREATE TABLE IF NOT EXISTS public.deletion_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_email TEXT NOT NULL,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMP WITH TIME ZONE
);

-- 2. Create an RPC function users can call to request deletion
CREATE OR REPLACE FUNCTION request_account_deletion()
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
  
  -- Get the user's email for later reference
  SELECT email INTO current_user_email 
  FROM auth.users 
  WHERE id = current_user_id;

  -- Clean up user data from tables
  DELETE FROM public.event_registrations WHERE user_id = current_user_id;
  DELETE FROM public.bookings WHERE user_id = current_user_id;
  
  -- Delete contacts (if email matches)
  IF current_user_email IS NOT NULL THEN
    DELETE FROM public.contacts WHERE email = current_user_email;
  END IF;
  
  -- Create a deletion request
  INSERT INTO public.deletion_requests (user_id, user_email)
  VALUES (current_user_id, current_user_email);
    
  -- Return success
  RETURN json_build_object('success', true, 'message', 'Account deletion requested and will be processed soon');
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Grant permissions
GRANT EXECUTE ON FUNCTION request_account_deletion() TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.deletion_requests TO authenticated;

-- 4. Create a function for the admin to process deletion requests
-- Note: This must be called with service_role permissions
CREATE OR REPLACE FUNCTION admin_process_deletion_requests()
RETURNS json AS $$
DECLARE
  deletion_record RECORD;
  result json;
  success_count INTEGER := 0;
  error_count INTEGER := 0;
BEGIN
  -- Loop through all unprocessed deletion requests
  FOR deletion_record IN 
    SELECT * FROM public.deletion_requests
    WHERE processed = false
    ORDER BY requested_at
  LOOP
    BEGIN
      -- This part would normally call the Supabase Admin API to delete the user
      -- But we're providing the curl command for you to run manually
      -- since we can't safely include service role key in database functions

      -- Mark the request as processed
      UPDATE public.deletion_requests
      SET processed = true, processed_at = timezone('utc', now())
      WHERE id = deletion_record.id;

      success_count := success_count + 1;
      
    EXCEPTION WHEN OTHERS THEN
      error_count := error_count + 1;
    END;
  END LOOP;
  
  -- Return summary
  RETURN json_build_object(
    'success', true, 
    'message', 'Deletion requests processed', 
    'processed', success_count,
    'errors', error_count
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create a view to show the curl commands for deletion
CREATE OR REPLACE VIEW admin_deletion_commands AS
SELECT 
  id,
  user_id,
  user_email,
  requested_at,
  processed,
  processed_at,
  'curl -X DELETE "https://{YOUR_PROJECT_ID}.supabase.co/auth/v1/admin/users/' || user_id || '" -H "Authorization: Bearer {YOUR_SERVICE_ROLE_KEY}"' as deletion_command
FROM public.deletion_requests
WHERE processed = false
ORDER BY requested_at;

-- Instructions for admin
DO $$ 
BEGIN
  RAISE NOTICE '----- COMPLETE USER DELETION SYSTEM INSTALLED -----';
  RAISE NOTICE 'To use this system:';
  RAISE NOTICE '1. Users call the request_account_deletion() function';
  RAISE NOTICE '2. Admin views pending requests with: SELECT * FROM admin_deletion_commands;';
  RAISE NOTICE '3. Admin runs the deletion commands shown in the view';
  RAISE NOTICE '4. Admin marks requests as processed with: SELECT * FROM admin_process_deletion_requests();';
  RAISE NOTICE '5. For automatic processing, create a scheduled function with service role access';
  RAISE NOTICE '--------------------------------------------------';
END $$; 