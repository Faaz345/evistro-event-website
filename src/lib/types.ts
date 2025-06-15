export type EventRegistration = {
  id?: string;
  user_id: string;
  event_type: string;
  event_date: string;
  guest_count: number;
  location: string;
  budget: number;
  special_requests?: string;
  contact_phone: string;
  contact_email: string;
  payment_status: 'pending' | 'partial' | 'complete';
  created_at?: string;
  status: 'submitted' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  start_time?: string;
  end_time?: string;
};

export type EventTracking = {
  id?: string;
  created_at?: string;
  event_type: string;
  event_date: string;
  location: string;
  status: 'upcoming' | 'cancelled' | 'completed';
  booking_id: string;
  start_time?: string;
  end_time?: string;
};

export type EventRegistrationFormData = Omit<EventRegistration, 'id' | 'user_id' | 'created_at' | 'payment_status' | 'status'>; 