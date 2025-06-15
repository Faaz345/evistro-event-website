import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { motion } from 'framer-motion';
import type { EventRegistration } from '../../lib/types';
import UpcomingEvents from '../../components/admin/UpcomingEvents';
import { updateCompletedEvents } from '../../utils/eventStatus';

type DashboardStats = {
  totalEvents: number;
  totalBookings: number;
  newMessages: number;
  totalMessages: number;
  recentBookings: EventRegistration[];
  recentMessages: any[];
};

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    totalBookings: 0,
    newMessages: 0,
    totalMessages: 0,
    recentBookings: [],
    recentMessages: [],
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First check and update any completed events
      await updateCompletedEvents();
      
      // Fetch all data in parallel for better performance
      const [
        eventsResult,
        bookingsResult,
        messagesResult,
        newMessagesResult,
        recentBookingsResult,
        recentMessagesResult
      ] = await Promise.all([
        // Events count - use event_tracking table for events
        supabase.from('event_tracking').select('*', { count: 'exact' }).eq('status', 'upcoming'),
        
        // Bookings count (using event_registrations table)
        supabase.from('event_registrations').select('*', { count: 'exact' }),
        
        // Total messages
        supabase.from('contacts').select('*', { count: 'exact' }),
        
        // New messages
        supabase.from('contacts').select('*', { count: 'exact' }).eq('responded', false),
        
        // Recent bookings (using event_registrations table)
        supabase.from('event_registrations').select('*').order('created_at', { ascending: false }).limit(5),
        
        // Recent messages
        supabase.from('contacts').select('*').order('created_at', { ascending: false }).limit(5)
      ]);

      // Check for errors
      if (eventsResult.error) throw new Error(`Events error: ${eventsResult.error.message}`);
      if (bookingsResult.error) throw new Error(`Bookings error: ${bookingsResult.error.message}`);
      if (messagesResult.error) throw new Error(`Messages error: ${messagesResult.error.message}`);
      if (newMessagesResult.error) throw new Error(`New messages error: ${newMessagesResult.error.message}`);
      if (recentBookingsResult.error) throw new Error(`Recent bookings error: ${recentBookingsResult.error.message}`);
      if (recentMessagesResult.error) throw new Error(`Recent messages error: ${recentMessagesResult.error.message}`);

      // Update stats with the fetched data
      setStats({
        totalEvents: eventsResult.count || 0,
        totalBookings: bookingsResult.count || 0,
        totalMessages: messagesResult.count || 0,
        newMessages: newMessagesResult.count || 0,
        recentBookings: recentBookingsResult.data || [],
        recentMessages: recentMessagesResult.data || [],
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();

    // Set up refresh interval (every 30 seconds)
    const refreshInterval = setInterval(() => {
      fetchDashboardData();
    }, 30000);

    // Clean up interval on unmount
    return () => clearInterval(refreshInterval);
  }, []);

  // Add refresh button functionality
  const handleRefresh = () => {
    fetchDashboardData();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading && stats.totalEvents === 0) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" color="accent" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <motion.h1 
            className="text-3xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Admin Dashboard
          </motion.h1>
          
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors flex items-center gap-2 border border-white/10"
            disabled={loading}
          >
            {loading ? (
              <>
                <LoadingSpinner size="small" color="white" />
                <span>Refreshing...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </>
            )}
          </button>
        </div>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/40 text-white px-4 py-3 rounded-lg mb-6">
            {error}
            <button 
              className="ml-4 underline text-white/80 hover:text-white"
              onClick={fetchDashboardData}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Events */}
          <motion.div 
            className="card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center">
              <div className="bg-secondary/20 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-white/70">Total Events</h2>
                <p className="text-2xl font-semibold text-white">{stats.totalEvents}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/admin/events" className="text-secondary hover:text-secondary/80 text-sm font-medium">
                View all events →
              </Link>
            </div>
          </motion.div>

          {/* Total Bookings */}
          <motion.div 
            className="card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center">
              <div className="bg-accent/20 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-white/70">Total Bookings</h2>
                <p className="text-2xl font-semibold text-white">{stats.totalBookings}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/admin/bookings" className="text-accent hover:text-accent/80 text-sm font-medium">
                View all bookings →
              </Link>
            </div>
          </motion.div>

          {/* Total Messages */}
          <motion.div 
            className="card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex items-center">
              <div className="bg-purple-500/20 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-white/70">Total Messages</h2>
                <p className="text-2xl font-semibold text-white">{stats.totalMessages}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/admin/messages" className="text-purple-500 hover:text-purple-400 text-sm font-medium">
                View all messages →
              </Link>
            </div>
          </motion.div>

          {/* New Messages */}
          <motion.div 
            className="card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="flex items-center">
              <div className="bg-pink-500/20 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-white/70">New Messages</h2>
                <p className="text-2xl font-semibold text-white">{stats.newMessages}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/admin/messages" className="text-pink-500 hover:text-pink-400 text-sm font-medium">
                View unread messages →
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Bookings */}
          <motion.div 
            className="card overflow-hidden lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">Recent Bookings</h3>
            </div>
            <div className="divide-y divide-white/10">
              {stats.recentBookings.length > 0 ? (
                stats.recentBookings.map((booking) => (
                  <div key={booking.id} className="p-4 hover:bg-white/5 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-white">Booking #{booking.id}</h4>
                        <p className="text-sm text-white/70">
                          {booking.event_type} • {booking.contact_email}
                        </p>
                        <div className="mt-1 flex items-center">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            booking.status === 'confirmed' 
                              ? 'bg-green-500/20 text-green-400' 
                              : booking.status === 'cancelled'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {booking.status ? (booking.status.charAt(0).toUpperCase() + booking.status.slice(1)) : 'Pending'}
                          </span>
                          {booking.guest_count && (
                            <span className="ml-2 text-xs text-white/50">
                              {booking.guest_count} {booking.guest_count === 1 ? 'guest' : 'guests'}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-white/50">{formatDate(booking.created_at || '')}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-white/50">No recent bookings</div>
              )}
            </div>
            <div className="p-4 bg-white/5 border-t border-white/10">
              <Link to="/admin/bookings" className="text-secondary hover:text-secondary/80 text-sm font-medium">
                View all bookings →
              </Link>
            </div>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div 
            className="card overflow-hidden lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">Upcoming Events</h3>
            </div>
            <div className="p-4">
              <UpcomingEvents limit={5} />
            </div>
            <div className="p-4 bg-white/5 border-t border-white/10">
              <Link to="/admin/events" className="text-secondary hover:text-secondary/80 text-sm font-medium">
                View all events →
              </Link>
            </div>
          </motion.div>

          {/* Recent Messages */}
          <motion.div 
            className="card overflow-hidden lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">Recent Messages</h3>
            </div>
            <div className="divide-y divide-white/10">
              {stats.recentMessages.length > 0 ? (
                stats.recentMessages.map((message) => (
                  <div key={message.id} className="p-4 hover:bg-white/5 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-white">{message.name}</h4>
                        <p className="text-sm text-white/70">{message.email}</p>
                        <p className="text-sm text-white/50 mt-1 line-clamp-1">{message.message}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-white/50">{formatDate(message.created_at)}</span>
                        {!message.responded && (
                          <span className="mt-1 px-2 py-1 bg-accent/20 text-accent text-xs rounded-full">New</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-white/50">No recent messages</div>
              )}
            </div>
            <div className="p-4 bg-white/5 border-t border-white/10">
              <Link to="/admin/messages" className="text-accent hover:text-accent/80 text-sm font-medium">
                View all messages →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard; 