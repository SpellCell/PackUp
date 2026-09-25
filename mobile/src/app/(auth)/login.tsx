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
import { Ionicons } from "@expo/vector-icons";
import AuthBackground from "../../components/auth/AuthBackground";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      await login(email.trim().toLowerCase(), password);

      router.replace("/home");
    } catch (err: any) {
      setError(
        err?.message || "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
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
            <Text style={styles.eyebrow}>YOUR JOURNEY CONTINUES</Text>

            <Text style={styles.title}>
              Welcome <Text style={styles.script}>back.</Text>
            </Text>

            <Text style={styles.subtitle}>
              Pick up where you left off and continue your next adventure.
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardEyebrow}>SIGN IN</Text>

                <Text style={styles.cardTitle}>
                  Let's get moving.
                </Text>
              </View>

              <View style={styles.iconBox}>
                <Text style={styles.icon}>➤</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email address</Text>

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

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>

              <View style={styles.passwordInputRow}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#66636f"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  value={password}
                  onChangeText={setPassword}
                  editable={!loading}
                />

                <Pressable
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword((prev) => !prev)}
                  disabled={loading}
                  hitSlop={8}
                >
                  <Ionicons
                    name={
                      showPassword
                        ? "eye-off-outline"
                        : "eye-outline"
                    }
                    size={20}
                    color="#77747f"
                  />
                </Pressable>
              </View>
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Pressable
              style={styles.forgotButton}
              disabled={loading}
              onPress={() => router.push("/forgot-password")}
            >
              <Text style={styles.forgotText}>
                Forgot password?
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.loginButton,
                loading && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <Text style={styles.loginButtonText}>
                    Start Exploring
                  </Text>

                  <Text style={styles.arrow}>→</Text>
                </>
              )}
            </Pressable>

            <View style={styles.divider} />

            <View style={styles.registerRow}>
              <Text style={styles.registerText}>
                New to PackUP?{" "}
              </Text>

              <Pressable
                disabled={loading}
                onPress={() => router.push("/register")}
              >
                <Text style={styles.registerLink}>
                  Create an account →
                </Text>
              </Pressable>
            </View>
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
    fontSize: 21,
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
    color: "#a99cff",
    fontFamily: "DMSans_500Medium",
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

  passwordInputRow: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "rgba(130, 126, 143, 0.25)",
    backgroundColor: "rgba(5, 5, 8, 0.8)",
  },

  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    color: "#ffffff",
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
  },

  passwordToggle: {
    width: 48,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
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

  forgotButton: {
    alignSelf: "flex-end",
    marginTop: -3,
    marginBottom: 20,
  },

  forgotText: {
    color: "#9187dc",
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
  },

  loginButton: {
    height: 52,
    borderRadius: 13,
    backgroundColor: "#6657f5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  loginButtonDisabled: {
    opacity: 0.7,
  },

  loginButtonText: {
    color: "#ffffff",
    fontFamily: "DMSans_700Bold",
    fontSize: 13,
  },

  arrow: {
    color: "#ffffff",
    fontFamily: "DMSans_500Medium",
    fontSize: 18,
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(130, 126, 143, 0.16)",
    marginVertical: 20,
  },

  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },

  registerText: {
    color: "#66636d",
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
  },

  registerLink: {
    color: "#9388ee",
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
  },
});