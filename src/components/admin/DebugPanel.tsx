import { useState } from 'react';
import { supabase } from '../../lib/supabase';

const DebugPanel = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Test connection to Supabase
      const { data, error } = await supabase.from('event_registrations').select('count').limit(1);
      
      if (error) throw error;
      
      setResult({
        connection: 'Success',
        data
      });
    } catch (err) {
      console.error('Connection test failed:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setResult({
        connection: 'Failed'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestRegistrations = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Fetch latest registrations
      const { data, error } = await supabase
        .from('event_registrations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      setResult({
        registrations: data
      });
    } catch (err) {
      console.error('Failed to fetch registrations:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const checkRLSPolicies = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('No authenticated user found');
        return;
      }
      
      setResult({
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      });
    } catch (err) {
      console.error('Failed to check RLS policies:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Debug Panel</h2>
      
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={testConnection}
          className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-md hover:bg-blue-500/30 transition-colors"
          disabled={loading}
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
        
        <button
          onClick={fetchLatestRegistrations}
          className="px-4 py-2 bg-green-500/20 text-green-400 rounded-md hover:bg-green-500/30 transition-colors"
          disabled={loading}
        >
          {loading ? 'Fetching...' : 'Fetch Latest Registrations'}
        </button>
        
        <button
          onClick={checkRLSPolicies}
          className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-md hover:bg-purple-500/30 transition-colors"
          disabled={loading}
        >
          {loading ? 'Checking...' : 'Check User & Permissions'}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500/40 text-white px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      {result && (
        <div className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
          <pre className="text-white/80 text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DebugPanel; 