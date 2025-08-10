import { FlatList } from "react-native";
import { YStack, XStack, Text, Circle, Card, H2, Stack } from "tamagui";
import { NotificationData } from "../components/NotificationData";
import type { UserStamp } from "../constants/api";

interface NotificationCardProps {
  item: UserStamp;
}

const NotificationCard = ({ item }: NotificationCardProps) => {
  // Format date to display in readable format
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return "Today";
    } else if (days === 1) {
      return "Yesterday";
    } else {
      return `${days} days ago`;
    }
  };

  return (
    <Card
      style={{
        backgroundColor: "#fff",
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#000",
        marginBottom: 12,
      }}
      padding="$4"
      elevate
    >
      <XStack gap="$3" alignItems="flex-start">
        {/* Profile Icon */}
        <Circle
          size={60}
          style={{
            backgroundColor: "#f0f0f0",
            borderWidth: 2,
            borderColor: "#000",
          }}
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize={20} fontWeight="bold" color="#000">
            U
          </Text>
        </Circle>

        {/* Main Content */}
        <YStack flex={1} gap="$3">
          {/* Header with username and date */}
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={16} fontWeight="500" color="#000">
              username
            </Text>
            <Text
              fontSize={12}
              color="#666"
              style={{
                borderWidth: 1,
                borderColor: "#000",
                borderRadius: 8,
                paddingHorizontal: 8,
                paddingVertical: 4,
              }}
            >
              {formatDate(item.created_at)}
            </Text>
          </XStack>

          {/* Stamps section */}
          <XStack gap="$3">
            {/* Main Stamp */}
            <Card
              flex={2}
              style={{
                backgroundColor: "#f9f9f9",
                borderWidth: 2,
                borderColor: "#000",
                borderRadius: 8,
                minHeight: 80,
              }}
              padding="$4"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize={14} color="#000" textAlign="center">
                Stamp
              </Text>
            </Card>

            {/* Response Stamp */}
            <Card
              flex={1}
              style={{
                backgroundColor: "#f9f9f9",
                borderWidth: 2,
                borderColor: "#000",
                borderRadius: 8,
                minHeight: 80,
              }}
              padding="$2"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize={11} color="#000" textAlign="center" lineHeight={14}>
                {item.after_stamp ? "respond\nstamp" : "respond\nstamp"}
              </Text>
            </Card>
          </XStack>
        </YStack>
      </XStack>
    </Card>
  );
};

export default function Notifications() {
  return (
    <YStack flex={1} style={{ backgroundColor: "#fff", paddingTop: 50 }} paddingHorizontal="$4">
      <H2 textAlign="center" marginBottom="$5">
        Notifications
      </H2>
      <FlatList
        data={NotificationData}
        keyExtractor={(item) => item.user_stamp_id.toString()}
        renderItem={({ item }) => <NotificationCard item={item} />}
        style={{ flex: 1 }}
      />
    </YStack>
  );
}
