import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import {
  ActivityIndicator,
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
import { getMyTrips, Trip } from "../../services/authService";

export default function Trips() {
  const { token } = useAuth();

  const [createdTrips, setCreatedTrips] = useState<Trip[]>([]);
  const [joinedTrips, setJoinedTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTrips = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await getMyTrips(token);

      setCreatedTrips(response.createdTrips || []);
      setJoinedTrips(response.joinedTrips || []);
    } catch (error) {
      console.log("Failed to fetch trips:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      fetchTrips();
    }, [fetchTrips])
  );

  async function handleRefresh() {
    setRefreshing(true);
    await fetchTrips();
    setRefreshing(false);
  }

  const totalTrips =
    createdTrips.length + joinedTrips.length;

  function openTrip(trip: Trip) {
    router.push({
      pathname: "/(app)/(screens)/trip-details",
      params: {
        id: trip._id,
      },
    });
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#08080d", "#0c0b14", "#050507"]}
        style={StyleSheet.absoluteFill}
      />

      <AnimatedDoodles />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#9188ff"
          />
        }
        contentContainerStyle={styles.content}
      >
        <Text style={styles.eyebrow}>YOUR JOURNEYS</Text>
        <Text style={styles.title}>My Trips</Text>

        {loading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator
              size="large"
              color="#9188ff"
            />

            <Text style={styles.loadingText}>
              Loading your trips...
            </Text>
          </View>
        ) : totalTrips === 0 ? (
          <View style={styles.hero}>
            <View style={styles.iconBox}>
              <Ionicons
                name="airplane-outline"
                size={28}
                color="#a39aff"
              />
            </View>

            <Text style={styles.heroTitle}>
              No trips yet
            </Text>

            <Text style={styles.heroText}>
              Start planning your next adventure with your
              friends.
            </Text>

            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.85}
              onPress={() =>
                router.push("/(app)/(screens)/create-trip")
              }
            >
              <LinearGradient
                colors={["#9188ff", "#7168df"]}
                style={styles.buttonGradient}
              >
                <Feather
                  name="plus"
                  size={18}
                  color="#fff"
                />

                <Text style={styles.buttonText}>
                  Create a Trip
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.joinButton}
              activeOpacity={0.8}
              onPress={() =>
                router.push("/(app)/(screens)/join-trip")
              }
            >
              <Feather
                name="users"
                size={17}
                color="#aaa2ff"
              />

              <Text style={styles.joinButtonText}>
                Join with a trip code
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {createdTrips.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>
                    Created by you
                  </Text>

                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>
                      {createdTrips.length}
                    </Text>
                  </View>
                </View>

                <View style={styles.tripList}>
                  {createdTrips.map((trip) => (
                    <TripCard
                      key={trip._id}
                      trip={trip}
                      isOwner
                      onPress={() => openTrip(trip)}
                    />
                  ))}
                </View>
              </>
            )}

            {joinedTrips.length > 0 && (
              <>
                <View
                  style={[
                    styles.sectionHeader,
                    { marginTop: 30 },
                  ]}
                >
                  <Text style={styles.sectionTitle}>
                    Joined trips
                  </Text>

                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>
                      {joinedTrips.length}
                    </Text>
                  </View>
                </View>

                <View style={styles.tripList}>
                  {joinedTrips.map((trip) => (
                    <TripCard
                      key={trip._id}
                      trip={trip}
                      onPress={() => openTrip(trip)}
                    />
                  ))}
                </View>
              </>
            )}

            <TouchableOpacity
              style={styles.addTripButton}
              activeOpacity={0.8}
              onPress={() =>
                router.push("/(app)/(screens)/create-trip")
              }
            >
              <View style={styles.addTripIcon}>
                <Feather
                  name="plus"
                  size={20}
                  color="#aaa2ff"
                />
              </View>

              <View style={styles.addTripInfo}>
                <Text style={styles.addTripTitle}>
                  Create another trip
                </Text>

                <Text style={styles.addTripSubtitle}>
                  Plan your next adventure
                </Text>
              </View>

              <Feather
                name="chevron-right"
                size={19}
                color="#666372"
              />
            </TouchableOpacity>
          </>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

