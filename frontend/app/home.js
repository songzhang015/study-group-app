import { Text, View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location'

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.push('/')}>
        <Text style={styles.button}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 25,
    paddingRight: 20,
  },
  text: {
    color: '#fff',
  },

  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});