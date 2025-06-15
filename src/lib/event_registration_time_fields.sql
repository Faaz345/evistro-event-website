-- Add start_time and end_time columns to event_registrations table
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS start_time TIME;
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS end_time TIME; 