import { Coffee, Milk } from "@tamagui/lucide-icons";
import { useEffect, useState } from "react";
import { Avatar, H2, H4, Stack, TamaguiProvider, Text, View, XStack, YStack } from "tamagui";
import { config } from "tamagui.config";
import { API_ENDPOINTS } from "../constants/api";

interface UserData {
  X?: string;
  bio?: string;
  photo_url?: string;
  user_id: string;
  user_name: string;
}

export default function Profile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const getUserData = (userId: string) => {
    return fetch(API_ENDPOINTS.USERS(userId))
      .then((response) => response.json())
      .catch((error) => {
        console.error("Error fetching user data:", error);
        return null;
      });
  };

  useEffect(() => {
    const userId = "2"; // Replace with actual user ID
    getUserData(userId).then((data) => {
      if (data) {
        setUserData(data);
      }
      setLoading(false);
    });
  }, []);

  return (
    <TamaguiProvider config={config}>
      <View flex={1} p={40} pt={60}>
        <XStack mb={20} gap={20} bg={"$blue3"} borderWidth={1} style={{ borderRadius: 12 }}>
          <Avatar size={150} bg={"$blue3"} circular>
            <Avatar.Image
              source={{
                uri: userData?.photo_url || "https://example.com/path/to/profile-image.jpg",
              }}
            />
            <Avatar.Fallback delayMs={500} height={150} justify={"center"} items="center">
              <Text>Loading...</Text>
            </Avatar.Fallback>
          </Avatar>
          <YStack>
            <H2
              style={{
                margin: 20,
                marginTop: 30,
                fontSize: 26,
                fontWeight: "bold",
              }}
            >
              {loading ? "Loading..." : userData?.user_name || "User Name"}
            </H2>
            <Stack items={"flex-end"}>
              <Text>{userData?.X ? `X(Twitter): ${userData.X}` : "X(Twitter)"}</Text>
            </Stack>
          </YStack>
        </XStack>
        {userData?.bio && (
          <Stack style={{ borderWidth: 1, borderColor: "$blue3", borderRadius: 12 }} p={20} mb={20}>
            <H4>Bio</H4>
            <Text>{userData.bio}</Text>
          </Stack>
        )}
        <Stack style={{ borderWidth: 1, borderColor: "$blue3", borderRadius: 12 }} p={20}>
          <H4>過去の記録</H4>
          <YStack gap={5}>
            <Stack bg="$green5" p="$4">
              <XStack>
                <Coffee size={24} color="$green9" />
                <Text fontSize={24} p={4}>
                  お茶
                </Text>
              </XStack>
              <Text>500ml</Text>
              <Text>2023年3月1日</Text>
            </Stack>
            <Stack bg="$white3" p="$4">
              <XStack>
                <Milk size={24} color="$white9" />
                <Text fontSize={24} p={4}>
                  牛乳
                </Text>
              </XStack>
              <Text>200ml</Text>
              <Text>2023年3月1日</Text>
            </Stack>
          </YStack>
        </Stack>
      </View>
    </TamaguiProvider>
  );
}

// user name
// bio
// X link
// photo url

