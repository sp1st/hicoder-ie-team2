import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type WaterCupProps = {
  filled: boolean;
  index: number;
};

const WaterCup = ({ filled }: WaterCupProps) => (
  <View style={{ marginHorizontal: 4 }}>
    <Ionicons name="water" size={32} color={filled ? "#007AFF" : "#E0E0E0"} />
  </View>
);

type WaterProgressProps = {
  waterAmount: number;
  maxAmount?: number;
  cupsCount?: number;
};

const WaterProgress = ({
  waterAmount,
  maxAmount = 2000,
  cupsCount = 4,
}: WaterProgressProps) => {
  const amountPerCup = maxAmount / cupsCount;
  const filledCups = Math.floor(waterAmount / amountPerCup);

  return (
    <View style={{ alignItems: "center", marginVertical: 16 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {Array.from({ length: cupsCount }, (_, index) => (
          <WaterCup key={index} filled={index < filledCups} index={index} />
        ))}
      </View>

      <Text style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
        {waterAmount}ml / {maxAmount}ml
      </Text>
    </View>
  );
};

export default WaterProgress;
