import { mockupStyle } from "@/style/Mockup";
import type { MarkerData } from "@/types/Marker";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import WaterProgress from "./WaterProgress";

import dayjs from "dayjs";
import ja from "dayjs/locale/ja";

type MockupProps = {
  selectedPin: MarkerData;
  setSelectedPin: (pin: MarkerData | null) => void;
};

const Mockup = ({ selectedPin, setSelectedPin }: MockupProps) => {
  dayjs.locale(ja);
  const formattedDate = dayjs(selectedPin.water_date).format(
    "M月D日（ddd）HH:mm"
  );
  return (
    <View style={mockupStyle.mockupBox}>
      <View style={mockupStyle.mockupHeader}>
        <Text style={mockupStyle.name}>{selectedPin.user_name}</Text>
        <Text style={mockupStyle.date}>{formattedDate}</Text>
        <TouchableOpacity
          style={mockupStyle.closeIconButton}
          onPress={() => setSelectedPin(null)}
        >
          <Ionicons name="close-sharp" size={24} color="#666" />
        </TouchableOpacity>
      </View>
      <Text style={mockupStyle.message}>{selectedPin.message}</Text>

      <WaterProgress waterAmount={selectedPin.water_amount} />
    </View>
  );
};
export default Mockup;
