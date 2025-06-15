-- This script helps you find your admin user ID
-- Run this in the Supabase SQL Editor

-- Create a function to get the current user's ID
CREATE OR REPLACE FUNCTION get_my_user_id() 
RETURNS TEXT AS $$
BEGIN
  RETURN auth.uid()::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get the current user's email
CREATE OR REPLACE FUNCTION get_my_user_email() 
RETURNS TEXT AS $$
DECLARE
  email TEXT;
BEGIN
  -- Use service role to access auth.users
  SELECT au.email INTO email
  FROM auth.users au
  WHERE au.id = auth.uid();
  
  RETURN email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Select the current user's information
SELECT 
  get_my_user_id() as your_user_id,
  get_my_user_email() as your_email;

-- After running this, use the returned user_id to add yourself to the admin_users table:
-- INSERT INTO admin_users (id, email) VALUES ('your-user-id-from-above', 'your-email-from-above'); 