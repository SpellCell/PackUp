import { apiRequest } from "../api/api";

export type Notification = {
  _id: string;
  type:
    | "JOIN_REQUEST"
    | "REQUEST_ACCEPTED"
    | "REQUEST_REJECTED"
    | "MEMBER_REMOVED"
    | "NEW_MESSAGE"
    | "TRIP_UPDATED"
    | "TRIP_CANCELLED";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  sender?: {
    _id: string;
    name: string;
    username: string;
    profileImage?: string;
  };
  trip?: {
    _id: string;
    title: string;
  };
};

export type NotificationsResponse = {
  success: boolean;
  notifications: Notification[];
};

export async function getNotifications(
  token: string
): Promise<NotificationsResponse> {
  return apiRequest("/api/notifications", {
    method: "GET",
    token,
  });
}

export async function markNotificationAsRead(
  token: string,
  notificationId: string
) {
  return apiRequest(
    `/api/notifications/${notificationId}/read`,
    {
      method: "PATCH",
      token,
    }
  );
}