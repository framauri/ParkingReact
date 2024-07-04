const express = require('express');
const cors = require('cors'); // Import cors
const { createClient } = require('@supabase/supabase-js');
const app = express();
const PORT = process.env.PORT || 5000;

const supabaseUrl = 'https://lxrduzuimpvorfnfxcdf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4cmR1enVpbXB2b3JmbmZ4Y2RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgzNTE0MjcsImV4cCI6MjAzMzkyNzQyN30.09I2xX9LeRvOaGsYDfeI-X5zeTJ_R03uspHx3JVXKn8';
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors()); // Enable CORS

app.get('/api/parking', async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    // Fetch parking spots from Supabase
    const { data: parkinglot, error } = await supabase
      .from('parkinglot')
      .select('*');

    if (error) {
      throw error;
    }

    // For simplicity, we return all spots here
    res.json(parkinglot);
  } catch (error) {
    console.error('Error fetching parking spots:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});