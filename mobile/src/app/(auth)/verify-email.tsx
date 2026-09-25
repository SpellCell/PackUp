import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import AuthBackground from "../../components/auth/AuthBackground";
import {
  resendVerificationOTP,
  verifyEmail,
} from "../../services/authService";

export default function VerifyEmail() {
  const params = useLocalSearchParams<{ email?: string }>();

  const email =
    typeof params.email === "string" ? params.email : "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleVerify() {
    setError("");
    setMessage("");

    if (!email) {
      setError("Email address is missing.");
      return;
    }

    if (otp.trim().length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    try {
      setLoading(true);

      await verifyEmail(email, otp.trim());

      setMessage("Email verified successfully.");

      setTimeout(() => {
        router.replace("/login");
      }, 700);
    } catch (err: any) {
      setError(
        err?.message || "Invalid verification code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setMessage("");

    if (!email) {
      setError("Email address is missing.");
      return;
    }

    try {
      setResending(true);

      await resendVerificationOTP(email);

      setMessage("A new verification code has been sent.");
    } catch (err: any) {
      setError(
        err?.message || "Unable to resend the verification code."
      );
    } finally {
      setResending(false);
    }
  }

  return (
    <AuthBackground>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.eyebrow}>ONE LAST STEP</Text>

            <Text style={styles.title}>
              Verify <Text style={styles.script}>you.</Text>
            </Text>

            <Text style={styles.subtitle}>
              We've sent a 6-digit verification code to your email.
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.iconCircle}>
              <Text style={styles.icon}>✉</Text>
            </View>

            <Text style={styles.cardTitle}>
              Check your inbox
            </Text>

            <Text style={styles.cardSubtitle}>
              Enter the verification code sent to
            </Text>

            <Text style={styles.email}>
              {email || "your email address"}
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Verification code</Text>

              <TextInput
                style={styles.otpInput}
                placeholder="000000"
                placeholderTextColor="#66636f"
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={(value) =>
                  setOtp(value.replace(/[^0-9]/g, ""))
                }
                editable={!loading}
                textAlign="center"
              />
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {message ? (
              <View style={styles.successBox}>
                <Text style={styles.successText}>{message}</Text>
              </View>
            ) : null}

            <Pressable
              style={[
                styles.verifyButton,
                loading && styles.buttonDisabled,
              ]}
              onPress={handleVerify}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <Text style={styles.verifyButtonText}>
                    Verify Email
                  </Text>

                  <Text style={styles.arrow}>→</Text>
                </>
              )}
            </Pressable>

            <Pressable
              style={styles.resendButton}
              onPress={handleResend}
              disabled={resending || loading}
            >
              {resending ? (
                <ActivityIndicator color="#9388ee" size="small" />
              ) : (
                <Text style={styles.resendText}>
                  Didn't receive it? Resend code
                </Text>
              )}
            </Pressable>

            <View style={styles.divider} />

            <Pressable
              disabled={loading}
              onPress={() => router.replace("/login")}
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
    paddingTop: 100,
    paddingBottom: 100,
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
    fontSize: 42,
    letterSpacing: -1.5,
  },

  script: {
    color: "#c4bdff",
    fontFamily: "MrDafoe",
    fontSize: 52,
    fontWeight: "400",
    letterSpacing: 0,
  },

  subtitle: {
    color: "#77747f",
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    maxWidth: 290,
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
    alignItems: "center",
  },

  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(132, 119, 255, 0.45)",
    backgroundColor: "rgba(95, 79, 210, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  icon: {
    color: "#a99cff",
    fontSize: 24,
  },

  cardTitle: {
    color: "#ffffff",
    fontFamily: "DMSans_600SemiBold",
    fontSize: 21,
    marginBottom: 8,
  },

  cardSubtitle: {
    color: "#77747f",
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    textAlign: "center",
  },

  email: {
    color: "#b7b0f5",
    fontFamily: "DMSans_600SemiBold",
    fontSize: 12,
    marginTop: 5,
    marginBottom: 25,
  },

  inputGroup: {
    width: "100%",
    marginBottom: 18,
  },

  label: {
    color: "#a7a4ad",
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
    marginBottom: 8,
  },

  otpInput: {
    width: "100%",
    height: 58,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "rgba(130, 126, 143, 0.25)",
    backgroundColor: "rgba(5, 5, 8, 0.8)",
    color: "#ffffff",
    fontFamily: "DMSans_600SemiBold",
    fontSize: 22,
    letterSpacing: 8,
  },

  errorBox: {
    width: "100%",
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
    textAlign: "center",
  },

  successBox: {
    width: "100%",
    backgroundColor: "rgba(80, 200, 140, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(80, 200, 140, 0.2)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
  },

  successText: {
    color: "#8de0b3",
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    textAlign: "center",
  },

  verifyButton: {
    width: "100%",
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

  verifyButtonText: {
    color: "#ffffff",
    fontFamily: "DMSans_700Bold",
    fontSize: 13,
  },

  arrow: {
    color: "#ffffff",
    fontFamily: "DMSans_500Medium",
    fontSize: 18,
  },

  resendButton: {
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  resendText: {
    color: "#9388ee",
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
  },

  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(130, 126, 143, 0.16)",
    marginVertical: 18,
  },

  backText: {
    color: "#77747f",
    fontFamily: "DMSans_500Medium",
    fontSize: 11,
  },
});