// Admin script to process account deletion requests
// This script will completely remove users from Supabase auth

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');

// Load environment variables from .env file
dotenv.config();

// Check if environment variables are available
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing environment variables');
  console.error('Please create a .env file with SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  console.error('Example:');
  console.error('SUPABASE_URL=https://your-project-id.supabase.co');
  console.error('SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  process.exit(1);
}

// Create Supabase client with service role key
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Function to log to both console and file
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${message}`;
  console.log(logMessage);
  
  // Also log to file
  fs.appendFileSync('deletion_log.txt', logMessage + '\n');
}

// Main function to process deletion requests
async function processDeletionRequests() {
  try {
    log('Starting account deletion processing...');
    
    // Get all unprocessed deletion requests
    const { data: requests, error: fetchError } = await supabaseAdmin
      .from('deletion_requests')
      .select('*')
      .eq('processed', false)
      .order('requested_at', { ascending: true });
    
    if (fetchError) {
      log(`Error fetching deletion requests: ${fetchError.message}`);
      return;
    }
    
    log(`Found ${requests.length} deletion requests to process`);
    
    // Process each request
    for (const request of requests) {
      try {
        log(`Processing deletion for user: ${request.user_id} (${request.user_email})`);
        
        // Delete the user from auth.users using the admin API
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
          request.user_id
        );
        
        if (deleteError) {
          log(`Error deleting user ${request.user_id}: ${deleteError.message}`);
          continue;
        }
        
        // Mark the request as processed
        const { error: updateError } = await supabaseAdmin
          .from('deletion_requests')
          .update({ 
            processed: true,
            processed_at: new Date().toISOString()
          })
          .eq('id', request.id);
          
        if (updateError) {
          log(`Error updating request status: ${updateError.message}`);
          continue;
        }
        
        log(`Successfully deleted user: ${request.user_id} (${request.user_email})`);
      } catch (err) {
        log(`Error processing user ${request.user_id}: ${err.message}`);
      }
    }
    
    log('Finished processing deletion requests');
    
  } catch (error) {
    log(`Fatal error: ${error.message}`);
  }
}

// Run the script
processDeletionRequests().catch(err => {
  log(`Unhandled error: ${err.message}`);
  process.exit(1);
}); 