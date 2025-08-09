import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  Image,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, type Region } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

type MarkerData = {
  id: number;
  name: string;
  message: string;
  latitude: number;
  longitude: number;
  iconUrl?: string;
};

const markersData: MarkerData[] = [
  {
    id: 1,
    name: "test1",
    message: "テストとと",
    latitude: 34.3853,
    longitude: 132.4553,
  },
  {
    id: 2,
    name: "test2",
    message: "ふが",
    latitude: 34.3956,
    longitude: 132.4596,
  },
  {
    id: 3,
    name: "test3",
    message: "ほげほげほげ",
    latitude: 34.3947,
    longitude: 132.4519,
  },
];

export default function HomeScreen() {
  const [initRegion, setInitRegion] = useState<Region | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);

  useEffect(() => {
    // 現在地情報を取得
    const getCurrentLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("位置情報へのアクセスが拒否されました");
          // デフォルト位置
          setInitRegion({
            latitude: 34.3956,
            longitude: 132.4596,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setInitRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
        setLoading(false);
      } catch (error) {
        console.error("現在地情報取得エラー：", error);
        setError("現在地情報を取得できませんでした");
        // エラーのデフォルト位置
        setInitRegion({
          latitude: 34.3956,
          longitude: 132.4596,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
        setLoading(false);
      }
    };

    getCurrentLocation();
    setMarkers(markersData);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>マップを読み込んでいます...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      {initRegion && (
        <MapView
          style={styles.mapContainer}
          region={initRegion}
          showsUserLocation={true}
          provider={Platform.OS === "android" ? "google" : undefined}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              onPress={() => setSelectedMarker(marker)}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
            >
              {marker.iconUrl ? (
                <View style={styles.markerContainer}>
                  <Image
                    source={{ uri: marker.iconUrl }}
                    style={styles.markerImage}
                  />
                </View>
              ) : (
                <View style={styles.markerContainer}>
                  <Image
                    source={require("../assets/images/no-profile.png")}
                    style={styles.markerImage}
                  />
                </View>
              )}
            </Marker>
          ))}
        </MapView>
      )}
      {selectedMarker && (
        <View style={styles.mockupBox}>
          <View style={styles.mockupHeader}>
            <Text style={styles.name}>{selectedMarker.name}</Text>
            <TouchableOpacity
              style={styles.closeIconButton}
              onPress={() => setSelectedMarker(null)}
            >
              <Ionicons name="close-sharp" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <Text style={styles.message}>{selectedMarker.message}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
  mockupBox: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 8,
  },
  mockupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  closeIconButton: {
    padding: 4,
  },
  message: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  closeButton: {
    marginTop: 12,
    color: "#007AFF",
    textAlign: "right",
  },
});
