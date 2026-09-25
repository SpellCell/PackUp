import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { io, Socket } from "socket.io-client";
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  getChatHistory,
  markChatAsRead,
  ChatMessage,
} from "../../../../services/chatService";
import { getTripById } from "../../../../services/authService";
import { useAuth } from "../../../../context/AuthContext";

const SOCKET_URL = "https://packup-c2lk.onrender.com";

type DoodleType =
  | "plane"
  | "compass"
  | "map"
  | "pin"
  | "globe"
  | "navigation";

function ChatDoodle({
  type,
  size,
  left,
  top,
  rotation = 0,
}: {
  type: DoodleType;
  size: number;
  left: number;
  top: number;
  rotation?: number;
}) {
  const color = "#aaa2ff";

  const icons: Record<DoodleType, React.ReactNode> = {
    plane: (
      <Ionicons
        name="airplane-outline"
        size={size}
        color={color}
      />
    ),
    compass: (
      <Ionicons
        name="compass-outline"
        size={size}
        color={color}
      />
    ),
    map: (
      <Ionicons
        name="map-outline"
        size={size}
        color={color}
      />
    ),
    pin: (
      <Ionicons
        name="location-outline"
        size={size}
        color={color}
      />
    ),
    globe: (
      <Ionicons
        name="globe-outline"
        size={size}
        color={color}
      />
    ),
    navigation: (
      <Ionicons
        name="navigate-outline"
        size={size}
        color={color}
      />
    ),
  };

  return (
    <View
      pointerEvents="none"
      style={[
        styles.doodle,
        {
          left,
          top,
          transform: [
            {
              rotate: `${rotation}deg`,
            },
          ],
        },
      ]}
    >
      {icons[type]}
    </View>
  );
}

function ChatWallpaper() {
  return (
    <View
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
    >
      <ChatDoodle
        type="plane"
        size={24}
        left={28}
        top={115}
        rotation={-18}
      />

      <ChatDoodle
        type="compass"
        size={29}
        left={170}
        top={150}
        rotation={12}
      />

      <ChatDoodle
        type="pin"
        size={22}
        left={320}
        top={210}
        rotation={-8}
      />

      <ChatDoodle
        type="map"
        size={27}
        left={70}
        top={285}
        rotation={7}
      />

      <ChatDoodle
        type="globe"
        size={29}
        left={275}
        top={370}
        rotation={-10}
      />

      <ChatDoodle
        type="navigation"
        size={24}
        left={25}
        top={460}
        rotation={18}
      />

      <ChatDoodle
        type="plane"
        size={23}
        left={190}
        top={550}
        rotation={14}
      />

      <ChatDoodle
        type="pin"
        size={25}
        left={315}
        top={650}
        rotation={-15}
      />

      <ChatDoodle
        type="compass"
        size={28}
        left={35}
        top={740}
        rotation={-8}
      />

      <ChatDoodle
        type="globe"
        size={26}
        left={190}
        top={850}
        rotation={10}
      />

      <ChatDoodle
        type="map"
        size={28}
        left={325}
        top={960}
        rotation={-7}
      />

      <ChatDoodle
        type="navigation"
        size={24}
        left={70}
        top={1070}
        rotation={-18}
      />
    </View>
  );
}

