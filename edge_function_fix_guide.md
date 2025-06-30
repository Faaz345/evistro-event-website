# Fix Account Deletion Edge Function

Follow these steps to fix the "Failed to send a request to the Edge Function" error when trying to delete an account.

## 1. Check if the Edge Function is Deployed

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Edge Functions in the left sidebar
4. Check if the `delete-user` function is listed and shows as "Active"

If it's not listed, you need to deploy it first.

## 2. Deploy or Redeploy the Edge Function

You can deploy the function using the Supabase CLI:

```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Login to Supabase
supabase login

# Deploy the function (from your project directory)
cd supabase/functions/delete-user
supabase functions deploy delete-user --project-ref your-project-reference
```

Alternatively, you can try a simpler option - direct API access:

## 3. Alternative: Direct API Access Method

If you're still having issues with the Edge Function, let's modify your application to use direct API access instead:

1. Edit `src/context/AuthContext.tsx`:

```typescript
// In the AuthContext.tsx file, replace the deleteAccount function with this:
const deleteAccount = async () => {
  try {
    if (!user || !user.id) {
      return { error: new Error('No user is logged in') };
    }

    // Get current session for auth token
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    
    if (!token) {
      return { error: new Error('No valid session found') };
    }

    // First delete user data from tables directly
    console.log('Deleting user data...');
    const { error: regError } = await supabase
      .from('event_registrations')
      .delete()
      .eq('user_id', user.id);
    
    if (regError) {
      console.error('Error deleting registrations:', regError);
    }
    
    const { error: bookingsError } = await supabase
      .from('bookings')
      .delete()
      .eq('user_id', user.id);
    
    if (bookingsError) {
      console.error('Error deleting bookings:', bookingsError);
    }
    
    // Now use a special RPC function to complete the deletion process
    console.log('Calling delete_user function...');
    const { data, error } = await supabase.rpc('delete_user');
    
    if (error) {
      console.error('Error calling delete_user function:', error);
      return { error };
    }

    console.log('Delete function response:', data);
    
    // Sign out after account deletion
    console.log('Signing out user...');
    await signOut();
    
    return { error: null };
  } catch (error) {
    console.error('Error in account deletion:', error);
    return { error: error instanceof Error ? error : new Error('Failed to delete account') };
  }
};
```

## 4. Check Environment Variables

Make sure your Edge Function has the correct environment variables:

1. Go to Supabase Dashboard > Edge Functions > delete-user
2. Check that these environment variables are set:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Your service role key from Project Settings > API
   - `SUPABASE_ANON_KEY`: Your anon/public key

## 5. Set up Required SQL Settings

Run this SQL in your SQL Editor to ensure your delete_user function has the necessary settings:

```sql
-- Store required settings for delete_user function
DO $$
BEGIN
  PERFORM set_config('app.settings.supabase_url', 'https://your-project-id.supabase.co', FALSE);
  PERFORM set_config('app.settings.service_role_key', 'your-service-role-key-here', FALSE);
END $$;
```

## 6. Check CORS Settings

1. Go to Project Settings > API
2. Check that your frontend URL is in the "Additional allowed header values" section

## 7. Verify Database Function

Make sure the `delete_user` function is properly created by running:

```sql
SELECT pg_get_functiondef('delete_user'::regproc);
```

This should show the definition of your function.

## Final Check

After making these changes, test account deletion again. The direct API access method should work even if the Edge Function is still having issues. 