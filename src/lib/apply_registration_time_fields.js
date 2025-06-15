import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Get current file directory (ESM equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get Supabase URL and key from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or key. Please check your .env file.');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function applyDatabaseChanges() {
  try {
    console.log('Reading SQL file...');
    const sqlFilePath = path.join(__dirname, 'event_registration_time_fields.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split SQL into individual statements
    const statements = sqlContent.split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    console.log(`Found ${statements.length} SQL statements to execute.`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      
      const { error } = await supabase.rpc('exec_sql', { sql: statement });
      
      if (error) {
        console.error(`Error executing statement ${i + 1}:`, error);
      } else {
        console.log(`Statement ${i + 1} executed successfully.`);
      }
    }
    
    console.log('All database changes applied successfully!');
  } catch (error) {
    console.error('Error applying database changes:', error);
    process.exit(1);
  }
}

applyDatabaseChanges(); 