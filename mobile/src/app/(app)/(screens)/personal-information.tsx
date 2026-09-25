import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

import { apiRequest } from "../../../api/api";
import { useAuth } from "../../../context/AuthContext";

type Profile = {
  _id: string;
  name: string;
  username: string;
  email: string;
  profileImage?: string;
  bio?: string;
  gender?: "Male" | "Female" | "Other";
  dateOfBirth?: string;
  interests?: string[];
  skills?: string[];
  instagram?: string;
  linkedin?: string;
};

const BASE_URL = "https://packup-c2lk.onrender.com";

export default function PersonalInformationScreen() {
  const { token } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [interests, setInterests] = useState("");
  const [skills, setSkills] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!token) return;

    try {
      const response = await apiRequest("/api/users/profile", {
        method: "GET",
        token,
      });

      const user = response?.user;

      if (!user) {
        throw new Error("Profile data not found");
      }

      setProfile(user);

      setName(user.name || "");
      setUsername(user.username || "");
      setEmail(user.email || "");
      setBio(user.bio || "");
      setGender(user.gender || "");

      if (user.dateOfBirth) {
        setDateOfBirth(user.dateOfBirth.slice(0, 10));
      } else {
        setDateOfBirth("");
      }

      setInterests((user.interests || []).join(", "));
      setSkills((user.skills || []).join(", "));
      setInstagram(user.instagram || "");
      setLinkedin(user.linkedin || "");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.message || "Unable to load your profile."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  function validateDate(value: string) {
    if (!value) return true;

    const regex = /^\d{4}-\d{2}-\d{2}$/;

    if (!regex.test(value)) {
      return false;
    }

    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return false;
    }

    const [year, month, day] = value.split("-").map(Number);

    return (
      date.getFullYear() === year &&
      date.getMonth() + 1 === month &&
      date.getDate() === day
    );
  }

  function parseList(value: string) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  async function saveProfile() {
    if (!token) return;

    const trimmedName = name.trim();
    const trimmedUsername = username.trim().toLowerCase();
    const trimmedBio = bio.trim();
    const trimmedDate = dateOfBirth.trim();
    const trimmedInstagram = instagram.trim();
    const trimmedLinkedin = linkedin.trim();

    if (!trimmedName) {
      Alert.alert("Invalid Name", "Please enter your name.");
      return;
    }

    if (trimmedName.length < 3) {
      Alert.alert(
        "Invalid Name",
        "Name must contain at least 3 characters."
      );
      return;
    }

    if (!trimmedUsername) {
      Alert.alert("Invalid Username", "Please enter a username.");
      return;
    }

    if (
      trimmedUsername.length < 3 ||
      trimmedUsername.length > 20
    ) {
      Alert.alert(
        "Invalid Username",
        "Username must be between 3 and 20 characters."
      );
      return;
    }

    if (trimmedBio.length > 300) {
      Alert.alert(
        "Bio Too Long",
        "Bio cannot contain more than 300 characters."
      );
      return;
    }

    if (!validateDate(trimmedDate)) {
      Alert.alert(
        "Invalid Date",
        "Please use the format YYYY-MM-DD."
      );
      return;
    }

    if (trimmedDate) {
      const selectedDate = new Date(`${trimmedDate}T00:00:00`);
      const today = new Date();

      if (selectedDate > today) {
        Alert.alert(
          "Invalid Date",
          "Date of birth cannot be in the future."
        );
        return;
      }
    }

    setSaving(true);

    try {
      const response = await apiRequest("/api/users/profile", {
        method: "PUT",
        token,
        body: {
          name: trimmedName,
          username: trimmedUsername,
          bio: trimmedBio,
          gender: gender || undefined,
          dateOfBirth: trimmedDate || undefined,
          interests: parseList(interests),
          skills: parseList(skills),
          instagram: trimmedInstagram,
          linkedin: trimmedLinkedin,
        },
      });

      const updatedUser = response?.user;

      if (updatedUser) {
        setProfile(updatedUser);

        setName(updatedUser.name || "");
        setUsername(updatedUser.username || "");
        setEmail(updatedUser.email || "");
        setBio(updatedUser.bio || "");
        setGender(updatedUser.gender || "");

        setDateOfBirth(
          updatedUser.dateOfBirth
            ? updatedUser.dateOfBirth.slice(0, 10)
            : ""
        );

        setInterests(
          (updatedUser.interests || []).join(", ")
        );

        setSkills(
          (updatedUser.skills || []).join(", ")
        );

        setInstagram(updatedUser.instagram || "");
        setLinkedin(updatedUser.linkedin || "");
      }

      Alert.alert(
        "Profile Updated",
        "Your profile has been updated successfully."
      );
    } catch (error: any) {
      Alert.alert(
        "Update Failed",
        error?.message || "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  }

  async function changeProfileImage() {
    if (!token) return;

    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow photo library access to change your profile picture."
        );
        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      const imageUri = result.assets[0].uri;

      setUploadingImage(true);

      const formData = new FormData();

      formData.append("avatar", {
        uri: imageUri,
        name: "profile-image.jpg",
        type: "image/jpeg",
      } as any);

      const response = await fetch(
        `${BASE_URL}/api/users/upload-avatar`,
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
            `Image upload failed with status ${response.status}`
        );
      }

      if (data?.user) {
        setProfile(data.user);
      }

      Alert.alert(
        "Profile Photo Updated",
        "Your profile picture has been updated successfully."
      );
    } catch (error: any) {
      Alert.alert(
        "Upload Failed",
        error?.message || "Unable to update your profile picture."
      );
    } finally {
      setUploadingImage(false);
    }
  }

  function goBack() {
    router.back();
  }

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>
          Loading profile...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await loadProfile();
            }}
            tintColor="#ffffff"
          />
        }
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={goBack}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#ffffff"
            />
          </Pressable>

          <View>
            <Text style={styles.title}>
              Personal Information
            </Text>
            <Text style={styles.subtitle}>
              Manage your PackUP profile
            </Text>
          </View>
        </View>

        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            {profile?.profileImage ? (
              <Image
                source={{ uri: profile.profileImage }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarText}>
                  {(name || "U").charAt(0).toUpperCase()}
                </Text>
              </View>
            )}

            {uploadingImage && (
              <View style={styles.avatarLoading}>
                <ActivityIndicator
                  size="small"
                  color="#ffffff"
                />
              </View>
            )}
          </View>

          <Pressable
            style={styles.changePhotoButton}
            onPress={changeProfileImage}
            disabled={uploadingImage}
          >
            <Ionicons
              name="camera-outline"
              size={17}
              color="#ffffff"
            />

            <Text style={styles.changePhotoText}>
              {uploadingImage
                ? "Uploading..."
                : "Change profile photo"}
            </Text>
          </Pressable>
        </View>

        <SectionTitle title="Basic Information" />

        <InputField
          label="Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          icon="person-outline"
        />

        <InputField
          label="Username"
          value={username}
          onChangeText={(value) =>
            setUsername(
              value.toLowerCase().replace(/\s/g, "")
            )
          }
          placeholder="Enter username"
          icon="at-outline"
          autoCapitalize="none"
        />

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Email</Text>

          <View style={styles.disabledInputWrapper}>
            <Ionicons
              name="mail-outline"
              size={19}
              color="#777777"
            />

            <Text style={styles.disabledInput}>
              {email}
            </Text>

            <Ionicons
              name="lock-closed-outline"
              size={16}
              color="#666666"
            />
          </View>

          <Text style={styles.helperText}>
            Email changes require a separate verification flow.
          </Text>
        </View>

        <SectionTitle title="About You" />

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Bio</Text>

          <View style={styles.textAreaWrapper}>
            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="Tell people a little about yourself..."
              placeholderTextColor="#666666"
              multiline
              maxLength={300}
              textAlignVertical="top"
              style={styles.textArea}
            />
          </View>

          <Text style={styles.counter}>
            {bio.length}/300
          </Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Gender</Text>

          <View style={styles.genderRow}>
            {["Male", "Female", "Other"].map((item) => {
              const selected = gender === item;

              return (
                <Pressable
                  key={item}
                  style={[
                    styles.genderButton,
                    selected && styles.genderButtonSelected,
                  ]}
                  onPress={() =>
                    setGender(
                      selected ? "" : item
                    )
                  }
                >
                  <Text
                    style={[
                      styles.genderText,
                      selected &&
                        styles.genderTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <InputField
          label="Date of Birth"
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
          placeholder="YYYY-MM-DD"
          icon="calendar-outline"
          keyboardType="numbers-and-punctuation"
          maxLength={10}
        />

        <Text style={styles.dateHint}>
          Example: 2003-08-21
        </Text>

        <SectionTitle title="Interests & Skills" />

        <InputField
          label="Interests"
          value={interests}
          onChangeText={setInterests}
          placeholder="Travel, Photography, Gaming"
          icon="heart-outline"
        />

        <Text style={styles.helperText}>
          Separate multiple interests with commas.
        </Text>

        <InputField
          label="Skills"
          value={skills}
          onChangeText={setSkills}
          placeholder="JavaScript, React, Photography"
          icon="flash-outline"
        />

        <Text style={styles.helperText}>
          Separate multiple skills with commas.
        </Text>

        <SectionTitle title="Social Links" />

        <InputField
          label="Instagram"
          value={instagram}
          onChangeText={setInstagram}
          placeholder="@username"
          icon="logo-instagram"
          autoCapitalize="none"
        />

        <InputField
          label="LinkedIn"
          value={linkedin}
          onChangeText={setLinkedin}
          placeholder="linkedin.com/in/username"
          icon="logo-linkedin"
          autoCapitalize="none"
        />

        <Pressable
          style={[
            styles.saveButton,
            saving && styles.saveButtonDisabled,
          ]}
          onPress={saveProfile}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator
              size="small"
              color="#000000"
            />
          ) : (
            <>
              <Ionicons
                name="checkmark-circle-outline"
                size={21}
                color="#000000"
              />

              <Text style={styles.saveButtonText}>
                Save Changes
              </Text>
            </>
          )}
        </Pressable>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function SectionTitle({
  title,
}: {
  title: string;
}) {
  return (
    <View style={styles.sectionTitleContainer}>
      <Text style={styles.sectionTitle}>
        {title}
      </Text>
    </View>
  );
}

function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  autoCapitalize = "sentences",
  keyboardType = "default",
  maxLength,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  icon: keyof typeof Ionicons.glyphMap;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: any;
  maxLength?: number;
}) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputWrapper}>
        <Ionicons
          name={icon}
          size={19}
          color="#777777"
        />

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#666666"
          style={styles.input}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          maxLength={maxLength}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090909",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 58,
    paddingBottom: 40,
  },

  loadingScreen: {
    flex: 1,
    backgroundColor: "#090909",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    color: "#888888",
    fontSize: 14,
    marginTop: 12,
    fontFamily: "DMSans_400Regular",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#171717",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  title: {
    color: "#ffffff",
    fontSize: 23,
    fontFamily: "DMSans_700Bold",
  },

  subtitle: {
    color: "#777777",
    fontSize: 13,
    marginTop: 3,
    fontFamily: "DMSans_400Regular",
  },

  avatarSection: {
    alignItems: "center",
    marginBottom: 30,
  },

  avatarWrapper: {
    width: 108,
    height: 108,
    borderRadius: 54,
    overflow: "hidden",
    marginBottom: 14,
    position: "relative",
  },

  avatar: {
    width: "100%",
    height: "100%",
  },

  avatarFallback: {
    width: "100%",
    height: "100%",
    backgroundColor: "#242424",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#ffffff",
    fontSize: 42,
    fontFamily: "DMSans_700Bold",
  },

  avatarLoading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },

  changePhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: "#191919",
  },

  changePhotoText: {
    color: "#ffffff",
    fontSize: 13,
    fontFamily: "DMSans_600SemiBold",
  },

  sectionTitleContainer: {
    marginTop: 13,
    marginBottom: 15,
  },

  sectionTitle: {
    color: "#ffffff",
    fontSize: 17,
    fontFamily: "DMSans_700Bold",
  },

  fieldContainer: {
    marginBottom: 17,
  },

  label: {
    color: "#bdbdbd",
    fontSize: 13,
    marginBottom: 8,
    fontFamily: "DMSans_500Medium",
  },

  inputWrapper: {
    minHeight: 51,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#252525",
    backgroundColor: "#111111",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  input: {
    flex: 1,
    color: "#ffffff",
    fontSize: 14,
    marginLeft: 10,
    fontFamily: "DMSans_400Regular",
  },

  disabledInputWrapper: {
    minHeight: 51,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#202020",
    backgroundColor: "#0e0e0e",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  disabledInput: {
    flex: 1,
    color: "#666666",
    fontSize: 14,
    marginLeft: 10,
    fontFamily: "DMSans_400Regular",
  },

  textAreaWrapper: {
    minHeight: 115,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#252525",
    backgroundColor: "#111111",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  textArea: {
    minHeight: 90,
    color: "#ffffff",
    fontSize: 14,
    lineHeight: 21,
    fontFamily: "DMSans_400Regular",
  },

  counter: {
    color: "#555555",
    fontSize: 11,
    textAlign: "right",
    marginTop: 5,
    fontFamily: "DMSans_400Regular",
  },

  helperText: {
    color: "#555555",
    fontSize: 11,
    marginTop: -9,
    marginBottom: 15,
    fontFamily: "DMSans_400Regular",
  },

  dateHint: {
    color: "#555555",
    fontSize: 11,
    marginTop: -10,
    marginBottom: 15,
    fontFamily: "DMSans_400Regular",
  },

  genderRow: {
    flexDirection: "row",
    gap: 10,
  },

  genderButton: {
    flex: 1,
    minHeight: 47,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#252525",
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
  },

  genderButtonSelected: {
    backgroundColor: "#ffffff",
    borderColor: "#ffffff",
  },

  genderText: {
    color: "#888888",
    fontSize: 13,
    fontFamily: "DMSans_600SemiBold",
  },

  genderTextSelected: {
    color: "#000000",
  },

  saveButton: {
    height: 54,
    borderRadius: 15,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 17,
  },

  saveButtonDisabled: {
    opacity: 0.65,
  },

  saveButtonText: {
    color: "#000000",
    fontSize: 15,
    fontFamily: "DMSans_700Bold",
  },

  bottomSpace: {
    height: 30,
  },
});