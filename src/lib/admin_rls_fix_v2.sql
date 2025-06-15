-- Create a service function to check if a user is an admin
-- This avoids direct access to auth.users table which causes permission issues
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if the user has a service_role token (superuser)
  -- or if they're in a special admin list
  RETURN (SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
  ));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a simpler policy that allows specific admin users to view all registrations
CREATE POLICY "Admins can view all registrations"
  ON event_registrations
  FOR SELECT
  USING (
    -- Either the user is viewing their own registration OR they are an admin
    auth.uid() = user_id OR is_admin()
  );

-- Add policy for admins to update all registrations
CREATE POLICY "Admins can update any registration"
  ON event_registrations
  FOR UPDATE
  USING (
    auth.uid() = user_id OR is_admin()
  );

-- Add policy for admins to delete registrations
CREATE POLICY "Admins can delete registrations"
  ON event_registrations
  FOR DELETE
  USING (
    auth.uid() = user_id OR is_admin()
  );

-- IMPORTANT: You need to add your admin user to the admin_users table
-- Replace 'your-admin-user-id' and 'admin@example.com' with your actual admin user details
-- INSERT INTO admin_users (id, email) VALUES ('your-admin-user-id', 'admin@example.com'); 