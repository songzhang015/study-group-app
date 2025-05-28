import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate, useLocation } from "react-router";
import './home.css';
import 'leaflet/dist/leaflet.css';

export default function Home() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [username, setUsername] = useState<string>("");

  const location = useLocation();
  const data = location.state;

  useEffect(() => {
    if(data != null){
      console.log("username: "+data.username)
      setUsername(data.username);
    }
  }, [data]);

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

  //<div className="text">Username: {username}</div>

  return (
    <div className="main-split-container">
      <div className="left-section">
        <div className="text">Username: {username}</div>
        <div className="findButtonTextContainer">
          <button className="button">Find Nearby Study Groups</button>
        </div>
        <div className="createButtonTextContainer">
          <button className="button">Create Your Own Group</button>
        </div>
        <div className="logoutButtonContainer">
          <button className="button" onClick={() => window.location.href = '/'}>Logout</button>
        </div>
      </div>
      <div className="right-section">
        {latitude !== null && longitude !== null && (
          <>
            <div className="overlay-coordinates">
              Latitude: {latitude.toFixed(5)} <br />
              Longitude: {longitude.toFixed(5)}
            </div>
            <div style={{ height: '400px', width: '100%', maxWidth: 600 }}>
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
          </>
        )}
      </div>
    </div>
  );
}