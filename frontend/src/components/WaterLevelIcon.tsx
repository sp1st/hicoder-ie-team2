import React, { useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from "react-native-reanimated";
import type { User } from "@/types/User";
import Svg, {
  Defs,
  ClipPath,
  Path,
  Circle,
  Image as SvgImage,
} from "react-native-svg";
void SvgImage; //ごめんなさい、lint回避

type WaterLevelIconProps = {
  progress: number;
  iconSource: User["photo_url"] | { uri: string } | number;
};

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function WaterLevelIcon({
  progress,
  iconSource,
}: WaterLevelIconProps) {
  const waveOffset = useSharedValue(0);
  const waterHeight = useSharedValue(40);

  // 水位アニメーション（progress=1 →満タン, 0 →空）
  useEffect(() => {
    const targetHeight = 40 * progress;
    waterHeight.value = withTiming(targetHeight, { duration: 2000 });
  });

  const animatedWaveProps = useAnimatedProps(() => {
    const waveY = 40 - waterHeight.value;
    const offsetX = waveOffset.value;
    const path = `
      M ${-20 + offsetX} ${waveY}
      Q ${-10 + offsetX} ${waveY - 5}, ${0 + offsetX} ${waveY}
      T ${20 + offsetX} ${waveY}
      T ${40 + offsetX} ${waveY}
      V 40 H -20 Z
    `;
    return { d: path };
  });

  return (
    <View style={styles.container}>
      <Svg width={40} height={40}>
        <Defs>
          <ClipPath id="clip">
            <Circle cx={20} cy={20} r={20} />
          </ClipPath>
        </Defs>

        {/* 白い円の背景 */}
        <Circle
          cx={20}
          cy={20}
          r={20}
          fill="white"
          stroke="#ddd"
          strokeWidth={1}
        />

        {/* 水部分（波形） - 白い円の上に */}
        <AnimatedPath
          animatedProps={animatedWaveProps}
          fill="#00BFFF"
          clipPath="url(#clip)"
        />
      </Svg>

      {/* アイコンを絶対配置で上に重ねる */}
      <View style={styles.iconContainer}>
        {typeof iconSource === "number" ? (
          <Image source={iconSource} style={styles.markerImage} />
        ) : (
          <Image
            source={
              typeof iconSource === "string" ? { uri: iconSource } : iconSource
            }
            style={styles.markerImage}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    position: "absolute",
    top: 3,
    left: 3,
    width: 34,
    height: 34,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  markerImage: {
    width: 34,
    height: 34,
    borderRadius: 14,
  },
});
