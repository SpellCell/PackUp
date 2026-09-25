import { apiRequest } from "../api/api";
import { File } from "expo-file-system";
import { fetch as expoFetch } from "expo/fetch";

export type CreateTripData = {
  title: string;
  source: string;
  destination: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  maxMembers: number;
  tripType: string;
};

export type UpdateTripData = CreateTripData;

export async function createTrip(
  token: string,
  tripData: CreateTripData
) {
  return apiRequest("/api/trips", {
    method: "POST",
    token,
    body: tripData,
  });
}

export async function updateTrip(
  token: string,
  tripId: string,
  tripData: UpdateTripData
) {
  return apiRequest(`/api/trips/${tripId}`, {
    method: "PUT",
    token,
    body: tripData,
  });
}

export async function uploadTripCover(
  token: string,
  tripId: string,
  imageUri: string
) {
  const file = new File(imageUri);

  if (!file.exists) {
    throw new Error("Selected image file does not exist.");
  }

  const formData = new FormData();

  formData.append("cover", file);

  const response = await expoFetch(
    `https://packup-c2lk.onrender.com/api/trips/${tripId}/upload-cover`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  let data: any = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
}