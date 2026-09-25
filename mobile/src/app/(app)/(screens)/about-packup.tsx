import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";

type Developer = {
  name: string;
  role: string;
  image: any;
  instagram: string;
  number: string;
};

const developers: Developer[] = [
  {
    name: "Vipul Raj",
    role: "CO-FOUNDER & CREATOR",
    image: require("../../../../assets/vipul.jpg"),
    instagram:
      "https://www.instagram.com/vipul.raaaj",
    number: "01",
  },
  {
    name: "Keshav Singh",
    role: "CO-FOUNDER & CREATOR",
    image: require("../../../../assets/keshav.jpg"),
    instagram:
      "https://www.instagram.com/keshavvv15",
    number: "02",
  },
];

export default function AboutPackUP() {
  const [activeDeveloper, setActiveDeveloper] =
    useState(0);

  const developer =
    developers[activeDeveloper];

  function previousDeveloper() {
    setActiveDeveloper((current) =>
      current === 0
        ? developers.length - 1
        : current - 1
    );
  }

  function nextDeveloper() {
    setActiveDeveloper(
      (current) =>
        (current + 1) % developers.length
    );
  }

  async function openInstagram() {
    await Linking.openURL(
      developer.instagram
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          "#08080d",
          "#0c0b14",
          "#050507",
        ]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={() => router.back()}
          >
            <Feather
              name="arrow-left"
              size={20}
              color="#ffffff"
            />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.headerEyebrow}>
              ABOUT PACKUP
            </Text>

            <Text style={styles.headerTitle}>
              The people behind PackUP
            </Text>
          </View>
        </View>

        {/* HERO */}

        <View style={styles.hero}>
          <Text style={styles.heroEyebrow}>
            THE PEOPLE BEHIND PACKUP
          </Text>

          <Text style={styles.heroTitle}>
            Built by
          </Text>

          <Text style={styles.heroAccent}>
            travellers.
          </Text>

          <Text style={styles.heroDescription}>
            PackUP was built by two travellers
            who wanted to make travelling with
            friends feel easier, more connected
            and more memorable.
          </Text>
        </View>

        {/* CREATOR */}

        <View style={styles.creatorCard}>
          <Image
            source={developer.image}
            style={styles.creatorImage}
          />

          <LinearGradient
            colors={[
              "transparent",
              "rgba(0,0,0,0.95)",
            ]}
            style={styles.creatorOverlay}
          />

          <View style={styles.creatorNumber}>
            <Text style={styles.numberText}>
              {developer.number}
            </Text>

            <Text
              style={[
                styles.numberText,
                styles.numberMuted,
              ]}
            >
              {" / "}
              02
            </Text>
          </View>

          <View style={styles.creatorInfo}>
            <Text style={styles.creatorRole}>
              {developer.role}
            </Text>

            <Text style={styles.creatorName}>
              {developer.name}
            </Text>
          </View>
        </View>

        {/* CREATOR CONTROLS */}

        <View style={styles.controls}>
          <View style={styles.dots}>
            {developers.map(
              (item, index) => (
                <TouchableOpacity
                  key={item.name}
                  activeOpacity={0.8}
                  onPress={() =>
                    setActiveDeveloper(index)
                  }
                  style={[
                    styles.dot,
                    index === activeDeveloper &&
                      styles.dotActive,
                  ]}
                />
              )
            )}
          </View>

          <View style={styles.arrows}>
            <TouchableOpacity
              style={styles.arrow}
              activeOpacity={0.8}
              onPress={previousDeveloper}
            >
              <Feather
                name="arrow-left"
                size={17}
                color="#ffffff"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.arrow}
              activeOpacity={0.8}
              onPress={nextDeveloper}
            >
              <Feather
                name="arrow-right"
                size={17}
                color="#ffffff"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* CREATOR INFORMATION */}

        <View style={styles.infoCard}>
          <Text style={styles.infoRole}>
            FOUNDERS & CREATORS
          </Text>

          <Text style={styles.infoName}>
            {developer.name}
          </Text>

          <Text style={styles.infoDescription}>
            One of the creators behind PackUP,
            building a platform designed around
            real travel experiences and the people
            you share them with.
          </Text>

          <TouchableOpacity
            style={styles.instagramButton}
            activeOpacity={0.8}
            onPress={openInstagram}
          >
            <Ionicons
              name="logo-instagram"
              size={18}
              color="#ffffff"
            />

            <Text style={styles.instagramText}>
              Follow on Instagram
            </Text>

            <Feather
              name="arrow-up-right"
              size={15}
              color="#ffffff"
            />
          </TouchableOpacity>
        </View>

        {/* OUR STORY */}

        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>
            OUR STORY
          </Text>

          <Text style={styles.sectionTitle}>
            Why we built PackUP
          </Text>

          <Text style={styles.paragraph}>
            Group trips often mean endless chats,
            scattered plans, confusing expenses
            and too many different apps.
          </Text>

          <Text style={styles.paragraph}>
            PackUP was created to bring those
            things together in one place.
          </Text>

          <Text style={styles.paragraph}>
            Create a trip, bring your friends
            together, communicate with your group,
            manage expenses and share the journey
            from one platform.
          </Text>
        </View>

        {/* THE IDEA */}

        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>
            THE IDEA
          </Text>

          <Text style={styles.sectionTitle}>
            Everything around the journey
          </Text>

          <Feature
            icon="map-outline"
            title="Create & discover trips"
            description="Plan trips and bring the right people together."
          />

          <Feature
            icon="chatbubble-ellipses-outline"
            title="Stay connected"
            description="Chat with your trip group without jumping between apps."
          />

          <Feature
            icon="wallet-outline"
            title="Manage expenses"
            description="Keep group expenses and settlements organised."
          />

          <Feature
            icon="images-outline"
            title="Share memories"
            description="Keep your trip conversations and memories together."
          />
        </View>

        {/* FINAL QUOTE FROM WEB HOME */}

        <View style={styles.quoteCard}>
          <Text style={styles.quoteMark}>
            "
          </Text>

          <Text style={styles.quote}>
            The best journeys are the ones
            you remember together.
          </Text>

          <Text style={styles.quoteLabel}>
            — THE PACKUP TEAM
          </Text>
        </View>

        {/* FOOTER */}

        <View style={styles.footer}>
          <Ionicons
            name="compass-outline"
            size={24}
            color="#aaa2ff"
          />

          <Text style={styles.footerTitle}>
            PackUP
          </Text>

          <Text style={styles.footerText}>
            Built for journeys worth remembering.
          </Text>

          <Text style={styles.version}>
            PackUP Mobile • v1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.feature}>
      <View style={styles.featureIcon}>
        <Ionicons
          name={icon}
          size={20}
          color="#aaa2ff"
        />
      </View>

      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>
          {title}
        </Text>

        <Text style={styles.featureDescription}>
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050507",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 50,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#17171d",
    borderWidth: 1,
    borderColor: "#292832",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  headerText: {
    flex: 1,
  },

  headerEyebrow: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 9,
    letterSpacing: 2,
    color: "#777482",
  },

  headerTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 20,
    color: "#ffffff",
    marginTop: 4,
  },

  hero: {
    marginBottom: 22,
  },

  heroEyebrow: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 9,
    letterSpacing: 2.2,
    color: "#777482",
    marginBottom: 8,
  },

  heroTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 32,
    color: "#ffffff",
    letterSpacing: -1,
  },

  heroAccent: {
    fontFamily: "MrDafoe",
    fontSize: 43,
    lineHeight: 55,
    color: "#c2bcff",
    marginTop: -3,
    marginLeft: 2,
  },

  heroDescription: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    lineHeight: 20,
    color: "#85818e",
    marginTop: 8,
  },

  creatorCard: {
    height: 360,
    borderRadius: 25,
    overflow: "hidden",
    backgroundColor: "#101016",
    borderWidth: 1,
    borderColor: "#302c43",
    position: "relative",
  },

  creatorImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  creatorOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "65%",
  },

  creatorNumber: {
    position: "absolute",
    right: 20,
    top: 20,
    flexDirection: "row",
  },

  numberText: {
    fontFamily: "DMSans_700Bold",
    fontSize: 10,
    letterSpacing: 2.5,
    color: "rgba(255,255,255,0.75)",
  },

  numberMuted: {
    color: "rgba(255,255,255,0.25)",
  },

  creatorInfo: {
    position: "absolute",
    left: 21,
    right: 21,
    bottom: 21,
  },

  creatorRole: {
    fontFamily: "DMSans_700Bold",
    fontSize: 9,
    letterSpacing: 2.2,
    color: "#aaa2ff",
    marginBottom: 6,
  },

  creatorName: {
    fontFamily: "DMSans_700Bold",
    fontSize: 27,
    color: "#ffffff",
  },

  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
  },

  dots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  dot: {
    width: 18,
    height: 3,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.2)",
  },

  dotActive: {
    width: 42,
    backgroundColor: "#c2bcff",
  },

  arrows: {
    flexDirection: "row",
    gap: 8,
  },

  arrow: {
    width: 41,
    height: 41,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
    justifyContent: "center",
  },

  infoCard: {
    marginTop: 17,
    padding: 19,
    borderRadius: 21,
    backgroundColor: "#101016",
    borderWidth: 1,
    borderColor: "#24232d",
  },

  infoRole: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 9,
    letterSpacing: 2,
    color: "#777482",
  },

  infoName: {
    fontFamily: "DMSans_700Bold",
    fontSize: 22,
    color: "#ffffff",
    marginTop: 5,
  },

  infoDescription: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    lineHeight: 19,
    color: "#85818e",
    marginTop: 9,
  },

  instagramButton: {
    height: 47,
    borderRadius: 14,
    backgroundColor: "#181722",
    borderWidth: 1,
    borderColor: "#302c43",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 17,
  },

  instagramText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 12,
    color: "#ffffff",
  },

  section: {
    marginTop: 38,
  },

  sectionEyebrow: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 9,
    letterSpacing: 2.2,
    color: "#777482",
    marginBottom: 7,
  },

  sectionTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 23,
    color: "#ffffff",
    letterSpacing: -0.5,
    marginBottom: 13,
  },

  paragraph: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    lineHeight: 21,
    color: "#85818e",
    marginBottom: 13,
  },

  feature: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 17,
    backgroundColor: "#101016",
    borderWidth: 1,
    borderColor: "#24232d",
    marginBottom: 9,
  },

  featureIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "#181722",
    borderWidth: 1,
    borderColor: "#302c43",
    alignItems: "center",
    justifyContent: "center",
  },

  featureContent: {
    flex: 1,
    marginLeft: 13,
  },

  featureTitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: "#ffffff",
  },

  featureDescription: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    lineHeight: 17,
    color: "#777482",
    marginTop: 3,
  },

  quoteCard: {
    marginTop: 38,
    padding: 22,
    borderRadius: 22,
    backgroundColor: "#17152a",
    borderWidth: 1,
    borderColor: "#302b55",
  },

  quoteMark: {
    fontFamily: "DMSans_700Bold",
    fontSize: 38,
    lineHeight: 30,
    color: "#aaa2ff",
  },

  quote: {
    fontFamily: "MrDafoe",
    fontSize: 27,
    lineHeight: 38,
    color: "#ffffff",
    marginTop: 8,
  },

  quoteLabel: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 8,
    letterSpacing: 1.7,
    color: "#777482",
    marginTop: 14,
  },

  footer: {
    alignItems: "center",
    marginTop: 45,
  },

  footerTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 20,
    color: "#ffffff",
    marginTop: 8,
  },

  footerText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: "#777482",
    marginTop: 4,
  },

  version: {
    fontFamily: "DMSans_400Regular",
    fontSize: 9,
    color: "#4f4c57",
    marginTop: 17,
  },
});