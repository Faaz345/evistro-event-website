import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { EventRegistration, EventRegistrationFormData } from '../lib/types';

export const useEventRegistrations = () => {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch user's event registrations
  const fetchRegistrations = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setRegistrations(data || []);
    } catch (err) {
      console.error('Error fetching event registrations:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  // Create new event registration
  const createRegistration = async (formData: EventRegistrationFormData) => {
    if (!user) return { error: 'User not authenticated' };
    
    try {
      const newRegistration: EventRegistration = {
        ...formData,
        user_id: user.id,
        payment_status: 'pending',
        status: 'submitted'
      };
      
      const { data, error } = await supabase
        .from('event_registrations')
        .insert([newRegistration])
        .select()
        .single();
        
      if (error) throw error;
      
      // Update local state
      setRegistrations(prev => [data, ...prev]);
      
      return { data, error: null };
    } catch (err) {
      console.error('Error creating event registration:', err);
      return { error: err instanceof Error ? err.message : 'An error occurred', data: null };
    }
  };
  
  // Cancel event registration
  const cancelRegistration = async (id: string) => {
    if (!user) return { error: 'User not authenticated' };
    
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .update({ status: 'cancelled' })
        .eq('id', id)
        .eq('user_id', user.id) // Security: ensure user can only cancel their own registrations
        .select()
        .single();
        
      if (error) throw error;
      
      // Update local state
      setRegistrations(prev => 
        prev.map(reg => reg.id === id ? { ...reg, status: 'cancelled' } : reg)
      );
      
      return { data, error: null };
    } catch (err) {
      console.error('Error cancelling event registration:', err);
      return { error: err instanceof Error ? err.message : 'An error occurred', data: null };
    }
  };
  
  // Load registrations on mount or when user changes
  useEffect(() => {
    fetchRegistrations();
  }, [user]);
  
  return {
    registrations,
    loading,
    error,
    createRegistration,
    cancelRegistration,
    refreshRegistrations: fetchRegistrations
  };
}; 