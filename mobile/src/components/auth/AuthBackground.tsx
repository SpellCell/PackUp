import { LinearGradient } from "expo-linear-gradient";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Feather,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useEffect, useRef } from "react";

const { width, height } = Dimensions.get("window");

export default function AuthBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  const compassAnim = useRef(new Animated.Value(0)).current;
  const planeAnim = useRef(new Animated.Value(0)).current;
  const mapAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  const cyclistAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const compass = Animated.loop(
      Animated.sequence([
        Animated.timing(compassAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(compassAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );

    const plane = Animated.loop(
      Animated.sequence([
        Animated.timing(planeAnim, {
          toValue: 1,
          duration: 3500,
          useNativeDriver: true,
        }),
        Animated.timing(planeAnim, {
          toValue: 0,
          duration: 3500,
          useNativeDriver: true,
        }),
      ])
    );

    const map = Animated.loop(
      Animated.sequence([
        Animated.timing(mapAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(mapAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );

    const sparkle = Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    const cyclist = Animated.loop(
      Animated.timing(cyclistAnim, {
        toValue: 1,
        duration: 14000,
        useNativeDriver: true,
      })
    );

    compass.start();
    plane.start();
    map.start();
    sparkle.start();
    cyclist.start();

    return () => {
      compass.stop();
      plane.stop();
      map.stop();
      sparkle.stop();
      cyclist.stop();
    };
  }, []);

  const compassTranslate = compassAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });

  const planeTranslateX = planeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -18],
  });

  const planeTranslateY = planeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -14],
  });

  const mapTranslate = mapAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const sparkleScale = sparkleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1.15],
  });

  const cyclistTranslateX = cyclistAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-70, width + 70],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#050507", "#07060d", "#020305"]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />
      <View style={styles.glowThree} />

      <View style={styles.brand}>
        <Image
          source={require("../../../assets/images/PackUp.png")}
          style={styles.brandLogo}
          resizeMode="contain"
        />

        <Text style={styles.brandName}>PackUP</Text>
      </View>

      <Animated.View
        style={[
          styles.doodle,
          styles.compass,
          {
            transform: [{ translateY: compassTranslate }],
          },
        ]}
      >
        <Feather
          name="compass"
          size={42}
          color="rgba(190,184,255,0.5)"
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.doodle,
          styles.plane,
          {
            transform: [
              { translateX: planeTranslateX },
              { translateY: planeTranslateY },
              { rotate: "-18deg" },
            ],
          },
        ]}
      >
        <Feather
          name="send"
          size={34}
          color="rgba(190,184,255,0.5)"
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.doodle,
          styles.map,
          {
            transform: [
              { translateY: mapTranslate },
              { rotate: "7deg" },
            ],
          },
        ]}
      >
        <Feather
          name="map"
          size={40}
          color="rgba(190,184,255,0.5)"
          strokeWidth={1.3}
        />
      </Animated.View>

      <View style={[styles.doodle, styles.navigation]}>
        <Feather
          name="navigation"
          size={32}
          color="rgba(190,184,255,0.5)"
        />
      </View>

      <Animated.View
        style={[
          styles.doodle,
          styles.sparkle,
          {
            transform: [{ scale: sparkleScale }],
          },
        ]}
      >
        <MaterialCommunityIcons
          name="creation"
          size={27}
          color="rgba(255,255,255,0.5)"
        />
      </Animated.View>

      <View style={styles.cyclistRoute}>
        <View style={styles.routeLine} />

        <Animated.View
          style={[
            styles.cyclist,
            {
              transform: [{ translateX: cyclistTranslateX }],
            },
          ]}
        >
          <MaterialCommunityIcons
            name="bike"
            size={44}
            color="rgba(190,184,255,0.6)"
          />
        </Animated.View>
      </View>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050507",
    overflow: "hidden",
  },

  glowOne: {
    position: "absolute",
    width: 500,
    height: 500,
    borderRadius: 250,
    top: -180,
    left: -140,
    backgroundColor: "#635bff",
    opacity: 0.14,
  },

  glowTwo: {
    position: "absolute",
    width: 430,
    height: 430,
    borderRadius: 215,
    right: -100,
    bottom: -120,
    backgroundColor: "#22d3ee",
    opacity: 0.09,
  },

  glowThree: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    left: width * 0.48,
    top: height * 0.35,
    backgroundColor: "#a89cff",
    opacity: 0.045,
  },

  brand: {
    position: "absolute",
    top: 24,
    left: 22,
    zIndex: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  brandLogo: {
    width: 58,
    height: 58,
  },

  brandName: {
    color: "#ffffff",
    fontFamily: "DMSans_700Bold",
    fontSize: 20,
    letterSpacing: -0.6,
  },

  doodle: {
    position: "absolute",
    zIndex: 2,
  },

  compass: {
    top: height * 0.17,
    left: width * 0.08,
  },

  plane: {
    top: height * 0.19,
    right: width * 0.1,
  },

  map: {
    bottom: height * 0.19,
    right: width * 0.09,
  },

  navigation: {
    top: height * 0.44,
    left: width * 0.05,
  },

  sparkle: {
    top: height * 0.33,
    right: width * 0.08,
  },

  cyclistRoute: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: height * 0.18,
    height: 80,
    overflow: "hidden",
    zIndex: 2,
  },

  routeLine: {
    position: "absolute",
    left: "5%",
    right: "5%",
    bottom: 15,
    height: 1,
    borderBottomWidth: 1,
    borderStyle: "dashed",
    borderBottomColor: "rgba(168,156,255,0.2)",
  },

  cyclist: {
    position: "absolute",
    bottom: 10,
    left: 0,
  },
});