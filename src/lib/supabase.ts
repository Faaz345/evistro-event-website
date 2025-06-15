import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xiudkintsxvqtowiggpq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpdWRraW50c3h2cXRvd2lnZ3BxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NTIwNDAsImV4cCI6MjA2NTQyODA0MH0.YCcLBabmMUuwvSmLfPTsoPei0wE8Fz0KbSQU_GaFumk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for TypeScript
export type Event = {
  id: number;
  created_at: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image_url: string;
  category: string;
  featured: boolean;
};

export type Booking = {
  id: number;
  created_at: string;
  event_id: number;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
};

export type Contact = {
  id: number;
  created_at: string;
  name: string;
  email: string;
  message: string;
  responded: boolean;
}; 