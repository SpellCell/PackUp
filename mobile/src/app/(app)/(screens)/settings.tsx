import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

type SettingItemProps = {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle: string;
  onPress?: () => void;
};

function SettingItem({
  icon,
  title,
  subtitle,
  onPress,
}: SettingItemProps) {
  return (
    <TouchableOpacity
      style={styles.item}
      activeOpacity={0.75}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.iconBox}>
        <Feather name={icon} size={19} color="#c2bcff" />
      </View>

      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemSubtitle}>{subtitle}</Text>
      </View>

      {onPress && (
        <Feather
          name="chevron-right"
          size={19}
          color="#666"
        />
      )}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  function openChangePassword() {
    router.push(
      "/(app)/(screens)/change-password"
    );
  }

  function openNotifications() {
    router.push(
      "/(app)/(screens)/notifications"
    );
  }

  function openAboutPackUP() {
    router.push(
      "/(app)/(screens)/about-packup"
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.75}
            onPress={() => router.back()}
          >
            <Feather
              name="arrow-left"
              size={21}
              color="#ffffff"
            />
          </TouchableOpacity>

          <View>
            <Text style={styles.eyebrow}>PACKUP</Text>
            <Text style={styles.title}>Settings</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          ACCOUNT
        </Text>

        <View style={styles.card}>
          <SettingItem
            icon="lock"
            title="Change Password"
            subtitle="Update your account password"
            onPress={openChangePassword}
          />

          <View style={styles.divider} />

          <SettingItem
            icon="bell"
            title="Notifications"
            subtitle="View your PackUP notifications"
            onPress={openNotifications}
          />
        </View>

        <Text style={styles.sectionTitle}>
          APP
        </Text>

        <View style={styles.card}>
          <SettingItem
            icon="info"
            title="About PackUP"
            subtitle="Learn about the people behind PackUP"
            onPress={openAboutPackUP}
          />

          <View style={styles.divider} />

          <SettingItem
            icon="smartphone"
            title="App Information"
            subtitle="PackUP mobile application"
          />
        </View>

        <View style={styles.footer}>
          <Ionicons
            name="compass-outline"
            size={20}
            color="#777"
          />

          <Text style={styles.footerText}>
            Built for travellers.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#09090d",
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 34,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#15151c",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#24242d",
  },

  eyebrow: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 10,
    letterSpacing: 2.2,
    color: "#777",
    marginBottom: 3,
  },

  title: {
    fontFamily: "DMSans_700Bold",
    fontSize: 28,
    color: "#ffffff",
  },

  sectionTitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 10,
    letterSpacing: 2,
    color: "#666",
    marginBottom: 10,
    marginLeft: 4,
  },

  card: {
    backgroundColor: "#111117",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#22222b",
    paddingHorizontal: 15,
    marginBottom: 28,
  },

  item: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#191822",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  itemContent: {
    flex: 1,
  },

  itemTitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 15,
    color: "#ffffff",
    marginBottom: 4,
  },

  itemSubtitle: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: "#777",
  },

  divider: {
    height: 1,
    backgroundColor: "#22222b",
  },

  footer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    gap: 7,
  },

  footerText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: "#666",
  },
});