-- IMPORTANT: This is a temporary solution to bypass RLS completely
-- It removes all security restrictions on the event_registrations table
-- Only use this for debugging and re-enable RLS for production

-- Disable Row Level Security for event_registrations table
ALTER TABLE event_registrations DISABLE ROW LEVEL SECURITY;

-- To re-enable RLS later, run:
-- ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY; 