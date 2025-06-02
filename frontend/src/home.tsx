/*
The Home Screen for CS 422 Project 2: Study Group App

This file contains the code for the home screen menu.

This menu handles displaying the map and study group choices, 
as well as the currently selected study gorup.

Authors: Sawyer Christensen, Kaleo Montero
Last Modified: 06/01/2025
*/
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useNavigate, useLocation } from "react-router";
import { User, Backend, StudyGroup } from './backend';
import './home.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// The map pin icon image retrieval:
delete (L.Icon.Default.prototype as any)._getIconUrl;
export const userIcon   = new L.Icon({
  iconUrl:        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:  "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize:       [25, 41],
  iconAnchor:     [12, 41],
  popupAnchor:    [1, -34],
  shadowSize:     [41, 41],
});

/* green versions come from the leaflet-color-markers repo */
export const greenIcon = new L.Icon({
  iconUrl:        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  iconRetinaUrl:  "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize:       [25, 41],
  iconAnchor:     [12, 41],
  popupAnchor:    [1, -34],
  shadowSize:     [41, 41],
});

export const greyIcon = new L.Icon({
  iconUrl:        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png",
  iconRetinaUrl:  "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png",
  shadowUrl:      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize:       [25, 41],
  iconAnchor:     [12, 41],
  popupAnchor:    [1, -34],
  shadowSize:     [41, 41],
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
  const [joinGroup, setJoinGroup] = useState(false);

  const [address, setAddress] = useState<string>("");

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
      let userGroup = await Backend.GetUserGroup(user);
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
      console.log("creating group: " + subject);
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
      if(await Backend.JoinGroup(user, selectedGroup)){
        let updatedGroup = await Backend.GetGroupInfo(selectedGroup.id);
        setSelectedGroup(updatedGroup);
        setCurrentGroup(updatedGroup);
        console.log("joined group: "+updatedGroup?.subject);
      }
    }
  }
  
  async function LeaveCurrentGroup(){
    if(user != null && currentGroup != null){
      if(await Backend.LeaveGroup(user, currentGroup)){
        setCurrentGroup(null);
        setSelectedGroup(null);
      }
    }
  }

  async function getAddressFromCoords(lat: number, lon: number): Promise<string> {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
    );
    const data = await response.json();
    const houseNumber = data.address?.house_number || "";
    const road = data.address?.road || "";
    if (houseNumber && road) {
      return `${houseNumber} ${road}`;
    } else if (road) {
      return road;
    } else {
      return "Unknown location";
    }
  }

  useEffect(() => {
    if(joinGroup){
      (async () => {
        await JoinSelectedGroup();
        setJoinGroup(false);
      })();
    }
  }, [joinGroup])

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

  useEffect(() => {
    if (currentGroup) {
      getAddressFromCoords(
        currentGroup.location.latitude,
        currentGroup.location.longitude
      ).then(setAddress);
    }
  }, [currentGroup]);

  return (
    <div className="main-split-container">
      <div className="left-section">
        <div className="text">User: {user?.name}</div>
        {currentGroup ? (
          <div className = "inGroupContainer">
            <div className = "text">Current Study Group: {currentGroup.subject}</div>
            <div className = "text">Members: {currentGroup.member_count} / {currentGroup.max_member_count}</div>
            <div className="text">
              {address && <span>Location: {address}</span>}
            </div>
            <button className="button" onClick={async () => {
              await LeaveCurrentGroup();
              await FetchGroups();
            }}>
              Leave group
            </button>
          </div>) : (
            <><div className="findButtonTextContainer">
          <select
            id="groupDropdown"
            className="groupDropdown"
            value={selectedGroup?.subject || ""}
            onChange={async e => {
              const group = groups?.find(g => g.subject === e.target.value);
              console.log("selected group: " + group?.subject);
              setSelectedGroup(group || null);
              setJoinGroup(true);
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
                  onSubmit={async (e) => {
                    console.log("create group button");
                    e.preventDefault();
                    await CreateAndJoinGroup(newGroupSubject, newGroupMaxMembers);
                    setShowCreateForm(false);
                    setNewGroupSubject("");
                    setNewGroupMaxMembers(5);
                  } }
                >
                  <input
                    type="text"
                    placeholder="Group Subject"
                    value={newGroupSubject}
                    onChange={e => setNewGroupSubject(e.target.value)}
                    required
                    className="groupInput" />
                  <input
                    type="number"
                    min={2}
                    max={20}
                    placeholder="Max Members"
                    value={newGroupMaxMembers}
                    onChange={e => setNewGroupMaxMembers(Number(e.target.value))}
                    required
                    className="groupInput" />
                  <div className="buttonRow">
                    <button className="button" type="submit">Create</button>
                    <button className="button" type="button" onClick={() => setShowCreateForm(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div><div className="logoutButtonContainer">
                <button className="button" onClick={() => window.location.href = '/'}>Logout</button>
              </div></>
        )}
      </div>
      <div className="right-section">
        {latitude !== null && longitude !== null && (
          <>
            <div style={{ height: '100%', width: '100%'}}>
              <MapContainer
                center={[latitude, longitude]}
                zoom={15}
                style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'/>

                <Marker 
                  position={[latitude, longitude]} 
                  icon={userIcon}>
                  <Popup>You are here</Popup>
                </Marker>

                {selectedGroup && (
                  <Marker
                    position={[selectedGroup.location.latitude, selectedGroup.location.longitude]}
                    icon={greenIcon}>
                    <Popup> {selectedGroup.subject} </Popup>
                  </Marker>
                )}

                {(!selectedGroup && groups) && groups.map(group => (
                    <Marker 
                      position={[group.location.latitude, group.location.longitude]} 
                      icon={greyIcon}>
                      <Popup>{group.subject}</Popup>
                    </Marker>
                  ))
                }
              </MapContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}