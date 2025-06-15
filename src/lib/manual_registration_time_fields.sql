-- Add start_time and end_time columns to event_registrations table
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS start_time TIME;
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS end_time TIME;

-- Add start_time and end_time columns to event_tracking table
ALTER TABLE event_tracking ADD COLUMN IF NOT EXISTS start_time TIME;
ALTER TABLE event_tracking ADD COLUMN IF NOT EXISTS end_time TIME;

-- Update existing event_tracking entries to use the start_time and end_time from event_registrations
UPDATE event_tracking et
SET 
  start_time = er.start_time,
  end_time = er.end_time
FROM event_registrations er
WHERE et.booking_id = er.id
  AND er.start_time IS NOT NULL
  AND er.end_time IS NOT NULL;

-- Set default times for event_tracking entries that don't have times
UPDATE event_tracking
SET 
  start_time = '09:00:00',
  end_time = '17:00:00'
WHERE start_time IS NULL OR end_time IS NULL; 