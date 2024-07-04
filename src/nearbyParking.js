import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';

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
        setLocation({ lat: parseFloat(latitude), lng: parseFloat(longitude) });
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
        {parkingSpots.map((spot) => {
          // Ensure that spot.lat and spot.lng are valid numbers
          const spotLat = parseFloat(spot.lat);
          const spotLng = parseFloat(spot.lng);

          // Check if the values are numbers before rendering the Marker
          if (!isNaN(spotLat) && !isNaN(spotLng)) {
            return <Marker key={spot.id} position={{ lat: spotLat, lng: spotLng }} />;
          }
          return null;
        })}
      </GoogleMap>
    </LoadScript>
  );
}

export default NearbyParking;
