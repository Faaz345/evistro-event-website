export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: number
          created_at: string
          title: string
          description: string
          date: string
          location: string
          image_url: string | null
          category: string
          featured: boolean
        }
        Insert: {
          id?: number
          created_at?: string
          title: string
          description: string
          date: string
          location: string
          image_url?: string | null
          category: string
          featured?: boolean
        }
        Update: {
          id?: number
          created_at?: string
          title?: string
          description?: string
          date?: string
          location?: string
          image_url?: string | null
          category?: string
          featured?: boolean
        }
      }
      event_registrations: {
        Row: {
          id: string
          user_id: string
          event_type: string
          event_date: string
          guest_count: number
          location: string
          budget: number
          special_requests: string | null
          contact_phone: string
          contact_email: string
          payment_status: 'pending' | 'partial' | 'complete'
          created_at: string
          status: 'submitted' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'
          start_time: string | null
          end_time: string | null
        }
        Insert: {
          id?: string
          user_id: string
          event_type: string
          event_date: string
          guest_count: number
          location: string
          budget: number
          special_requests?: string | null
          contact_phone: string
          contact_email: string
          payment_status: 'pending' | 'partial' | 'complete'
          created_at?: string
          status: 'submitted' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'
          start_time?: string | null
          end_time?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          event_type?: string
          event_date?: string
          guest_count?: number
          location?: string
          budget?: number
          special_requests?: string | null
          contact_phone?: string
          contact_email?: string
          payment_status?: 'pending' | 'partial' | 'complete'
          created_at?: string
          status?: 'submitted' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'
          start_time?: string | null
          end_time?: string | null
        }
      }
      event_tracking: {
        Row: {
          id: string
          created_at: string
          event_type: string
          event_date: string
          location: string
          status: 'upcoming' | 'cancelled' | 'completed'
          booking_id: string
          start_time: string | null
          end_time: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          event_type: string
          event_date: string
          location: string
          status: 'upcoming' | 'cancelled' | 'completed'
          booking_id: string
          start_time?: string | null
          end_time?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          event_type?: string
          event_date?: string
          location?: string
          status?: 'upcoming' | 'cancelled' | 'completed'
          booking_id?: string
          start_time?: string | null
          end_time?: string | null
        }
      }
      contacts: {
        Row: {
          id: number
          created_at: string
          name: string
          email: string
          subject: string
          message: string
          responded: boolean
        }
        Insert: {
          id?: number
          created_at?: string
          name: string
          email: string
          subject: string
          message: string
          responded?: boolean
        }
        Update: {
          id?: number
          created_at?: string
          name?: string
          email?: string
          subject?: string
          message?: string
          responded?: boolean
        }
      }
      bookings: {
        Row: {
          id: number
          created_at: string
          event_id: number
          user_id: string
          name: string
          email: string
          phone: string | null
          guests: number
          status: 'pending' | 'confirmed' | 'cancelled'
        }
        Insert: {
          id?: number
          created_at?: string
          event_id: number
          user_id: string
          name: string
          email: string
          phone?: string | null
          guests: number
          status: 'pending' | 'confirmed' | 'cancelled'
        }
        Update: {
          id?: number
          created_at?: string
          event_id?: number
          user_id?: string
          name?: string
          email?: string
          phone?: string | null
          guests?: number
          status?: 'pending' | 'confirmed' | 'cancelled'
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      delete_user: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      delete_user_by_id: {
        Args: {
          id: string
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 
