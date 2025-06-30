import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AlertMessage from './AlertMessage';

const AccountSettings: React.FC = () => {
  const { user, deleteAccount } = useAuth();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleDeleteRequest = async () => {
    setIsDeleting(true);
    setError(null);
    
    try {
      const { error: deleteError } = await deleteAccount();
      
      if (deleteError) {
        setError(deleteError.message);
      } else {
        setSuccess('Your account has been successfully deleted.');
        // Redirect happens automatically due to auth state change
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Delete account error:', err);
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Account Settings</h2>
      
      {error && <AlertMessage type="error" message={error} />}
      {success && <AlertMessage type="success" message={success} />}
      
      <div className="mb-4">
        <p className="text-gray-600 dark:text-gray-300"><strong>Email:</strong> {user?.email}</p>
      </div>

      <div className="border-t pt-4 mt-4">
        <h3 className="text-xl font-medium mb-2 text-red-600 dark:text-red-400">Danger Zone</h3>
        
        <button
          onClick={() => setIsConfirmOpen(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete Account'}
        </button>
      </div>

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">Confirm Account Deletion</h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRequest}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings; 