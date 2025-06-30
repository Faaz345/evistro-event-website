import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { motion } from 'framer-motion';
import type { EventTracking } from '../../lib/types';
import { eventTypes } from '../../data/eventTypes';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Partial<EventTracking>>({
    event_type: '',
    event_date: '',
    location: '',
    status: 'upcoming',
    booking_id: 'manual-entry',
    start_time: '09:00:00',
    end_time: '17:00:00'
  });

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
      
      // Create event
      const { data, error } = await supabase
        .from('event_tracking')
        .insert(formData)
        .select();
        
      if (error) throw error;
      
      // Show success message
      setSuccess('Event created successfully!');
      
      // Redirect to events page after 2 seconds
      setTimeout(() => {
        navigate('/admin/events');
      }, 2000);
      
    } catch (err: any) {
      console.error('Error creating event:', err);
      setError(err.message || 'Failed to create event. Please try again.');
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
            Create New Event
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
        
        <div className="card p-6">
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
                  {loading ? <LoadingSpinner size="small" color="white" /> : 'Create Event'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default CreateEventPage; 