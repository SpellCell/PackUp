import { apiRequest } from "../api/api";

export type ChatMessage = {
  _id: string;
  trip: string;
  sender: {
    _id: string;
    name: string;
    username: string;
    profileImage?: string;
  };
  message: string;
  messageType: "text" | "image";
  createdAt: string;
  updatedAt?: string;
};

export type ChatSummary = {
  trip: {
    _id: string;
    title: string;
    source: string;
    destination: string;
    currentMembers: number;
    maxMembers: number;
  };

  latestMessage: {
    message: string;
    messageType: "text" | "image";
    createdAt: string;
    sender: string;
  } | null;

  unreadCount: number;
};

export type ChatSummariesResponse = {
  success: boolean;
  summaries: ChatSummary[];
};

export type ChatHistoryResponse = {
  success: boolean;
  currentPage: number;
  totalPages: number;
  totalMessages: number;
  chats: ChatMessage[];
};

export async function getChatSummaries(
  token: string
): Promise<ChatSummariesResponse> {
  return apiRequest("/api/chat/summaries", {
    method: "GET",
    token,
  });
}

export async function markChatAsRead(
  token: string,
  tripId: string
) {
  return apiRequest(
    `/api/chat/${tripId}/read`,
    {
      method: "PATCH",
      token,
    }
  );
}

export async function getChatHistory(
  token: string,
  tripId: string
): Promise<ChatHistoryResponse> {
  return apiRequest(
    `/api/chat/${tripId}/history`,
    {
      method: "GET",
      token,
    }
  );
}