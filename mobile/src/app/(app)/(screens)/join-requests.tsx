import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import {
  ActivityIndicator,
  Alert,
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
  acceptJoinRequest,
  getPendingJoinRequests,
  JoinRequest,
  rejectJoinRequest,
} from "../../../services/joinRequestService";

export default function JoinRequests() {
  const { token } = useAuth();

  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await getPendingJoinRequests(token);

      setRequests(response.requests || []);
    } catch (error) {
      console.log("Failed to load pending requests:", error);

      Alert.alert(
        "Unable to load requests",
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
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

  function confirmAction(
    request: JoinRequest,
    action: "accept" | "reject"
  ) {
    const isAccept = action === "accept";

    const requesterName =
      request.requester?.name || "this user";

    const tripTitle =
      request.trip?.title || "this trip";

    Alert.alert(
      isAccept ? "Accept request?" : "Reject request?",
      isAccept
        ? `Add ${requesterName} to ${tripTitle}?`
        : `Reject ${requesterName}'s request to join ${tripTitle}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: isAccept ? "Accept" : "Reject",
          style: isAccept ? "default" : "destructive",
          onPress: () => processRequest(request, action),
        },
      ]
    );
  }

  async function processRequest(
    request: JoinRequest,
    action: "accept" | "reject"
  ) {
    if (!token || processingId !== null) {
      return;
    }

    setProcessingId(request._id);

    try {
      const response =
        action === "accept"
          ? await acceptJoinRequest(token, request._id)
          : await rejectJoinRequest(token, request._id);

      setRequests((current) =>
        current.filter(
          (item) => item._id !== request._id
        )
      );

      Alert.alert(
        action === "accept"
          ? "Request accepted"
          : "Request rejected",
        response.message || "Done."
      );
    } catch (error) {
      Alert.alert(
        "Action failed",
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );

      await load();
    } finally {
      setProcessingId(null);
    }
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
            ORGANIZER TOOLS
          </Text>

          <Text style={styles.title}>
            Join Requests
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
            Loading requests...
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
                  name="person-add-outline"
                  size={31}
                  color="#aaa2ff"
                />
              </View>

              <Text style={styles.emptyTitle}>
                No pending requests
              </Text>

              <Text style={styles.emptyText}>
                New requests from travelers will
                appear here.
              </Text>
            </View>
          ) : (
            requests.map((request) => {
              const isProcessing =
                processingId === request._id;

              const isAnyProcessing =
                processingId !== null;

              const requesterName =
                request.requester?.name ||
                "Unknown user";

              const username =
                request.requester?.username ||
                "user";

              const tripTitle =
                request.trip?.title || "Trip";

              const source =
                request.trip?.source || "";

              const destination =
                request.trip?.destination || "";

              const memberCount =
                request.trip?.currentMembers;

              const maxMembers =
                request.trip?.maxMembers;

              const initials =
                requesterName
                  .trim()
                  .charAt(0)
                  .toUpperCase() || "?";

              return (
                <View
                  key={request._id}
                  style={styles.card}
                >
                  <View style={styles.topRow}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {initials}
                      </Text>
                    </View>

                    <View style={styles.info}>
                      <Text style={styles.name}>
                        {requesterName}
                      </Text>

                      <Text style={styles.username}>
                        @{username}
                      </Text>
                    </View>

                    <View style={styles.pendingBadge}>
                      <View
                        style={
                          styles.pendingDot
                        }
                      />

                      <Text
                        style={
                          styles.pendingText
                        }
                      >
                        Pending
                      </Text>
                    </View>
                  </View>

                  <View style={styles.requestBody}>
                    <Text style={styles.wants}>
                      wants to join
                    </Text>

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

                    {memberCount !== undefined &&
                      maxMembers !== undefined && (
                        <View
                          style={
                            styles.membersRow
                          }
                        >
                          <Ionicons
                            name="people-outline"
                            size={14}
                            color="#777482"
                          />

                          <Text
                            style={
                              styles.membersText
                            }
                          >
                            {memberCount}/
                            {maxMembers} members
                          </Text>
                        </View>
                      )}
                  </View>

                  <View style={styles.actions}>
                    <TouchableOpacity
                      disabled={
                        isAnyProcessing
                      }
                      activeOpacity={0.8}
                      style={[
                        styles.acceptButton,
                        isAnyProcessing &&
                          styles.disabledButton,
                      ]}
                      onPress={() =>
                        confirmAction(
                          request,
                          "accept"
                        )
                      }
                    >
                      {isProcessing ? (
                        <ActivityIndicator
                          size="small"
                          color="#fff"
                        />
                      ) : (
                        <>
                          <Ionicons
                            name="checkmark"
                            size={16}
                            color="#fff"
                          />

                          <Text
                            style={
                              styles.actionText
                            }
                          >
                            Accept
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      disabled={
                        isAnyProcessing
                      }
                      activeOpacity={0.8}
                      style={[
                        styles.rejectButton,
                        isAnyProcessing &&
                          styles.disabledRejectButton,
                      ]}
                      onPress={() =>
                        confirmAction(
                          request,
                          "reject"
                        )
                      }
                    >
                      <Ionicons
                        name="close"
                        size={16}
                        color="#ff7b7b"
                      />

                      <Text
                        style={
                          styles.rejectText
                        }
                      >
                        Reject
                      </Text>
                    </TouchableOpacity>
                  </View>
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

  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#29234d",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontFamily: "DMSans_700Bold",
    fontSize: 17,
    color: "#c0baff",
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  name: {
    fontFamily: "DMSans_700Bold",
    fontSize: 15,
    color: "#fff",
  },

  username: {
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    color: "#777482",
    marginTop: 2,
  },

  pendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 9,
    backgroundColor: "#29230f",
    borderWidth: 1,
    borderColor: "#4a3c17",
  },

  pendingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#e4bd55",
  },

  pendingText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 9,
    color: "#e4bd55",
  },

  requestBody: {
    marginTop: 14,
  },

  wants: {
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    color: "#777482",
  },

  tripTitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: "#fff",
    marginTop: 3,
  },

  route: {
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    color: "#777482",
    marginTop: 4,
  },

  membersRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 8,
  },

  membersText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    color: "#777482",
  },

  actions: {
    flexDirection: "row",
    gap: 9,
    marginTop: 15,
  },

  acceptButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 13,
    backgroundColor: "#54b97d",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },

  rejectButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#47252b",
    backgroundColor: "#1b1115",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },

  disabledButton: {
    opacity: 0.55,
  },

  disabledRejectButton: {
    opacity: 0.55,
  },

  actionText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
    color: "#fff",
  },

  rejectText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
    color: "#ff7b7b",
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
    marginTop: 6,
  },
});