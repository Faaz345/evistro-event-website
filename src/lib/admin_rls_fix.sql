-- Add admin policy to view all event registrations
CREATE POLICY "Admins can view all registrations"
  ON event_registrations
  FOR SELECT
  USING (
    -- Check if user has admin role in auth.users metadata
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Add admin policy to update any event registration
CREATE POLICY "Admins can update any registration"
  ON event_registrations
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Add admin policy to delete any event registration
CREATE POLICY "Admins can delete any registration"
  ON event_registrations
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'admin'
    )
  ); 