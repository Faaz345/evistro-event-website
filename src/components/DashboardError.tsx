import { motion } from 'framer-motion';

type DashboardErrorProps = {
  message: string;
};

const DashboardError = ({ message }: DashboardErrorProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-500/20 border border-red-500/50 p-6 rounded-lg mb-8"
    >
      <h3 className="text-xl font-bold mb-2 text-red-400">An error occurred</h3>
      <p className="mb-4 text-white/80">{message}</p>
      
      <div className="bg-black/30 p-4 rounded-md">
        <h4 className="font-medium mb-2 text-white">Database Setup Required</h4>
        <p className="text-white/70 text-sm mb-3">
          It looks like the Supabase tables haven't been created yet. Please follow these steps:
        </p>
        <ol className="list-decimal list-inside text-sm text-white/70 space-y-2">
          <li>Log in to your Supabase dashboard at <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="text-accent underline">https://app.supabase.com</a></li>
          <li>Select your project: <span className="font-mono bg-black/50 px-2 py-0.5 rounded">xiudkintsxvqtowiggpq</span></li>
          <li>Navigate to the SQL Editor</li>
          <li>Copy the SQL from <span className="font-mono bg-black/50 px-2 py-0.5 rounded">src/lib/supabase.sql</span> in this project</li>
          <li>Paste and run the SQL to create the required tables</li>
          <li>Refresh this page</li>
        </ol>
      </div>
    </motion.div>
  );
};

export default DashboardError; 