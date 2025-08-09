import { Coffee, Milk, X } from "@tamagui/lucide-icons";
import {
  Avatar,
  H2,
  H4,
  Stack,
  TamaguiProvider,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";
import { config } from "tamagui.config";

export default function Profile() {
  return (
    <TamaguiProvider config={config}>
      <View flex={1} p={40} pt={60}>
        <XStack
          mb={20}
          gap={20}
          bg={"$blue3"}
          borderWidth={1}
          style={{ borderRadius: 12 }}
        >
          <Avatar size={150} bg={"$blue3"} circular>
            <Avatar.Image
              source={{
                uri: "https://example.com/path/to/profile-image.jpg",
              }}
            />
            <Avatar.Fallback
              delayMs={500}
              height={150}
              justify={"center"}
              items="center"
            >
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
              User Name
            </H2>
            <Stack items={"flex-end"}>
              <Text>X(Twitter)</Text>
            </Stack>
          </YStack>
        </XStack>
        <Stack
          style={{ borderWidth: 1, borderColor: "$blue3", borderRadius: 12 }}
          p={20}
        >
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
