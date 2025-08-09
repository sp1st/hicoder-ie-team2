import { StyleSheet, View, Text } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 26, fontWeight: "bold" }}>Profile Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
