// CommonJS script to check environment variables
const dotenv = require('dotenv');
dotenv.config();

console.log('Environment variables check:');
console.log('SUPABASE_URL exists:', Boolean(process.env.SUPABASE_URL));
console.log('SUPABASE_SERVICE_ROLE_KEY exists:', Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)); 