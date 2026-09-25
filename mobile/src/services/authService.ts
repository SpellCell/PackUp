import { apiRequest } from "../api/api";

export type LoginResponse = {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
  };
};

export type RegisterResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    username: string;
    email: string;
  };
};

export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
};

export type TripParticipant = {
  _id: string;
  name: string;
  username: string;
  profileImage?: string;
};

export type Trip = {
  _id: string;
  title: string;
  source: string;
  destination: string;
  description: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  budget: number;
  maxMembers: number;
  currentMembers: number;
  tripType: string;
  status: string;
  tripCode?: string;
  createdBy?: TripParticipant;
  participants?: TripParticipant[];
};

export type MyTripsResponse = {
  success: boolean;
  createdTrips: Trip[];
  joinedTrips: Trip[];
};

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: {
      email,
      password,
    },
  });
}

export async function registerUser(
  name: string,
  username: string,
  email: string,
  password: string
): Promise<RegisterResponse> {
  return apiRequest("/api/auth/register", {
    method: "POST",
    body: {
      name,
      username,
      email,
      password,
    },
  });
}

export async function verifyEmail(
  email: string,
  otp: string
) {
  return apiRequest("/api/auth/verify-email", {
    method: "POST",
    body: {
      email,
      otp,
    },
  });
}

export async function resendVerificationOTP(email: string) {
  return apiRequest("/api/auth/send-verification-otp", {
    method: "POST",
    body: {
      email,
    },
  });
}

export async function forgotPassword(email: string) {
  return apiRequest("/api/auth/forgot-password", {
    method: "POST",
    body: {
      email,
    },
  });
}

export async function resetPassword(
  email: string,
  otp: string,
  newPassword: string
) {
  return apiRequest("/api/auth/reset-password", {
    method: "POST",
    body: {
      email,
      otp,
      newPassword,
    },
  });
}

export async function getCurrentUser(token: string): Promise<{
  success: boolean;
  user: User;
}> {
  return apiRequest("/api/auth/me", {
    method: "GET",
    token,
  });
}

export async function getMyTrips(
  token: string
): Promise<MyTripsResponse> {
  return apiRequest("/api/trips/my-trips", {
    method: "GET",
    token,
  });
}

export async function getTripById(
  token: string,
  tripId: string
): Promise<{
  success: boolean;
  trip: Trip;
}> {
  return apiRequest(`/api/trips/${tripId}`, {
    method: "GET",
    token,
  });
}