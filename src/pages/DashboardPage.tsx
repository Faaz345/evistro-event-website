import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useEventRegistrations } from '../hooks/useEventRegistrations';
import EventRegistrationForm from '../components/EventRegistrationForm';
import EventRegistrationsList from '../components/EventRegistrationsList';
import LoadingSpinner from '../components/LoadingSpinner';
import DashboardError from '../components/DashboardError';
import AccountSettings from '../components/AccountSettings';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'registrations' | 'new' | 'account'>('registrations');
  const { 
    registrations, 
    loading, 
    error, 
    createRegistration, 
    cancelRegistration,
    refreshRegistrations
  } = useEventRegistrations();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <Layout>
      <div className="min-h-screen bg-primary pt-24 pb-16 relative z-10">
        <div className="container relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-20"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-white">My Dashboard</h1>
                <p className="text-white/80">
                  Manage your event registrations and account settings
                </p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <div className="bg-white/15 backdrop-blur-md rounded-lg p-1 flex flex-wrap shadow-md">
                  <button
                    className={`px-4 py-2 rounded-md transition-all ${
                      activeTab === 'registrations'
                        ? 'bg-accent text-white shadow-lg'
                        : 'text-white/80 hover:text-white'
                    }`}
                    onClick={() => setActiveTab('registrations')}
                  >
                    My Registrations
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md transition-all ${
                      activeTab === 'new'
                        ? 'bg-accent text-white shadow-lg'
                        : 'text-white/80 hover:text-white'
                    }`}
                    onClick={() => setActiveTab('new')}
                  >
                    Register New Event
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md transition-all ${
                      activeTab === 'account'
                        ? 'bg-accent text-white shadow-lg'
                        : 'text-white/80 hover:text-white'
                    }`}
                    onClick={() => setActiveTab('account')}
                  >
                    Account
                  </button>
                </div>
              </div>
            </div>
            
            {error && <DashboardError message={error} />}
            
            <div className="relative z-20">
              {activeTab === 'registrations' ? (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-white">My Event Registrations</h2>
                    <button
                      onClick={refreshRegistrations}
                      className="btn-outline btn-sm"
                      disabled={loading}
                    >
                      {loading ? <LoadingSpinner size="small" color="white" /> : 'Refresh'}
                    </button>
                  </div>
                  
                  <EventRegistrationsList
                    registrations={registrations}
                    loading={loading}
                    onCancel={cancelRegistration}
                  />
                </div>
              ) : activeTab === 'new' ? (
                <div>
                  <h2 className="text-2xl font-semibold mb-6 text-white">Register for a New Event</h2>
                  
                  <EventRegistrationForm
                    onSubmit={createRegistration}
                    onSuccess={() => {
                      setActiveTab('registrations');
                      refreshRegistrations();
                    }}
                  />
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-semibold mb-6 text-white">Account Settings</h2>
                  <AccountSettings />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage; 