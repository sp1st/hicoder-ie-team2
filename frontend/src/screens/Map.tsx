import { useEffect, useState } from "react";
import { StyleSheet, Platform } from "react-native";
import MapView, { type Region } from "react-native-maps";
import * as Location from "expo-location";
import {
  Button,
  Sheet,
  YStack,
  XStack,
  View,
  Text,
  RadioGroup,
  Slider,
  TextArea,
  Label,
  Paragraph,
  XGroup,
} from "tamagui";
import { Coffee, GlassWater } from "@tamagui/lucide-icons";
import type { MarkerData } from "@/types/Marker";
import Mockup from "@/components/Mockup";
import MapPin from "@/components/MapPin";
import usePin from "@/hooks/usePin";
// import { markerData } from "@/components/PinData";

export default function Map() {
  const [initRegion, setInitRegion] = useState<Region | null>(null);
  const [pins, setPins] = useState<MarkerData[]>([]);
  const [selectedPin, setSelectedPin] = useState<MarkerData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // State for bottom sheet form
  const [drinkType, setDrinkType] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(500);
  const [comment, setComment] = useState<string>("");

  const { markerData } = usePin();

  useEffect(() => {
    const init = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Location permission denied");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setInitRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    };
    init();
    setPins(markerData);
  }, []);

  return (
    <View style={styles.container}>
      {errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : (
        <>
          <MapView
            style={styles.map}
            region={initRegion || undefined}
            showsUserLocation
            provider={Platform.OS === "android" ? "google" : undefined}
          >
            <MapPin pins={pins} setSelectedPin={setSelectedPin} />
          </MapView>

          {selectedPin && (
            <Mockup selectedPin={selectedPin} setSelectedPin={setSelectedPin} />
          )}

          {/* Floating Action Button */}
          <View style={styles.recordButton}>
            <YStack position="absolute" b={20} l={20}>
              <Button
                size="$6"
                circular
                icon={GlassWater}
                onPress={() => setSheetOpen(true)}
                bg="cyan"
              />
            </YStack>
          </View>

          {/* Bottom Sheet Modal */}
          <Sheet
            modal
            open={sheetOpen}
            onOpenChange={setSheetOpen}
            snapPointsMode="percent"
            dismissOnSnapToBottom
            snapPoints={[95, 45]}
            animation="medium"
          >
            <Sheet.Overlay />
            <Sheet.Frame p="$4" gap="$4" disableHideBottomOverflow>
              {/* Header */}
              <XStack justify="center">
                <Paragraph size="$7" fontWeight="700">
                  飲んだものを記録
                </Paragraph>
              </XStack>

              {/* 種類 --------------------------------------- */}
              <YStack gap="$2">
                <Label size="$4" fontWeight="600">
                  種類 <Paragraph color="$red10">必須</Paragraph>
                </Label>

                <RadioGroup
                  value={drinkType ?? ""}
                  onValueChange={setDrinkType}
                  aria-label="drink-type"
                >
                  <XGroup bordered height="$9" width="100%" gap="$2">
                    {/* お茶 */}
                    <RadioGroup.Item asChild value="tea" height={"100%"}>
                      <Button
                        flex={1}
                        pressStyle={{ bg: "purple", scale: 0.98 }}
                      >
                        <Coffee size={18} />
                        <Paragraph ml="$2">お茶</Paragraph>
                      </Button>
                    </RadioGroup.Item>

                    {/* 牛乳 */}
                    <RadioGroup.Item asChild value="milk" height={"100%"}>
                      <Button
                        flex={1}
                        pressStyle={{ bg: "purple", scale: 0.98 }}
                      >
                        <GlassWater size={18} />
                        <Paragraph ml="$2">牛乳</Paragraph>
                      </Button>
                    </RadioGroup.Item>
                  </XGroup>
                </RadioGroup>
              </YStack>

              {/* 量 ----------------------------------------- */}
              <YStack gap="$2">
                <Label size="$4" fontWeight="600">
                  量 <Paragraph color="$red10">必須</Paragraph>
                </Label>

                <XStack items="center" gap="$3">
                  <Paragraph width={50}>{amount}ml</Paragraph>
                  <Slider
                    size="$2"
                    width="80%"
                    value={[amount]}
                    max={1000}
                    step={50}
                    onValueChange={([val]) => setAmount(val)}
                  >
                    <Slider.Track>
                      <Slider.TrackActive />
                    </Slider.Track>
                    <Slider.Thumb circular index={0} />
                  </Slider>
                </XStack>

                <XStack justify="space-between">
                  <Paragraph size="$2">0 ml</Paragraph>
                  <Paragraph size="$2">1000 ml</Paragraph>
                </XStack>
              </YStack>

              {/* コメント ----------------------------------- */}
              <YStack gap="$2">
                <Label size="$4" fontWeight="600">
                  コメント
                </Label>
                <TextArea
                  placeholder="コメントを入力できます…"
                  size="$6"
                  value={comment}
                  onChangeText={setComment}
                  numberOfLines={4}
                />
              </YStack>

              {/* 送信ボタン --------------------------------- */}
              <XStack justify="flex-end" mt="$4">
                <Button
                  disabled={!drinkType || amount === 0}
                  onPress={() => {
                    // TODO: send to API / AsyncStorage
                    console.log({ drinkType, amount, comment });
                    setSheetOpen(false);
                  }}
                >
                  記録する
                </Button>
              </XStack>
            </Sheet.Frame>
          </Sheet>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%", zIndex: -20 },
  recordButton: { zIndex: -10 },
});