function TripCard({
  trip,
  isOwner,
  onPress,
}: {
  trip: Trip;
  isOwner?: boolean;
  onPress: () => void;
}) {
  function formatDate(date: string) {
    if (!date) return "";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "";
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  }

  return (
    <TouchableOpacity
      style={styles.tripCard}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <LinearGradient
        colors={["#18152b", "#111118"]}
        style={styles.tripIcon}
      >
        <Ionicons
          name="airplane-outline"
          size={25}
          color="#aaa2ff"
        />
      </LinearGradient>

      <View style={styles.tripInfo}>
        <View style={styles.tripTitleRow}>
          <Text
            style={styles.tripTitle}
            numberOfLines={1}
          >
            {trip.title}
          </Text>

          {isOwner && (
            <View style={styles.ownerBadge}>
              <Text style={styles.ownerBadgeText}>
                YOU
              </Text>
            </View>
          )}
        </View>

        <Text
          style={styles.tripRoute}
          numberOfLines={1}
        >
          {trip.source} → {trip.destination}
        </Text>

        <View style={styles.tripMeta}>
          <View style={styles.metaItem}>
            <Ionicons
              name="calendar-outline"
              size={12}
              color="#666372"
            />

            <Text style={styles.metaText}>
              {formatDate(trip.startDate)}
            </Text>
          </View>

          <View style={styles.metaItem}>
            <Ionicons
              name="people-outline"
              size={12}
              color="#666372"
            />

            <Text style={styles.metaText}>
              {trip.currentMembers}/{trip.maxMembers}
            </Text>
          </View>
        </View>
      </View>

      <Feather
        name="chevron-right"
        size={19}
        color="#666372"
      />
    </TouchableOpacity>
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
    paddingBottom: 40,
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
    marginBottom: 28,
  },

  loadingCard: {
    minHeight: 220,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#272532",
    backgroundColor: "#101016",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: "#777482",
    marginTop: 12,
  },

  hero: {
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#272532",
    backgroundColor: "#101016",
    padding: 28,
    alignItems: "center",
  },

  iconBox: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: "#1b1929",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  heroTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 21,
    color: "#fff",
  },

  heroText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    lineHeight: 20,
    color: "#777482",
    textAlign: "center",
    maxWidth: 280,
    marginTop: 8,
  },

  button: {
    borderRadius: 15,
    overflow: "hidden",
    marginTop: 22,
  },

  buttonGradient: {
    height: 48,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  buttonText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: "#fff",
  },

  joinButton: {
    height: 45,
    paddingHorizontal: 17,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#302d3d",
    backgroundColor: "#15131e",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },

  joinButtonText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 12,
    color: "#aaa2ff",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 13,
  },

  sectionTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 18,
    color: "#fff",
  },

  countBadge: {
    minWidth: 25,
    height: 25,
    paddingHorizontal: 7,
    borderRadius: 10,
    backgroundColor: "#19172a",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 9,
  },

  countText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 10,
    color: "#aaa2ff",
  },

  tripList: {
    gap: 11,
  },

  tripCard: {
    minHeight: 94,
    borderRadius: 21,
    backgroundColor: "#101016",
    borderWidth: 1,
    borderColor: "#24232d",
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  tripIcon: {
    width: 55,
    height: 55,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  tripInfo: {
    flex: 1,
    marginLeft: 13,
    marginRight: 8,
  },

  tripTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  tripTitle: {
    flex: 1,
    fontFamily: "DMSans_600SemiBold",
    fontSize: 15,
    color: "#fff",
  },

  ownerBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: "#19172a",
    marginLeft: 7,
  },

  ownerBadgeText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 7,
    letterSpacing: 0.7,
    color: "#aaa2ff",
  },

  tripRoute: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: "#777482",
    marginTop: 5,
  },

  tripMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    marginTop: 7,
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  metaText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    color: "#666372",
  },

  addTripButton: {
    minHeight: 72,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#24232d",
    backgroundColor: "#0f0f15",
    marginTop: 28,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  addTripIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "#181624",
    alignItems: "center",
    justifyContent: "center",
  },

  addTripInfo: {
    flex: 1,
    marginLeft: 12,
  },

  addTripTitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: "#fff",
  },

  addTripSubtitle: {
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    color: "#666372",
    marginTop: 3,
  },

  bottomSpace: {
    height: 20,
  },
});