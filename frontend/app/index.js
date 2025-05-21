import { Text, View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login Screen</Text>
      <Pressable onPress={() => router.push('/home')}>
        <Text style={styles.button}>Go to Home Screen</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
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