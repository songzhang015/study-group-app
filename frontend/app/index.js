import { Text, View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.push('/home')}>
        <Text style={styles.button}>Login to Study Group App</Text>
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