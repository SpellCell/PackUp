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

import AnimatedDoodles from "../../../components/AnimatedDoodles";
import { useAuth } from "../../../context/AuthContext";
import {
  getMyJoinRequests,
  JoinRequest,
} from "../../../services/joinRequestService";

type StatusConfig = {
  label: string;
  color: string;
  background: string;
  border: string;
  icon: keyof typeof Ionicons.glyphMap;
};

function getStatusConfig(
  status: JoinRequest["status"]
): StatusConfig {
  switch (status) {
    case "Accepted":
      return {
        label: "Accepted",
        color: "#65d99a",
        background: "#13291f",
        border: "#27553d",
        icon: "checkmark-circle",
      };

    case "Rejected":
      return {
        label: "Rejected",
        color: "#ff7b7b",
        background: "#291517",
        border: "#54272d",
        icon: "close-circle",
      };

    case "Pending":
    default:
      return {
        label: "Pending",
        color: "#e4bd55",
        background: "#29230f",
        border: "#4a3c17",
        icon: "time-outline",
      };
  }
}

export default function MyRequests() {
  const { token } = useAuth();

  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await getMyJoinRequests(token);

      setRequests(response.requests || []);
    } catch (error) {
      console.log("Failed to load my join requests:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function refresh() {
    setRefreshing(true);

    await load();

    setRefreshing(false);
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#08080d", "#0c0b14", "#050507"]}
        style={StyleSheet.absoluteFill}
      />

      <AnimatedDoodles />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Feather
            name="arrow-left"
            size={21}
            color="#fff"
          />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>
            YOUR ACTIVITY
          </Text>

          <Text style={styles.title}>
            My Requests
          </Text>
        </View>

        {requests.length > 0 && (
          <View style={styles.count}>
            <Text style={styles.countText}>
              {requests.length > 99
                ? "99+"
                : requests.length}
            </Text>
          </View>
        )}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color="#9188ff"
          />

          <Text style={styles.loadingText}>
            Loading your requests...
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor="#9188ff"
            />
          }
        >
          {requests.length === 0 ? (
            <View style={styles.emptyCard}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="paper-plane-outline"
                  size={30}
                  color="#aaa2ff"
                />
              </View>

              <Text style={styles.emptyTitle}>
                No join requests yet
              </Text>

              <Text style={styles.emptyText}>
                When you request to join a trip,
                your request status will appear here.
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.joinButton}
                onPress={() =>
                  router.push(
                    "/(app)/(screens)/join-trip"
                  )
                }
              >
                <Ionicons
                  name="add"
                  size={17}
                  color="#fff"
                />

                <Text style={styles.joinButtonText}>
                  Join a Trip
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            requests.map((request) => {
              const status =
                getStatusConfig(request.status);

              const tripTitle =
                request.trip?.title || "Trip";

              const source =
                request.trip?.source || "";

              const destination =
                request.trip?.destination || "";

              const tripCode =
                request.trip?.tripCode || "";

              const currentMembers =
                request.trip?.currentMembers;

              const maxMembers =
                request.trip?.maxMembers;

              return (
                <View
                  key={request._id}
                  style={styles.card}
                >
                  <View style={styles.cardTop}>
                    <View style={styles.tripIcon}>
                      <Ionicons
                        name="airplane-outline"
                        size={21}
                        color="#aaa2ff"
                      />
                    </View>

                    <View style={styles.tripInfo}>
                      <Text
                        style={styles.tripTitle}
                        numberOfLines={1}
                      >
                        {tripTitle}
                      </Text>

                      <Text
                        style={styles.route}
                        numberOfLines={1}
                      >
                        {source} → {destination}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            status.background,
                          borderColor:
                            status.border,
                        },
                      ]}
                    >
                      <Ionicons
                        name={status.icon}
                        size={13}
                        color={status.color}
                      />

                      <Text
                        style={[
                          styles.statusText,
                          {
                            color: status.color,
                          },
                        ]}
                      >
                        {status.label}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.details}>
                    {tripCode ? (
                      <View style={styles.detailItem}>
                        <Text
                          style={styles.detailLabel}
                        >
                          TRIP CODE
                        </Text>

                        <Text
                          style={styles.code}
                        >
                          {tripCode}
                        </Text>
                      </View>
                    ) : null}

                    {currentMembers !==
                      undefined &&
                      maxMembers !== undefined ? (
                      <View style={styles.detailItem}>
                        <Text
                          style={styles.detailLabel}
                        >
                          MEMBERS
                        </Text>

                        <View
                          style={styles.memberValue}
                        >
                          <Ionicons
                            name="people-outline"
                            size={14}
                            color="#777482"
                          />

                          <Text
                            style={
                              styles.detailValue
                            }
                          >
                            {currentMembers}/
                            {maxMembers}
                          </Text>
                        </View>
                      </View>
                    ) : null}
                  </View>

                  {request.status ===
                    "Accepted" && (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.openTripButton}
                      onPress={() => {
                        if (!request.trip?._id) {
                          return;
                        }

                        router.push({
                          pathname:
                            "/(app)/(screens)/trip-details",
                          params: {
                            id: request.trip._id,
                          },
                        });
                      }}
                    >
                      <Text
                        style={
                          styles.openTripText
                        }
                      >
                        Open Trip
                      </Text>

                      <Feather
                        name="arrow-right"
                        size={16}
                        color="#fff"
                      />
                    </TouchableOpacity>
                  )}

                  {request.status ===
                    "Pending" && (
                    <View
                      style={styles.pendingMessage}
                    >
                      <Ionicons
                        name="time-outline"
                        size={15}
                        color="#e4bd55"
                      />

                      <Text
                        style={
                          styles.pendingMessageText
                        }
                      >
                        Waiting for the organizer
                        to respond
                      </Text>
                    </View>
                  )}

                  {request.status ===
                    "Rejected" && (
                    <View
                      style={styles.rejectedMessage}
                    >
                      <Ionicons
                        name="information-circle-outline"
                        size={15}
                        color="#ff7b7b"
                      />

                      <Text
                        style={
                          styles.rejectedMessageText
                        }
                      >
                        Your request was not
                        accepted
                      </Text>
                    </View>
                  )}
                </View>
              );
            })
          )}
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

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 20,
    paddingTop: 58,
    paddingBottom: 18,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#292735",
    backgroundColor: "#111017",
    alignItems: "center",
    justifyContent: "center",
  },

  headerText: {
    flex: 1,
  },

  eyebrow: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 10,
    letterSpacing: 2,
    color: "#777482",
  },

  title: {
    fontFamily: "DMSans_700Bold",
    fontSize: 30,
    color: "#fff",
    marginTop: 4,
  },

  count: {
    minWidth: 31,
    height: 31,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: "#201b3b",
    borderWidth: 1,
    borderColor: "#393253",
    alignItems: "center",
    justifyContent: "center",
  },

  countText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
    color: "#aaa2ff",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 45,
  },

  center: {
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

  card: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#272532",
    backgroundColor: "#101016",
    padding: 15,
    marginBottom: 12,
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  tripIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: "#1b1830",
    borderWidth: 1,
    borderColor: "#302b4b",
    alignItems: "center",
    justifyContent: "center",
  },

  tripInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },

  tripTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 15,
    color: "#fff",
  },

  route: {
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    color: "#777482",
    marginTop: 4,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 9,
    borderWidth: 1,
  },

  statusText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 9,
  },

  divider: {
    height: 1,
    backgroundColor: "#22212b",
    marginVertical: 14,
  },

  details: {
    flexDirection: "row",
    gap: 28,
  },

  detailItem: {
    minWidth: 80,
  },

  detailLabel: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 8,
    letterSpacing: 1.3,
    color: "#5f5c68",
  },

  detailValue: {
    fontFamily: "DMSans_500Medium",
    fontSize: 11,
    color: "#aaa7b2",
  },

  code: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
    color: "#aaa2ff",
    marginTop: 5,
    letterSpacing: 1,
  },

  memberValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 5,
  },

  openTripButton: {
    height: 43,
    borderRadius: 13,
    backgroundColor: "#6259d9",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 15,
  },

  openTripText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
    color: "#fff",
  },

  pendingMessage: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: "#17150d",
    borderWidth: 1,
    borderColor: "#332b15",
    marginTop: 15,
  },

  pendingMessageText: {
    flex: 1,
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    color: "#9d8d58",
  },

  rejectedMessage: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: "#191012",
    borderWidth: 1,
    borderColor: "#392026",
    marginTop: 15,
  },

  rejectedMessageText: {
    flex: 1,
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    color: "#9d666b",
  },

  emptyCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#272532",
    backgroundColor: "#101016",
    padding: 30,
    alignItems: "center",
    marginTop: 15,
  },

  emptyIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: "#1b1830",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 18,
    color: "#fff",
    marginTop: 15,
  },

  emptyText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    lineHeight: 18,
    color: "#777482",
    textAlign: "center",
    textAlignVertical: "center",
    marginTop: 6,
    maxWidth: 280,
  },

  joinButton: {
    height: 43,
    paddingHorizontal: 18,
    borderRadius: 13,
    backgroundColor: "#6259d9",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
    marginTop: 20,
  },

  joinButtonText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
    color: "#fff",
  },
});