import { useEffect, useState } from "react";
import { Avatar, Button, H2, H4, Stack, TamaguiProvider, Text, View, XStack, YStack } from "tamagui";
import { config } from "tamagui.config";
import WaterRecords from "../components/WaterRecords";
import { API_ENDPOINTS } from "../constants/api";
import { X } from "@tamagui/lucide-icons";
import { Linking } from "react-native";

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
            {userData?.X && (
              <Button
                icon={<X />}
                onPress={() => {
                  // React Native or Expo
                  Linking.openURL(userData.X as string);
                }}
              />
            )}
          </YStack>
        </XStack>
        {userData?.bio && (
          <Stack style={{ borderWidth: 1, borderColor: "$blue3", borderRadius: 12 }} p={20} mb={20}>
            <H4>Bio</H4>
            <Text>{userData.bio}</Text>
          </Stack>
        )}
        <WaterRecords userId="2" />
      </View>
    </TamaguiProvider>
  );
}

