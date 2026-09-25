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
import { router } from "expo-router";
import AuthBackground from "../../components/auth/AuthBackground";
import { registerUser } from "../../services/authService";

export default function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordRules = [
    {
      label: "8+ characters",
      valid: password.length >= 8,
    },
    {
      label: "Uppercase letter",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "Lowercase letter",
      valid: /[a-z]/.test(password),
    },
    {
      label: "Number",
      valid: /[0-9]/.test(password),
    },
  ];

  const passwordIsStrong = passwordRules.every(
    (rule) => rule.valid
  );

  async function handleRegister() {
    setError("");

    if (
      !name.trim() ||
      !username.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (name.trim().length < 3) {
      setError("Name must be at least 3 characters.");
      return;
    }

    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }

    if (!passwordIsStrong) {
      setError("Please create a stronger password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const normalizedEmail = email.trim().toLowerCase();

      await registerUser(
        name.trim(),
        username.trim(),
        normalizedEmail,
        password
      );

      router.push({
        pathname: "/verify-email",
        params: {
          email: normalizedEmail,
        },
      });
    } catch (err: any) {
      setError(
        err?.message ||
          "Unable to create your account. Please try again."
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
            <Text style={styles.eyebrow}>
              YOUR NEXT ADVENTURE
            </Text>

            <Text style={styles.title}>
              Join <Text style={styles.script}>PackUP.</Text>
            </Text>

            <Text style={styles.subtitle}>
              Create your account and start planning your
              next adventure.
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardEyebrow}>
                  CREATE ACCOUNT
                </Text>

                <Text style={styles.cardTitle}>
                  Let's get started.
                </Text>
              </View>

              <View style={styles.iconBox}>
                <Text style={styles.icon}>✦</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full name</Text>

              <TextInput
                style={styles.input}
                placeholder="Your full name"
                placeholderTextColor="#66636f"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>

              <TextInput
                style={styles.input}
                placeholder="Choose a username"
                placeholderTextColor="#66636f"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
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

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>

              <TextInput
                style={styles.input}
                placeholder="Create a strong password"
                placeholderTextColor="#66636f"
                secureTextEntry
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />

              <View style={styles.passwordRules}>
                {passwordRules.map((rule) => (
                  <View
                    key={rule.label}
                    style={styles.passwordRule}
                  >
                    <View
                      style={[
                        styles.ruleIcon,
                        rule.valid &&
                          styles.ruleIconValid,
                      ]}
                    >
                      <Text
                        style={[
                          styles.ruleCheck,
                          rule.valid &&
                            styles.ruleCheckValid,
                        ]}
                      >
                        ✓
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.ruleText,
                        rule.valid &&
                          styles.ruleTextValid,
                      ]}
                    >
                      {rule.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Confirm password
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor="#66636f"
                secureTextEntry
                autoCapitalize="none"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!loading}
              />

              {confirmPassword.length > 0 &&
              password !== confirmPassword ? (
                <Text style={styles.confirmError}>
                  Passwords do not match
                </Text>
              ) : null}

              {confirmPassword.length > 0 &&
              password === confirmPassword ? (
                <Text style={styles.confirmSuccess}>
                  Passwords match ✓
                </Text>
              ) : null}
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
                styles.registerButton,
                loading &&
                  styles.registerButtonDisabled,
              ]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <Text style={styles.registerButtonText}>
                    Create Account
                  </Text>

                  <Text style={styles.arrow}>→</Text>
                </>
              )}
            </Pressable>

            <View style={styles.divider} />

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>
                Already have an account?{" "}
              </Text>

              <Pressable
                disabled={loading}
                onPress={() => router.replace("/login")}
              >
                <Text style={styles.loginLink}>
                  Sign in →
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

  passwordRules: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },

  passwordRule: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginRight: 4,
    marginBottom: 2,
  },

  ruleIcon: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    borderWidth: 1,
    borderColor: "rgba(130, 126, 143, 0.35)",
    backgroundColor: "rgba(5, 5, 8, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },

  ruleIconValid: {
    borderColor: "rgba(141, 131, 232, 0.8)",
    backgroundColor: "rgba(102, 87, 245, 0.3)",
  },

  ruleCheck: {
    color: "#55515e",
    fontFamily: "DMSans_700Bold",
    fontSize: 8,
  },

  ruleCheckValid: {
    color: "#c4bdff",
  },

  ruleText: {
    color: "#66636f",
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
  },

  ruleTextValid: {
    color: "#aaa3e8",
  },

  confirmError: {
    color: "#ff8b99",
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    marginTop: 7,
  },

  confirmSuccess: {
    color: "#8de0b3",
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    marginTop: 7,
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

  registerButton: {
    height: 52,
    borderRadius: 13,
    backgroundColor: "#6657f5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  registerButtonDisabled: {
    opacity: 0.7,
  },

  registerButtonText: {
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

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },

  loginText: {
    color: "#66636d",
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
  },

  loginLink: {
    color: "#9388ee",
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
  },
});