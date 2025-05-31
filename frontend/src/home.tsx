import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate, useLocation } from "react-router";
import { User, Backend, StudyGroup } from './backend';
import './home.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// The map pin icon image retrieval:
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


export default function Home() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [groups, setGroups] = useState<StudyGroup[] | null>(null);
  //const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);

  const location = useLocation();
  const data = location.state;

  //TODO: call from a refresh button of some kind
  async function fetchGroups() {
    let studyGroups = await Backend.FetchGroups();
    setGroups(studyGroups);
    if(studyGroups != null){
      for(let i=0;i<studyGroups.length;i++){
        let selected = studyGroups[i];
        console.log(
          selected.subject 
          + ", members: "+selected.member_count + "/" + selected.max_member_count
          + ", location: " +selected.location.latitude + ", " + selected.location.longitude
        );
      }
    }
  }

  useEffect(() => {
    if(data != null){
      setUser(data.user);
      let dataUser = data.user as User;
      console.log("user name: "+ dataUser.name)
      console.log("user id: "+ dataUser.id)
    }
  }, [data]);

  useEffect(() => {
    //TODO remove the example group
    if(user != null){
      console.log("creating group...");
      Backend.CreateGroup(user, "Example Group - " + user.name, 3, 12, 15);
    }
    else{
      console.log("user or location error");
    }

    fetchGroups();
  }, [user]);

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
    <div className="main-split-container">
      <div className="left-section">
        <div className="text">Username: {user?.name}</div>
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