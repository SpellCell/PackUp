import { apiRequest } from "../api/api";

export type JoinRequestStatus = "Pending" | "Accepted" | "Rejected";

export type JoinRequest = {
  _id: string;
  trip: {
    _id: string;
    title: string;
    source: string;
    destination: string;
    tripCode?: string;
    currentMembers?: number;
    maxMembers?: number;
  } | null;
  requester?: {
    _id: string;
    name: string;
    username: string;
    email?: string;
    profileImage?: string;
  };
  status: JoinRequestStatus;
  message?: string;
  createdAt: string;
  updatedAt: string;
};

export async function sendJoinRequest(
  token: string,
  tripCode: string
) {
  return apiRequest("/api/join-request", {
    method: "POST",
    token,
    body: { tripCode: tripCode.trim().toUpperCase() },
  });
}

export async function getMyJoinRequests(token: string) {
  return apiRequest("/api/join-request/my", {
    method: "GET",
    token,
  });
}

export async function getPendingJoinRequests(token: string) {
  return apiRequest("/api/join-request/pending", {
    method: "GET",
    token,
  });
}

export async function acceptJoinRequest(
  token: string,
  requestId: string
) {
  return apiRequest(`/api/join-request/${requestId}/accept`, {
    method: "PUT",
    token,
  });
}

export async function rejectJoinRequest(
  token: string,
  requestId: string
) {
  return apiRequest(`/api/join-request/${requestId}/reject`, {
    method: "PUT",
    token,
  });
}
