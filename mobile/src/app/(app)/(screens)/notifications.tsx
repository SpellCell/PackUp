import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
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
import { useState } from "react";

import AnimatedDoodles from "../../../components/AnimatedDoodles";
import { useNotifications } from "../../../context/NotificationContext";
import { markNotificationAsRead } from "../../../services/notificationService";
import { useAuth } from "../../../context/AuthContext";
import { Notification } from "../../../services/notificationService";

function getNotificationIcon(type: Notification["type"]) {
  switch (type) {
    case "JOIN_REQUEST":
      return {
        name: "person-add",
        color: "#8f87ff",
      };

    case "REQUEST_ACCEPTED":
      return {
        name: "checkmark-circle",
        color: "#54d68c",
      };

    case "REQUEST_REJECTED":
      return {
        name: "close-circle",
        color: "#ff6b6b",
      };

    case "MEMBER_REMOVED":
      return {
        name: "person-remove",
        color: "#ff9f43",
      };

    case "NEW_MESSAGE":
      return {
        name: "chatbubble",
        color: "#4da6ff",
      };

    case "TRIP_UPDATED":
      return {
        name: "airplane",
        color: "#8f87ff",
      };

    case "TRIP_CANCELLED":
      return {
        name: "warning",
        color: "#ff6b6b",
      };

    default:
      return {
        name: "notifications",
        color: "#8f87ff",
      };
  }
}

function getRelativeTime(dateString: string) {
  const createdAt = new Date(dateString).getTime();
  const now = Date.now();

  const difference = Math.floor(
    (now - createdAt) / 1000
  );

  if (difference < 60) {
    return "Just now";
  }

  const minutes = Math.floor(difference / 60);

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d ago`;
  }

  return new Date(createdAt).toLocaleDateString();
}

export default function Notifications() {
  const { token } = useAuth();

  const {
    notifications,
    unreadCount,
    loading,
    refreshNotifications,
    markAsReadLocally,
  } = useNotifications();

  const [refreshing, setRefreshing] =
    useState(false);

  async function handleRefresh() {
    setRefreshing(true);

    await refreshNotifications();

    setRefreshing(false);
  }

  async function handleNotificationPress(
    notification: Notification
  ) {
    if (!token) {
      return;
    }

    if (notification.isRead) {
      return;
    }

    markAsReadLocally(
      notification._id
    );

    try {
      await markNotificationAsRead(
        token,
        notification._id
      );
    } catch (error) {
      console.log(
        "Failed to mark notification as read:",
        error
      );

      await refreshNotifications();
    }
  }

  return (
    <View style={styles.container}>
      <AnimatedDoodles />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather
            name="arrow-left"
            size={22}
            color="#ffffff"
          />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={styles.title}>
            Notifications
          </Text>

          <Text style={styles.subtitle}>
            {unreadCount > 0
              ? `${unreadCount} unread`
              : "You're all caught up"}
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons
            name="notifications"
            size={22}
            color="#8f87ff"
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color="#8f87ff"
          />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            notifications.length === 0
              ? styles.emptyContent
              : styles.listContent
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#8f87ff"
            />
          }
        >
          {notifications.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="notifications-off-outline"
                  size={34}
                  color="#8f87ff"
                />
              </View>

              <Text style={styles.emptyTitle}>
                No notifications
              </Text>

              <Text style={styles.emptyText}>
                You're all caught up. New trip
                activity will appear here.
              </Text>
            </View>
          ) : (
            notifications.map((notification) => {
              const icon =
                getNotificationIcon(
                  notification.type
                );

              return (
                <TouchableOpacity
                  key={notification._id}
                  activeOpacity={0.8}
                  onPress={() =>
                    handleNotificationPress(
                      notification
                    )
                  }
                  style={[
                    styles.card,
                    !notification.isRead &&
                      styles.unreadCard,
                  ]}
                >
                  <View
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor:
                          `${icon.color}18`,
                      },
                    ]}
                  >
                    <Ionicons
                      name={icon.name as any}
                      size={22}
                      color={icon.color}
                    />
                  </View>

                  <View style={styles.content}>
                    <View style={styles.titleRow}>
                      <Text
                        style={
                          styles.notificationTitle
                        }
                        numberOfLines={1}
                      >
                        {notification.title}
                      </Text>

                      {!notification.isRead && (
                        <View
                          style={styles.unreadDot}
                        />
                      )}
                    </View>

                    <Text style={styles.message}>
                      {notification.message}
                    </Text>

                    <View
                      style={styles.bottomRow}
                    >
                      <Text style={styles.time}>
                        {getRelativeTime(
                          notification.createdAt
                        )}
                      </Text>

                      {notification.trip?.title && (
                        <View
                          style={styles.tripTag}
                        >
                          <MaterialCommunityIcons
                            name="map-marker-path"
                            size={13}
                            color="#aaa4ff"
                          />

                          <Text
                            style={
                              styles.tripText
                            }
                            numberOfLines={1}
                          >
                            {
                              notification.trip
                                .title
                            }
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 18,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#111116",
    borderWidth: 1,
    borderColor: "#202027",
    alignItems: "center",
    justifyContent: "center",
  },

  headerText: {
    flex: 1,
    marginLeft: 14,
  },

  title: {
    color: "#ffffff",
    fontSize: 23,
    fontWeight: "700",
  },

  subtitle: {
    color: "#777783",
    fontSize: 13,
    marginTop: 3,
  },

  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#101018",
    alignItems: "center",
    justifyContent: "center",
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#0d0d12",
    borderWidth: 1,
    borderColor: "#1c1c23",
    borderRadius: 18,
    padding: 15,
    marginBottom: 12,
  },

  unreadCard: {
    borderColor: "#2b2850",
    backgroundColor: "#101018",
  },

  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  content: {
    flex: 1,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  notificationTitle: {
    flex: 1,
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ff4d67",
    marginLeft: 8,
  },

  message: {
    color: "#9999a5",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 9,
  },

  time: {
    color: "#5f5f69",
    fontSize: 11,
  },

  tripTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#171620",
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 4,
    marginLeft: 8,
    maxWidth: "70%",
  },

  tripText: {
    color: "#aaa4ff",
    fontSize: 10,
    marginLeft: 3,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  emptyState: {
    alignItems: "center",
    marginTop: -70,
  },

  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: "#11111a",
    borderWidth: 1,
    borderColor: "#252536",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  emptyTitle: {
    color: "#ffffff",
    fontSize: 19,
    fontWeight: "700",
  },

  emptyText: {
    color: "#777783",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 8,
    maxWidth: 300,
  },
});