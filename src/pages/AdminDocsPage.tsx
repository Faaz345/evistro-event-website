import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const AdminDocsPage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">
            <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              Admin Documentation
            </span>
          </h1>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-white">Getting Admin Access</h2>
            
            <div className="space-y-6 text-white/80">
              <p>
                Admin access to the EviStro platform is restricted to authorized personnel only. 
                This ensures the security and integrity of our event management system.
              </p>

              <h3 className="text-xl font-medium text-white mt-8 mb-4">How to Request Admin Access</h3>
              
              <ol className="list-decimal list-inside space-y-3">
                <li>
                  <span className="font-medium text-white">Create a regular user account</span> - 
                  First, register as a regular user through the main login page.
                </li>
                <li>
                  <span className="font-medium text-white">Contact the Super Admin</span> - 
                  Reach out to the platform's super admin with your account details and reason for needing admin access.
                </li>
                <li>
                  <span className="font-medium text-white">Verification</span> - 
                  The super admin will verify your identity and need for admin privileges.
                </li>
                <li>
                  <span className="font-medium text-white">Admin Privileges</span> - 
                  If approved, your account will be granted admin privileges.
                </li>
              </ol>

              <div className="bg-blue-500/20 border border-blue-500/40 rounded-lg p-4 mt-6">
                <h4 className="font-medium text-white mb-2">Note:</h4>
                <p>
                  Admin accounts can only be created by existing super admins. This is a security measure
                  to protect the platform and its users' data.
                </p>
              </div>

              <h3 className="text-xl font-medium text-white mt-8 mb-4">Admin Features</h3>
              
              <ul className="list-disc list-inside space-y-2">
                <li>Manage all events on the platform</li>
                <li>View and respond to user messages</li>
                <li>Process and manage event bookings</li>
                <li>Access platform analytics and reports</li>
                <li>Manage user accounts (super admin only)</li>
              </ul>

              <div className="mt-8 text-center">
                <Link
                  to="/login"
                  className="inline-block bg-gradient-to-r from-secondary to-accent text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Return to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDocsPage; 