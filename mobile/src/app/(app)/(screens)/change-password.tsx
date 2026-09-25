import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { apiRequest } from "../../../api/api";
import { useAuth } from "../../../context/AuthContext";

function PasswordInput({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry: boolean;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.inputWrapper}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#5f5d68"
        secureTextEntry={secureTextEntry && !visible}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TouchableOpacity
        style={styles.eyeButton}
        activeOpacity={0.7}
        onPress={() => setVisible((previous) => !previous)}
      >
        <Feather
          name={visible ? "eye" : "eye-off"}
          size={18}
          color="#777482"
        />
      </TouchableOpacity>
    </View>
  );
}

function Requirement({
  met,
  text,
}: {
  met: boolean;
  text: string;
}) {
  return (
    <View style={styles.requirement}>
      <View
        style={[
          styles.requirementIcon,
          met && styles.requirementIconMet,
        ]}
      >
        <Feather
          name="check"
          size={10}
          color={met ? "#000000" : "#66636f"}
        />
      </View>

      <Text
        style={[
          styles.requirementText,
          met && styles.requirementTextMet,
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

export default function ChangePasswordScreen() {
  const { token } = useAuth();

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);

  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);

  const passwordValid =
    hasMinLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber;

  const passwordsMatch =
    newPassword.length > 0 &&
    newPassword === confirmPassword;

  async function handleChangePassword() {
    if (!token) {
      Alert.alert(
        "Session expired",
        "Please log in again."
      );
      return;
    }

    if (!currentPassword) {
      Alert.alert(
        "Current password required",
        "Please enter your current password."
      );
      return;
    }

    if (!passwordValid) {
      Alert.alert(
        "Invalid password",
        "Please satisfy all password requirements."
      );
      return;
    }

    if (!passwordsMatch) {
      Alert.alert(
        "Passwords don't match",
        "Please make sure both new passwords are the same."
      );
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert(
        "Invalid password",
        "Your new password must be different from your current password."
      );
      return;
    }

    try {
      setLoading(true);

      await apiRequest("/api/users/change-password", {
        method: "PUT",
        token,
        body: {
          currentPassword,
          newPassword,
        },
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      Alert.alert(
        "Password changed",
        "Your password has been updated successfully.",
        [
          {
            text: "Done",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        "Unable to change password",
        error?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              activeOpacity={0.75}
              onPress={() => router.back()}
            >
              <Feather
                name="arrow-left"
                size={21}
                color="#ffffff"
              />
            </TouchableOpacity>

            <View>
              <Text style={styles.eyebrow}>
                ACCOUNT
              </Text>

              <Text style={styles.title}>
                Change Password
              </Text>
            </View>
          </View>

          <View style={styles.introCard}>
            <View style={styles.lockIcon}>
              <Feather
                name="lock"
                size={21}
                color="#c2bcff"
              />
            </View>

            <View style={styles.introContent}>
              <Text style={styles.introTitle}>
                Keep your account secure
              </Text>

              <Text style={styles.introText}>
                Choose a strong password that you
                don't use anywhere else.
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>
            CURRENT PASSWORD
          </Text>

          <PasswordInput
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Enter current password"
            secureTextEntry
          />

          <Text style={styles.sectionTitle}>
            NEW PASSWORD
          </Text>

          <PasswordInput
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter new password"
            secureTextEntry
          />

          <View style={styles.requirementsCard}>
            <Requirement
              met={hasMinLength}
              text="At least 8 characters"
            />

            <Requirement
              met={hasUppercase}
              text="One uppercase letter"
            />

            <Requirement
              met={hasLowercase}
              text="One lowercase letter"
            />

            <Requirement
              met={hasNumber}
              text="One number"
            />
          </View>

          <Text style={styles.sectionTitle}>
            CONFIRM NEW PASSWORD
          </Text>

          <PasswordInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
            secureTextEntry
          />

          {confirmPassword.length > 0 && (
            <View style={styles.matchRow}>
              <Feather
                name={
                  passwordsMatch
                    ? "check-circle"
                    : "x-circle"
                }
                size={14}
                color={
                  passwordsMatch
                    ? "#8de7b0"
                    : "#ff7777"
                }
              />

              <Text
                style={[
                  styles.matchText,
                  passwordsMatch
                    ? styles.matchSuccess
                    : styles.matchError,
                ]}
              >
                {passwordsMatch
                  ? "Passwords match"
                  : "Passwords do not match"}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.changeButton,
              loading && styles.changeButtonDisabled,
            ]}
            activeOpacity={0.8}
            onPress={handleChangePassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator
                size="small"
                color="#000000"
              />
            ) : (
              <>
                <Feather
                  name="shield"
                  size={17}
                  color="#000000"
                />

                <Text style={styles.changeButtonText}>
                  Update Password
                </Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Your new password will be securely hashed
            before it is stored.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#09090d",
  },

  keyboardView: {
    flex: 1,
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 45,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 30,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#15151c",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#24242d",
  },

  eyebrow: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 10,
    letterSpacing: 2.2,
    color: "#777",
    marginBottom: 3,
  },

  title: {
    fontFamily: "DMSans_700Bold",
    fontSize: 26,
    color: "#ffffff",
  },

  introCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111117",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#24232d",
    padding: 16,
    marginBottom: 28,
  },

  lockIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#191822",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  introContent: {
    flex: 1,
  },

  introTitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: "#ffffff",
    marginBottom: 4,
  },

  introText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    lineHeight: 17,
    color: "#777482",
  },

  sectionTitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 10,
    letterSpacing: 1.8,
    color: "#666",
    marginBottom: 9,
    marginLeft: 3,
  },

  inputWrapper: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111117",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#292832",
    marginBottom: 23,
  },

  input: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 16,
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: "#ffffff",
  },

  eyeButton: {
    width: 48,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  requirementsCard: {
    backgroundColor: "#0f0f15",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#20202a",
    padding: 14,
    marginTop: -9,
    marginBottom: 23,
    gap: 10,
  },

  requirement: {
    flexDirection: "row",
    alignItems: "center",
  },

  requirementIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#191920",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },

  requirementIconMet: {
    backgroundColor: "#8de7b0",
  },

  requirementText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: "#66636f",
  },

  requirementTextMet: {
    color: "#aaa7b2",
  },

  matchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: -14,
    marginBottom: 23,
    marginLeft: 4,
  },

  matchText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
  },

  matchSuccess: {
    color: "#8de7b0",
  },

  matchError: {
    color: "#ff7777",
  },

  changeButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },

  changeButtonDisabled: {
    opacity: 0.6,
  },

  changeButtonText: {
    fontFamily: "DMSans_700Bold",
    fontSize: 14,
    color: "#000000",
  },

  footerText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    lineHeight: 16,
    color: "#4f4c57",
    textAlign: "center",
    marginTop: 17,
    paddingHorizontal: 20,
  },
});