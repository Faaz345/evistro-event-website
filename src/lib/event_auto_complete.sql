-- Modify event_tracking table to include start_time and end_time fields
ALTER TABLE event_tracking ADD COLUMN IF NOT EXISTS start_time TIME;
ALTER TABLE event_tracking ADD COLUMN IF NOT EXISTS end_time TIME;

-- Add status 'completed' to the possible values
ALTER TABLE event_tracking DROP CONSTRAINT IF EXISTS event_tracking_status_check;
ALTER TABLE event_tracking ADD CONSTRAINT event_tracking_status_check 
  CHECK (status IN ('upcoming', 'cancelled', 'completed'));

-- Create a function to automatically mark events as completed when their end time has passed
CREATE OR REPLACE FUNCTION check_completed_events() RETURNS TRIGGER AS $$
BEGIN
  -- Check if the event date has passed or if the event date is today and end time has passed
  IF (NEW.event_date < CURRENT_DATE) OR 
     (NEW.event_date = CURRENT_DATE AND NEW.end_time < CURRENT_TIME) THEN
    NEW.status = 'completed';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to run the function before any insert or update
DROP TRIGGER IF EXISTS auto_mark_completed_events ON event_tracking;
CREATE TRIGGER auto_mark_completed_events
  BEFORE INSERT OR UPDATE ON event_tracking
  FOR EACH ROW
  EXECUTE FUNCTION check_completed_events();

-- Create a scheduled function to periodically check for events that need to be marked as completed
CREATE OR REPLACE FUNCTION update_completed_events() RETURNS void AS $$
BEGIN
  UPDATE event_tracking
  SET status = 'completed'
  WHERE status = 'upcoming' AND
        ((event_date < CURRENT_DATE) OR 
         (event_date = CURRENT_DATE AND end_time < CURRENT_TIME));
END;
$$ LANGUAGE plpgsql;

-- Create a cron job to run the update function every hour
-- Note: This requires pg_cron extension to be enabled
-- UNCOMMENT THIS IF YOU HAVE pg_cron ENABLED:
-- SELECT cron.schedule('0 * * * *', 'SELECT update_completed_events()');

-- Create an RPC function to manually check for completed events (for clients to call)
CREATE OR REPLACE FUNCTION check_and_update_completed_events()
RETURNS TABLE (updated_count bigint) SECURITY DEFINER AS $$
DECLARE
  updated_count bigint;
BEGIN
  WITH updated AS (
    UPDATE event_tracking
    SET status = 'completed'
    WHERE status = 'upcoming' AND
          ((event_date < CURRENT_DATE) OR 
           (event_date = CURRENT_DATE AND end_time < CURRENT_TIME))
    RETURNING id
  )
  SELECT COUNT(*) INTO updated_count FROM updated;
  
  RETURN QUERY SELECT updated_count;
END;
$$ LANGUAGE plpgsql; 