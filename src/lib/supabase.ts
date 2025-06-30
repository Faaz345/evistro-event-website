import { createClient } from '@supabase/supabase-js';

// Update these values with your new Supabase project details
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_NEW_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_NEW_SUPABASE_ANON_KEY';

// Log the URL being used (for debugging)
console.log('Supabase URL:', supabaseUrl);

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