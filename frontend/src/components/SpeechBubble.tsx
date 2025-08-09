import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function SpeechBubbleExample() {
  return (
    <View style={styles.container}>
      {/* 吹き出し */}
      <View style={styles.bubbleContainer}>
        <View style={styles.bubble}>
          <Text style={styles.text}>発表終わった！</Text>
        </View>
        {/* 吹き出しの三角 */}
        <View style={styles.arrow} />
      </View>

      {/* アイコン */}
      <Image
        source={{ uri: "https://placekitten.com/80/80" }}
        style={styles.icon}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 50,
  },
  bubbleContainer: {
    alignItems: "center",
    marginBottom: 5,
  },
  bubble: {
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    fontSize: 14,
    color: "#000",
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#fff",
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
