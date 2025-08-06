import { registerRootComponent } from "expo";
import { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import MapView, { LatLng, Region } from "react-native-maps";
import * as Location from "expo-location";

import MapPin from "@/components/MapPin";

// ---------- Local types ----------
type MyMarker = {
  id: number;
  coord: LatLng;
  ratio: number; // 0 (blue) → 1 (red)
};

// ---------- Static pin data ----------
const markersData: MyMarker[] = [
  {
    id: 1,
    coord: { latitude: 34.4013448, longitude: 132.4549913 },
    ratio: 0.5,
  },
];

export default function Map() {
  const [initRegion, setInitRegion] = useState<Region | null>(null);
  const [pins, setPins] = useState<MyMarker[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Location permission denied");
        return;
      }
      try {
        const location = await Location.getCurrentPositionAsync({});
        setInitRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } catch (err) {
        console.error("Failed to fetch location:", err);
      }
    };

    getCurrentLocation();
    setPins(markersData);
  }, []);

  return (
    <View style={styles.container}>
      {errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : (
        <MapView
          style={styles.map}
          region={initRegion || undefined}
          showsUserLocation
          provider="google"
        >
          {pins.map((p) => (
            <MapPin key={p.id} coord={p.coord} ratio={p.ratio} />
          ))}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

registerRootComponent(Map);
