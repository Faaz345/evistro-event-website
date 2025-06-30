// Debug script for account deletion
// Simplified version to diagnose issues

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Debug environment variables
console.log('Checking environment variables:');
console.log('- SUPABASE_URL exists:', Boolean(process.env.SUPABASE_URL));
console.log('- SUPABASE_SERVICE_ROLE_KEY exists:', Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY));

// Show partial values for verification (without exposing full keys)
if (process.env.SUPABASE_URL) {
  console.log('- SUPABASE_URL starts with:', process.env.SUPABASE_URL.substring(0, 12) + '...');
}
if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
  const keyStart = process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 10);
  const keyEnd = process.env.SUPABASE_SERVICE_ROLE_KEY.substring(process.env.SUPABASE_SERVICE_ROLE_KEY.length - 5);
  console.log('- SUPABASE_SERVICE_ROLE_KEY pattern:', `${keyStart}...${keyEnd}`);
}

// If any variables are missing, exit
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('\nError: Missing environment variables');
  console.error('Make sure your .env file has:');
  console.error('SUPABASE_URL=https://your-project-id.supabase.co');
  console.error('SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  process.exit(1);
}

// Try creating the Supabase client
try {
  console.log('\nAttempting to create Supabase client...');
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL, 
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
  console.log('Supabase client created successfully');

  // Test a simple query
  console.log('\nTesting database connection...');
  supabaseAdmin
    .from('deletion_requests')
    .select('count(*)', { count: 'exact' })
    .then(({ count, error }) => {
      if (error) {
        console.error('Database query error:', error.message);
      } else {
        console.log('Connection successful! Found', count, 'deletion requests');
      }
    })
    .catch(err => {
      console.error('Connection error:', err.message);
    });
} catch (err) {
  console.error('\nError creating Supabase client:', err.message);
}

// Show example command for reference
console.log('\nIf all checks pass, you can run the full script with:');
console.log('node admin_process_deletions.js'); 