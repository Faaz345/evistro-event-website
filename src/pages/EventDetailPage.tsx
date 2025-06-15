import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { useForm } from 'react-hook-form';

import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { useSingleEvent } from '../hooks/useEvents';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

type BookingFormData = {
  name: string;
  email: string;
  phone?: string;
  guests: number;
  notes?: string;
};

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { event, loading, error } = useSingleEvent(id);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<BookingFormData>();

  // Format date
  const formattedDate = event
    ? new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  // GSAP animations
  useEffect(() => {
    if (event) {
      gsap.from('.event-image', { 
        opacity: 0, 
        scale: 1.05, 
        duration: 0.8,
        ease: 'power3.out' 
      });
      
      gsap.from('.event-details > *', { 
        opacity: 0, 
        y: 20, 
        stagger: 0.1, 
        duration: 0.5,
        ease: 'power3.out' 
      });
      
      gsap.from('.booking-form', { 
        opacity: 0, 
        x: 30, 
        duration: 0.6,
        delay: 0.4,
        ease: 'power3.out' 
      });
    }
  }, [event]);

  const onSubmit = async (data: BookingFormData) => {
    if (!event || !user) return;

    setBookingLoading(true);
    setBookingError(null);

    try {
      // Submit booking to Supabase
      const { error } = await supabase.from('bookings').insert({
        event_id: event.id,
        user_id: user.id,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        guests: data.guests,
        notes: data.notes || null,
        status: 'pending',
      });

      if (error) throw error;

      // Success
      setBookingSubmitted(true);
      reset();
    } catch (err) {
      console.error('Error submitting booking:', err);
      setBookingError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="large" text="Loading event details..." />
        </div>
      </Layout>
    );
  }

  if (error || !event) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4">
          <div className="text-center max-w-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-accent/50 mb-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h1 className="text-2xl font-bold mb-2">Event Not Found</h1>
            <p className="text-white/70 mb-8">
              The event you're looking for doesn't exist or has been removed.
            </p>
            <button 
              className="btn-primary" 
              onClick={() => navigate('/events')}
            >
              View All Events
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-primary min-h-screen pt-24 pb-16">
        <div className="container">
          {/* Event Header */}
          <div className="mb-12">
            <motion.h1
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {event.title}
            </motion.h1>
            <div className="flex flex-wrap gap-4 text-sm">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm"
              >
                {formattedDate}
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-secondary/20 border border-secondary/30 text-secondary px-3 py-1 rounded-full backdrop-blur-sm"
              >
                {event.category}
              </motion.span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Event Details Column */}
            <div className="lg:col-span-2">
              {/* Event Image */}
              <div className="event-image mb-8 rounded-xl overflow-hidden">
                <img
                  src={event.image_url || 'https://via.placeholder.com/1200x600?text=Event'}
                  alt={event.title}
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Event Details */}
              <div className="event-details space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-3">About This Event</h2>
                  <p className="text-white/80 whitespace-pre-line">{event.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="card p-6">
                    <h3 className="text-lg font-medium mb-3">Date & Time</h3>
                    <div className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3 text-accent"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <div>
                        <div className="font-medium">{formattedDate}</div>
                        <div className="text-sm text-white/60">Doors open 1 hour before event</div>
                      </div>
                    </div>
                  </div>

                  <div className="card p-6">
                    <h3 className="text-lg font-medium mb-3">Location</h3>
                    <div className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3 text-accent"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <div>
                        <div className="font-medium">{event.location}</div>
                        <div className="text-sm text-white/60">See map for directions</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form Column */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="booking-form card p-6 backdrop-blur-lg">
                  {bookingSubmitted ? (
                    <motion.div
                      className="text-center py-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 mx-auto text-accent mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <h3 className="text-xl font-semibold mb-2">Booking Successful!</h3>
                      <p className="text-white/70 mb-4">
                        Your booking request has been submitted. We'll send you a confirmation email
                        shortly.
                      </p>
                      <button
                        className="btn-primary"
                        onClick={() => setBookingSubmitted(false)}
                      >
                        Book Again
                      </button>
                    </motion.div>
                  ) : (
                    <>
                      <h2 className="text-xl font-semibold mb-4">Reserve Your Spot</h2>
                      
                      {!user && (
                        <div className="bg-secondary/20 border border-secondary/40 rounded-md p-3 mb-4 text-sm">
                          Please <button 
                            className="text-secondary underline hover:text-white"
                            onClick={() => navigate('/login')}
                          >
                            sign in
                          </button> to book this event.
                        </div>
                      )}

                      {bookingError && (
                        <div className="bg-red-500/20 border border-red-500/40 rounded-md p-3 mb-4 text-sm">
                          {bookingError}
                        </div>
                      )}

                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium mb-1">
                            Your Name
                          </label>
                          <input
                            id="name"
                            type="text"
                            className="form-input"
                            disabled={bookingLoading || !user}
                            {...register('name', { required: 'Name is required' })}
                          />
                          {errors.name && (
                            <span className="text-xs text-red-400 mt-1">
                              {errors.name.message}
                            </span>
                          )}
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium mb-1">
                            Email Address
                          </label>
                          <input
                            id="email"
                            type="email"
                            className="form-input"
                            disabled={bookingLoading || !user}
                            defaultValue={user?.email || ''}
                            {...register('email', { 
                              required: 'Email is required',
                              pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address'
                              }
                            })}
                          />
                          {errors.email && (
                            <span className="text-xs text-red-400 mt-1">
                              {errors.email.message}
                            </span>
                          )}
                        </div>

                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium mb-1">
                            Phone Number (Optional)
                          </label>
                          <input
                            id="phone"
                            type="tel"
                            className="form-input"
                            disabled={bookingLoading || !user}
                            {...register('phone')}
                          />
                        </div>

                        <div>
                          <label htmlFor="guests" className="block text-sm font-medium mb-1">
                            Number of Guests
                          </label>
                          <input
                            id="guests"
                            type="number"
                            min="1"
                            max="10"
                            className="form-input"
                            disabled={bookingLoading || !user}
                            {...register('guests', { 
                              required: 'Number of guests is required',
                              min: {
                                value: 1,
                                message: 'Minimum 1 guest'
                              },
                              max: {
                                value: 10,
                                message: 'Maximum 10 guests'
                              }
                            })}
                          />
                          {errors.guests && (
                            <span className="text-xs text-red-400 mt-1">
                              {errors.guests.message}
                            </span>
                          )}
                        </div>

                        <div>
                          <label htmlFor="notes" className="block text-sm font-medium mb-1">
                            Additional Notes (Optional)
                          </label>
                          <textarea
                            id="notes"
                            rows={3}
                            className="form-input"
                            disabled={bookingLoading || !user}
                            {...register('notes')}
                          />
                        </div>

                        <div>
                          <button
                            type="submit"
                            className="btn-primary w-full"
                            disabled={bookingLoading || !user}
                          >
                            {bookingLoading ? (
                              <LoadingSpinner size="small" color="white" />
                            ) : (
                              'Book Now'
                            )}
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetailPage; 