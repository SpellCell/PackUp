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
import { router } from "expo-router";

import AuthBackground from "../../components/auth/AuthBackground";
import { forgotPassword } from "../../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleForgotPassword() {
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      await forgotPassword(
        email.trim().toLowerCase()
      );

      router.push({
        pathname: "/reset-password",
        params: {
          email: email.trim().toLowerCase(),
        },
      });
    } catch (err: any) {
      setError(
        err?.message ||
          "Unable to send OTP. Please try again."
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
              ACCOUNT RECOVERY
            </Text>

            <Text style={styles.title}>
              Forgot{" "}
              <Text style={styles.script}>
                password?
              </Text>
            </Text>

            <Text style={styles.subtitle}>
              Enter your registered email and we'll
              send you an OTP to reset your password.
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardEyebrow}>
                  RESET PASSWORD
                </Text>

                <Text style={styles.cardTitle}>
                  Let's get you back in.
                </Text>
              </View>

              <View style={styles.iconBox}>
                <Text style={styles.icon}>
                  🔐
                </Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Email address
              </Text>

              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor="#66636f"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
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
              onPress={handleForgotPassword}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <Text style={styles.buttonText}>
                    Send OTP
                  </Text>

                  <Text style={styles.arrow}>
                    →
                  </Text>
                </>
              )}
            </Pressable>

            <Pressable
              style={styles.backButton}
              disabled={loading}
              onPress={() => router.back()}
            >
              <Text style={styles.backText}>
                ← Back to login
              </Text>
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
    paddingTop: 72,
    paddingBottom: 100,
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
    marginBottom: 24,
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

  inputGroup: {
    marginBottom: 17,
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