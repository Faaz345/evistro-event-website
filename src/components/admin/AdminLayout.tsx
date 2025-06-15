import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../LoadingSpinner';
import { motion } from 'framer-motion';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (!data.session) {
          navigate('/login', { state: { from: location.pathname } });
          return;
        }
        
        setUser(data.session.user);
      } catch (error) {
        console.error('Authentication error:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate, location.pathname]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-primary">
        <LoadingSpinner size="large" color="accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary text-white">
      {/* Background pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <img src="/src/assets/images/bg-pattern.svg" alt="Background Pattern" className="w-full h-full object-cover" />
      </div>

      {/* Admin Header */}
      <header className="bg-primary/80 backdrop-blur-sm shadow-lg border-b border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/admin" className="text-2xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                EviStro Admin
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-white/70">
                {user?.email}
              </div>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors text-sm border border-white/10"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Navigation */}
      <div className="bg-primary/50 backdrop-blur-sm border-b border-white/10 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
          <nav className="flex space-x-2 overflow-x-auto scrollbar-hide">
            <Link
              to="/admin"
              className={`px-4 py-3 rounded-md text-sm font-medium transition-all ${
                location.pathname === '/admin'
                  ? 'bg-gradient-to-r from-secondary to-accent text-white shadow-neon'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/admin/events"
              className={`px-4 py-3 rounded-md text-sm font-medium transition-all ${
                location.pathname === '/admin/events'
                  ? 'bg-gradient-to-r from-secondary to-accent text-white shadow-neon'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Events
            </Link>
            <Link
              to="/admin/bookings"
              className={`px-4 py-3 rounded-md text-sm font-medium transition-all ${
                location.pathname === '/admin/bookings'
                  ? 'bg-gradient-to-r from-secondary to-accent text-white shadow-neon'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Bookings
            </Link>
            <Link
              to="/admin/messages"
              className={`px-4 py-3 rounded-md text-sm font-medium transition-all ${
                location.pathname === '/admin/messages'
                  ? 'bg-gradient-to-r from-secondary to-accent text-white shadow-neon'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Messages
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default AdminLayout; 