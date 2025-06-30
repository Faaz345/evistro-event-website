import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { EventRegistration } from '../lib/types';
import { eventTypes } from '../data/eventTypes';
import LoadingSpinner from './LoadingSpinner';

type EventRegistrationsListProps = {
  registrations: EventRegistration[];
  loading: boolean;
  onCancel: (id: string) => Promise<{ error: string | null; data?: any }>;
};

const EventRegistrationsList = ({ registrations, loading, onCancel }: EventRegistrationsListProps) => {
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this event registration?')) {
      return;
    }
    
    setCancellingId(id);
    setError(null);
    
    try {
      const result = await onCancel(id);
      
      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setCancellingId(null);
    }
  };
  
  // Helper function to get event type name
  const getEventTypeName = (id: string) => {
    // Convert string id to number for comparison with eventTypes
    const numericId = parseInt(id, 10);
    const eventType = eventTypes.find(type => type.id === numericId);
    return eventType ? eventType.name : id;
  };
  
  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Helper function to get status badge color
  const getStatusColor = (status: EventRegistration['status']) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-500/20 text-blue-300';
      case 'confirmed':
        return 'bg-green-500/20 text-green-300';
      case 'in-progress':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'completed':
        return 'bg-purple-500/20 text-purple-300';
      case 'cancelled':
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };
  
  // Helper function to get payment status badge color
  const getPaymentStatusColor = (status: EventRegistration['payment_status']) => {
    switch (status) {
      case 'complete':
        return 'bg-green-500/20 text-green-300';
      case 'partial':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'pending':
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner text="Loading your registrations..." />
      </div>
    );
  }
  
  if (registrations.length === 0) {
    return (
      <div className="card p-8 text-center relative z-10 shadow-lg bg-white/15 backdrop-blur-md border-white/30">
        <div className="text-white/70 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-medium mb-2 text-white">No Event Registrations</h3>
        <p className="text-white/80">
          You haven't registered for any events yet. Use the form to register for your first event.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-md relative z-10">
          {error}
        </div>
      )}
      
      <AnimatePresence>
        {registrations.map((registration) => (
          <motion.div
            key={registration.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="card p-6 relative z-10 shadow-lg bg-white/15 backdrop-blur-md border-white/30 hover:border-accent/70"
          >
            <div className="flex flex-col md:flex-row justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {getEventTypeName(registration.event_type)}
                </h3>
                <p className="text-white/80">
                  {formatDate(registration.event_date)}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(registration.status)}`}>
                  {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(registration.payment_status)}`}>
                  Payment: {registration.payment_status.charAt(0).toUpperCase() + registration.payment_status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-white/60">Location</p>
                <p className="text-sm text-white">{registration.location}</p>
              </div>
              <div>
                <p className="text-xs text-white/60">Guests</p>
                <p className="text-sm text-white">{registration.guest_count} people</p>
              </div>
              <div>
                <p className="text-xs text-white/60">Budget</p>
                <p className="text-sm text-white">₹{registration.budget.toLocaleString('en-IN')}</p>
              </div>
            </div>
            
            {registration.special_requests && (
              <div className="mt-2 mb-4">
                <p className="text-xs text-white/60">Special Requests</p>
                <p className="text-sm text-white/90">{registration.special_requests}</p>
              </div>
            )}
            
            {registration.status !== 'cancelled' && registration.status !== 'completed' && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleCancel(registration.id!)}
                  disabled={cancellingId === registration.id}
                  className="btn-outline btn-sm text-red-400 border-red-400 hover:bg-red-400/20"
                >
                  {cancellingId === registration.id ? (
                    <LoadingSpinner size="small" color="white" />
                  ) : (
                    'Cancel Registration'
                  )}
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default EventRegistrationsList; 