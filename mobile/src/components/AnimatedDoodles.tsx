import { Feather, Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  ViewStyle,
} from "react-native";

type DoodleType =
  | "compass"
  | "map"
  | "plane"
  | "pin"
  | "users"
  | "briefcase"
  | "globe"
  | "navigation";

type DoodleProps = {
  type: DoodleType;
  size?: number;
  left: number;
  top: number;
  rotation?: number;
  delay?: number;
  duration?: number;
};

function Doodle({
  type,
  size = 42,
  left,
  top,
  rotation = 0,
  delay = 0,
  duration = 7000,
}: DoodleProps) {
  const float = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(float, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
      ])
    );

    const fadeAnimation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(fade, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.delay(duration - 3600 > 0 ? duration - 3600 : 1000),
        Animated.timing(fade, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );

    floatAnimation.start();
    fadeAnimation.start();

    return () => {
      floatAnimation.stop();
      fadeAnimation.stop();
    };
  }, [delay, duration, fade, float]);

  const translateY = float.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -14, 0],
  });

  const translateX = float.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 7, 0],
  });

  const rotate = float.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [
      `${rotation - 4}deg`,
      `${rotation + 4}deg`,
      `${rotation - 4}deg`,
    ],
  });

  const opacity = fade.interpolate({
    inputRange: [0, 1],
    outputRange: [0.035, 0.12],
  });

  const style: ViewStyle = {
    position: "absolute",
    left,
    top,
  };

  function renderIcon() {
    const color = "#aaa2ff";

    switch (type) {
      case "plane":
        return (
          <Ionicons
            name="airplane-outline"
            size={size}
            color={color}
          />
        );

      case "compass":
        return (
          <Ionicons
            name="compass-outline"
            size={size}
            color={color}
          />
        );

      case "map":
        return (
          <Ionicons
            name="map-outline"
            size={size}
            color={color}
          />
        );

      case "pin":
        return (
          <Ionicons
            name="location-outline"
            size={size}
            color={color}
          />
        );

      case "users":
        return (
          <Ionicons
            name="people-outline"
            size={size}
            color={color}
          />
        );

      case "briefcase":
        return (
          <Feather
            name="briefcase"
            size={size}
            color={color}
          />
        );

      case "globe":
        return (
          <Ionicons
            name="globe-outline"
            size={size}
            color={color}
          />
        );

      case "navigation":
        return (
          <Ionicons
            name="navigate-outline"
            size={size}
            color={color}
          />
        );
    }
  }

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.doodle,
        style,
        {
          opacity,
          transform: [
            { translateX },
            { translateY },
            { rotate },
          ],
        },
      ]}
    >
      {renderIcon()}
    </Animated.View>
  );
}

export default function AnimatedDoodles() {
  return (
    <Animated.View
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
    >
      <Doodle
        type="compass"
        size={54}
        left={25}
        top={125}
        rotation={-15}
        delay={0}
        duration={7600}
      />

      <Doodle
        type="plane"
        size={46}
        left={315}
        top={190}
        rotation={12}
        delay={900}
        duration={6800}
      />

      <Doodle
        type="map"
        size={58}
        left={-8}
        top={390}
        rotation={-8}
        delay={1500}
        duration={8200}
      />

      <Doodle
        type="pin"
        size={42}
        left={335}
        top={475}
        rotation={10}
        delay={500}
        duration={7200}
      />

      <Doodle
        type="navigation"
        size={50}
        left={35}
        top={650}
        rotation={18}
        delay={1900}
        duration={7900}
      />

      <Doodle
        type="globe"
        size={52}
        left={325}
        top={760}
        rotation={-12}
        delay={1100}
        duration={8500}
      />

      <Doodle
        type="users"
        size={45}
        left={-5}
        top={900}
        rotation={8}
        delay={2200}
        duration={7300}
      />

      <Doodle
        type="briefcase"
        size={48}
        left={320}
        top={1040}
        rotation={-10}
        delay={700}
        duration={8100}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  doodle: {
    zIndex: 0,
  },
});