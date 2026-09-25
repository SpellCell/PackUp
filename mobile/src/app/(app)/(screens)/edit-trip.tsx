import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";

import { useAuth } from "../../../context/AuthContext";
import { getTripById, Trip } from "../../../services/authService";
import {
  updateTrip,
  uploadTripCover,
} from "../../../services/tripService";

const TRIP_TYPES = ["Adventure", "Leisure", "Road Trip", "Backpacking", "Business", "Other"];

export default function EditTrip() {
  const { token } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);

  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [maxMembers, setMaxMembers] = useState("");
  const [tripType, setTripType] = useState("Adventure");

  useEffect(() => {
    loadTrip();
  }, [token, id]);

  async function loadTrip() {
    if (!token || !id) {
      setLoading(false);
      return;
    }

    try {
      const response = await getTripById(token, id);
      const currentTrip = response.trip;

      setTrip(currentTrip);
      setTitle(currentTrip.title || "");
      setSource(currentTrip.source || "");
      setDestination(currentTrip.destination || "");
      setDescription(currentTrip.description || "");
      setStartDate(formatDateForInput(currentTrip.startDate));
      setEndDate(formatDateForInput(currentTrip.endDate));
      setBudget(String(currentTrip.budget ?? ""));
      setMaxMembers(String(currentTrip.maxMembers ?? ""));
      setTripType(currentTrip.tripType || "Adventure");
    } catch (error) {
      Alert.alert(
        "Couldn't load trip",
        error instanceof Error ? error.message : "Something went wrong.",
        [{ text: "Go back", onPress: () => router.back() }]
      );
    } finally {
      setLoading(false);
    }
  }

  function formatDateForInput(value: string) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toISOString().slice(0, 10);
  }

  function parseDate(value: string) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  async function handleSave() {
    if (!token || !id || !trip) return;

    const cleanTitle = title.trim();
    const cleanSource = source.trim();
    const cleanDestination = destination.trim();
    const cleanDescription = description.trim();
    const budgetNumber = Number(budget);
    const maxMembersNumber = Number(maxMembers);
    const start = parseDate(startDate);
    const end = parseDate(endDate);

    if (!cleanTitle || !cleanSource || !cleanDestination) {
      Alert.alert("Missing information", "Please fill in the title, source and destination.");
      return;
    }

    if (!start || !end) {
      Alert.alert("Invalid dates", "Use YYYY-MM-DD for the start and end dates.");
      return;
    }

    if (end < start) {
      Alert.alert("Invalid dates", "End date cannot be before the start date.");
      return;
    }

    if (!Number.isFinite(budgetNumber) || budgetNumber < 0) {
      Alert.alert("Invalid budget", "Enter a valid budget.");
      return;
    }

    if (!Number.isInteger(maxMembersNumber) || maxMembersNumber < trip.currentMembers) {
      Alert.alert(
        "Invalid member limit",
        `Maximum members must be at least ${trip.currentMembers}.`
      );
      return;
    }

    try {
      setSaving(true);

      await updateTrip(token, id, {
        title: cleanTitle,
        source: cleanSource,
        destination: cleanDestination,
        description: cleanDescription,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        budget: budgetNumber,
        maxMembers: maxMembersNumber,
        tripType,
      });

      Alert.alert("Trip updated", "Your trip details have been updated.", [
        {
          text: "Done",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert(
        "Couldn't update trip",
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleChangeCover() {
    if (!token || !id) return;

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission needed",
        "Allow photo access to choose a trip cover image."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.85,
    });

    if (result.canceled || !result.assets[0]?.uri) return;

    try {
      setCoverUploading(true);
      const response = await uploadTripCover(
        token,
        id,
        result.assets[0].uri
      );

      setTrip((current) =>
        current
          ? {
              ...current,
              coverImage: response.trip?.coverImage || result.assets[0].uri,
            }
          : current
      );

      Alert.alert("Cover updated", "Your trip cover has been updated.");
    } catch (error) {
      Alert.alert(
        "Couldn't update cover",
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setCoverUploading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#9188ff" />
        <Text style={styles.loadingText}>Loading trip...</Text>
      </View>
    );
  }

  if (!trip) return null;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#08080d", "#0c0b14", "#050507"]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={20} color="#ffffff" />
          </TouchableOpacity>

          <Text style={styles.topTitle}>Edit Trip</Text>
          <View style={styles.topSpacer} />
        </View>

        <View style={styles.coverCard}>
          {trip.coverImage ? (
            <Image source={{ uri: trip.coverImage }} style={styles.coverImage} />
          ) : (
            <LinearGradient
              colors={["#211c3d", "#151229", "#0e0d15"]}
              style={styles.coverImage}
            >
              <Ionicons name="image-outline" size={42} color="#aaa2ff" />
              <Text style={styles.coverPlaceholder}>No cover image</Text>
            </LinearGradient>
          )}

          <TouchableOpacity
            style={styles.coverButton}
            activeOpacity={0.85}
            disabled={coverUploading}
            onPress={handleChangeCover}
          >
            {coverUploading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Feather name="camera" size={15} color="#ffffff" />
                <Text style={styles.coverButtonText}>Change Cover</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Trip details</Text>

        <Field label="Trip title" value={title} onChangeText={setTitle} placeholder="e.g. Manali Escape" />
        <Field label="Starting point" value={source} onChangeText={setSource} placeholder="e.g. Mathura" />
        <Field label="Destination" value={destination} onChangeText={setDestination} placeholder="e.g. Manali" />
        <Field
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Tell people about this trip..."
          multiline
        />

        <View style={styles.row}>
          <View style={styles.half}>
            <Field label="Start date" value={startDate} onChangeText={setStartDate} placeholder="YYYY-MM-DD" />
          </View>
          <View style={styles.half}>
            <Field label="End date" value={endDate} onChangeText={setEndDate} placeholder="YYYY-MM-DD" />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.half}>
            <Field label="Budget (₹)" value={budget} onChangeText={setBudget} placeholder="10000" keyboardType="numeric" />
          </View>
          <View style={styles.half}>
            <Field label="Max members" value={maxMembers} onChangeText={setMaxMembers} placeholder="5" keyboardType="numeric" />
          </View>
        </View>

        <Text style={styles.fieldLabel}>Trip type</Text>
        <View style={styles.typeGrid}>
          {TRIP_TYPES.map((type) => {
            const selected = tripType === type;
            return (
              <TouchableOpacity
                key={type}
                style={[styles.typeChip, selected && styles.typeChipSelected]}
                onPress={() => setTripType(type)}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name={selected ? "check-circle" : "circle-outline"}
                  size={16}
                  color={selected ? "#aaa2ff" : "#666372"}
                />
                <Text style={[styles.typeChipText, selected && styles.typeChipTextSelected]}>
                  {type}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.85}
          disabled={saving || coverUploading}
          onPress={handleSave}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Feather name="check" size={18} color="#ffffff" />
          )}
          <Text style={styles.saveButtonText}>
            {saving ? "Saving Changes..." : "Save Changes"}
          </Text>
        </TouchableOpacity>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  keyboardType = "default",
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  multiline?: boolean;
  keyboardType?: "default" | "numeric";
}) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#55525f"
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        style={[styles.input, multiline && styles.textarea]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050507" },
  loadingScreen: {
    flex: 1,
    backgroundColor: "#050507",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: "#777482",
    marginTop: 12,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: "#121118",
    borderWidth: 1,
    borderColor: "#292731",
    alignItems: "center",
    justifyContent: "center",
  },
  topTitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 16,
    color: "#ffffff",
  },
  topSpacer: { width: 44 },
  coverCard: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#292633",
    backgroundColor: "#101016",
    marginBottom: 28,
  },
  coverImage: {
    width: "100%",
    height: 190,
    alignItems: "center",
    justifyContent: "center",
  },
  coverPlaceholder: {
    fontFamily: "DMSans_400Regular",
    color: "#777482",
    fontSize: 11,
    marginTop: 7,
  },
  coverButton: {
    height: 48,
    backgroundColor: "#181624",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  coverButtonText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 12,
    color: "#ffffff",
  },
  sectionTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 19,
    color: "#ffffff",
    marginBottom: 15,
  },
  fieldContainer: { marginBottom: 16, flex: 1 },
  fieldLabel: {
    fontFamily: "DMSans_500Medium",
    fontSize: 11,
    color: "#aaa5b4",
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#292733",
    backgroundColor: "#101016",
    paddingHorizontal: 15,
    color: "#ffffff",
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
  },
  textarea: {
    height: 115,
    paddingTop: 14,
    paddingBottom: 14,
  },
  row: {
    flexDirection: "row",
    gap: 11,
  },
  half: { flex: 1 },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
    marginBottom: 25,
  },
  typeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#292733",
    backgroundColor: "#101016",
  },
  typeChipSelected: {
    borderColor: "#403a65",
    backgroundColor: "#19172a",
  },
  typeChipText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 10,
    color: "#777482",
  },
  typeChipTextSelected: { color: "#aaa2ff" },
  saveButton: {
    height: 54,
    borderRadius: 17,
    backgroundColor: "#7168df",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    marginTop: 5,
  },
  saveButtonText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: "#ffffff",
  },
  bottomSpace: { height: 20 },
});
