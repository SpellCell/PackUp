import { Stack } from "expo-router";

export default function ScreensLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: {
          backgroundColor: "#050507",
        },
      }}
    >
      <Stack.Screen name="create-trip" />
      <Stack.Screen name="join-trip" />
      <Stack.Screen name="trip-details" />
      <Stack.Screen name="join-requests" />
      <Stack.Screen name="chat/[tripId]" />
    </Stack>
  );
}