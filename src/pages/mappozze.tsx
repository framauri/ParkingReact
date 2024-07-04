import React, { useEffect, useState, useRef } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  MapCameraChangedEvent,
  useMap,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { createClient } from "@supabase/supabase-js";
import type { Marker } from "@googlemaps/markerclusterer";

type Poi = {
  id: string;
  key: string;
  location: google.maps.LatLngLiteral;
  name: string;
  totalSpaces: number;
  type: string;
  hasTotem: boolean;
  rateId: string | null;
  specialSpacesCount: number;
  
};

const supabaseUrl = "https://lxrduzuimpvorfnfxcdf.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4cmR1enVpbXB2b3JmbmZ4Y2RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgzNTE0MjcsImV4cCI6MjAzMzkyNzQyN30.09I2xX9LeRvOaGsYDfeI-X5zeTJ_R03uspHx3JVXKn8";
const supabase = createClient(supabaseUrl, supabaseKey);

interface CSSProperties extends React.CSSProperties {
  flexDirection?: "row" | "row-reverse" | "column" | "column-reverse";
}

const containerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "row",
};

const mapStyle: CSSProperties = {
  flex: 1,
  height: "600px",
  margin: "0 20px",
};

const sidebarStyle: CSSProperties = {
  width: "300px",
  padding: "20px",
  backgroundColor: "#f0f0f0",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
};

const Mappozze = () => {
  const [locations, setLocations] = useState<Poi[]>([]);
  const [userLocation, setUserLocation] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [nearbyParkingSpots, setNearbyParkingSpots] = useState<Poi[]>([]);
  const [selectedPoi, setSelectedPoi] = useState<Poi | null>(null);

  useEffect(() => {
    const fetchParkingSpots = async () => {
      const { data, error } = await supabase.from("parkinglot").select("*");
      if (error) {
        console.error("Error fetching parking spots:", error);
      } else {
        const fetchedLocations = data.map((spot) => ({
          id: spot.id,
          key: spot.id,
          location: {
            lat: parseFloat(spot.latitude),
            lng: parseFloat(spot.longitude),
          },
          name: spot.name,
          totalSpaces: spot.totalspaces,
          type: spot.type,
          hasTotem: spot.hastotem,
          rateId: spot.rateid,
          specialSpacesCount: spot.specialspacescount,
        }));
        setLocations(fetchedLocations);

        if (userLocation) {
          fetchNearbyParkingSpots(
            userLocation.lat,
            userLocation.lng,
            fetchedLocations
          );
        }
      }
    };

    fetchParkingSpots();
  }, [userLocation]);

  useEffect(() => {
    // Request user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user's location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported.");
    }
  }, []); // Fetch user location only once on component mount

  const fetchNearbyParkingSpots = (lat: number, lng: number, spots: Poi[]) => {
    if (!window.google || !window.google.maps || !window.google.maps.geometry) {
      console.error("Google Maps API not initialized.");
      return;
    }

    const { geometry } = window.google.maps;

    const nearbySpots = spots.filter((spot) => {
      const distance = geometry.spherical.computeDistanceBetween(
        new window.google.maps.LatLng(lat, lng),
        new window.google.maps.LatLng(spot.location.lat, spot.location.lng)
      );
      return distance <= 100000; // 100 km radius
    });

    setNearbyParkingSpots(nearbySpots);
  };

  const getDirectionsUrl = (destination: google.maps.LatLngLiteral) => {
    if (!userLocation) return "";
    const origin = `${userLocation.lat},${userLocation.lng}`;
    const dest = `${destination.lat},${destination.lng}`;
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=driving`;
  };

  return (
    <APIProvider
      apiKey={"AIzaSyD1YSU6xwBjts7OLW9GBIdsdIcLpn9WjHw"}
      onLoad={() => console.log("Maps API has loaded.")}
      libraries={["geometry"]}
    >
      <div style={containerStyle}>
        <div style={mapStyle}>
          <Map
            defaultZoom={13}
            defaultCenter={{
              lat: userLocation ? userLocation.lat : -33.860664,
              lng: userLocation ? userLocation.lng : 151.208138,
            }}
            mapId="8818a6053d74936f"
            onCameraChanged={(ev: MapCameraChangedEvent) =>
              console.log(
                "camera changed:",
                ev.detail.center,
                "zoom:",
                ev.detail.zoom
              )
            }
          >
            <PoiMarkers pois={locations} onSelect={setSelectedPoi} />
            {selectedPoi && (
              <InfoWindow
                position={selectedPoi.location}
                onCloseClick={() => setSelectedPoi(null)}
              >
                <div>
                  <h3>{selectedPoi.name}</h3>
                  <p>Type: {selectedPoi.type}</p>
                  <p>Total Spaces: {selectedPoi.totalSpaces}</p>
                  <p>Has Totem: {selectedPoi.hasTotem ? "Yes" : "No"}</p>
                  <p>Rate ID: {selectedPoi.rateId || "N/A"}</p>
                  <p>Special Spaces: {selectedPoi.specialSpacesCount}</p>
                  <a
                    href={getDirectionsUrl(selectedPoi.location)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Directions
                  </a>
                </div>
              </InfoWindow>
            )}
          </Map>
        </div>
        <div style={sidebarStyle}>
          <h2>Nearby Parking Spots</h2>
          <ul>
            {nearbyParkingSpots.map((spot) => (
              <li key={spot.key}>
                <h3>{spot.name}</h3>
                <p>Type: {spot.type}</p>
                <p>Total Spaces: {spot.totalSpaces}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </APIProvider>
  );
};

const PoiMarkers = ({
  pois,
  onSelect,
}: {
  pois: Poi[];
  onSelect: (poi: Poi) => void;
}) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  return (
    <>
      {pois.map((poi: Poi) => (
        <AdvancedMarker
          key={poi.key}
          position={poi.location}
          ref={(marker) => setMarkerRef(marker, poi.key)}
          onClick={() => onSelect(poi)}
        >
          <Pin
            background={"#FBBC04"}
            glyphColor={"#000"}
            borderColor={"#000"}
          />
        </AdvancedMarker>
      ))}
    </>
  );
};

export default Mappozze;

//todo     prenotation e gestione ticket
//todo     info parcheggio disabili e speciali
