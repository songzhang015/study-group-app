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
  const [currentGroup, setCurrentGroup] = useState<StudyGroup | null>(null);

  //TODO: UI buttons should change selected group
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroupSubject, setNewGroupSubject] = useState("");
  const [newGroupMaxMembers, setNewGroupMaxMembers] = useState(5);

  const reactLocation = useLocation();
  const data = reactLocation.state;

  //TODO: call from a refresh button of some kind
  async function FetchGroups() {
    let studyGroups = await Backend.FetchGroups();
    setGroups(studyGroups);
    console.log("fetched study groups:");
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

  async function FetchCurrentGroup(){
    if(user != null){
      let userGroup = await Backend.GetGroup(user);
      setCurrentGroup(userGroup);
      if(userGroup != null){
        console.log("user group: "+userGroup.subject);
      }
      else{
        console.log("no current user group");
      }
    }
  }

  async function CreateAndJoinGroup(subject: string, max_members: number){
    if(user != null && latitude != null && longitude != null){
      let newGroup = await Backend.CreateGroup(user, subject, max_members, latitude, longitude);
      if(newGroup != null){
        setCurrentGroup(newGroup);
        return true;
      }
      return false;
    }
  }

  async function JoinSelectedGroup(){
    if(user != null && selectedGroup != null){
      await Backend.JoinGroup(user, selectedGroup);
    }
  }
  async function LeaveCurrentGroup(){
    if(user != null && currentGroup != null){
      await Backend.LeaveGroup(user, currentGroup);
    }
  }

  useEffect(() => {
    FetchCurrentGroup();
  }, [user])

  useEffect(() => {
    if(data != null){
      setUser(data.user);
      let dataUser = data.user as User;
      console.log("user name: "+ dataUser.name)
      console.log("user id: "+ dataUser.id)
    }
  }, [data]);

  useEffect(() => {
    FetchGroups();
  }, [user, latitude, longitude]);

  useEffect(() => {
    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          console.log("location updated");
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
          <select
            id="groupDropdown"
            className="groupDropdown"
            value={selectedGroup?.subject || ""}
            onChange={e => {
              const group = groups?.find(g => g.subject === e.target.value);
              setSelectedGroup(group || null);
            }}
          >
            <option value="" disabled>
              Find Nearby Study Groups
            </option>
            {groups && groups.map(group => (
              <option key={group.subject} value={group.subject}>
                {group.subject} ({group.member_count}/{group.max_member_count})
              </option>
            ))}
          </select>
        </div>
        <div className="createButtonTextContainer">
          {!showCreateForm ? (
            <button className="button" onClick={() => setShowCreateForm(true)}>
              Create Your Own Group
            </button>
          ) : (
            <form
              className="createGroupForm"
              onSubmit={async e => {
                e.preventDefault();
                await CreateAndJoinGroup(newGroupSubject, newGroupMaxMembers);
                setShowCreateForm(false);
                setNewGroupSubject("");
                setNewGroupMaxMembers(5);
              }}
            >
              <input
                type="text"
                placeholder="Group Subject"
                value={newGroupSubject}
                onChange={e => setNewGroupSubject(e.target.value)}
                required
                className="groupInput"
              />
              <input
                type="number"
                min={2}
                max={20}
                placeholder="Max Members"
                value={newGroupMaxMembers}
                onChange={e => setNewGroupMaxMembers(Number(e.target.value))}
                required
                className="groupInput"
              />
              <div className="buttonRow">
                <button className="button" type="submit">Create</button>
                <button className="button" type="button" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          )}
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