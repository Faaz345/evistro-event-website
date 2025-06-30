# Delete Supabase Users with Postman

If other methods aren't working, you can directly use Postman to delete users from Supabase.

## Prerequisites

1. Download and install [Postman](https://www.postman.com/downloads/)
2. Have your Supabase service role key ready

## Steps to Delete a User

### 1. Set up a new request in Postman

1. Open Postman
2. Click "New" → "HTTP Request"

### 2. Configure the request

1. Set the request method to **DELETE**
2. Enter the URL: `https://xiudkintsxvqtowiggpq.supabase.co/auth/v1/admin/users/USER_ID_HERE`
   - Replace `USER_ID_HERE` with the actual user ID you want to delete
   - You can find user IDs in the Supabase Dashboard → Authentication → Users

### 3. Add headers

Add these headers:
1. Click on the "Headers" tab
2. Add the following headers:
   - `apikey`: Your Supabase service role key
   - `Authorization`: `Bearer YOUR_SERVICE_ROLE_KEY`
   - `Content-Type`: `application/json`

### 4. Send the request

1. Click "Send"
2. You should receive a 200 OK response if successful

### 5. Clean up user data

After deleting the user from Auth, you'll need to clean up their data:

```sql
-- Run this in SQL Editor to delete a user's data
DELETE FROM event_registrations WHERE user_id = 'USER_ID_HERE';
DELETE FROM contacts WHERE email = 'USER_EMAIL_HERE';
```

## Batch Delete Multiple Users

If you need to delete multiple users, you can create a collection in Postman:

1. Save your first request
2. Duplicate it for each user
3. Update the user ID in each request
4. Run them in sequence

## Troubleshooting

### 401 Unauthorized Error
- Double-check your service role key
- Make sure you're using the correct authorization format

### 404 Not Found Error
- Verify the user ID exists
- Check if the URL is correctly formatted

### 500 Server Error
- Try again later
- Contact Supabase support if the issue persists 