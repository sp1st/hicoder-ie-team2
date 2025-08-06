import { type LatLng, Marker } from "react-native-maps";
import { interpolateColor } from "react-native-reanimated";

export default function MapPin({
  coord,
  ratio,
}: {
  coord: LatLng;
  ratio: number;
}) {
  /* ratio 0→青, 1→赤 */
  const color = interpolateColor(ratio, [0, 1], ["#38bdf8", "#ef4444"]);
  return <Marker coordinate={coord} pinColor={color} />;
}
