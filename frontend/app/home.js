import { Text, View, StyleSheet, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location'

export default function HomeScreen() {
  const router = useRouter();
  const [location, setLocation] = useState(null)

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log("Permission not granted!")
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }

    getCurrentLocation();
  }, []);

  let latitude = '0';
  let longitude = '0';
  
  if (location && location.coords) {
    latitude = location.coords.latitude.toFixed(6);
    longitude = location.coords.longitude.toFixed(6);
  }

  return (
    <View style={styles.container}>

      <View style={styles.logoutButtonContainer}>
        <Pressable onPress={() => router.push('/')}>
          <Text style={styles.button}>Logout</Text>
        </Pressable>
      </View>


      <View style={styles.coordinateTextContainer}>
        <Text style={styles.text}>Your coordinates are:</Text>
        <Text style={styles.text}>Latitude: {latitude}</Text>
        <Text style={styles.text}>Longitude: {longitude}</Text>
      </View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  logoutButtonContainer: {
    position: 'absolute',
    top: 25,
    right: 20,
  },
  coordinateTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 24,
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});