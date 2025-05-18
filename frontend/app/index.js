import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Hello, World!</Text>
      <Text>Edit app/index.js to edit this screen.</Text>
      <Text>All edits should appear realtime as you save/edit.</Text>
    </View>
  );
}
