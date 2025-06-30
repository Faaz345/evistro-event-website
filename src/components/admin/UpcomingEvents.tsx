import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../LoadingSpinner';
import { motion } from 'framer-motion';
import type { EventTracking } from '../../lib/types';

interface UpcomingEventsProps {
  limit?: number;
}

const UpcomingEvents = ({ limit = 5 }: UpcomingEventsProps) => {
  const [events, setEvents] = useState<EventTracking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
        // First, call the function to check for completed events
        await supabase.rpc('check_and_update_completed_events');
        
        // Then fetch the upcoming events
        const { data, error } = await supabase
          .from('event_tracking')
          .select('*')
          .eq('status', 'upcoming')
          .order('event_date', { ascending: true })
          .limit(limit);

        if (error) throw error;
        setEvents(data || []);
      } catch (err) {
        console.error('Error fetching upcoming events:', err);
        setError('Failed to load upcoming events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [limit]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Format time
  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    
    try {
      // Handle time format (assuming HH:MM:SS format)
      const [hours, minutes] = timeString.split(':');
      const time = new Date();
      time.setHours(parseInt(hours), parseInt(minutes), 0);
      
      return time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (err) {
      console.error('Error formatting time:', err);
      return timeString;
    }
  };

  // Calculate days remaining
  const getDaysRemaining = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <LoadingSpinner size="small" color="accent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500/40 text-white px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center p-6 text-white/50">
        No upcoming events found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          className="card p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-white">{event.event_type}</h3>
              <p className="text-sm text-white/70">{event.location}</p>
              <div className="mt-1 flex flex-col sm:flex-row sm:items-center">
                <span className="text-xs text-white/50">
                  {formatDate(event.event_date)}
                </span>
                {event.start_time && (
                  <span className="sm:ml-2 text-xs text-white/50">
                    {formatTime(event.start_time)} - {formatTime(event.end_time)}
                  </span>
                )}
                {getDaysRemaining(event.event_date) <= 7 && (
                  <span className="mt-1 sm:mt-0 sm:ml-2 px-2 py-1 text-xs rounded-full bg-accent/20 text-accent">
                    Soon
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className={`px-2 py-1 text-xs rounded-full ${
                getDaysRemaining(event.event_date) <= 3
                  ? 'bg-red-500/20 text-red-400'
                  : getDaysRemaining(event.event_date) <= 7
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-green-500/20 text-green-400'
              }`}>
                {getDaysRemaining(event.event_date)} days left
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default UpcomingEvents; 