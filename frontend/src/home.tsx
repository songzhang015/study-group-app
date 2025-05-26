import React, { useState, useEffect } from 'react';
import './home.css';

export default function Home() {
  const [latitude, setLatitude] = useState('0');
  const [longitude, setLongitude] = useState('0');

  useEffect(() => {
    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLatitude(position.coords.latitude.toFixed(5));
          setLongitude(position.coords.longitude.toFixed(5));
          console.log('Web location update:', position);
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
        <div className="text">Latitude: {latitude}</div>
        <div className="text">Longitude: {longitude}</div>
      </div>
    </div>
  );
}