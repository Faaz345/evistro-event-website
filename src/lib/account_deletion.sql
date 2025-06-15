-- Create a function to handle user account deletion
CREATE OR REPLACE FUNCTION handle_user_deletion()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the user is marked for deletion
  IF NEW.raw_user_meta_data->>'deleted' = 'true' THEN
    -- Delete all event registrations for this user
    DELETE FROM event_registrations WHERE user_id = NEW.id;
    
    -- If you have other user-related tables, delete data from them here
    
    -- Note: We don't actually delete the auth.users record here
    -- as that would require admin privileges. The account is just marked as deleted
    -- and all associated data is removed.
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to run the function when a user is updated
DROP TRIGGER IF EXISTS on_user_deletion ON auth.users;
CREATE TRIGGER on_user_deletion
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_user_deletion();

-- Add a policy to allow users to delete their own registrations
CREATE POLICY IF NOT EXISTS "Users can delete their own registrations"
  ON event_registrations
  FOR DELETE
  USING (auth.uid() = user_id); 