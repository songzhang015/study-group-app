import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import './home.css';
import 'leaflet/dist/leaflet.css';

export default function Home() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error('Web location error:', error);
        }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      console.warn('Geolocation not available in this browser.');
    }
  }, []);

  return (
    <div className="container">
      <div className="logoutButtonContainer">
        <button className="button" onClick={() => window.location.href = '/'}>Logout</button>
      </div>

      <div className="findButtonTextContainer">
        <button className="button">Button 1: Find Nearby Study Groups</button>
      </div>

      <div className="createButtonTextContainer">
        <button className="button">Button 2: Create Your Own Group</button>
      </div>

      <div className="coordinateTextContainer">
        <div className="text">Your coordinates are:</div>
        <div className="text">
          Latitude: {latitude !== null ? latitude.toFixed(5) : 'Loading...'}
        </div>
        <div className="text">
          Longitude: {longitude !== null ? longitude.toFixed(5) : 'Loading...'}
        </div>
      </div>

      {latitude !== null && longitude !== null && (
        <div style={{ height: '300px', width: '100%', margin: '0 auto', maxWidth: 600 }}>
          <MapContainer
            center={[latitude, longitude]}
            zoom={15}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[latitude, longitude]}>
              <Popup>You are here</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
}