# Setting Up Admin Users in Supabase

This guide explains how to set up admin users for your Event Website application using the new approach that doesn't require directly modifying the `auth.users` table.

## Background

In Supabase, regular database users don't have permission to modify the `auth.users` table directly. Instead, we've created a separate `admin_users` table to track which users have admin privileges.

## Steps to Create an Admin User

1. First, create a regular user through your application's signup flow.

2. Get the user's ID from the Supabase dashboard:
   - Go to Authentication > Users
   - Find the user you want to make an admin
   - Copy their UUID

3. Open the SQL Editor in your Supabase dashboard.

4. Run the following SQL to grant admin privileges to the user:

```sql
INSERT INTO public.admin_users (user_id) 
VALUES ('paste-user-id-here');
```

5. The user will now have admin privileges when they log in.

## Verifying Admin Status

You can check if a user has admin privileges by running:

```sql
SELECT EXISTS (
  SELECT 1 FROM public.admin_users
  WHERE user_id = 'paste-user-id-here'
);
```

This should return `true` if the user is an admin.

## Revoking Admin Privileges

To remove admin privileges from a user:

```sql
DELETE FROM public.admin_users
WHERE user_id = 'paste-user-id-here';
```

## How Admin Status Works

1. The application uses the `is_admin()` function to check if the current user has admin privileges.
2. This function checks if the user's ID exists in the `admin_users` table.
3. Row Level Security (RLS) policies use this function to grant additional access to admin users.

## Troubleshooting

If admin functionality isn't working:

1. Verify the user is correctly added to the `admin_users` table.
2. Make sure the RLS policies are properly set up (they should be created by the setup script).
3. Check that the `is_admin()` function exists and returns the expected value.
4. Ensure the user is correctly authenticated in the application.

## Security Considerations

- Only grant admin privileges to trusted users.
- The first admin user must be created manually through SQL.
- Subsequent admin users can be created by existing admins if you implement that functionality in your application. 