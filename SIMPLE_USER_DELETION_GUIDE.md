# Simple User Deletion Guide for Event Website

This guide provides instructions for implementing a simpler, more reliable approach to user account deletion in your Supabase-powered Event Website.

## Overview

This simplified solution uses a single Supabase SQL function (`complete_delete_user()`) to handle all aspects of user deletion in one atomic operation.

The solution:
1. Deletes all user data from various tables
2. Marks the user as deleted in the auth.users table
3. Returns success/failure information

## Implementation Steps

### 1. Create the SQL Function in Supabase

1. Go to your Supabase Dashboard
2. Navigate to the SQL Editor
3. Create a new query
4. Copy and paste the contents of the `simple_delete_user.sql` file
5. Run the query

```sql
-- Simplified User Deletion Function
-- Run this in the Supabase SQL Editor

-- Create a simplified function that handles everything
CREATE OR REPLACE FUNCTION complete_delete_user()
RETURNS json AS $$
DECLARE
  current_user_id UUID;
  current_user_email TEXT;
BEGIN
  -- Get current user's ID
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  
  -- Get user email
  SELECT email INTO current_user_email FROM auth.users WHERE id = current_user_id;
  
  -- Delete all user data
  DELETE FROM public.event_registrations WHERE user_id = current_user_id;
  DELETE FROM public.bookings WHERE user_id = current_user_id;
  IF current_user_email IS NOT NULL THEN
    DELETE FROM public.contacts WHERE email = current_user_email;
  END IF;
  
  -- Flag user as deleted (so they can't log in anymore)
  UPDATE auth.users
  SET raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{deleted}', 'true'::jsonb)
  WHERE id = current_user_id;
  
  RETURN json_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION complete_delete_user() TO authenticated;
```

### 2. Update AuthContext.tsx

The `AuthContext.tsx` file has been updated to:
1. Use the simplified `complete_delete_user()` function
2. Handle errors appropriately
3. Sign out the user after successful deletion

### 3. Update AccountSettings.tsx

The `AccountSettings.tsx` component has been updated to:
1. Call the deleteAccount function from AuthContext
2. Display appropriate success/error messages
3. Provide a confirmation modal

## Testing

To test the user deletion:

1. Log in to your application
2. Go to Account Settings
3. Click "Delete Account"
4. Confirm the deletion
5. Verify that you're redirected to the login page
6. Try to log in again with the same credentials (should fail)

## Benefits of This Approach

1. **Simplicity**: Single function handles all deletion logic
2. **Reliability**: No Edge Functions or complex processing required
3. **Security**: Function is executed with SECURITY DEFINER to ensure proper permissions
4. **Consistency**: All operations happen in a single transaction

## Limitations

1. The user record in auth.users isn't actually deleted, just marked as deleted.
2. For full GDPR compliance, you might need admin processes to periodically clean up marked records.

## Troubleshooting

If you encounter issues with deletion:

1. Check the browser console for error messages
2. Verify the SQL function was created correctly in Supabase
3. Ensure the user has permission to execute the function 