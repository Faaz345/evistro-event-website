# Supabase User Deletion - Quick Fix Guide

## IMPORTANT: Follow these exact steps to fix account deletion

The issue is that user accounts aren't being properly deleted from Supabase Auth when clicking the delete button in your dashboard. This guide provides a quick fix solution.

## Step 1: Get Your Supabase Service Role Key

1. Go to your Supabase Dashboard: https://app.supabase.com/project/xiudkintsxvqtowiggpq
2. Click on "Project Settings" in the left sidebar
3. Click on "API" in the submenu
4. Under "Project API keys", find and copy the "service_role" key (begins with "eyJ...")

## Step 2: Run This SQL Function

1. Go to the SQL Editor in your Supabase Dashboard
2. Create a new query
3. Paste this code:

```sql
-- First, enable the HTTP extension
CREATE EXTENSION IF NOT EXISTS http;

-- Create the delete_user function
CREATE OR REPLACE FUNCTION delete_user()
RETURNS json AS $$
DECLARE
  current_user_id UUID;
BEGIN
  -- Get the current user's ID
  current_user_id := auth.uid();
  
  -- Check if user is authenticated
  IF current_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  -- Delete user data from tables
  DELETE FROM public.event_registrations WHERE user_id = current_user_id;
  
  -- Delete contacts data if exists
  DELETE FROM public.contacts 
  WHERE email = (SELECT email FROM auth.users WHERE id = current_user_id);
  
  -- Delete the user from Auth
  PERFORM 
    http_delete(
      'https://xiudkintsxvqtowiggpq.supabase.co/auth/v1/admin/users/' || current_user_id,
      '{}',
      'application/json',
      array[
        http_header('Authorization', 'Bearer PASTE_YOUR_SERVICE_ROLE_KEY_HERE')
      ]
    );
    
  RETURN json_build_object('success', true);
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

4. **IMPORTANT**: Replace `PASTE_YOUR_SERVICE_ROLE_KEY_HERE` with your actual service role key from Step 1
5. Click "Run" to create the function

## Step 3: Test the Delete Function

1. Log into your app with a test account
2. Open your browser's developer console (F12 or right-click → Inspect → Console)
3. Try deleting your account from the dashboard
4. Look at the console logs to see if there are any errors

## Common Problems & Solutions

### "Extension 'http' does not exist" Error

If you get this error when running the SQL:

1. Go to the SQL Editor in Supabase
2. Try running only: `CREATE EXTENSION IF NOT EXISTS http;`
3. If it fails, you'll need to contact Supabase support to enable the extension

### "Not enough permissions" Error 

If your console shows permission errors:

1. Double-check your service role key (not anon key)
2. Make sure you included `SECURITY DEFINER` in the function
3. Try the alternative approach below

## Alternative Quick Solution

If the SQL function isn't working, try this direct approach:

1. Go to Supabase Authentication → Users
2. Find the user you want to delete
3. Click the three dots menu (...)
4. Select "Delete user"

This will manually delete the user, but you'll still need to clean up their data in your tables. 