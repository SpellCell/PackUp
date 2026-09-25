import {
  Feather,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCallback, useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import {
  getMyTrips,
  Trip,
} from "../../services/authService";

export default function Home() {
  const { user, token } = useAuth();

  const { unreadCount } =
    useNotifications();

  const [trips, setTrips] =
    useState<Trip[]>([]);

  const [loadingTrips, setLoadingTrips] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const firstName =
    user?.name?.split(" ")[0] ||
    "Traveler";

  const fetchTrips = useCallback(
    async () => {
      if (!token) {
        setLoadingTrips(false);
        return;
      }

      try {
        const response =
          await getMyTrips(token);

        setTrips(
          response.createdTrips || []
        );
      } catch (error) {
        console.log(
          "Failed to fetch trips:",
          error
        );
      } finally {
        setLoadingTrips(false);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  async function handleRefresh() {
    setRefreshing(true);

    await fetchTrips();

    setRefreshing(false);
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#9188ff"
          />
        }
        contentContainerStyle={
          styles.scrollContent
        }
      >
        {/* Header */}

        <View style={styles.header}>
          <View>
            <Text style={styles.smallText}>
              WELCOME BACK
            </Text>

            <Text style={styles.greeting}>
              Hey, {firstName} 👋
            </Text>
          </View>

          <View style={styles.headerActions}>
            {/* Notifications */}

            <TouchableOpacity
              activeOpacity={0.8}
              style={
                styles.notificationButton
              }
              onPress={() => {
                router.push(
                  "/(app)/(screens)/notifications"
                );
              }}
            >
              <Ionicons
                name="notifications-outline"
                size={21}
                color="#ffffff"
              />

              {unreadCount > 0 && (
                <View
                  style={
                    styles.notificationBadge
                  }
                >
                  <Text
                    style={
                      styles.notificationBadgeText
                    }
                  >
                    {unreadCount > 9
                      ? "9+"
                      : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Profile */}

            <TouchableOpacity
              style={styles.profileButton}
              onPress={() =>
                router.push("/profile")
              }
            >
              <Feather
                name="user"
                size={21}
                color="#ffffff"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero */}

        <LinearGradient
          colors={[
            "#201b3b",
            "#141126",
            "#0d0c15",
          ]}
          style={styles.heroCard}
        >
          <View style={styles.heroGlow} />

          <View style={styles.heroTop}>
            <View style={styles.heroIcon}>
              <MaterialCommunityIcons
                name="compass-outline"
                size={27}
                color="#c5bfff"
              />
            </View>

            <Text style={styles.heroLabel}>
              PACKUP
            </Text>
          </View>

          <Text style={styles.heroTitle}>
            Where are you{"\n"}
            going next?
          </Text>

          <Text style={styles.heroSubtitle}>
            Create a trip, invite your people
            and make memories together.
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.createButton}
            onPress={() =>
              router.push(
                "/(app)/(screens)/create-trip"
              )
            }
          >
            <LinearGradient
              colors={[
                "#9188ff",
                "#7168df",
              ]}
              style={
                styles.createButtonGradient
              }
            >
              <Feather
                name="plus"
                size={19}
                color="#ffffff"
              />

              <Text
                style={
                  styles.createButtonText
                }
              >
                Create a Trip
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>

        {/* Quick Actions */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Quick actions
          </Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.8}
            onPress={() =>
              router.push(
                "/(app)/(screens)/create-trip"
              )
            }
          >
            <View style={styles.actionIcon}>
              <MaterialCommunityIcons
                name="map-marker-plus-outline"
                size={24}
                color="#aaa2ff"
              />
            </View>

            <Text style={styles.actionTitle}>
              Create Trip
            </Text>

            <Text
              style={styles.actionSubtitle}
            >
              Plan your journey
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.8}
            onPress={() =>
              router.push(
                "/(app)/(screens)/join-trip"
              )
            }
          >
            <View style={styles.actionIcon}>
              <Feather
                name="users"
                size={23}
                color="#8de7ff"
              />
            </View>

            <Text style={styles.actionTitle}>
              Join Trip
            </Text>

            <Text
              style={styles.actionSubtitle}
            >
              Use a trip code
            </Text>
          </TouchableOpacity>
        </View>

        {/* My Trips */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            My trips
          </Text>

          <TouchableOpacity
            onPress={() =>
              router.push("/trips")
            }
          >
            <Text style={styles.seeAll}>
              See all
            </Text>
          </TouchableOpacity>
        </View>

        {loadingTrips ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator
              size="small"
              color="#9188ff"
            />

            <Text style={styles.loadingText}>
              Loading your trips...
            </Text>
          </View>
        ) : trips.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="airplane-outline"
                size={27}
                color="#9188ff"
              />
            </View>

            <Text style={styles.emptyTitle}>
              No trips yet
            </Text>

            <Text
              style={styles.emptySubtitle}
            >
              Your upcoming adventures will
              appear here.
            </Text>

            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() =>
                router.push(
                  "/(app)/(screens)/create-trip"
                )
              }
            >
              <Text
                style={
                  styles.emptyButtonText
                }
              >
                Plan your first trip
              </Text>

              <Feather
                name="arrow-right"
                size={16}
                color="#aaa2ff"
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.tripList}>
            {trips
              .slice(0, 3)
              .map((trip) => (
                <TouchableOpacity
                  key={trip._id}
                  style={styles.tripCard}
                  activeOpacity={0.8}
                >
                  <View
                    style={styles.tripIcon}
                  >
                    <Ionicons
                      name="airplane-outline"
                      size={24}
                      color="#aaa2ff"
                    />
                  </View>

                  <View
                    style={styles.tripInfo}
                  >
                    <Text
                      style={styles.tripTitle}
                      numberOfLines={1}
                    >
                      {trip.title}
                    </Text>

                    <Text
                      style={styles.tripRoute}
                      numberOfLines={1}
                    >
                      {trip.source} →{" "}
                      {trip.destination}
                    </Text>

                    <View
                      style={styles.tripMeta}
                    >
                      <Text
                        style={
                          styles.tripType
                        }
                      >
                        {trip.tripType}
                      </Text>

                      <Text
                        style={
                          styles.tripMembers
                        }
                      >
                        {trip.currentMembers}/
                        {trip.maxMembers} members
                      </Text>
                    </View>
                  </View>

                  <Feather
                    name="chevron-right"
                    size={19}
                    color="#666372"
                  />
                </TouchableOpacity>
              ))}
          </View>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050507",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 58,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 26,
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  smallText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 10,
    letterSpacing: 2,
    color: "#777486",
    marginBottom: 5,
  },

  greeting: {
    fontFamily: "DMSans_700Bold",
    fontSize: 25,
    color: "#ffffff",
  },

  notificationButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#15141d",
    borderWidth: 1,
    borderColor: "#282633",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  notificationBadge: {
    position: "absolute",
    top: -3,
    right: -3,
    minWidth: 17,
    height: 17,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: "#ff6675",
    borderWidth: 2,
    borderColor: "#08080d",
    alignItems: "center",
    justifyContent: "center",
  },

  notificationBadgeText: {
    fontFamily: "DMSans_700Bold",
    fontSize: 8,
    color: "#ffffff",
  },

  profileButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#15141d",
    borderWidth: 1,
    borderColor: "#282633",
    alignItems: "center",
    justifyContent: "center",
  },

  heroCard: {
    minHeight: 310,
    borderRadius: 28,
    padding: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#292541",
    marginBottom: 28,
  },

  heroGlow: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#6657e8",
    opacity: 0.12,
    right: -70,
    top: -60,
  },

  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#302951",
    alignItems: "center",
    justifyContent: "center",
  },

  heroLabel: {
    fontFamily: "DMSans_700Bold",
    fontSize: 11,
    letterSpacing: 2.5,
    color: "#aaa2ff",
  },

  heroTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 32,
    lineHeight: 38,
    color: "#ffffff",
    marginTop: 28,
  },

  heroSubtitle: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    lineHeight: 21,
    color: "#a5a1b0",
    marginTop: 12,
    maxWidth: 300,
  },

  createButton: {
    marginTop: 24,
    alignSelf: "flex-start",
    borderRadius: 15,
    overflow: "hidden",
  },

  createButtonGradient: {
    height: 48,
    paddingHorizontal: 19,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  createButtonText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: "#ffffff",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  sectionTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 19,
    color: "#ffffff",
  },

  seeAll: {
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
    color: "#9188ff",
  },

  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 29,
  },

  actionCard: {
    flex: 1,
    minHeight: 145,
    padding: 17,
    borderRadius: 21,
    backgroundColor: "#101016",
    borderWidth: 1,
    borderColor: "#24232d",
  },

  actionIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#181722",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 13,
  },

  actionTitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: "#ffffff",
  },

  actionSubtitle: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: "#777482",
    marginTop: 5,
  },

  loadingCard: {
    minHeight: 170,
    borderRadius: 23,
    backgroundColor: "#0e0e14",
    borderWidth: 1,
    borderColor: "#23222b",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: "#777482",
    marginTop: 10,
  },

  emptyCard: {
    borderRadius: 23,
    backgroundColor: "#0e0e14",
    borderWidth: 1,
    borderColor: "#23222b",
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: "#181624",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  emptyTitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 17,
    color: "#ffffff",
  },

  emptySubtitle: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    lineHeight: 18,
    color: "#777482",
    textAlign: "center",
    marginTop: 7,
    maxWidth: 250,
  },

  emptyButton: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  emptyButtonText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 12,
    color: "#aaa2ff",
  },

  tripList: {
    gap: 11,
  },

  tripCard: {
    minHeight: 92,
    borderRadius: 20,
    backgroundColor: "#101016",
    borderWidth: 1,
    borderColor: "#24232d",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  tripIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: "#181624",
    alignItems: "center",
    justifyContent: "center",
  },

  tripInfo: {
    flex: 1,
    marginLeft: 13,
    marginRight: 8,
  },

  tripTitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 15,
    color: "#ffffff",
  },

  tripRoute: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: "#777482",
    marginTop: 4,
  },

  tripMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
    gap: 10,
  },

  tripType: {
    fontFamily: "DMSans_500Medium",
    fontSize: 10,
    color: "#aaa2ff",
  },

  tripMembers: {
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    color: "#666372",
  },

  bottomSpace: {
    height: 20,
  },
});