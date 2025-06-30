# Supabase Environment Setup Guide

This guide will help you connect your Event Website application to your new Supabase project.

## Get Your Supabase Project Details

1. Log in to your [Supabase Dashboard](https://app.supabase.com)
2. Select your new project
3. Go to Project Settings > API
4. You'll need two key pieces of information:
   - **Project URL**: Looks like `https://your-project-id.supabase.co`
   - **anon/public** key (not the secret key)

## Option 1: Create a .env File (Recommended for Development)

1. Create a file named `.env` in the root of your project
2. Add the following content:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

3. Replace the placeholder values with your actual Supabase project details
4. Restart your development server with `npm run dev`

## Option 2: Update supabase.ts Directly (Quick Method)

If you're having issues with environment variables, you can directly update the `src/lib/supabase.ts` file:

1. Open `src/lib/supabase.ts`
2. Replace the placeholder values with your actual Supabase project details:

```js
// Update these values with your new Supabase project details
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-id.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';
```

## Option 3: Environment Variables for Production

For production deployments (like Vercel):

1. Go to your hosting provider's dashboard
2. Find the environment variables or secrets section
3. Add the following variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon/public key
4. Redeploy your application

## Verifying the Connection

To verify that your application is connected to Supabase:

1. Start your development server with `npm run dev`
2. Open your browser's developer tools (F12)
3. Go to the Console tab
4. Look for the log message: `Supabase URL: https://your-project-id.supabase.co`
5. Try signing up for a new account - if successful, you're connected!

## Troubleshooting

If you're having connection issues:

1. Check that your URL and key are correct
2. Make sure you're using the anon/public key, not the service role key
3. Verify that your Supabase project is active (not paused)
4. Check for CORS issues in the browser console
5. Make sure you've restarted your development server after making changes

## Edge Function Configuration

If you're using the Edge Function for user deletion:

1. Go to Supabase Dashboard > Edge Functions
2. Select your "delete-user" function
3. Add environment variables:
   - `SUPABASE_URL`: Same as your project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Your service role key (from Project Settings > API)

Remember to keep your service role key secure and never expose it in client-side code! 