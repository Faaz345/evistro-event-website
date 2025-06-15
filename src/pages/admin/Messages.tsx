import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { motion } from 'framer-motion';

type Message = {
  id: number;
  created_at: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  responded: boolean;
};

const MessagesPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate('/login');
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('contacts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setMessages(data || []);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Mark as responded
  const handleMarkResponded = async (id: number) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ responded: true })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, responded: true } : msg
      ));
      
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, responded: true });
      }
    } catch (err) {
      console.error('Error updating message:', err);
      setError('Failed to update message status.');
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <AdminLayout>
      <motion.div 
        className="p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.h1 
          className="text-3xl font-bold mb-6 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Contact Messages
        </motion.h1>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/40 text-white px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="large" color="accent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Messages List */}
            <motion.div 
              className="card overflow-hidden lg:col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="p-4 border-b border-white/10">
                <h2 className="font-semibold text-xl text-white">Messages ({messages.length})</h2>
              </div>
              
              <div className="overflow-y-auto" style={{ maxHeight: '70vh' }}>
                {messages.length === 0 ? (
                  <div className="p-6 text-center text-white/50">
                    No messages found
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {messages.map((msg) => (
                      <div 
                        key={msg.id}
                        className={`p-4 cursor-pointer transition-colors ${
                          selectedMessage?.id === msg.id 
                            ? 'bg-white/10' 
                            : 'hover:bg-white/5'
                        } ${!msg.responded ? 'border-l-4 border-accent' : ''}`}
                        onClick={() => setSelectedMessage(msg)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-white truncate">{msg.name}</p>
                            <p className="text-sm text-white/70 truncate">{msg.subject || 'No subject'}</p>
                          </div>
                          <span className="text-xs text-white/50">
                            {formatDate(msg.created_at).split(',')[0]}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-white/50 truncate">{msg.email}</p>
                        {!msg.responded && (
                          <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-accent/20 text-accent">
                            New
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Message Detail */}
            <motion.div 
              className="card lg:col-span-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {selectedMessage ? (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        {selectedMessage.subject || 'No subject'}
                      </h2>
                      <p className="text-white/70">
                        From: {selectedMessage.name} ({selectedMessage.email})
                      </p>
                      <p className="text-white/50 text-sm mt-1">
                        {formatDate(selectedMessage.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span 
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          selectedMessage.responded
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-accent/20 text-accent'
                        }`}
                      >
                        {selectedMessage.responded ? 'Responded' : 'New'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                    <p className="whitespace-pre-wrap text-white/90">{selectedMessage.message}</p>
                  </div>
                  
                  <div className="mt-8 flex flex-wrap gap-4">
                    <a 
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${selectedMessage.email}&su=Re: ${selectedMessage.subject || 'Your message to EviStro'}&from=evistroevents@gmail.com`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-gradient-to-r from-secondary to-accent text-white rounded-md hover:opacity-90 transition-opacity"
                    >
                      Reply via Gmail
                    </a>
                    
                    {!selectedMessage.responded && (
                      <button
                        onClick={() => handleMarkResponded(selectedMessage.id)}
                        className="px-5 py-2.5 bg-white/10 border border-white/20 text-white rounded-md hover:bg-white/20 transition-colors"
                      >
                        Mark as Responded
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-6 text-white/50">
                  <p>Select a message to view details</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
};

export default MessagesPage; 