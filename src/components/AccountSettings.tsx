import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const AccountSettings = () => {
  const { user, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setError(null);
    
    try {
      const { error } = await deleteAccount();
      
      if (error) {
        setError(error.message);
        setIsDeleting(false);
      } else {
        // Redirect to home page after successful deletion
        navigate('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsDeleting(false);
    }
  };

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Your Account</h3>
        <div className="bg-white/5 p-4 rounded-md">
          <p className="text-sm text-white/70">Email</p>
          <p className="text-white">{user?.email}</p>
        </div>
      </div>
      
      <div className="border-t border-white/10 pt-6 mt-6">
        <h3 className="text-lg font-medium text-red-400 mb-2">Danger Zone</h3>
        <p className="text-sm text-white/70 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/40 text-white p-4 rounded-md mb-4">
            {error}
          </div>
        )}
        
        {!showConfirmation ? (
          <button
            className="btn-outline border-red-400 text-red-400 hover:bg-red-400/20"
            onClick={() => setShowConfirmation(true)}
          >
            Delete Account
          </button>
        ) : (
          <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-md">
            <p className="text-white mb-4">
              Are you sure you want to delete your account? All your data will be permanently removed.
              This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                className="btn-outline border-white/30 text-white/70 hover:bg-white/10"
                onClick={() => setShowConfirmation(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="btn bg-red-500 hover:bg-red-600 text-white"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <LoadingSpinner size="small" color="white" />
                ) : (
                  'Yes, Delete My Account'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSettings; 