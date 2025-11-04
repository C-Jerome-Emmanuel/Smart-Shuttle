// frontend-react/src/components/MapCard.js
import React, { useEffect, useRef } from 'react';
import '../App.css';

const stopCoords = {
  "Airport": { lat: 12.9941, lng: 80.1802 },
  "Metro Station": { lat: 12.9868, lng: 80.2306 },
  "Kelambakkam Bus Stand": { lat: 12.7638, lng: 80.2293 },
  "Tambaram": { lat: 12.9249, lng: 80.1000 },
  "Vandalur": { lat: 12.8924, lng: 80.0803 }
};

const MapCard = ({ destination }) => {
  const mapRef = useRef(null);
  const googleMap = useRef(null);
  const marker = useRef(null);

  useEffect(() => {
    // This function will be called by the Google Maps API script once it's loaded
    window.initMap = () => {
      googleMap.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 12.8400, lng: 80.1530 },
        zoom: 11,
      });
      // Initial update when map loads
      updateMapLocation(destination);
    };

    // Clean up global initMap if component unmounts
    return () => {
      delete window.initMap;
    };
  }, []); // Run only once on mount

  useEffect(() => {
    if (googleMap.current) {
      updateMapLocation(destination);
    }
  }, [destination]); // Update map whenever destination changes

  const updateMapLocation = (dest) => {
    const coords = stopCoords[dest];
    if (coords && googleMap.current) {
      googleMap.current.setCenter(coords);
      if (marker.current) {
        marker.current.setMap(null); // Remove previous marker
      }
      marker.current = new window.google.maps.Marker({
        position: coords,
        map: googleMap.current,
        title: dest,
      });
    }
  };

  return (
    <div className="card">
      <h2>Shuttle Stop Map</h2>
      <div id="map" ref={mapRef} style={{ width: '100%', height: '250px', marginTop: '10px', borderRadius: '10px' }}></div>
    </div>
  );
};

export default MapCard;