import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { motion } from 'framer-motion';
import type { EventTracking } from '../../lib/types';

const AdminEventsPage = () => {
  const [events, setEvents] = useState<EventTracking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate('/login');
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
        // First, call the function to check for completed events
        await supabase.rpc('check_and_update_completed_events');
        
        // Then fetch all events
        const { data, error } = await supabase
          .from('event_tracking')
          .select('*')
          .order('event_date', { ascending: true });

        if (error) throw error;
        setEvents(data || []);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Delete event
  const deleteEvent = async (id: string | undefined) => {
    if (!id) return;
    
    try {
      setDeletingId(id);
      setError(null);

      // Get the booking ID associated with this event
      const event = events.find(e => e.id === id);
      const bookingId = event?.booking_id;
      
      // Delete the event tracking entry
      const { error: deleteEventError } = await supabase
        .from('event_tracking')
        .delete()
        .eq('id', id);
      
      if (deleteEventError) throw deleteEventError;

      // Update local state
      setEvents(events.filter(e => e.id !== id));
      
      // Show success message
      setError(`Event successfully deleted`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event.');
    } finally {
      setDeletingId(null);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  return (
    <AdminLayout>
      <motion.div 
        className="p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <motion.h1 
            className="text-3xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Events Management
          </motion.h1>
          
          <button 
            className="px-4 py-2 bg-gradient-to-r from-secondary to-accent text-white rounded-md hover:opacity-90 transition-opacity"
            onClick={() => navigate('/admin/create-event')}
          >
            Create Event
          </button>
        </div>
        
        {error && (
          <div className={`${error.includes('successfully') ? 'bg-green-500/20 border-green-500/40' : 'bg-red-500/20 border-red-500/40'} text-white px-4 py-3 rounded-lg mb-6 border`}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="large" color="accent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {events.length === 0 ? (
              <div className="card p-6 text-center">
                <p className="text-white/50">No events found</p>
                <p className="text-white/30 text-sm mt-2">Create your first event or confirm a booking to get started</p>
              </div>
            ) : (
              <>
                {/* Filter tabs */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors text-white">
                    All Events
                  </button>
                  <button className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 rounded-md transition-colors text-green-400">
                    Upcoming
                  </button>
                  <button className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-md transition-colors text-blue-400">
                    Completed
                  </button>
                  <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-md transition-colors text-red-400">
                    Cancelled
                  </button>
                </div>
                
                {events.map((event) => (
                  <motion.div 
                    key={event.id}
                    className={`card overflow-hidden ${event.status === 'cancelled' ? 'opacity-60' : ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="text-xl font-semibold text-white">{event.event_type}</h2>
                          <p className="text-white/70">{event.location} • {formatDate(event.event_date)}</p>
                          {event.start_time && (
                            <p className="text-white/70 text-sm">
                              Time: {formatTime(event.start_time)} - {formatTime(event.end_time)}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              event.status === 'upcoming'
                                ? 'bg-green-500/20 text-green-400'
                                : event.status === 'completed'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {event.status === 'upcoming' ? 'Upcoming' : 
                               event.status === 'completed' ? 'Completed' : 'Cancelled'}
                            </span>
                            
                            {event.status === 'upcoming' && (
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                getDaysRemaining(event.event_date) <= 3
                                  ? 'bg-red-500/20 text-red-400'
                                  : getDaysRemaining(event.event_date) <= 7
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-blue-500/20 text-blue-400'
                              }`}>
                                {getDaysRemaining(event.event_date)} days left
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors"
                            onClick={() => navigate(`/admin/edit-event/${event.id}`)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            className="p-2 bg-white/10 hover:bg-red-500/20 rounded-md transition-colors"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
                                deleteEvent(event.id);
                              }
                            }}
                            disabled={deletingId === event.id}
                          >
                            {deletingId === event.id ? (
                              <LoadingSpinner size="small" color="accent" />
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/70 hover:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-between items-center">
                        <div>
                          <h3 className="text-sm font-medium text-white/70">Booking Details</h3>
                          <p className="text-sm text-white/50">Booking ID: {event.booking_id}</p>
                        </div>
                        <button 
                          className="text-secondary hover:text-secondary/80 text-sm font-medium"
                          onClick={() => navigate(`/admin/bookings`)}
                        >
                          View Booking →
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </>
            )}
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
};

export default AdminEventsPage; 