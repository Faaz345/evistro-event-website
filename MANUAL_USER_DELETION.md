# Manual User Deletion Guide for EviStro

Since the automatic deletion of users from Supabase Auth requires a backend component, this guide provides a simple manual solution.

## Current Implementation

The current implementation in your application:
1. Deletes the user's data from the `event_registrations` table
2. Deletes the user's data from the `contacts` table
3. Marks the user as "deleted" in their auth metadata
4. Signs the user out

This is a "soft delete" approach that protects user privacy by removing their personal data, but it doesn't actually remove the user from the Supabase Auth panel.

## How to Manually Delete Users

To fully delete users from the Supabase Auth panel:

1. Log in to your Supabase Dashboard: https://app.supabase.com/project/xiudkintsxvqtowiggpq
2. Navigate to "Authentication" → "Users"
3. Find users with the `deleted: true` flag in their metadata
4. Click the three dots menu (...)
5. Select "Delete user"
6. Confirm the deletion

You can do this periodically (weekly or monthly) to clean up your user database.

## Why We Use This Approach

The current approach is a good compromise because:

1. **Privacy Protection**: Users' personal data is immediately deleted from your database
2. **Simplicity**: No need for complex backend setup
3. **Security**: No need to expose admin credentials in client-side code

While users remain in the Supabase Auth panel, they:
- Cannot log back in (your app checks the `deleted` flag)
- Have no personal data stored in your database
- Can be fully deleted at your convenience

## Future Improvements

If you want to automate the full deletion process in the future, you'll need to:

1. Set up a Supabase Edge Function
2. Deploy it with proper admin credentials
3. Update your client code to call this function

The files for this approach have been created but require deployment through the Supabase CLI. See `SUPABASE_EDGE_FUNCTION_SETUP.md` for details. 