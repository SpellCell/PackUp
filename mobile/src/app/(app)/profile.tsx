import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCallback, useState } from "react";

import AnimatedDoodles from "../../components/AnimatedDoodles";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../api/api";

type ProfileUser = {
  _id?: string;
  id?: string;
  name?: string;
  username?: string;
  email?: string;
  profileImage?: string;
  bio?: string;
  gender?: string;
  dateOfBirth?: string;
  interests?: string[];
  skills?: string[];
  instagram?: string;
  linkedin?: string;
  tripsCreated?: number;
  tripsJoined?: number;
  rating?: number;
};

export default function Profile() {
  const { user, logout, token } = useAuth();

  const [profile, setProfile] =
    useState<ProfileUser | null>(user || null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await apiRequest(
        "/api/users/profile",
        {
          method: "GET",
          token,
        }
      );

      setProfile(response?.user || user || null);
    } catch (error) {
      console.log("Failed to load profile:", error);
      setProfile(user || null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, user]);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  async function refreshProfile() {
    setRefreshing(true);
    await loadProfile();
  }

  async function handleLogout() {
    Alert.alert(
      "Log out",
      "Are you sure you want to log out of PackUP?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log out",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/(auth)/login");
          },
        },
      ]
    );
  }

  function openJoinRequests() {
    router.push(
      "/(app)/(screens)/join-requests"
    );
  }

  function openPersonalInformation() {
    router.push(
      "/(app)/(screens)/personal-information"
    );
  }

  function openSettings() {
  router.push(
    "/(app)/(screens)/settings"
  );
}

  function openAboutPackUP() {
    router.push(
      "/(app)/(screens)/about-packup"
    );
  }

  const displayName =
    profile?.name || user?.name || "User";

  const username =
    profile?.username ||
    user?.username ||
    "username";

  const email =
    profile?.email ||
    user?.email ||
    "";

  const profileImage =
    profile?.profileImage || "";

  const bio =
    profile?.bio?.trim() || "";

  const interests =
    profile?.interests || [];

  const skills =
    profile?.skills || [];

  const tripsCreated =
    profile?.tripsCreated ?? 0;

  const tripsJoined =
    profile?.tripsJoined ?? 0;

  const rating =
    profile?.rating ?? 5;

  const initials =
    displayName
      .trim()
      .charAt(0)
      .toUpperCase() || "U";

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

      <AnimatedDoodles />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#9188ff"
          />

          <Text style={styles.loadingText}>
            Loading profile...
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshProfile}
              tintColor="#9188ff"
            />
          }
        >
          <Text style={styles.eyebrow}>
            ACCOUNT
          </Text>

          <Text style={styles.title}>
            Profile
          </Text>

          {/* PROFILE CARD */}

          <View style={styles.profileCard}>
            {profileImage ? (
              <Image
                source={{
                  uri: profileImage,
                }}
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {initials}
                </Text>
              </View>
            )}

            <View style={styles.userInfo}>
              <Text
                style={styles.name}
                numberOfLines={1}
              >
                {displayName}
              </Text>

              <Text
                style={styles.username}
                numberOfLines={1}
              >
                @{username}
              </Text>

              <Text
                style={styles.email}
                numberOfLines={1}
              >
                {email}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.editIconButton}
              activeOpacity={0.8}
              onPress={openPersonalInformation}
            >
              <Feather
                name="edit-2"
                size={17}
                color="#aaa2ff"
              />
            </TouchableOpacity>
          </View>

          {/* BIO */}

          {bio ? (
            <View style={styles.bioCard}>
              <View style={styles.bioHeader}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={17}
                  color="#aaa2ff"
                />

                <Text style={styles.bioLabel}>
                  ABOUT
                </Text>
              </View>

              <Text style={styles.bioText}>
                {bio}
              </Text>
            </View>
          ) : null}

          {/* PROFILE STATS */}

          <View style={styles.statsCard}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>
                {tripsCreated}
              </Text>

              <Text style={styles.statLabel}>
                Created
              </Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.stat}>
              <Text style={styles.statValue}>
                {tripsJoined}
              </Text>

              <Text style={styles.statLabel}>
                Joined
              </Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.stat}>
              <View style={styles.ratingRow}>
                <Text style={styles.statValue}>
                  {rating.toFixed(1)}
                </Text>

                <Ionicons
                  name="star"
                  size={15}
                  color="#ffd166"
                  style={styles.star}
                />
              </View>

              <Text style={styles.statLabel}>
                Rating
              </Text>
            </View>
          </View>

          {/* INTERESTS */}

          {interests.length > 0 ? (
            <View style={styles.tagSection}>
              <Text style={styles.sectionTitle}>
                Interests
              </Text>

              <View style={styles.tagsContainer}>
                {interests.slice(0, 8).map(
                  (interest, index) => (
                    <View
                      key={`${interest}-${index}`}
                      style={styles.interestTag}
                    >
                      <Text
                        style={
                          styles.interestTagText
                        }
                      >
                        {interest}
                      </Text>
                    </View>
                  )
                )}
              </View>
            </View>
          ) : null}

          {/* SKILLS */}

          {skills.length > 0 ? (
            <View style={styles.tagSection}>
              <Text style={styles.sectionTitle}>
                Skills
              </Text>

              <View style={styles.tagsContainer}>
                {skills.slice(0, 8).map(
                  (skill, index) => (
                    <View
                      key={`${skill}-${index}`}
                      style={styles.skillTag}
                    >
                      <Text
                        style={styles.skillTagText}
                      >
                        {skill}
                      </Text>
                    </View>
                  )
                )}
              </View>
            </View>
          ) : null}

          {/* EDIT PROFILE */}

          <TouchableOpacity
            style={styles.editProfileButton}
            activeOpacity={0.8}
            onPress={openPersonalInformation}
          >
            <Feather
              name="edit-2"
              size={17}
              color="#000000"
            />

            <Text style={styles.editProfileText}>
              Edit Profile
            </Text>
          </TouchableOpacity>

          {/* TRIPS */}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Trips
            </Text>

            <TouchableOpacity
              style={styles.option}
              activeOpacity={0.8}
              onPress={openJoinRequests}
            >
              <View style={styles.optionIcon}>
                <Ionicons
                  name="people-outline"
                  size={20}
                  color="#aaa2ff"
                />
              </View>

              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>
                  Join Requests
                </Text>

                <Text style={styles.optionSubtitle}>
                  Manage incoming and sent trip
                  requests
                </Text>
              </View>

              <Feather
                name="chevron-right"
                size={19}
                color="#666372"
              />
            </TouchableOpacity>
          </View>

          {/* ACCOUNT */}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Account
            </Text>

            <TouchableOpacity
              style={styles.option}
              activeOpacity={0.8}
              onPress={openPersonalInformation}
            >
              <View style={styles.optionIcon}>
                <Feather
                  name="user"
                  size={19}
                  color="#aaa2ff"
                />
              </View>

              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>
                  Personal information
                </Text>

                <Text style={styles.optionSubtitle}>
                  Manage your profile details
                </Text>
              </View>

              <Feather
                name="chevron-right"
                size={19}
                color="#666372"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              activeOpacity={0.8}
              onPress={openSettings}
            >
              <View style={styles.optionIcon}>
                <Ionicons
                  name="settings-outline"
                  size={20}
                  color="#8de7ff"
                />
              </View>

              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>
                  Settings
                </Text>

                <Text style={styles.optionSubtitle}>
                  App preferences and settings
                </Text>
              </View>

              <Feather
                name="chevron-right"
                size={19}
                color="#666372"
              />
            </TouchableOpacity>
          </View>

          {/* ABOUT PACKUP */}

          <TouchableOpacity
            style={styles.aboutCard}
            activeOpacity={0.85}
            onPress={openAboutPackUP}
          >
            <View style={styles.aboutGlow} />

            <View style={styles.aboutContent}>
              <Text style={styles.aboutEyebrow}>
                THE PEOPLE BEHIND PACKUP
              </Text>

              <Text style={styles.aboutTitle}>
                Built by{" "}
                <Text style={styles.aboutAccent}>
                  travellers.
                </Text>
              </Text>

              <Text style={styles.aboutDescription}>
                Meet the people who built PackUP
                and learn the story behind the
                app.
              </Text>

              <View style={styles.aboutAction}>
                <Text style={styles.aboutActionText}>
                  Know about us
                </Text>

                <Feather
                  name="arrow-up-right"
                  size={17}
                  color="#ffffff"
                />
              </View>
            </View>

            <View style={styles.aboutIcon}>
              <Ionicons
                name="compass-outline"
                size={27}
                color="#aaa2ff"
              />
            </View>
          </TouchableOpacity>

          {/* LOGOUT */}

          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.8}
            onPress={handleLogout}
          >
            <Feather
              name="log-out"
              size={19}
              color="#ff7777"
            />

            <Text style={styles.logoutText}>
              Log out
            </Text>
          </TouchableOpacity>

          <Text style={styles.version}>
            PackUP Mobile • v1.0.0
          </Text>
        </ScrollView>
      )}
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
    paddingTop: 58,
    paddingBottom: 50,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: "#777482",
    marginTop: 10,
  },

  eyebrow: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 10,
    letterSpacing: 2,
    color: "#777486",
  },

  title: {
    fontFamily: "DMSans_700Bold",
    fontSize: 32,
    color: "#fff",
    marginTop: 7,
    marginBottom: 25,
  },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 24,
    backgroundColor: "#101016",
    borderWidth: 1,
    borderColor: "#272532",
  },

  avatar: {
    width: 66,
    height: 66,
    borderRadius: 22,
    backgroundColor: "#27214a",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#4a4080",
  },

  avatarImage: {
    width: 66,
    height: 66,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#4a4080",
  },

  avatarText: {
    fontFamily: "DMSans_700Bold",
    fontSize: 27,
    color: "#aaa2ff",
  },

  userInfo: {
    flex: 1,
    marginLeft: 15,
    marginRight: 10,
  },

  name: {
    fontFamily: "DMSans_700Bold",
    fontSize: 19,
    color: "#fff",
  },

  username: {
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
    color: "#aaa2ff",
    marginTop: 3,
  },

  email: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: "#777482",
    marginTop: 4,
  },

  editIconButton: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: "#181722",
    borderWidth: 1,
    borderColor: "#302c43",
    alignItems: "center",
    justifyContent: "center",
  },

  bioCard: {
    marginTop: 12,
    padding: 17,
    borderRadius: 19,
    backgroundColor: "#101016",
    borderWidth: 1,
    borderColor: "#24232d",
  },

  bioHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 9,
  },

  bioLabel: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 10,
    letterSpacing: 1.5,
    color: "#777482",
  },

  bioText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    lineHeight: 20,
    color: "#b8b5c0",
  },

  statsCard: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingVertical: 17,
    borderRadius: 19,
    backgroundColor: "#101016",
    borderWidth: 1,
    borderColor: "#24232d",
  },

  stat: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  statValue: {
    fontFamily: "DMSans_700Bold",
    fontSize: 17,
    color: "#ffffff",
  },

  statLabel: {
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    color: "#777482",
    marginTop: 4,
  },

  statDivider: {
    width: 1,
    height: 31,
    backgroundColor: "#292832",
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  star: {
    marginLeft: 4,
  },

  tagSection: {
    marginTop: 25,
  },

  sectionTitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 16,
    color: "#fff",
    marginBottom: 12,
  },

  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  interestTag: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#17152a",
    borderWidth: 1,
    borderColor: "#302b55",
  },

  interestTagText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 11,
    color: "#aaa2ff",
  },

  skillTag: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#111d21",
    borderWidth: 1,
    borderColor: "#24404a",
  },

  skillTagText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 11,
    color: "#8de7ff",
  },

  editProfileButton: {
    height: 51,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 25,
  },

  editProfileText: {
    fontFamily: "DMSans_700Bold",
    fontSize: 14,
    color: "#000000",
  },

  section: {
    marginTop: 30,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 72,
    paddingHorizontal: 15,
    borderRadius: 18,
    backgroundColor: "#101016",
    borderWidth: 1,
    borderColor: "#24232d",
    marginBottom: 10,
  },

  optionIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#181722",
    alignItems: "center",
    justifyContent: "center",
  },

  optionText: {
    flex: 1,
    marginLeft: 13,
  },

  optionTitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: "#fff",
  },

  optionSubtitle: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: "#777482",
    marginTop: 4,
  },

  aboutCard: {
    marginTop: 32,
    minHeight: 190,
    borderRadius: 25,
    backgroundColor: "#101016",
    borderWidth: 1,
    borderColor: "#302c43",
    overflow: "hidden",
    position: "relative",
  },

  aboutGlow: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    right: -55,
    top: -60,
    backgroundColor: "#28224c",
    opacity: 0.7,
  },

  aboutContent: {
    padding: 21,
    paddingRight: 70,
  },

  aboutEyebrow: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 9,
    letterSpacing: 2,
    color: "#777482",
    marginBottom: 8,
  },

  aboutTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 27,
    letterSpacing: -0.8,
    color: "#ffffff",
  },

  aboutAccent: {
    color: "#c2bcff",
  },

  aboutDescription: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    lineHeight: 18,
    color: "#85818e",
    marginTop: 9,
  },

  aboutAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 18,
  },

  aboutActionText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 12,
    color: "#ffffff",
  },

  aboutIcon: {
    position: "absolute",
    right: 18,
    top: 22,
    width: 43,
    height: 43,
    borderRadius: 15,
    backgroundColor: "#181722",
    borderWidth: 1,
    borderColor: "#302c43",
    alignItems: "center",
    justifyContent: "center",
  },

  logoutButton: {
    height: 55,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#42272b",
    backgroundColor: "#171013",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    marginTop: 25,
  },

  logoutText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: "#ff7777",
  },

  version: {
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    color: "#4f4c57",
    textAlign: "center",
    marginTop: 25,
  },
});