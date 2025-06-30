// Admin script to process account deletion requests (CommonJS version)
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
  
  try {
    // Also log to file (with error handling)
    fs.appendFileSync('deletion_log.txt', logMessage + '\n');
  } catch (err) {
    console.error(`Could not write to log file: ${err.message}`);
  }
}

// Check if deletion_requests table exists
async function checkSetup() {
  log('Checking database setup...');
  
  try {
    // Try to get the count of deletion requests
    const { error } = await supabaseAdmin
      .from('deletion_requests')
      .select('id', { count: 'exact', head: true });
      
    if (error) {
      if (error.code === '42P01') {  // undefined_table error
        log('ERROR: Table deletion_requests does not exist');
        log('Please run the complete_user_deletion.sql script in the Supabase SQL Editor first');
        return false;
      } else {
        log(`Database error: ${error.message}`);
        return false;
      }
    }
    
    log('Database setup looks good');
    return true;
  } catch (err) {
    log(`Setup check error: ${err.message}`);
    return false;
  }
}

// Main function to process deletion requests
async function processDeletionRequests() {
  try {
    log('Starting account deletion processing...');
    
    // First check if everything is set up correctly
    const isSetupOk = await checkSetup();
    if (!isSetupOk) {
      log('Aborting due to setup issues');
      return;
    }
    
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
    
    log(`Found ${requests ? requests.length : 0} deletion requests to process`);
    
    if (!requests || requests.length === 0) {
      log('No pending deletion requests to process');
      return;
    }
    
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