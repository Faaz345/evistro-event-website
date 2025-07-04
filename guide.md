# Deployment Guide for Supabase Edge Functions

## Overview

This guide will help you deploy the `delete-user` Edge Function to your Supabase project to fix the "Failed to send a request to the Edge Function" error.

## Prerequisites

1. Install Supabase CLI
2. Login to Supabase

## Steps to Deploy

1. Deploy the Edge Function:
   ```bash
   supabase functions deploy delete-user
   ```

2. Set environment variables:
   ```bash
   supabase secrets set SUPABASE_URL=https://xiudkintsxvqtowiggpq.supabase.co
   supabase secrets set SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. Make sure the client-side code is correctly calling the function:
   ```javascript
   const { data, error } = await supabase.functions.invoke('delete-user', {
     method: 'DELETE',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${token}`
     },
     body: { userId: user.id }
   });
   ```

## Troubleshooting

If you still encounter errors:
1. Check function logs: `supabase functions logs delete-user`
2. Verify CORS settings
3. Ensure your Auth token is being passed correctly

For more details, see the [Supabase Edge Functions documentation](https://supabase.com/docs/guides/functions).
