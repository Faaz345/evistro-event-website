import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { motion } from 'framer-motion';
import type { EventTracking } from '../../lib/types';
import { eventTypes } from '../../data/eventTypes';

const EditEventPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Partial<EventTracking>>({
    event_type: '',
    event_date: '',
    location: '',
    status: 'upcoming',
    booking_id: '',
    start_time: '',
    end_time: ''
  });

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        
        if (!id) {
          throw new Error('Event ID is required');
        }
        
        const { data, error } = await supabase
          .from('event_tracking')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        if (!data) {
          throw new Error('Event not found');
        }
        
        setFormData(data);
      } catch (err: any) {
        console.error('Error fetching event:', err);
        setError(err.message || 'Failed to load event data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, [id]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Validate form
      if (!formData.event_type || !formData.event_date || !formData.location || !formData.start_time || !formData.end_time) {
        throw new Error('Please fill all required fields');
      }
      
      // Update event
      const { error } = await supabase
        .from('event_tracking')
        .update({
          event_type: formData.event_type,
          event_date: formData.event_date,
          location: formData.location,
          status: formData.status,
          start_time: formData.start_time,
          end_time: formData.end_time
        })
        .eq('id', id);
        
      if (error) throw error;
      
      // Show success message
      setSuccess('Event updated successfully!');
      
      // Redirect to events page after 2 seconds
      setTimeout(() => {
        navigate('/admin/events');
      }, 2000);
      
    } catch (err: any) {
      console.error('Error updating event:', err);
      setError(err.message || 'Failed to update event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle event status change
  const handleStatusChange = async (status: 'upcoming' | 'cancelled' | 'completed') => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('event_tracking')
        .update({ status })
        .eq('id', id);
        
      if (error) throw error;
      
      setFormData({ ...formData, status });
      setSuccess(`Event marked as ${status}!`);
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      console.error('Error updating event status:', err);
      setError(err.message || 'Failed to update event status');
    } finally {
      setLoading(false);
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
            Edit Event
          </motion.h1>
          
          <button 
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors"
            onClick={() => navigate('/admin/events')}
          >
            Back to Events
          </button>
        </div>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/40 text-white px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-500/20 border border-green-500/40 text-white px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}
        
        {loading && !formData.id ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="large" color="accent" />
          </div>
        ) : (
          <>
            <div className="card p-6 mb-6">
              <div className="flex flex-wrap gap-3 mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  formData.status === 'upcoming' 
                    ? 'bg-green-500/20 text-green-400' 
                    : formData.status === 'completed'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {formData.status === 'upcoming' ? 'Upcoming' : 
                   formData.status === 'completed' ? 'Completed' : 'Cancelled'}
                </span>
                
                <div className="flex-grow"></div>
                
                {formData.status !== 'upcoming' && (
                  <button
                    onClick={() => handleStatusChange('upcoming')}
                    className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium hover:bg-green-500/30 transition-colors"
                  >
                    Mark as Upcoming
                  </button>
                )}
                
                {formData.status !== 'completed' && (
                  <button
                    onClick={() => handleStatusChange('completed')}
                    className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium hover:bg-blue-500/30 transition-colors"
                  >
                    Mark as Completed
                  </button>
                )}
                
                {formData.status !== 'cancelled' && (
                  <button
                    onClick={() => handleStatusChange('cancelled')}
                    className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium hover:bg-red-500/30 transition-colors"
                  >
                    Mark as Cancelled
                  </button>
                )}
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="event_type" className="block text-sm font-medium text-white/70 mb-2">
                      Event Type*
                    </label>
                    <select
                      id="event_type"
                      name="event_type"
                      value={formData.event_type}
                      onChange={handleChange}
                      className="form-input bg-white/5 w-full"
                      required
                    >
                      <option value="">Select Event Type</option>
                      {eventTypes.map(type => (
                        <option key={type.id} value={type.name}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="event_date" className="block text-sm font-medium text-white/70 mb-2">
                      Event Date*
                    </label>
                    <input
                      type="date"
                      id="event_date"
                      name="event_date"
                      value={formData.event_date}
                      onChange={handleChange}
                      className="form-input bg-white/5 w-full"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="start_time" className="block text-sm font-medium text-white/70 mb-2">
                      Start Time*
                    </label>
                    <input
                      type="time"
                      id="start_time"
                      name="start_time"
                      value={formData.start_time?.substring(0, 5)}
                      onChange={handleChange}
                      className="form-input bg-white/5 w-full"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="end_time" className="block text-sm font-medium text-white/70 mb-2">
                      End Time*
                    </label>
                    <input
                      type="time"
                      id="end_time"
                      name="end_time"
                      value={formData.end_time?.substring(0, 5)}
                      onChange={handleChange}
                      className="form-input bg-white/5 w-full"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="location" className="block text-sm font-medium text-white/70 mb-2">
                      Location*
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="form-input bg-white/5 w-full"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="booking_id" className="block text-sm font-medium text-white/70 mb-2">
                      Booking ID
                    </label>
                    <input
                      type="text"
                      id="booking_id"
                      name="booking_id"
                      value={formData.booking_id}
                      onChange={handleChange}
                      className="form-input bg-white/5 w-full"
                      disabled
                    />
                    <p className="text-xs text-white/50 mt-1">
                      Booking ID cannot be changed
                    </p>
                  </div>
                  
                  <div className="md:col-span-2 flex justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors mr-4"
                      onClick={() => navigate('/admin/events')}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-secondary to-accent text-white rounded-md hover:opacity-90 transition-opacity"
                      disabled={loading}
                    >
                      {loading ? <LoadingSpinner size="small" color="white" /> : 'Update Event'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </>
        )}
      </motion.div>
    </AdminLayout>
  );
};

export default EditEventPage; 