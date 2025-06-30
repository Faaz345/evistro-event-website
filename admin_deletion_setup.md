# Complete User Deletion System Guide

This guide explains how to set up and use the complete user deletion system, which allows users to be fully removed from your Supabase auth system so their emails can be reused.

## The Problem

Supabase doesn't allow regular database functions to completely delete users from `auth.users`. This requires service role access, which isn't available in standard RPC calls.

## The Solution

Our system uses a two-step process:
1. Users request account deletion through the application
2. An administrator processes these requests with service role access

## Setup Instructions

### Step 1: Set Up the Database

1. Go to your Supabase SQL Editor
2. Run the entire `complete_user_deletion.sql` script
3. This creates:
   - A `deletion_requests` table to track deletion requests
   - A `request_account_deletion()` function users can call
   - An `admin_process_deletion_requests()` function for admins
   - An `admin_deletion_commands` view for manual processing

### Step 2: Update the Application

1. Use the updated `AuthContext.tsx` file that calls the new RPC function
2. This version:
   - Removes user data from application tables
   - Creates a deletion request
   - Signs the user out

### Step 3: Set Up the Admin Processing Script

1. Create a file named `.env` in your project root with:
   ```
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

2. Install required dependencies:
   ```bash
   npm install @supabase/supabase-js dotenv
   ```

3. Run the admin script to process deletion requests:
   ```bash
   node admin_process_deletions.js
   ```

## How It Works

1. **User Side**:
   - User clicks "Delete Account"
   - App calls `request_account_deletion()` function
   - User data is deleted from application tables
   - Account deletion request is recorded
   - User is signed out

2. **Admin Side**:
   - Admin runs processing script periodically
   - Script uses service role key to access Supabase Admin API
   - Each user in the deletion queue is permanently deleted
   - Successful deletions are marked as processed

## Manual Processing (Alternative)

If you prefer to manually process deletions:

1. Run this query in SQL Editor to see pending requests:
   ```sql
   SELECT * FROM admin_deletion_commands;
   ```

2. Execute the curl commands shown in the results
   (Replace `{YOUR_PROJECT_ID}` and `{YOUR_SERVICE_ROLE_KEY}` with your actual values)

3. Mark requests as processed:
   ```sql
   SELECT * FROM admin_process_deletion_requests();
   ```

## Security Considerations

- Keep the service role key secure - never expose it in client-side code
- Only run the admin script on a secure system
- Consider setting up a scheduled job to automatically process deletions
- The admin script logs all actions to `deletion_log.txt`

## Troubleshooting

If users report issues with account deletion:

1. Check the deletion requests table:
   ```sql
   SELECT * FROM deletion_requests ORDER BY requested_at DESC;
   ```

2. If requests are marked processed but the user still exists, manually delete:
   ```bash
   curl -X DELETE "https://your-project-id.supabase.co/auth/v1/admin/users/USER_ID" \
     -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY"
   ```

3. Check console logs for any errors during the request process 