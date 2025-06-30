import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ParticleBg from '../components/ParticleBg';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginType, setLoginType] = useState<'user' | 'admin'>('user');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check for admin parameter in URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('admin') === 'true') {
      setLoginType('admin');
      setIsLogin(true);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        
        // Navigate based on login type
        if (loginType === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/home');
        }
      } else {
        // Only allow user registration, not admin
        if (loginType === 'admin') {
          throw new Error('Admin accounts can only be created by super admins');
        }
        
        const { error } = await signUp(email, password);
        if (error) throw error;
        setIsLogin(true);
        setError('Account created. Please check your email for verification.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginTypeChange = (type: 'user' | 'admin') => {
    setLoginType(type);
    setError(null);
    
    // If switching to admin, ensure we're in login mode, not signup
    if (type === 'admin' && !isLogin) {
      setIsLogin(true);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <ParticleBg color="#7000FF" particleCount={150} speed={0.0008} />
      
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/80 to-primary" />
      
      <motion.div 
        className="w-full max-w-md z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="card p-8 backdrop-blur-lg">
          <div className="text-center mb-8">
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-3xl font-extrabold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent"
            >
              {isLogin ? (loginType === 'admin' ? 'Admin Access' : 'Sign In') : 'Create Account'}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="mt-2 text-sm text-white/70"
            >
              {loginType === 'admin' 
                ? 'Restricted area. Authorized personnel only.' 
                : isLogin ? 'Welcome back to EviStro' : 'Join the EviStro community'}
            </motion.p>
          </div>

          {/* Login Type Selector */}
          <div className="flex justify-center mb-6">
            <div className="bg-white/5 backdrop-blur-sm p-1 rounded-lg flex">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  loginType === 'user'
                    ? 'bg-gradient-to-r from-secondary to-accent text-white shadow-lg'
                    : 'text-white/70 hover:text-white'
                }`}
                onClick={() => handleLoginTypeChange('user')}
              >
                User Login
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  loginType === 'admin'
                    ? 'bg-gradient-to-r from-secondary to-accent text-white shadow-lg'
                    : 'text-white/70 hover:text-white'
                }`}
                onClick={() => handleLoginTypeChange('admin')}
              >
                Admin Login
              </button>
            </div>
          </div>

          {loginType === 'admin' && (
            <div className="mb-6 p-3 rounded-md bg-blue-500/20 border border-blue-500/50 text-sm text-center">
              Admin access is restricted to authorized personnel only
            </div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-md bg-red-500/20 border border-red-500/50 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                {loginType === 'admin' ? 'Admin Email' : 'Email'}
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder={loginType === 'admin' ? 'admin@example.com' : 'you@example.com'}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input pr-10"
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white/90 transition-colors"
                  onClick={toggleShowPassword}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="text-right">
                <a href="#forgot" className="text-sm text-accent hover:underline">
                  Forgot password?
                </a>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="btn-primary w-full flex justify-center"
                disabled={loading}
              >
                {loading ? (
                  <LoadingSpinner size="small" color="white" />
                ) : (
                  isLogin 
                    ? `Sign In as ${loginType === 'admin' ? 'Admin' : 'User'}` 
                    : 'Sign Up'
                )}
              </button>
            </div>
          </form>

          {/* Only show account creation option for user login */}
          {loginType === 'user' && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white/5 backdrop-blur-sm rounded-md">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="btn-outline w-full"
                  disabled={loading}
                >
                  {isLogin ? 'Create Account' : 'Sign In'}
                </button>
              </div>
            </div>
          )}
          
          {/* Admin documentation link */}
          {loginType === 'admin' && (
            <div className="mt-6 text-center">
              <p className="text-xs text-white/50">
                Need admin access? Contact the super admin or refer to the{' '}
                <Link to="/admin-docs" className="text-accent hover:underline">
                  admin documentation
                </Link>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage; 