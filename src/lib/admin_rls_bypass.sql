-- IMPORTANT: This is a temporary solution to bypass RLS for debugging
-- It allows any authenticated user to view all registrations
-- For production, use a more restrictive policy

-- Add policy to allow any authenticated user to view all registrations
CREATE POLICY "Any authenticated user can view all registrations"
  ON event_registrations
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Alternatively, you could completely disable RLS for this table (not recommended for production)
-- ALTER TABLE event_registrations DISABLE ROW LEVEL SECURITY; 