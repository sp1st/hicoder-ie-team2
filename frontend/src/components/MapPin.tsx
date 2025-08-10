import { pinStyle } from "@/style/Pin";
import { Image, Text, View } from "react-native";
import { Marker } from "react-native-maps";
import TruncateMessage from "./TruncateMessage";
import type { MarkerData } from "@/types/Marker";

type MapPinProps = {
  pins: MarkerData[];
  setSelectedPin: (pin: MarkerData) => void;
};

const MapPin = ({ pins, setSelectedPin }: MapPinProps) => {
  return (
    <>
      {pins.map((pin) => {
        const iconSource = pin.iconUrl
          ? { uri: pin.iconUrl }
          : require("../assets/images/no-profile.png");

        return (
          <Marker
            key={pin.id}
            onPress={() => setSelectedPin(pin)}
            coordinate={{
              latitude: pin.lat,
              longitude: pin.lon,
            }}
          >
            <View>
              <View style={pinStyle.bubbleContainer}>
                <View style={pinStyle.bubble}>
                  <Text style={pinStyle.text}>
                    {TruncateMessage(pin.message)}
                  </Text>
                </View>
                <View style={pinStyle.arrow} />
              </View>
              <View style={pinStyle.markerContainer}>
                <View style={pinStyle.iconContainer}>
                  <Image source={iconSource} style={pinStyle.markerImage} />
                </View>
              </View>
            </View>
          </Marker>
        );
      })}
    </>
  );
};
export default MapPin;
