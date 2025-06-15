import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import type { EventRegistrationFormData } from '../lib/types';
import { eventTypes } from '../data/eventTypes';
import LoadingSpinner from './LoadingSpinner';

type EventRegistrationFormProps = {
  onSubmit: (data: EventRegistrationFormData) => Promise<{ error: string | null; data?: any }>;
  onSuccess?: () => void;
};

const EventRegistrationForm = ({ onSubmit, onSuccess }: EventRegistrationFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<EventRegistrationFormData>();
  
  const handleFormSubmit = async (data: EventRegistrationFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await onSubmit(data);
      
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        reset();
        onSuccess?.();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card p-8 text-center"
      >
        <div className="text-accent mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold mb-2">Registration Submitted!</h3>
        <p className="text-white/70 mb-6">
          Thank you for your event registration. Our team will contact you shortly to discuss details and payment options.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="btn-outline"
        >
          Register Another Event
        </button>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-8"
    >
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
        Register for an Event
      </h2>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Event Type */}
        <div>
          <label htmlFor="event_type" className="block text-sm font-medium mb-1">
            Event Type <span className="text-red-500">*</span>
          </label>
          <select
            id="event_type"
            className="form-input"
            disabled={loading}
            {...register('event_type', { required: 'Event type is required' })}
          >
            <option value="">Select an event type</option>
            {eventTypes.map((type) => (
              <option key={type.id} value={type.name}>
                {type.name}
              </option>
            ))}
          </select>
          {errors.event_type && (
            <p className="mt-1 text-sm text-red-400">{errors.event_type.message}</p>
          )}
        </div>
        
        {/* Event Date */}
        <div>
          <label htmlFor="event_date" className="block text-sm font-medium mb-1">
            Event Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="event_date"
            className="form-input"
            disabled={loading}
            min={new Date().toISOString().split('T')[0]} // Prevent past dates
            {...register('event_date', { required: 'Event date is required' })}
          />
          {errors.event_date && (
            <p className="mt-1 text-sm text-red-400">{errors.event_date.message}</p>
          )}
        </div>
        
        {/* Event Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Time */}
          <div>
            <label htmlFor="start_time" className="block text-sm font-medium mb-1">
              Start Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              id="start_time"
              className="form-input"
              disabled={loading}
              {...register('start_time', { required: 'Start time is required' })}
            />
            {errors.start_time && (
              <p className="mt-1 text-sm text-red-400">{errors.start_time.message}</p>
            )}
          </div>
          
          {/* End Time */}
          <div>
            <label htmlFor="end_time" className="block text-sm font-medium mb-1">
              End Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              id="end_time"
              className="form-input"
              disabled={loading}
              {...register('end_time', { required: 'End time is required' })}
            />
            {errors.end_time && (
              <p className="mt-1 text-sm text-red-400">{errors.end_time.message}</p>
            )}
          </div>
        </div>
        
        {/* Guest Count */}
        <div>
          <label htmlFor="guest_count" className="block text-sm font-medium mb-1">
            Number of Guests <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="guest_count"
            className="form-input"
            disabled={loading}
            min={1}
            {...register('guest_count', { 
              required: 'Guest count is required',
              min: { value: 1, message: 'Must have at least 1 guest' },
              valueAsNumber: true
            })}
          />
          {errors.guest_count && (
            <p className="mt-1 text-sm text-red-400">{errors.guest_count.message}</p>
          )}
        </div>
        
        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-1">
            Event Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="location"
            className="form-input"
            disabled={loading}
            placeholder="Enter event location"
            {...register('location', { required: 'Location is required' })}
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-400">{errors.location.message}</p>
          )}
        </div>
        
        {/* Budget */}
        <div>
          <label htmlFor="budget" className="block text-sm font-medium mb-1">
            Budget (₹) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="budget"
            className="form-input"
            disabled={loading}
            min={1000}
            placeholder="Enter your budget"
            {...register('budget', { 
              required: 'Budget is required',
              min: { value: 1000, message: 'Minimum budget is ₹1,000' },
              valueAsNumber: true
            })}
          />
          {errors.budget && (
            <p className="mt-1 text-sm text-red-400">{errors.budget.message}</p>
          )}
        </div>
        
        {/* Contact Phone */}
        <div>
          <label htmlFor="contact_phone" className="block text-sm font-medium mb-1">
            Contact Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="contact_phone"
            className="form-input"
            disabled={loading}
            placeholder="Enter your phone number"
            {...register('contact_phone', { required: 'Phone number is required' })}
          />
          {errors.contact_phone && (
            <p className="mt-1 text-sm text-red-400">{errors.contact_phone.message}</p>
          )}
        </div>
        
        {/* Contact Email */}
        <div>
          <label htmlFor="contact_email" className="block text-sm font-medium mb-1">
            Contact Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="contact_email"
            className="form-input"
            disabled={loading}
            placeholder="Enter your email"
            {...register('contact_email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
          />
          {errors.contact_email && (
            <p className="mt-1 text-sm text-red-400">{errors.contact_email.message}</p>
          )}
        </div>
        
        {/* Special Requests */}
        <div>
          <label htmlFor="special_requests" className="block text-sm font-medium mb-1">
            Special Requests
          </label>
          <textarea
            id="special_requests"
            rows={4}
            className="form-input"
            disabled={loading}
            placeholder="Any special requirements or requests for your event"
            {...register('special_requests')}
          ></textarea>
        </div>
        
        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? <LoadingSpinner size="small" color="white" /> : 'Submit Registration'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default EventRegistrationForm; 