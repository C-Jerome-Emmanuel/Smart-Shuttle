// frontend-react/src/components/MapCard.js
import React, { useEffect, useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import '../App.css';

const GOOGLE_MAPS_API_KEY = 'AIzaSyC9gUVPSu-jVb5FT_kzqqYhSYsAPkzjqaA';


// College coordinates
const COLLEGE_LOCATION = { lat: 12.823, lng: 80.044 };

// Destination coordinates map
const DESTINATIONS = {
  "Airport": { lat: 12.9941, lng: 80.1709 },
  "Metro Station": { lat: 12.9702, lng: 80.2229 },
  "Kelambakkam Bus Stand": { lat: 12.7595, lng: 80.2208 },
  "Tambaram": { lat: 12.9249, lng: 80.1000 },
  "Vandalur": { lat: 12.8926, lng: 80.0805 },
};

const MapCard = ({ destination = 'Airport' }) => {
  const [directions, setDirections] = useState(null);
  const [eta, setEta] = useState('');
  const [mapsLoaded, setMapsLoaded] = useState(false);

  // Calculate route and ETA once Google Maps is ready
  const calculateRoute = useCallback(() => {
    if (!mapsLoaded || !window.google || !destination) return;

    const destCoords = DESTINATIONS[destination];
    if (!destCoords) return;

    const service = new window.google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [COLLEGE_LOCATION],
        destinations: [destCoords],
        travelMode: 'DRIVING',
      },
      (response, status) => {
        if (status === 'OK' && response.rows[0].elements[0].status === 'OK') {
          const duration = response.rows[0].elements[0].duration.text;
          setEta(duration);
        } else {
          setEta('Unavailable');
        }
      }
    );

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: COLLEGE_LOCATION,
        destination: destCoords,
        travelMode: 'DRIVING',
      },
      (result, status) => {
        if (status === 'OK') setDirections(result);
        else setDirections(null);
      }
    );
  }, [destination, mapsLoaded]);

  useEffect(() => {
    if (mapsLoaded) calculateRoute();
  }, [destination, mapsLoaded, calculateRoute]);

  return (
    <div className="card">
      <h2>🗺️ Shuttle Stop Map</h2>

      {eta && (
        <p style={{ color: 'blue', fontWeight: 'bold' }}>
          🚗 Estimated Travel Time: {eta}
        </p>
      )}

      <div style={{ height: '300px', width: '100%', marginTop: '10px' }}>
        <LoadScript
          googleMapsApiKey={GOOGLE_MAPS_API_KEY}
          onLoad={() => setMapsLoaded(true)}
        >
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={COLLEGE_LOCATION}
            zoom={12}
          >
            <Marker position={COLLEGE_LOCATION} label="College" />
            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default MapCard;
