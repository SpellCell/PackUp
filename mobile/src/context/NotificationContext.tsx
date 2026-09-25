import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  Notification,
  getNotifications,
} from "../services/notificationService";

import {
  connectNotificationSocket,
  disconnectNotificationSocket,
  getNotificationSocket,
} from "../services/notificationSocket";

import { useAuth } from "./AuthContext";

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  refreshNotifications: () => Promise<void>;
  markAsReadLocally: (
    notificationId: string
  ) => void;
};

const NotificationContext =
  createContext<
    NotificationContextType | undefined
  >(undefined);

export function NotificationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { token } = useAuth();

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [loading, setLoading] =
    useState(true);

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.isRead
    ).length;

  async function refreshNotifications() {
    if (!token) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      const response =
        await getNotifications(token);

      setNotifications(
        response.notifications
      );
    } catch (error) {
      console.log(
        "Failed to fetch notifications:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  function markAsReadLocally(
    notificationId: string
  ) {
    setNotifications((current) =>
      current.map((notification) =>
        notification._id === notificationId
          ? {
              ...notification,
              isRead: true,
            }
          : notification
      )
    );
  }

  useEffect(() => {
    if (!token) {
      setNotifications([]);
      setLoading(false);
      disconnectNotificationSocket();
      return;
    }

    refreshNotifications();

    const socket =
      connectNotificationSocket(token);

    function handleNewNotification(
      notification: Notification
    ) {
      console.log(
        "New notification received:",
        notification
      );

      setNotifications((current) => {
        const alreadyExists =
          current.some(
            (item) =>
              item._id === notification._id
          );

        if (alreadyExists) {
          return current;
        }

        return [
          notification,
          ...current,
        ];
      });
    }

    socket.on(
      "newNotification",
      handleNewNotification
    );

    return () => {
      socket.off(
        "newNotification",
        handleNewNotification
      );
    };
  }, [token]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        refreshNotifications,
        markAsReadLocally,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context =
    useContext(
      NotificationContext
    );

  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider"
    );
  }

  return context;
}