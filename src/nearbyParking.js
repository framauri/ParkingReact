// src/components/NearbyParking.js
import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';

//bocciato, non una arrow function
const containerStyle = {
  width: '100%',
  height: '400px'
};

function NearbyParking() {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [parkingSpots, setParkingSpots] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        fetchParkingSpots(latitude, longitude);
      },
      (error) => {
        console.error('Error fetching location:', error);
      }
    );
  }, []);

  const fetchParkingSpots = async (lat, lng) => {
    try {
      const response = await axios.get('/api/parking', {
        params: { lat, lng }
      });
      setParkingSpots(response.data);
    } catch (error) {
      console.error('Error fetching parking spots:', error);
    }
  };

  if (!location.lat || !location.lng) {
    return <div>Loading...</div>;
  }

  return (
    <LoadScript googleMapsApiKey="AIzaSyD1YSU6xwBjts7OLW9GBIdsdIcLpn9WjHw">
      <GoogleMap mapContainerStyle={containerStyle} center={location} zoom={15}>
        {parkingSpots.map((spot) => (
          <Marker key={spot.id} position={{ lat: spot.lat, lng: spot.lng }} />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}

export default NearbyParking;
