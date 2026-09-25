import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import {
  createTrip,
  CreateTripData,
} from "../../../services/tripService";

const tripTypes = [
  "Adventure",
  "Road Trip",
  "Backpacking",
  "Camping",
  "Trekking",
  "Beach",
  "Family",
  "Business",
  "Solo",
  "Other",
];

export default function CreateTrip() {
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [maxMembers, setMaxMembers] = useState("");
  const [tripType, setTripType] = useState("Adventure");

  const [loading, setLoading] = useState(false);

  function validateForm() {
    if (title.trim().length < 3) {
      Alert.alert(
        "Invalid title",
        "Trip title must be at least 3 characters."
      );
      return false;
    }

    if (!source.trim()) {
      Alert.alert("Missing source", "Please enter where the trip starts.");
      return false;
    }

    if (!destination.trim()) {
      Alert.alert(
        "Missing destination",
        "Please enter your destination."
      );
      return false;
    }

    if (description.trim().length < 20) {
      Alert.alert(
        "Description too short",
        "Description must be at least 20 characters."
      );
      return false;
    }

    if (!startDate.trim()) {
      Alert.alert(
        "Missing start date",
        "Please enter the start date as YYYY-MM-DD."
      );
      return false;
    }

    if (!endDate.trim()) {
      Alert.alert(
        "Missing end date",
        "Please enter the end date as YYYY-MM-DD."
      );
      return false;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime())) {
      Alert.alert(
        "Invalid start date",
        "Use the format YYYY-MM-DD."
      );
      return false;
    }

    if (Number.isNaN(end.getTime())) {
      Alert.alert(
        "Invalid end date",
        "Use the format YYYY-MM-DD."
      );
      return false;
    }

    if (end < start) {
      Alert.alert(
        "Invalid dates",
        "End date cannot be before the start date."
      );
      return false;
    }

    const budgetNumber = Number(budget);

    if (!budget || budgetNumber < 1) {
      Alert.alert(
        "Invalid budget",
        "Budget must be at least ₹1."
      );
      return false;
    }

    const membersNumber = Number(maxMembers);

    if (
      !maxMembers ||
      membersNumber < 2 ||
      membersNumber > 100
    ) {
      Alert.alert(
        "Invalid members",
        "Maximum members must be between 2 and 100."
      );
      return false;
    }

    return true;
  }

  async function handleCreateTrip() {
    if (!token) {
      Alert.alert(
        "Session expired",
        "Please login again."
      );
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const tripData: CreateTripData = {
        title: title.trim(),
        source: source.trim(),
        destination: destination.trim(),
        description: description.trim(),
        startDate,
        endDate,
        budget: Number(budget),
        maxMembers: Number(maxMembers),
        tripType,
      };

      await createTrip(token, tripData);

      Alert.alert(
        "Trip created 🎉",
        "Your new adventure has been created successfully.",
        [
          {
            text: "View Trips",
            onPress: () => router.replace("/trips"),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Couldn't create trip",
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

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
        {/* Header */}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather
            name="arrow-left"
            size={20}
            color="#ffffff"
          />
        </TouchableOpacity>

        <Text style={styles.eyebrow}>
          NEW ADVENTURE
        </Text>

        <Text style={styles.title}>
          Create a Trip
        </Text>

        <Text style={styles.subtitle}>
          Plan your journey and invite people to experience it with you.
        </Text>

        {/* Trip title */}

        <View style={styles.section}>
          <Text style={styles.label}>
            Trip Title
          </Text>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Manali Backpacking"
            placeholderTextColor="#555260"
            style={styles.input}
          />
        </View>

        {/* Source */}

        <View style={styles.section}>
          <Text style={styles.label}>
            From
          </Text>

          <View style={styles.inputWithIcon}>
            <Ionicons
              name="location-outline"
              size={19}
              color="#aaa2ff"
            />

            <TextInput
              value={source}
              onChangeText={setSource}
              placeholder="Delhi"
              placeholderTextColor="#555260"
              style={styles.iconInput}
            />
          </View>
        </View>

        {/* Destination */}

        <View style={styles.section}>
          <Text style={styles.label}>
            Destination
          </Text>

          <View style={styles.inputWithIcon}>
            <Ionicons
              name="navigate-outline"
              size={19}
              color="#8de7ff"
            />

            <TextInput
              value={destination}
              onChangeText={setDestination}
              placeholder="Manali"
              placeholderTextColor="#555260"
              style={styles.iconInput}
            />
          </View>
        </View>

        {/* Description */}

        <View style={styles.section}>
          <Text style={styles.label}>
            Description
          </Text>

          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Tell your travel partners about this trip..."
            placeholderTextColor="#555260"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            style={styles.textArea}
          />

          <Text style={styles.helperText}>
            Minimum 20 characters
          </Text>
        </View>

        {/* Dates */}

        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={styles.label}>
              Start Date
            </Text>

            <TextInput
              value={startDate}
              onChangeText={setStartDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#555260"
              keyboardType="numbers-and-punctuation"
              style={styles.input}
            />
          </View>

          <View style={styles.halfField}>
            <Text style={styles.label}>
              End Date
            </Text>

            <TextInput
              value={endDate}
              onChangeText={setEndDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#555260"
              keyboardType="numbers-and-punctuation"
              style={styles.input}
            />
          </View>
        </View>

        {/* Budget + members */}

        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={styles.label}>
              Budget
            </Text>

            <View style={styles.inputWithIcon}>
              <Text style={styles.rupee}>
                ₹
              </Text>

              <TextInput
                value={budget}
                onChangeText={setBudget}
                placeholder="5000"
                placeholderTextColor="#555260"
                keyboardType="numeric"
                style={styles.iconInput}
              />
            </View>
          </View>

          <View style={styles.halfField}>
            <Text style={styles.label}>
              Max Members
            </Text>

            <View style={styles.inputWithIcon}>
              <Ionicons
                name="people-outline"
                size={19}
                color="#aaa2ff"
              />

              <TextInput
                value={maxMembers}
                onChangeText={setMaxMembers}
                placeholder="5"
                placeholderTextColor="#555260"
                keyboardType="numeric"
                style={styles.iconInput}
              />
            </View>
          </View>
        </View>

        {/* Trip type */}

        <View style={styles.section}>
          <Text style={styles.label}>
            Trip Type
          </Text>

          <View style={styles.typeGrid}>
            {tripTypes.map((type) => {
              const selected = tripType === type;

              return (
                <TouchableOpacity
                  key={type}
                  onPress={() => setTripType(type)}
                  style={[
                    styles.typeChip,
                    selected && styles.typeChipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.typeText,
                      selected && styles.typeTextSelected,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Create */}

        <TouchableOpacity
          activeOpacity={0.85}
          disabled={loading}
          onPress={handleCreateTrip}
          style={styles.createButton}
        >
          <LinearGradient
            colors={["#9188ff", "#7168df"]}
            style={styles.createButtonGradient}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Feather
                  name="plus"
                  size={20}
                  color="#ffffff"
                />

                <Text style={styles.createButtonText}>
                  Create Trip
                </Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050507",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 40,
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
    marginBottom: 30,
  },

  eyebrow: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 10,
    letterSpacing: 2,
    color: "#777486",
  },

  title: {
    fontFamily: "DMSans_700Bold",
    fontSize: 32,
    color: "#ffffff",
    marginTop: 7,
  },

  subtitle: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    lineHeight: 20,
    color: "#777482",
    marginTop: 8,
    marginBottom: 30,
  },

  section: {
    marginBottom: 22,
  },

  label: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: "#ffffff",
    marginBottom: 9,
  },

  input: {
    height: 52,
    borderRadius: 15,
    backgroundColor: "#101016",
    borderWidth: 1,
    borderColor: "#292731",
    paddingHorizontal: 15,
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: "#ffffff",
  },

  inputWithIcon: {
    height: 52,
    borderRadius: 15,
    backgroundColor: "#101016",
    borderWidth: 1,
    borderColor: "#292731",
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  iconInput: {
    flex: 1,
    height: "100%",
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: "#ffffff",
  },

  textArea: {
    minHeight: 125,
    borderRadius: 15,
    backgroundColor: "#101016",
    borderWidth: 1,
    borderColor: "#292731",
    paddingHorizontal: 15,
    paddingTop: 14,
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    lineHeight: 20,
    color: "#ffffff",
  },

  helperText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    color: "#555260",
    marginTop: 6,
  },

  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 22,
  },

  halfField: {
    flex: 1,
  },

  rupee: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 16,
    color: "#aaa2ff",
  },

  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
  },

  typeChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 13,
    backgroundColor: "#101016",
    borderWidth: 1,
    borderColor: "#292731",
  },

  typeChipSelected: {
    backgroundColor: "#29234d",
    borderColor: "#7569df",
  },

  typeText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 11,
    color: "#777482",
  },

  typeTextSelected: {
    color: "#b5aeff",
  },

  createButton: {
    borderRadius: 17,
    overflow: "hidden",
    marginTop: 5,
  },

  createButtonGradient: {
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 9,
  },

  createButtonText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 15,
    color: "#ffffff",
  },

  bottomSpace: {
    height: 20,
  },
});