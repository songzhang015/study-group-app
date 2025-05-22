import { Text, View, StyleSheet, Pressable } from 'react-native';
import { useState, useEffect, SetStateAction } from 'react';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location'

export default function HomeScreen() {
  const router = useRouter();
  const [location, setLocation] : [Location.LocationObject|null, React.Dispatch<SetStateAction<Location.LocationObject|null>>] = useState<Location.LocationObject | null>(null);

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
    latitude = location.coords.latitude.toFixed(5);
    longitude = location.coords.longitude.toFixed(5);
  }

  return (
    <View style={styles.container}>

      <View style={styles.logoutButtonContainer}>
        <Pressable onPress={() => router.push('/')}>
          <Text style={styles.button}>Logout</Text>
        </Pressable>
      </View>

      <View style={styles.findButtonTextContainer}>
        <Pressable >
          <Text style={styles.button}>Button 1: Find Nearby Study Groups</Text>
        </Pressable>
      </View>

      <View style={styles.createButtonTextContainer}>
        <Pressable>
          <Text style={styles.button}>Button 2: Create Your Own Group</Text>
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

  findButtonTextContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 200,
  },

  createButtonTextContainer: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  coordinateTextContainer: {
    flex: 2,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 25,
  },

  text: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 25,
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});