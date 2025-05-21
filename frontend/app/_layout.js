import { Stack } from "expo-router";

export default function RootLayout() {
  return(
  <Stack>

    <Stack.Screen name="index" options={{ title: 'Login Title', headerBackVisible: false }} />
    <Stack.Screen name="home" options={{ title: 'Home Title', headerBackVisible: false }} />
  </Stack>
  )
}