export default function TripChat() {
  const { token, user } = useAuth();

  const params = useLocalSearchParams<{
    tripId: string;
    title?: string;
  }>();

  const tripId = params.tripId;
  const routeTitle = params.title;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [tripTitle, setTripTitle] = useState(
    routeTitle || "Trip Chat"
  );
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typingUser, setTypingUser] = useState("");

  const socketRef = useRef<Socket | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const typingTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  const loadChat = useCallback(async () => {
    if (!token || !tripId) return;

    try {
      const response = await getChatHistory(
        token,
        tripId
      );

      setMessages(response.chats || []);

      const tripResponse = await getTripById(
        token,
        tripId
      );

      if (tripResponse.trip?.title) {
        setTripTitle(tripResponse.trip.title);
      }
    } catch (error) {
      console.log("Failed to load chat:", error);
    } finally {
      setLoading(false);
    }
  }, [token, tripId]);

  const markRead = useCallback(async () => {
    if (!token || !tripId) return;

    try {
      await markChatAsRead(token, tripId);
    } catch (error) {
      console.log("Failed to mark chat as read:", error);
    }
  }, [token, tripId]);

  useEffect(() => {
    loadChat();
    markRead();
  }, [loadChat, markRead]);

  useEffect(() => {
    if (!token || !tripId) return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: {
        token,
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Chat socket connected");
      socket.emit("joinTrip", tripId);
    });

    socket.on(
      "receiveMessage",
      (message: ChatMessage) => {
        setMessages((current) => {
          const alreadyExists = current.some(
            (item) => item._id === message._id
          );

          if (alreadyExists) {
            return current;
          }

          return [...current, message];
        });

        if (message.sender?._id !== user?.id) {
          markRead();
        }
      }
    );

    socket.on("typing", (name: string) => {
      setTypingUser(name);
    });

    socket.on("stopTyping", () => {
      setTypingUser("");
    });

    socket.on("error", (error: string) => {
      console.log("Chat socket error:", error);
    });

    socket.on("connect_error", (error) => {
      console.log(
        "Chat socket connection error:",
        error.message
      );
    });

    return () => {
      socket.emit("leaveTrip", tripId);
      socket.disconnect();

      socketRef.current = null;

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [token, tripId]);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios"
        ? "keyboardWillShow"
        : "keyboardDidShow";

    const hideEvent =
      Platform.OS === "ios"
        ? "keyboardWillHide"
        : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(
      showEvent,
      () => {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({
            animated: true,
          });
        }, 250);
      }
    );

    const hideSubscription = Keyboard.addListener(
      hideEvent,
      () => {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({
            animated: true,
          });
        }, 120);
      }
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({
        animated: true,
      });
    }, 100);

    return () => clearTimeout(timeout);
  }, [messages.length]);

  function handleTyping(text: string) {
    setMessageText(text);

    const socket = socketRef.current;

    if (!socket || !tripId) return;

    if (text.trim()) {
      socket.emit("typing", tripId);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stopTyping", tripId);
      }, 1200);
    } else {
      socket.emit("stopTyping", tripId);
    }
  }

  function sendMessage() {
    const text = messageText.trim();

    if (
      !text ||
      !socketRef.current ||
      sending
    ) {
      return;
    }

    setSending(true);

    socketRef.current.emit("sendMessage", {
      tripId,
      message: text,
    });

    setMessageText("");

    socketRef.current.emit(
      "stopTyping",
      tripId
    );

    setTimeout(() => {
      setSending(false);
    }, 250);
  }

  function isOwnMessage(message: ChatMessage) {
    return message.sender?._id === user?.id;
  }

  function formatTime(date: string) {
    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "";
    }

    return parsed.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top"]}
    >
      <StatusBar
        style="light"
         />

      <View style={styles.container}>
        <LinearGradient
          colors={[
            "#08080d",
            "#0c0b14",
            "#050507",
          ]}
          style={StyleSheet.absoluteFill}
        />

        <ChatWallpaper />

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={() => {
              Keyboard.dismiss();
              router.replace("/(app)/chat");
            }}
          >
            <Feather
              name="arrow-left"
              size={21}
              color="#fff"
            />
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <Text
              style={styles.headerTitle}
              numberOfLines={1}
            >
              {tripTitle}
            </Text>

            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />

              <Text style={styles.onlineText}>
                {typingUser
                  ? `${typingUser} is typing...`
                  : "Trip conversation"}
              </Text>
            </View>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="airplane-outline"
              size={20}
              color="#aaa2ff"
            />
          </View>
        </View>

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator
              size="large"
              color="#8de7ff"
            />

            <Text style={styles.loadingText}>
              Loading messages...
            </Text>
          </View>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            style={styles.messages}
            contentContainerStyle={[
              styles.messagesContent,
              {
                paddingBottom: 82,
              },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            {messages.length === 0 ? (
              <View
                style={styles.emptyConversation}
              >
                <View
                  style={styles.emptyChatIcon}
                >
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={27}
                    color="#aaa2ff"
                  />
                </View>

                <Text
                  style={styles.emptyChatTitle}
                >
                  Start the conversation
                </Text>

                <Text
                  style={styles.emptyChatText}
                >
                  Say hello to your trip members
                  and start planning together.
                </Text>
              </View>
            ) : (
              messages.map((message) => {
                const own =
                  isOwnMessage(message);

                return (
                  <View
                    key={message._id}
                    style={[
                      styles.messageRow,
                      own
                        ? styles.messageRowOwn
                        : styles.messageRowOther,
                    ]}
                  >
                    {!own && (
                      <View
                        style={styles.avatar}
                      >
                        <Text
                          style={
                            styles.avatarText
                          }
                        >
                          {message.sender?.name
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "?"}
                        </Text>
                      </View>
                    )}

                    <View
                      style={[
                        styles.messageBubble,
                        own
                          ? styles.ownBubble
                          : styles.otherBubble,
                      ]}
                    >
                      {!own && (
                        <Text
                          style={
                            styles.senderName
                          }
                        >
                          {message.sender?.name ||
                            message.sender
                              ?.username ||
                            "Member"}
                        </Text>
                      )}

                      <Text
                        style={[
                          styles.messageText,
                          own
                            ? styles.ownMessageText
                            : styles.otherMessageText,
                        ]}
                      >
                        {message.message}
                      </Text>

                      <Text
                        style={[
                          styles.messageTime,
                          own
                            ? styles.ownTime
                            : styles.otherTime,
                        ]}
                      >
                        {formatTime(
                          message.createdAt
                        )}
                      </Text>
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>
        )}

        <View style={styles.inputArea}>
          <View style={styles.inputContainer}>
            <TextInput
              value={messageText}
              onChangeText={handleTyping}
              placeholder="Write a message..."
              placeholderTextColor="#666372"
              multiline
              maxLength={1000}
              textAlignVertical="center"
              style={styles.input}
              onFocus={() => {
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({
                    animated: true,
                  });
                }, 350);
              }}
            />

            <TouchableOpacity
              style={[
                styles.sendButton,
                !messageText.trim() &&
                  styles.sendButtonDisabled,
              ]}
              activeOpacity={0.8}
              onPress={sendMessage}
              disabled={
                !messageText.trim() ||
                sending
              }
            >
              <Ionicons
                name="arrow-up"
                size={20}
                color={
                  messageText.trim()
                    ? "#fff"
                    : "#5d596b"
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#08080d",
  },


  container: {
    flex: 1,
    backgroundColor: "#050507",
  },

  header: {
    minHeight: 74,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "rgba(8, 8, 13, 0.98)",
    borderBottomWidth: 1,
    borderBottomColor: "#24232d",
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#15141d",
    alignItems: "center",
    justifyContent: "center",
  },

  headerInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 10,
  },

  headerTitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 15,
    color: "#fff",
  },

  onlineRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 5,
  },

  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#75e6a0",
  },

  onlineText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    color: "#777482",
  },

  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#181624",
    alignItems: "center",
    justifyContent: "center",
  },

  messages: {
    flex: 1,
  },

  messagesContent: {
    paddingHorizontal: 13,
    paddingTop: 18,
    flexGrow: 1,
  },

  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: "#777482",
    marginTop: 12,
  },

  emptyConversation: {
    flex: 1,
    minHeight: 430,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 35,
  },

  emptyChatIcon: {
    width: 65,
    height: 65,
    borderRadius: 22,
    backgroundColor: "#181624",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  emptyChatTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 19,
    color: "#fff",
  },

  emptyChatText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    lineHeight: 19,
    color: "#777482",
    textAlign: "center",
    marginTop: 8,
  },

  messageRow: {
    width: "100%",
    flexDirection: "row",
    marginBottom: 9,
  },

  messageRowOwn: {
    justifyContent: "flex-end",
  },

  messageRowOther: {
    justifyContent: "flex-start",
  },

  avatar: {
    width: 30,
    height: 30,
    borderRadius: 11,
    backgroundColor: "#181624",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 7,
    alignSelf: "flex-end",
  },

  avatarText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
    color: "#aaa2ff",
  },

  messageBubble: {
    maxWidth: "78%",
    paddingHorizontal: 13,
    paddingTop: 9,
    paddingBottom: 7,
    borderRadius: 17,
  },

  ownBubble: {
    backgroundColor: "#655dc9",
    borderBottomRightRadius: 5,
  },

  otherBubble: {
    backgroundColor: "#15141d",
    borderWidth: 1,
    borderColor: "#292733",
    borderBottomLeftRadius: 5,
  },

  senderName: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 10,
    color: "#aaa2ff",
    marginBottom: 3,
  },

  messageText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    lineHeight: 19,
  },

  ownMessageText: {
    color: "#fff",
  },

  otherMessageText: {
    color: "#eeeef2",
  },

  messageTime: {
    fontFamily: "DMSans_400Regular",
    fontSize: 8,
    marginTop: 4,
    alignSelf: "flex-end",
  },

  ownTime: {
    color: "#d5d1ff",
  },

  otherTime: {
    color: "#666372",
  },

  inputArea: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: "rgba(8, 8, 13, 0.98)",
    borderTopWidth: 1,
    borderTopColor: "#24232d",
  },

  inputContainer: {
    minHeight: 52,
    maxHeight: 120,
    borderRadius: 18,
    backgroundColor: "#15141d",
    borderWidth: 1,
    borderColor: "#292733",
    flexDirection: "row",
    alignItems: "flex-end",
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 6,
  },

  input: {
    flex: 1,
    color: "#fff",
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    lineHeight: 19,
    maxHeight: 105,
    minHeight: 38,
    paddingTop: 8,
    paddingBottom: 8,
  },

  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: "#7168df",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },

  sendButtonDisabled: {
    backgroundColor: "#25232e",
  },

  doodle: {
    position: "absolute",
    opacity: 0.045,
  },
});