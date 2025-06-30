import { supabase } from '../lib/supabase';
import type { EventTracking } from '../lib/types';

/**
 * Check if an event is completed based on its date and end time
 * @param event The event to check
 * @returns boolean indicating if the event is completed
 */
export const isEventCompleted = (event: EventTracking): boolean => {
  const eventDate = new Date(event.event_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // If event date is in the past, it's completed
  if (eventDate < today) {
    return true;
  }
  
  // If event date is today, check if end time has passed
  if (eventDate.getTime() === today.getTime() && event.end_time) {
    const now = new Date();
    const [hours, minutes] = event.end_time.split(':').map(Number);
    
    const endTime = new Date();
    endTime.setHours(hours, minutes, 0, 0);
    
    return now > endTime;
  }
  
  return false;
};

/**
 * Update the status of completed events in the database
 * @returns Promise with the number of events updated
 */
export const updateCompletedEvents = async (): Promise<number> => {
  try {
    const { data, error } = await supabase.rpc('check_and_update_completed_events');
    
    if (error) {
      console.error('Error updating completed events:', error);
      return 0;
    }
    
    return data?.updated_count || 0;
  } catch (err) {
    console.error('Error calling update function:', err);
    return 0;
  }
};

/**
 * Check and update event status on the client side
 * @param events List of events to check
 * @returns Updated list of events with correct status
 */
export const checkAndUpdateEventStatus = (events: EventTracking[]): EventTracking[] => {
  return events.map(event => {
    if (event.status === 'upcoming' && isEventCompleted(event)) {
      return { ...event, status: 'completed' };
    }
    return event;
  });
}; 