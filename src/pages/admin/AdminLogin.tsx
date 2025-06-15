import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Authenticate with Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // Handle authentication errors
        if (authError.message.includes('Invalid login')) {
          throw new Error('Invalid email or password. Please try again.');
        } else {
          throw authError;
        }
      }

      if (data.user) {
        // Check if user has admin role
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (adminError || !adminData) {
          // Not an admin, sign them out
          await supabase.auth.signOut();
          throw new Error(
            'This account does not have admin privileges. Please contact the super admin or refer to the admin documentation.'
          );
        }

        // Admin login successful
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      setError(err instanceof Error ? err.message : 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary pointer-events-none"></div>
      
      {/* Admin Logo/Badge */}
      <div className="relative z-10 mx-auto mb-8">
        <div className="flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-full">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 text-accent" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-md w-full mx-auto px-4"
      >
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/20">
          <div className="px-6 py-8 sm:px-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white">Admin Access</h2>
              <p className="mt-2 text-white/70">
                Restricted area. Authorized personnel only.
              </p>
            </div>

            {error && (
              <div className="mb-6 bg-red-500/20 border border-red-500/40 rounded-lg p-3 text-sm text-white">
                {error}
                {error.includes('admin privileges') && (
                  <div className="mt-2 text-xs">
                    <Link to="/admin-docs" className="text-accent hover:underline">
                      Learn how to get admin access →
                    </Link>
                  </div>
                )}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white">
                  Admin Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  {loading ? <LoadingSpinner size="small" color="white" /> : 'Sign In to Admin Panel'}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center space-y-4">
              <Link to="/login" className="text-white/70 hover:text-white text-sm transition-colors block">
                Return to main login
              </Link>
              
              <Link to="/admin-docs" className="text-accent hover:text-accent/80 text-sm transition-colors block">
                How to get admin access?
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="relative z-10 text-center mt-8 text-white/50 text-sm">
        EviStro Admin Portal &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default AdminLogin; 