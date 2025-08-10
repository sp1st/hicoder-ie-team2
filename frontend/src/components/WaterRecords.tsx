import { Coffee, Droplets, Milk } from "@tamagui/lucide-icons";
import { useEffect, useState } from "react";
import { H4, ScrollView, Stack, Text, XStack, YStack } from "tamagui";
import { getWaterRecords, type WaterRecord, type UserId } from "../constants/api";

export default function WaterRecords({ user_id }: { user_id: UserId }) {
  const [waterRecords, setWaterRecords] = useState<WaterRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWaterRecords(user_id).then((value) => {
      setWaterRecords(value);
      setLoading(false);
    });
  }, [user_id]);

  const getWaterTypeIcon = (waterType: string) => {
    switch (waterType) {
      case "お茶":
        return <Coffee size={24} color="$green9" />;
      case "牛乳":
        return <Milk size={24} color="$blue9" />;
      case "水":
        return <Droplets size={24} color="$blue9" />;
      default:
        return <Droplets size={24} color="$blue9" />;
    }
  };

  const getWaterTypeBackground = (waterType: string) => {
    switch (waterType) {
      case "お茶":
        return "$green3";
      case "牛乳":
        return "$blue3";
      case "水":
        return "$blue2";
      default:
        return "$white3";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Stack style={{ borderWidth: 1, borderColor: "$blue3", borderRadius: 12 }} p={20}>
        <H4>過去の記録</H4>
        <Text>読み込み中...</Text>
      </Stack>
    );
  }

  if (waterRecords.length === 0) {
    return (
      <Stack style={{ borderWidth: 1, borderColor: "$blue3", borderRadius: 12 }} p={20}>
        <H4>過去の記録</H4>
        <Text>記録がありません</Text>
      </Stack>
    );
  }

  return (
    <ScrollView style={{ borderWidth: 1, borderColor: "$blue3", borderRadius: 12 }} p={20}>
      <H4>過去の記録</H4>
      <YStack gap={10} mb={40}>
        {waterRecords.map((record) => (
          <Stack key={record.water_id} bg={getWaterTypeBackground(record.water_type)} p="$4">
            <XStack items="center" gap="$2">
              {getWaterTypeIcon(record.water_type)}
              <Text fontSize={18} fontWeight="bold">
                {record.water_type}
              </Text>
            </XStack>
            <Text fontSize={16}>{record.water_amount}ml</Text>
            <Text fontSize={14}>{formatDate(record.water_date.toString())}</Text>
            {record.comment && (
              <Text fontSize={14} mt="$1">
                {record.comment}
              </Text>
            )}
          </Stack>
        ))}
      </YStack>
    </ScrollView>
  );
}
