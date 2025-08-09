import { StyleSheet } from "react-native";

export const pinStyle = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    zIndex: 1,
  },
  errorText: {
    backgroundColor: "rgba(255,0,0,0.8)",
    color: "white",
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
  },
  mapContainer: {
    flex: 1,
  },
  markerContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  markerImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  defaultMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "red",
  },

  closeButton: {
    marginTop: 12,
    color: "#007AFF",
    textAlign: "right",
  },
  details: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  bubbleContainer: {
    alignItems: "center",
    position: "absolute",
    top: -35,
    left: -70,
    width: 180,
  },

  bubble: {
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 16,
    maxWidth: 160,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    alignSelf: "center",
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
    alignSelf: "center",
  },
  text: {
    fontSize: 14,
    color: "#000",
  },
});
