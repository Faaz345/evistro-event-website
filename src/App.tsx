import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import React from 'react';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

// Components
import LoadingSpinner from './components/LoadingSpinner';

// API
import { checkAdminStatus } from './api/check-admin';

// Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const EventDetailPage = lazy(() => import('./pages/EventDetailPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const AdminDocsPage = lazy(() => import('./pages/AdminDocsPage'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminMessagesPage = lazy(() => import('./pages/admin/Messages'));
const AdminEventsPage = lazy(() => import('./pages/admin/Events'));
const AdminBookingsPage = lazy(() => import('./pages/admin/Bookings'));
const CreateEventPage = lazy(() => import('./pages/admin/CreateEvent'));
const EditEventPage = lazy(() => import('./pages/admin/EditEvent'));

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <LoadingSpinner size="large" text="Authenticating..." />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Admin route component (checks if user is an admin)
const AdminRoute = ({ children }: { children: React.ReactElement }) => {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);
  const [checkingAdmin, setCheckingAdmin] = React.useState(true);
  
  React.useEffect(() => {
    const verifyAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setCheckingAdmin(false);
        return;
      }
      
      try {
        const { isAdmin } = await checkAdminStatus(user.id);
        setIsAdmin(isAdmin);
      } catch (err) {
        console.error('Error checking admin status:', err);
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
      }
    };
    
    if (user && !loading) {
      verifyAdminStatus();
    } else if (!loading) {
      setIsAdmin(false);
      setCheckingAdmin(false);
    }
  }, [user, loading]);
  
  if (loading || checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <LoadingSpinner size="large" text="Verifying admin access..." />
      </div>
    );
  }
  
  if (!user || !isAdmin) {
    return <Navigate to="/login?admin=true" replace />;
  }
  
  return children;
};

// Public route component (redirects to home if already logged in)
const PublicRoute = ({ children }: { children: React.ReactElement }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <LoadingSpinner size="large" text="Loading..." />
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/home" replace />;
  }
  
  return children;
};

function AppRoutes() {
  return (
    <Router>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-primary">
            <LoadingSpinner size="large" text="Loading..." />
          </div>
        }
      >
        <Routes>
          {/* Login is the default route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-docs" element={<AdminDocsPage />} />
          
          {/* Protected routes */}
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/contact" element={<ContactPage />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/messages" element={<AdminRoute><AdminMessagesPage /></AdminRoute>} />
          <Route path="/admin/events" element={<AdminRoute><AdminEventsPage /></AdminRoute>} />
          <Route path="/admin/create-event" element={<AdminRoute><CreateEventPage /></AdminRoute>} />
          <Route path="/admin/edit-event/:id" element={<AdminRoute><EditEventPage /></AdminRoute>} />
          <Route path="/admin/bookings" element={<AdminRoute><AdminBookingsPage /></AdminRoute>} />
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
