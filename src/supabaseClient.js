import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lxrduzuimpvorfnfxcdf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4cmR1enVpbXB2b3JmbmZ4Y2RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgzNTE0MjcsImV4cCI6MjAzMzkyNzQyN30.09I2xX9LeRvOaGsYDfeI-X5zeTJ_R03uspHx3JVXKn8'
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;