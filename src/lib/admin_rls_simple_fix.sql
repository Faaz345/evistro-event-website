-- Alternative approach: Create a policy that allows specific admin users to view all registrations
-- Replace 'your-admin-user-id' with your actual admin user ID from Supabase Auth

-- First, create an admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert your admin user(s)
-- INSERT INTO admin_users (id, email) VALUES ('your-admin-user-id', 'admin@example.com');

-- Add policy for admins to view all registrations
CREATE POLICY "Admin users can view all registrations"
  ON event_registrations
  FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM admin_users)
  );

-- Add policy for admins to update all registrations
CREATE POLICY "Admin users can update all registrations"
  ON event_registrations
  FOR UPDATE
  USING (
    auth.uid() IN (SELECT id FROM admin_users)
  );

-- Add policy for admins to delete registrations
CREATE POLICY "Admin users can delete registrations"
  ON event_registrations
  FOR DELETE
  USING (
    auth.uid() IN (SELECT id FROM admin_users)
  ); 