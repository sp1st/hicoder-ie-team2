import { YStack, XStack, Text, Card, ScrollView, Avatar, Image } from "tamagui";
import { NotificationData } from "../components/NotificationData";
import { getStampInfo, getStamps, getUserInfo, type Stamp, type User, type UserStamp } from "../constants/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import "dayjs/locale/ja";
import { useState } from "react";
// Enable plugins
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

// Use Japanese locale
dayjs.locale("ja");

// (Optional) Fine-tune Japanese strings if you like
dayjs.updateLocale("ja", {
  relativeTime: {
    future: "%s後",
    past: "%s前",
    s: "数秒",
    m: "1分",
    mm: "%d分",
    h: "1時間",
    hh: "%d時間",
    d: "1日",
    dd: "%d日",
    M: "1ヶ月",
    MM: "%dヶ月",
    y: "1年",
    yy: "%d年",
  },
});

interface NotificationCardProps {
  item: UserStamp;
}

const NotificationCard = ({ item }: NotificationCardProps) => {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [stamp, setStamp] = useState<Stamp | null>(null);
  const [stamps, setStamps] = useState<Stamp[]>([]);

  const formatDate = (date: Date) => {
    return dayjs(date).fromNow();
  };

  getUserInfo(item.sender_id).then(setUserInfo);
  getStampInfo(item.stamp_id).then(setStamp);
  getStamps().then(setStamps);

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
      <XStack gap="$3" items="flex-start">
        {/* Profile Icon */}
        <Avatar
          size={60}
          style={{
            backgroundColor: "#f0f0f0",
            borderWidth: 2,
            borderColor: "#000",
          }}
          items="center"
          justify="center"
          circular
        >
          <Avatar.Image
            source={{ uri: userInfo ? userInfo.photo_url : "" }}
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
            }}
          />
        </Avatar>

        {/* Main Content */}
        <YStack flex={1} gap="$3">
          {/* Header with username and date */}
          <XStack justify="space-between" items="center">
            <Text fontSize={16} fontWeight="500" color="#000">
              {userInfo ? userInfo.user_name : "Loading..."}
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
              items="center"
              justify="center"
            >
              <Image verticalAlign="center" source={{ uri: stamp ? stamp.image_url : "" }}></Image>
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
              items="center"
              justify="center"
            >
              {stamps.length > 0 ? (
                stamps.map((s) => (
                  <Image
                    key={s.stamp_id}
                    source={{ uri: s.image_url }}
                    style={{
                      width: 30,
                      height: 30
                    }}
                  />
                ))
              ) : (
                <Text fontSize={11} color="#000" verticalAlign="center" lineHeight={14}>
                  {item.after_stamp ? "respond\nstamp" : "respond\nstamp"}
                </Text>
              )}
            </Card>
          </XStack>
        </YStack>
      </XStack>
    </Card>
  );
};

export default function Notifications() {
  return (
    <YStack flex={1} style={{ backgroundColor: "#fff", paddingTop: 50 }} paddingInline="$4">
      <ScrollView>
        {NotificationData.map((item) => (
          <NotificationCard key={item.user_stamp_id} item={item} />
        ))}
      </ScrollView>
    </YStack>
  );
}
