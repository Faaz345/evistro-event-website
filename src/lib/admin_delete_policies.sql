-- Ensure admins can delete event registrations
CREATE POLICY IF NOT EXISTS "Admins can delete any registration"
  ON event_registrations
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Ensure admins can delete event tracking entries
CREATE POLICY IF NOT EXISTS "Admins can delete any event tracking"
  ON event_tracking
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'admin'
    )
  ); 