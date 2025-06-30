# Account Deletion Setup Guide

This guide explains how to properly set up account deletion in your EviStro application.

## The Problem

The current implementation of account deletion in the application doesn't actually delete the user from Supabase auth - it only marks the user as "deleted" in metadata and removes associated data. This leads to orphaned user accounts in the Supabase auth system.

## The Solution

We've implemented a comprehensive account deletion system with three approaches:

1. **Client-side deletion**: Removes user data from tables
2. **Server-side API endpoint**: Handles user deletion with admin privileges
3. **Supabase Edge Function**: Alternative method using Supabase Functions

## Implementation Steps

### Step 1: Deploy the Supabase Edge Function

1. Make sure you have the Supabase CLI installed:
   ```bash
   npm install -g supabase
   ```

2. Log in to Supabase CLI:
   ```bash
   supabase login
   ```

3. Link your project (if not already linked):
   ```bash
   supabase link --project-ref xiudkintsxvqtowiggpq
   ```

4. Deploy the Edge Function:
   ```bash
   supabase functions deploy delete-user
   ```

### Step 2: Set Up the Server-Side API Endpoint

If you're using Vercel, Next.js, or another serverless provider:

1. Create an API route at `/api/delete-account`
2. Copy the implementation from `src/api/delete-account.ts`
3. Ensure you set the following environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` (keep this secure, never expose it to the client)

### Step 3: Test the Account Deletion Flow

1. Log in to your application
2. Navigate to Account Settings
3. Try to delete your account
4. Verify that:
   - All user data is removed from tables
   - The user is actually deleted from Supabase Auth (check in the Supabase dashboard)

## Security Considerations

- Never expose the Supabase service role key in client-side code
- Always verify user identity before allowing account deletion
- Add additional confirmation steps for sensitive operations

## Troubleshooting

If account deletion is still not working:

1. Check the browser console for errors
2. Look at server logs for the API endpoint
3. Verify that Supabase Edge Function is deployed correctly
4. Check that environment variables are set correctly

If the Supabase Edge Function and API endpoint aren't accessible, the code will fall back to marking the user as "deleted" in metadata, which is not a true deletion but prevents the user from accessing the account. 