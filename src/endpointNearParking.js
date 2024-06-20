const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Dummy data for parking spots
const parkingSpots = [
  { id: 1, name: "Spot 1", lat: 40.712776, lng: -74.005974 },
  { id: 2, name: "Spot 2", lat: 40.713776, lng: -74.006974 },
  // Add more spots as needed
];

app.get('/api/parking', (req, res) => {
  const { lat, lng } = req.query;
  // Logic to find nearby parking spots based on lat, lng
  // For simplicity, we return all spots here
  res.json(parkingSpots);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
