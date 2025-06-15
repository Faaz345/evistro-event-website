-- Create event_registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  event_date DATE NOT NULL,
  guest_count INTEGER NOT NULL,
  location TEXT NOT NULL,
  budget NUMERIC NOT NULL,
  special_requests TEXT,
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  payment_status TEXT NOT NULL CHECK (payment_status IN ('pending', 'partial', 'complete')),
  status TEXT NOT NULL CHECK (status IN ('submitted', 'confirmed', 'in-progress', 'completed', 'cancelled'))
);

-- Create RLS policies for event_registrations
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own registrations
CREATE POLICY "Users can view their own registrations"
  ON event_registrations
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own registrations
CREATE POLICY "Users can insert their own registrations"
  ON event_registrations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own registrations (for cancellation)
CREATE POLICY "Users can update their own registrations"
  ON event_registrations
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  featured BOOLEAN DEFAULT false
);

-- Make events publicly readable
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Events are publicly viewable"
  ON events
  FOR SELECT
  USING (true); 