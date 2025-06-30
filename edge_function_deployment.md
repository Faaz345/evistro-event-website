# Immediate Account Deletion - Edge Function Deployment Guide

This guide will help you deploy the `immediate-delete` Edge Function to Supabase for instant account deletion.

## Prerequisites

1. Supabase CLI installed
   ```bash
   npm install -g supabase
   ```

2. Logged in to Supabase CLI
   ```bash
   supabase login
   ```

## Deployment Steps

1. **Create the deno.json configuration file**:

   Create a file at `supabase/functions/immediate-delete/deno.json` with this content:
   ```json
   {
     "tasks": {
       "serve": "deno run --allow-net --allow-env index.ts"
     },
     "imports": {
       "std/": "https://deno.land/std@0.177.0/",
       "supabase": "https://esm.sh/@supabase/supabase-js@2.50.0"
     }
   }
   ```

2. **Deploy the Edge Function**:

   Run this command from your project root:
   ```bash
   supabase functions deploy immediate-delete --project-ref YOUR_PROJECT_REF
   ```
   Replace `YOUR_PROJECT_REF` with your Supabase project reference ID (found in your project URL).

3. **Set Environment Variables**:

   In the Supabase Dashboard:
   - Go to Project Settings > API
   - Copy your Service Role key
   - Go to Edge Functions > immediate-delete
   - Add these environment variables:
     - `SUPABASE_URL`: Your project URL (https://your-project-id.supabase.co)
     - `SUPABASE_SERVICE_ROLE_KEY`: Your service role key
     - `SUPABASE_ANON_KEY`: Your anon/public key

## Testing

To verify the function is working:

1. Log in to your app
2. Click the Delete Account button
3. The account should be immediately deleted (check Supabase Auth > Users)

## Troubleshooting

If you encounter issues:

1. **Check Edge Function logs**:
   - In Supabase Dashboard, go to Edge Functions > immediate-delete > Logs
   - Look for any error messages

2. **Verify environment variables**:
   - Make sure all environment variables are set correctly
   - The service role key should start with "eyJhbGciOiJIUzI1NiIsInR5c..."

3. **CORS issues**:
   - In Project Settings > API > CORS, make sure your frontend domain is allowed

4. **Function invocation errors**:
   - Check that your AuthContext.tsx is correctly calling the function
   - Ensure the user's JWT token is being passed in the Authorization header

## Fallback Mechanism

Your implementation includes a fallback to the request_account_deletion() function if the Edge Function fails. This ensures account deletion will work even if there are temporary issues with the Edge Function. 