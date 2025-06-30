# Supabase Deployment Guide

This guide will help you set up a new Supabase project for your Event Website after your previous database was removed due to inactivity.

## Step 1: Create a New Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/).
2. Click on "New Project" button.
3. Enter a name for your project (e.g., "Event Website").
4. Choose a database password (keep it secure).
5. Select your region (choose the closest to you or your target audience).
6. Click "Create New Project" and wait for it to be created.

## Step 2: Update Environment Variables

Once your project is created, you'll need to update your application's environment variables:

1. In your Supabase project dashboard, go to "Settings" > "API".
2. Find your project URL and anon/public key.
3. Create a `.env` file in your project root with these values:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. Update your `supabase.ts` file if necessary with these new values.

## Step 3: Set Up Database Tables and Functions

1. In your Supabase dashboard, go to "SQL Editor".
2. Copy the entire SQL script from the `supabase_setup.sql` file you created.
3. Paste it into the SQL Editor and click "Run".
4. This will create all necessary tables, functions, and RLS policies.

## Step 4: Set Up Edge Function for Account Deletion

1. In your Supabase dashboard, go to "Edge Functions".
2. Click "Create Function".
3. Name the function "delete-user".
4. Deploy the function using the Supabase CLI:

```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Login to Supabase
supabase login

# Deploy the function (from your project root)
supabase functions deploy delete-user --project-ref your-project-ref
```

5. Set environment variables for your function:
   - In the Supabase dashboard, go to "Settings" > "API".
   - Copy your Service Role Key.
   - Go to "Edge Functions", select your "delete-user" function.
   - Add environment variables:
     - `SUPABASE_URL`: Your project URL
     - `SUPABASE_SERVICE_ROLE_KEY`: Your service role key

## Step 5: Create an Admin User

To access admin features, you'll need to mark a user as admin:

1. Create a new user account via your application's signup form.
2. In the Supabase dashboard, go to "SQL Editor".
3. Run the following SQL to make your user an admin (replace `'your-user-id'` with your actual user ID):

```sql
UPDATE auth.users
SET is_admin = true
WHERE id = 'your-user-id';
```

## Step 6: Verify Setup

1. Test your application by signing up a new user.
2. Try creating an event registration.
3. Test admin functionality after setting up an admin user.
4. Verify that account deletion works correctly.

## Troubleshooting

### Missing Tables or Permissions
If you see errors related to missing tables or permissions:
1. Check that all SQL commands ran successfully.
2. Verify that Row Level Security (RLS) policies are properly set up.
3. Ensure your application is using the correct Supabase URL and API keys.

### Edge Function Errors
If the account deletion function isn't working:
1. Check that the function is deployed correctly.
2. Verify that environment variables are set properly.
3. Check the function logs in the Supabase dashboard for specific errors.

### Authentication Issues
If you're having trouble with authentication:
1. Make sure your Supabase URL and anon key are correct.
2. Try clearing browser cookies and local storage.
3. Verify that the auth tables are properly set up.

## Next Steps

After completing this setup, your application should be working as before. If you need to add sample data or additional functionality, you can do so using the SQL Editor or by interacting with your application. 