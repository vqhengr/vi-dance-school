import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
if (!supabaseKey) {
    console.log('Environment Variables:', process.env);
    throw new Error('supabaseKey is not found in src/services/supabaseClient.js.');
  }
const supabase = createClient(supabaseUrl, supabaseKey);


export default supabase;
