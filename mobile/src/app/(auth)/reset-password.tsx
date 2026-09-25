import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  View,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";

import AuthBackground from "../../components/auth/AuthBackground";
import { resetPassword } from "../../services/authService";

export default function ResetPassword() {
  const { email } = useLocalSearchParams<{
    email?: string;
  }>();

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleResetPassword() {
    setError("");

    if (!email) {
      setError("Email address is missing.");
      return;
    }

    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await resetPassword(
        email,
        otp.trim(),
        newPassword
      );

      router.replace("/login");
    } catch (err: any) {
      setError(
        err?.message ||
          "Unable to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthBackground>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.eyebrow}>
              SECURITY CHECK
            </Text>

            <Text style={styles.title}>
              Reset{" "}
              <Text style={styles.script}>
                password.
              </Text>
            </Text>

            <Text style={styles.subtitle}>
              Enter the OTP sent to your email and
              create a new password.
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardEyebrow}>
                  VERIFY & RESET
                </Text>

                <Text style={styles.cardTitle}>
                  Almost there.
                </Text>
              </View>

              <View style={styles.iconBox}>
                <Text style={styles.icon}>
                  🔑
                </Text>
              </View>
            </View>

            <View style={styles.emailBox}>
              <Text style={styles.emailLabel}>
                RESETTING PASSWORD FOR
              </Text>

              <Text style={styles.emailText}>
                {email || "your email"}
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                OTP
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                placeholderTextColor="#66636f"
                keyboardType="number-pad"
                autoCapitalize="none"
                value={otp}
                onChangeText={setOtp}
                editable={!loading}
                maxLength={6}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                New password
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                placeholderTextColor="#66636f"
                secureTextEntry
                autoCapitalize="none"
                value={newPassword}
                onChangeText={setNewPassword}
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Confirm password
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Confirm new password"
                placeholderTextColor="#66636f"
                secureTextEntry
                autoCapitalize="none"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!loading}
              />
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>
                  {error}
                </Text>
              </View>
            ) : null}

            <Pressable
              style={[
                styles.button,
                loading && styles.buttonDisabled,
              ]}
              onPress={handleResetPassword}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <Text style={styles.buttonText}>
                    Reset Password
                  </Text>

                  <Text style={styles.arrow}>
                    →
                  </Text>
                </>
              )}
            </Pressable>

            <Pressable
  style={styles.backButton}
  onPress={() => router.replace("/login")}
>
  <Text style={styles.backText}>← Back to login</Text>
</Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 65,
    paddingBottom: 80,
    justifyContent: "center",
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  eyebrow: {
    color: "#8d83e8",
    fontFamily: "DMSans_700Bold",
    fontSize: 9,
    letterSpacing: 3,
    marginBottom: 12,
  },

  title: {
    color: "#ffffff",
    fontFamily: "DMSans_600SemiBold",
    fontSize: 40,
    letterSpacing: -1.5,
  },

  script: {
    color: "#c4bdff",
    fontFamily: "MrDafoe",
    fontSize: 48,
    fontWeight: "400",
    letterSpacing: 0,
  },

  subtitle: {
    color: "#77747f",
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    maxWidth: 300,
    marginTop: 10,
  },

  card: {
    width: "100%",
    maxWidth: 390,
    alignSelf: "center",
    backgroundColor: "rgba(20, 19, 25, 0.88)",
    borderWidth: 1,
    borderColor: "rgba(125, 116, 160, 0.28)",
    borderRadius: 24,
    padding: 22,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  cardEyebrow: {
    color: "#8d83e8",
    fontFamily: "DMSans_700Bold",
    fontSize: 9,
    letterSpacing: 3,
    marginBottom: 8,
  },

  cardTitle: {
    color: "#ffffff",
    fontFamily: "DMSans_600SemiBold",
    fontSize: 20,
  },

  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(132, 119, 255, 0.45)",
    backgroundColor: "rgba(95, 79, 210, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    fontSize: 18,
  },

  emailBox: {
    padding: 13,
    borderRadius: 12,
    backgroundColor: "rgba(95, 79, 210, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(132, 119, 255, 0.18)",
    marginBottom: 20,
  },

  emailLabel: {
    color: "#777482",
    fontFamily: "DMSans_600SemiBold",
    fontSize: 8,
    letterSpacing: 1.5,
    marginBottom: 5,
  },

  emailText: {
    color: "#aaa2ff",
    fontFamily: "DMSans_500Medium",
    fontSize: 12,
  },

  inputGroup: {
    marginBottom: 16,
  },

  label: {
    color: "#a7a4ad",
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
    marginBottom: 8,
  },

  input: {
    height: 50,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "rgba(130, 126, 143, 0.25)",
    backgroundColor: "rgba(5, 5, 8, 0.8)",
    paddingHorizontal: 15,
    color: "#ffffff",
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
  },

  errorBox: {
    backgroundColor: "rgba(255, 70, 90, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 70, 90, 0.2)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
  },

  errorText: {
    color: "#ff8b99",
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    lineHeight: 17,
  },

  button: {
    height: 52,
    borderRadius: 13,
    backgroundColor: "#6657f5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 3,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#ffffff",
    fontFamily: "DMSans_700Bold",
    fontSize: 13,
  },

  arrow: {
    color: "#ffffff",
    fontFamily: "DMSans_500Medium",
    fontSize: 18,
  },

  backButton: {
    alignItems: "center",
    marginTop: 20,
  },

  backText: {
    color: "#9388ee",
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
  },
});