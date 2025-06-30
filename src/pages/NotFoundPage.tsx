import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';

const NotFoundPage = () => {
  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center py-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg"
        >
          <h1 className="text-8xl font-bold text-white mb-4">404</h1>
          
          <h2 className="text-3xl font-semibold mb-6">
            <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              Page Not Found
            </span>
          </h2>
          
          <p className="text-white/70 mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          
          <Link to="/home" className="btn-primary">
            Back to Homepage
          </Link>
        </motion.div>
      </div>
    </Layout>
  );
};

export default NotFoundPage; 