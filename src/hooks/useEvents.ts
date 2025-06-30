import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Event } from '../lib/supabase';

type UseEventsOptions = {
  featured?: boolean;
  category?: string;
  limit?: number;
};

export const useEvents = (options: UseEventsOptions = {}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        let query = supabase.from('events').select('*');

        if (options.featured !== undefined) {
          query = query.eq('featured', options.featured);
        }

        if (options.category) {
          query = query.eq('category', options.category);
        }

        if (options.limit) {
          query = query.limit(options.limit);
        }

        const { data, error } = await query.order('date', { ascending: true });

        if (error) {
          throw error;
        }

        setEvents(data as Event[]);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [options.featured, options.category, options.limit]);

  return { events, loading, error };
};

export const useSingleEvent = (id: number | string | undefined) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        setEvent(data as Event);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  return { event, loading, error };
}; 