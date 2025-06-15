import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { motion } from 'framer-motion';
import type { EventRegistration } from '../../lib/types';

type BookingStatus = 'submitted' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';

// Interface for event tracking
interface EventTracking {
  id?: string;
  event_type: string;
  event_date: string;
  location: string;
  status: 'upcoming' | 'cancelled';
  booking_id: string;
  start_time: string;
  end_time: string;
}

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(null);
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

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('event_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('Fetched bookings:', data);
      setBookings(data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Update event tracking in events table
  const updateEventTracking = async (booking: EventRegistration, status: BookingStatus) => {
    try {
      // Check if there's already an event tracking entry for this booking
      const { data: existingEvents, error: fetchError } = await supabase
        .from('event_tracking')
        .select('*')
        .eq('booking_id', booking.id);
      
      if (fetchError) throw fetchError;
      
      if (status === 'confirmed') {
        // Get the start and end times from the booking
        const startTime = booking.start_time || '09:00:00';
        const endTime = booking.end_time || '17:00:00';
        
        // If confirmed, add or update the event tracking
        const eventData: EventTracking = {
          event_type: booking.event_type,
          event_date: booking.event_date,
          location: booking.location,
          status: 'upcoming',
          booking_id: booking.id || '',
          start_time: startTime,
          end_time: endTime
        };
        
        if (existingEvents && existingEvents.length > 0) {
          // Update existing event tracking
          const { error: updateError } = await supabase
            .from('event_tracking')
            .update({ 
              status: 'upcoming',
              // Use booking times if available, otherwise keep existing or use defaults
              start_time: booking.start_time || existingEvents[0].start_time || '09:00:00',
              end_time: booking.end_time || existingEvents[0].end_time || '17:00:00'
            })
            .eq('id', existingEvents[0].id);
            
          if (updateError) throw updateError;
        } else {
          // Create new event tracking
          const { error: insertError } = await supabase
            .from('event_tracking')
            .insert(eventData);
            
          if (insertError) throw insertError;
        }
      } else if (status === 'cancelled') {
        // If cancelled, update the event tracking to cancelled or remove it
        if (existingEvents && existingEvents.length > 0) {
          // Update existing event tracking to cancelled
          const { error: updateError } = await supabase
            .from('event_tracking')
            .update({ status: 'cancelled' })
            .eq('id', existingEvents[0].id);
            
          if (updateError) throw updateError;
        }
      }
      
      return true;
    } catch (err) {
      console.error('Error updating event tracking:', err);
      return false;
    }
  };

  // Update booking status
  const updateBookingStatus = async (id: string | undefined, status: BookingStatus, booking: EventRegistration) => {
    if (!id) return;
    
    try {
      setStatusUpdateLoading(id);
      
      const { error } = await supabase
        .from('event_registrations')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      // Update event tracking
      await updateEventTracking(booking, status);

      // Update local state
      setBookings(bookings.map(b => 
        b.id === id ? { ...b, status } : b
      ));
      
      // Show success message
      setError(`Booking ${id} successfully ${status === 'confirmed' ? 'confirmed' : 'cancelled'}`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    } catch (err) {
      console.error('Error updating booking:', err);
      setError('Failed to update booking status.');
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  // Delete booking completely
  const deleteBooking = async (id: string | undefined) => {
    if (!id) return;
    
    try {
      setStatusUpdateLoading(id);
      
      // First check if there's an event tracking entry to delete
      const { data: eventTrackingData } = await supabase
        .from('event_tracking')
        .select('id')
        .eq('booking_id', id);
      
      // Delete event tracking entry if it exists
      if (eventTrackingData && eventTrackingData.length > 0) {
        const { error: deleteEventError } = await supabase
          .from('event_tracking')
          .delete()
          .eq('booking_id', id);
        
        if (deleteEventError) throw deleteEventError;
      }
      
      // Delete the booking
      const { error } = await supabase
        .from('event_registrations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setBookings(bookings.filter(b => b.id !== id));
      
      // Show success message
      setError(`Booking ${id} successfully deleted`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    } catch (err) {
      console.error('Error deleting booking:', err);
      setError('Failed to delete booking.');
    } finally {
      setStatusUpdateLoading(null);
    }
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
            Bookings Management
          </motion.h1>
          
          <button 
            onClick={fetchBookings}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <LoadingSpinner size="small" color="white" />
                <span>Refreshing...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </>
            )}
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
          <div className="overflow-x-auto">
            {bookings.length === 0 ? (
              <div className="card p-6 text-center">
                <p className="text-white/50">No bookings found</p>
              </div>
            ) : (
              <table className="w-full card overflow-hidden">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Event</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Guests</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{booking.event_type}</div>
                        <div className="text-xs text-white/50">{booking.location}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white">{booking.contact_email}</div>
                        <div className="text-xs text-white/50">{booking.contact_phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{formatDate(booking.created_at)}</div>
                        <div className="text-xs text-white/50">Event: {booking.event_date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {booking.guest_count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-500/20 text-green-400' 
                            : booking.status === 'cancelled'
                            ? 'bg-red-500/20 text-red-400'
                            : booking.status === 'completed'
                            ? 'bg-blue-500/20 text-blue-400'
                            : booking.status === 'in-progress'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-white/20 text-white/70'
                        }`}>
                          {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {statusUpdateLoading === booking.id ? (
                            <LoadingSpinner size="small" color="accent" />
                          ) : (
                            <>
                              {booking.status !== 'confirmed' && (
                                <button 
                                  className="text-secondary hover:text-secondary/80"
                                  onClick={() => updateBookingStatus(booking.id, 'confirmed', booking)}
                                >
                                  Confirm
                                </button>
                              )}
                              {booking.status !== 'cancelled' && (
                                <button 
                                  className="text-red-400 hover:text-red-300"
                                  onClick={() => updateBookingStatus(booking.id, 'cancelled', booking)}
                                >
                                  Cancel
                                </button>
                              )}
                              <button 
                                className="text-red-500 hover:text-red-400"
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to permanently delete this booking? This action cannot be undone.')) {
                                    deleteBooking(booking.id);
                                  }
                                }}
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
};

export default AdminBookingsPage; 