# Deploying the Delete User Edge Function

Follow these steps to deploy the Edge Function and fix the "Failed to send a request to the Edge Function" error:

## Prerequisites

1. Install the Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to your Supabase account:
   ```bash
   supabase login
   ```

## Deployment Steps

1. Link your project (replace with your project reference):
   ```bash
   supabase link --project-ref xiudkintsxvqtowiggpq
   ```

2. Deploy the Edge Function:
   ```bash
   supabase functions deploy delete-user --project-ref xiudkintsxvqtowiggpq
   ```

3. Verify the function was deployed:
   ```bash
   supabase functions list
   ```

## Setting up Environment Variables

The Edge Function requires these environment variables:

1. Set the environment variables:
   ```bash
   supabase secrets set SUPABASE_URL=https://xiudkintsxvqtowiggpq.supabase.co --project-ref xiudkintsxvqtowiggpq
   supabase secrets set SUPABASE_ANON_KEY=your-anon-key-here --project-ref xiudkintsxvqtowiggpq
   ```

## Testing the Function

After deployment, you can test the function using:

```bash
curl -X DELETE https://xiudkintsxvqtowiggpq.supabase.co/functions/v1/delete-user \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-id-to-delete"}'
```

## Troubleshooting

If you encounter the "Failed to send a request to the Edge Function" error:

1. Check that the function is properly deployed
2. Verify environment variables are set correctly
3. Make sure your access token is valid
4. Check the Edge Function logs:
   ```bash
   supabase functions logs delete-user --project-ref xiudkintsxvqtowiggpq
   ```

5. You might need to enable CORS for your domain:
   ```bash
   supabase functions update-cors delete-user --uri https://your-domain.com --project-ref xiudkintsxvqtowiggpq
   ``` 