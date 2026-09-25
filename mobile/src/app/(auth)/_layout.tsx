import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function AuthLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#050507",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color="#8f87ff" size="large" />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/home" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}