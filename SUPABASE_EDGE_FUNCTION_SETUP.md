# Setting Up the Delete User Edge Function

This guide will help you deploy the Supabase Edge Function to properly delete users from your Supabase Auth.

## Prerequisites

1. Install the Supabase CLI
   ```bash
   npm install -g supabase
   ```

2. Login to your Supabase account
   ```bash
   supabase login
   ```

## Step 1: Set Up the Edge Function Structure

The function files are already created in your project:
- `supabase/functions/delete-user/index.ts`: The main function code
- `supabase/functions/delete-user/deno.json`: Configuration file

## Step 2: Link Your Supabase Project

Link your local project to your Supabase project:

```bash
supabase link --project-ref xiudkintsxvqtowiggpq
```

When prompted, enter your Supabase access token (you can create one in Supabase Dashboard → Account → Access Tokens).

## Step 3: Deploy the Edge Function

Deploy the function to Supabase:

```bash
supabase functions deploy delete-user --no-verify-jwt
```

The `--no-verify-jwt` flag allows the function to be called without authentication, but we'll still check for authorization headers in the function itself.

## Step 4: Test the Function

You can test the function using the Supabase Dashboard:

1. Go to your Supabase Dashboard
2. Navigate to "Edge Functions"
3. Find the "delete-user" function
4. Click on "Logs" to view function logs
5. Try deleting a user from your application and check the logs

## Troubleshooting

### "Error: Function Not Found"

If your client-side code can't find the function, make sure:
1. The function is deployed successfully
2. You're using the correct function name ('delete-user')
3. Your Supabase client is initialized correctly

### "Unauthorized" Error

If you get an unauthorized error:
1. Make sure your function is deployed with `--no-verify-jwt`
2. Check that your client has the correct authorization

### "Permission Denied" Error

If the function can't delete users:
1. Make sure the function is using the service role key
2. Check that the service role key has proper permissions

## How It Works

1. Your client code calls the Edge Function when a user wants to delete their account
2. The Edge Function runs on Supabase's servers with admin privileges
3. It deletes the user's data from your tables
4. It then deletes the user from Supabase Auth
5. The client signs the user out

This approach properly removes users from Supabase Auth without exposing your service role key in client-side code. 