import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  router,
  useFocusEffect,
} from "expo-router";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

import AnimatedDoodles from "../../components/AnimatedDoodles";
import { useAuth } from "../../context/AuthContext";
import {
  ChatSummary,
  getChatSummaries,
} from "../../services/chatService";

const SOCKET_URL =
  "https://packup-c2lk.onrender.com";

export default function Chat() {
  const { token } = useAuth();

  const [summaries, setSummaries] =
    useState<ChatSummary[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const socketRef =
    useRef<Socket | null>(null);

  const summariesRef =
    useRef<ChatSummary[]>([]);

  const fetchChatSummaries =
    useCallback(
      async (showLoader = true) => {
        if (!token) {
          setLoading(false);
          return;
        }

        if (showLoader) {
          setLoading(true);
        }

        try {
          const response =
            await getChatSummaries(token);

          summariesRef.current =
            response.summaries;

          setSummaries(
            response.summaries
          );
        } catch (error) {
          console.log(
            "Failed to fetch chat summaries:",
            error
          );
        } finally {
          setLoading(false);
        }
      },
      [token]
    );

  useFocusEffect(
    useCallback(() => {
      fetchChatSummaries(false);
    }, [fetchChatSummaries])
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    const socket = io(
      SOCKET_URL,
      {
        transports: ["websocket"],
        auth: {
          token,
        },
      }
    );

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log(
        "Chat inbox socket connected:",
        socket.id
      );

      summariesRef.current.forEach(
        (summary) => {
          socket.emit(
            "joinTrip",
            summary.trip._id
          );
        }
      );
    });

    socket.on(
      "connect_error",
      (error) => {
        console.log(
          "Chat inbox socket error:",
          error.message
        );
      }
    );

    socket.on(
      "receiveMessage",
      (message) => {
        console.log(
          "New chat message received:",
          message
        );

        fetchChatSummaries(false);
      }
    );

    socket.on(
      "disconnect",
      (reason) => {
        console.log(
          "Chat inbox socket disconnected:",
          reason
        );
      }
    );

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [
    token,
    fetchChatSummaries,
  ]);

  useEffect(() => {
    const socket =
      socketRef.current;

    if (!socket) {
      return;
    }

    if (!socket.connected) {
      return;
    }

    summaries.forEach(
      (summary) => {
        socket.emit(
          "joinTrip",
          summary.trip._id
        );
      }
    );
  }, [summaries]);

  async function handleRefresh() {
    setRefreshing(true);

    try {
      await fetchChatSummaries(false);
    } finally {
      setRefreshing(false);
    }
  }

  function openChat(
    summary: ChatSummary
  ) {
    router.push({
      pathname:
        "/(app)/(screens)/chat/[tripId]",
      params: {
        tripId: summary.trip._id,
        title: summary.trip.title,
      },
    });
  }

  function getTripInitials(
    title: string
  ) {
    const words = title
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (words.length === 0) {
      return "T";
    }

    if (words.length === 1) {
      return words[0]
        .substring(0, 2)
        .toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[1].charAt(0)
    ).toUpperCase();
  }

  function getLastMessage(
    summary: ChatSummary
  ) {
    if (!summary.latestMessage) {
      return "No messages yet";
    }

    if (
      summary.latestMessage.messageType ===
      "image"
    ) {
      return "📷 Image";
    }

    return summary.latestMessage.message;
  }

  function getRelativeTime(
    dateString: string
  ) {
    const createdAt =
      new Date(dateString).getTime();

    const difference = Math.floor(
      (Date.now() - createdAt) / 1000
    );

    if (difference < 60) {
      return "now";
    }

    const minutes = Math.floor(
      difference / 60
    );

    if (minutes < 60) {
      return `${minutes}m`;
    }

    const hours = Math.floor(
      minutes / 60
    );

    if (hours < 24) {
      return `${hours}h`;
    }

    const days = Math.floor(
      hours / 24
    );

    return `${days}d`;
  }

  const totalUnread =
    summaries.reduce(
      (total, summary) =>
        total + summary.unreadCount,
      0
    );

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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#aaa2ff"
            colors={["#aaa2ff"]}
          />
        }
      >
        <Text style={styles.eyebrow}>
          STAY CONNECTED
        </Text>

        <View style={styles.titleRow}>
          <View>
            <Text style={styles.title}>
              Chats
            </Text>

            {summaries.length > 0 && (
              <Text style={styles.subtitle}>
                {totalUnread > 0
                  ? `${totalUnread} unread message${
                      totalUnread > 1
                        ? "s"
                        : ""
                    }`
                  : "Your trip conversations"}
              </Text>
            )}
          </View>

          {summaries.length > 0 && (
            <View
              style={styles.countBadge}
            >
              <Text
                style={styles.countText}
              >
                {summaries.length}
              </Text>
            </View>
          )}
        </View>

        {loading ? (
          <View
            style={styles.loadingCard}
          >
            <ActivityIndicator
              size="large"
              color="#8de7ff"
            />

            <Text
              style={styles.loadingText}
            >
              Loading conversations...
            </Text>
          </View>
        ) : summaries.length === 0 ? (
          <View
            style={styles.emptyCard}
          >
            <View
              style={styles.emptyIconGlow}
            >
              <View
                style={styles.iconBox}
              >
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={29}
                  color="#8de7ff"
                />
              </View>
            </View>

            <Text
              style={styles.emptyTitle}
            >
              No conversations yet
            </Text>

            <Text
              style={styles.emptyText}
            >
              Create or join a trip to start
              chatting with your travel group.
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.emptyButton}
              onPress={() =>
                router.push(
                  "/(app)/(screens)/create-trip"
                )
              }
            >
              <Ionicons
                name="add"
                size={18}
                color="#fff"
              />

              <Text
                style={
                  styles.emptyButtonText
                }
              >
                Create a trip
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={styles.conversationList}
          >
            {summaries.map(
              (summary) => {
                const initials =
                  getTripInitials(
                    summary.trip.title
                  );

                const unread =
                  summary.unreadCount > 0;

                return (
                  <TouchableOpacity
                    key={
                      summary.trip._id
                    }
                    activeOpacity={0.82}
                    style={[
                      styles.conversationCard,
                      unread &&
                        styles.unreadCard,
                    ]}
                    onPress={() =>
                      openChat(summary)
                    }
                  >
                    <LinearGradient
                      colors={[
                        "#201b3b",
                        "#151322",
                      ]}
                      style={
                        styles.tripIcon
                      }
                    >
                      <Text
                        style={
                          styles.tripInitials
                        }
                      >
                        {initials}
                      </Text>
                    </LinearGradient>

                    <View
                      style={
                        styles.conversationInfo
                      }
                    >
                      <View
                        style={
                          styles.topRow
                        }
                      >
                        <Text
                          style={
                            styles.tripTitle
                          }
                          numberOfLines={1}
                        >
                          {
                            summary.trip
                              .title
                          }
                        </Text>

                        {summary
                          .latestMessage && (
                          <Text
                            style={
                              styles.messageTime
                            }
                          >
                            {getRelativeTime(
                              summary
                                .latestMessage
                                .createdAt
                            )}
                          </Text>
                        )}

                        <Feather
                          name="chevron-right"
                          size={18}
                          color="#666372"
                        />
                      </View>

                      <View
                        style={
                          styles.routeRow
                        }
                      >
                        <Ionicons
                          name="location-outline"
                          size={12}
                          color="#777482"
                        />

                        <Text
                          style={
                            styles.route
                          }
                          numberOfLines={1}
                        >
                          {
                            summary.trip
                              .source
                          }{" "}
                          →{" "}
                          {
                            summary.trip
                              .destination
                          }
                        </Text>
                      </View>

                      <View
                        style={
                          styles.bottomRow
                        }
                      >
                        <Text
                          style={[
                            styles.lastMessage,
                            unread &&
                              styles.unreadMessage,
                          ]}
                          numberOfLines={1}
                        >
                          {getLastMessage(
                            summary
                          )}
                        </Text>

                        {unread && (
                          <View
                            style={
                              styles.unreadBadge
                            }
                          >
                            <Text
                              style={
                                styles.unreadBadgeText
                              }
                            >
                              {summary.unreadCount >
                              99
                                ? "99+"
                                : summary.unreadCount}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }
            )}
          </View>
        )}
      </ScrollView>
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
    paddingBottom: 40,
  },

  eyebrow: {
    fontFamily:
      "DMSans_600SemiBold",
    fontSize: 10,
    letterSpacing: 2,
    color: "#777486",
  },

  titleRow: {
    marginTop: 7,
    marginBottom: 26,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent:
      "space-between",
  },

  title: {
    fontFamily:
      "DMSans_700Bold",
    fontSize: 32,
    color: "#fff",
  },

  subtitle: {
    fontFamily:
      "DMSans_400Regular",
    fontSize: 11,
    color: "#777482",
    marginTop: 4,
  },

  countBadge: {
    minWidth: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#181624",
    borderWidth: 1,
    borderColor: "#2b283b",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },

  countText: {
    fontFamily:
      "DMSans_600SemiBold",
    fontSize: 11,
    color: "#aaa2ff",
  },

  loadingCard: {
    minHeight: 220,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#272532",
    backgroundColor:
      "rgba(16, 16, 22, 0.94)",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    fontFamily:
      "DMSans_400Regular",
    fontSize: 12,
    color: "#777482",
    marginTop: 12,
  },

  emptyCard: {
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#272532",
    backgroundColor:
      "rgba(16, 16, 22, 0.94)",
    paddingHorizontal: 28,
    paddingVertical: 32,
    alignItems: "center",
  },

  emptyIconGlow: {
    width: 78,
    height: 78,
    borderRadius: 27,
    backgroundColor: "#11151a",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  iconBox: {
    width: 62,
    height: 62,
    borderRadius: 21,
    backgroundColor: "#151b20",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    fontFamily:
      "DMSans_700Bold",
    fontSize: 20,
    color: "#fff",
  },

  emptyText: {
    fontFamily:
      "DMSans_400Regular",
    fontSize: 13,
    lineHeight: 20,
    color: "#777482",
    textAlign: "center",
    marginTop: 9,
    maxWidth: 290,
  },

  emptyButton: {
    height: 44,
    paddingHorizontal: 17,
    borderRadius: 14,
    backgroundColor: "#7168df",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginTop: 22,
  },

  emptyButtonText: {
    fontFamily:
      "DMSans_600SemiBold",
    fontSize: 12,
    color: "#fff",
  },

  conversationList: {
    gap: 11,
  },

  conversationCard: {
    minHeight: 94,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "#24232d",
    backgroundColor:
      "rgba(16, 16, 22, 0.94)",
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  unreadCard: {
    borderColor: "#38335c",
    backgroundColor:
      "rgba(21, 20, 31, 0.97)",
  },

  tripIcon: {
    width: 55,
    height: 55,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#302b4c",
  },

  tripInitials: {
    fontFamily:
      "DMSans_700Bold",
    fontSize: 15,
    color: "#aaa2ff",
    letterSpacing: 0.5,
  },

  conversationInfo: {
    flex: 1,
    marginLeft: 13,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  tripTitle: {
    flex: 1,
    fontFamily:
      "DMSans_600SemiBold",
    fontSize: 15,
    color: "#fff",
    marginRight: 8,
  },

  messageTime: {
    fontFamily:
      "DMSans_400Regular",
    fontSize: 9,
    color: "#666372",
    marginRight: 6,
  },

  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    gap: 3,
  },

  route: {
    flex: 1,
    fontFamily:
      "DMSans_400Regular",
    fontSize: 11,
    color: "#777482",
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  lastMessage: {
    flex: 1,
    fontFamily:
      "DMSans_400Regular",
    fontSize: 10,
    color: "#666372",
    marginRight: 8,
  },

  unreadMessage: {
    color: "#c5c1ff",
    fontFamily:
      "DMSans_500Medium",
  },

  unreadBadge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
    backgroundColor: "#7168df",
    alignItems: "center",
    justifyContent: "center",
  },

  unreadBadgeText: {
    fontFamily:
      "DMSans_700Bold",
    fontSize: 9,
    color: "#fff",
  },
});