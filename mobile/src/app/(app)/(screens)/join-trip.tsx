import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useCallback, useState } from "react";

import AnimatedDoodles from "../../../components/AnimatedDoodles";
import { useAuth } from "../../../context/AuthContext";
import {
  getMyJoinRequests,
  sendJoinRequest,
  JoinRequest,
} from "../../../services/joinRequestService";

export default function JoinTrip() {
  const { token } = useAuth();
  const [tripCode, setTripCode] = useState("");
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [sending, setSending] = useState(false);

  const loadRequests = useCallback(async () => {
    if (!token) {
      setLoadingRequests(false);
      return;
    }

    try {
      const response = await getMyJoinRequests(token);
      setRequests(response.requests || []);
    } catch (error) {
      console.log("Failed to load join requests:", error);
    } finally {
      setLoadingRequests(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      loadRequests();
    }, [loadRequests])
  );

  const pendingRequests = requests.filter(
    (request) => request.status === "Pending"
  );

  async function handleSubmit() {
    Keyboard.dismiss();

    const code = tripCode.trim().toUpperCase();

    if (!code) {
      Alert.alert("Trip code required", "Enter a trip code to continue.");
      return;
    }

    if (pendingRequests.some((request) => request.trip?.tripCode === code)) {
      Alert.alert("Request already pending", "You already have a pending request for this trip.");
      return;
    }

    if (!token) return;

    setSending(true);

    try {
      const response = await sendJoinRequest(token, code);
      setTripCode("");
      await loadRequests();
      Alert.alert("Request sent", response.message || "Your join request has been sent.");
    } catch (error) {
      Alert.alert(
        "Couldn't send request",
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#08080d", "#0c0b14", "#050507"]}
        style={StyleSheet.absoluteFill}
      />

      <AnimatedDoodles />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={21} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text style={styles.eyebrow}>JOIN A JOURNEY</Text>
            <Text style={styles.title}>Join Trip</Text>
          </View>
        </View>

        <LinearGradient colors={["#201b3b", "#12111c"]} style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons name="people-outline" size={28} color="#aaa2ff" />
          </View>
          <Text style={styles.heroTitle}>Have a trip code?</Text>
          <Text style={styles.heroText}>
            Enter the code shared by the trip organizer. Your request will be reviewed by them.
          </Text>

          <Text style={styles.label}>TRIP CODE</Text>
          <TextInput
            value={tripCode}
            onChangeText={(value) => setTripCode(value.toUpperCase())}
            placeholder="PKU-ABC123"
            placeholderTextColor="#555361"
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={30}
            style={styles.input}
          />

          <TouchableOpacity
            activeOpacity={0.85}
            disabled={sending}
            onPress={handleSubmit}
            style={styles.primaryButton}
          >
            <LinearGradient colors={["#9188ff", "#7168df"]} style={styles.primaryGradient}>
              {sending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Feather name="send" size={17} color="#fff" />
                  <Text style={styles.primaryText}>Send Join Request</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your requests</Text>
          <TouchableOpacity onPress={() => router.push("/(app)/(screens)/my-requests")}>
            <Text style={styles.linkText}>View all</Text>
          </TouchableOpacity>
        </View>

        {loadingRequests ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator color="#9188ff" />
          </View>
        ) : requests.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="time-outline" size={25} color="#777482" />
            <Text style={styles.emptyTitle}>No requests yet</Text>
            <Text style={styles.emptyText}>Your sent join requests will appear here.</Text>
          </View>
        ) : (
          requests.slice(0, 3).map((request) => (
            <RequestCard key={request._id} request={request} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

function RequestCard({ request }: { request: JoinRequest }) {
  const colors = {
    Pending: "#f2c94c",
    Accepted: "#54d68c",
    Rejected: "#ff6b6b",
  };

  return (
    <View style={styles.requestCard}>
      <View style={styles.requestIcon}>
        <Ionicons name="airplane-outline" size={20} color="#aaa2ff" />
      </View>
      <View style={styles.requestInfo}>
        <Text style={styles.requestTitle} numberOfLines={1}>
          {request.trip?.title || "Trip"}
        </Text>
        <Text style={styles.requestRoute} numberOfLines={1}>
          {request.trip?.source || ""} → {request.trip?.destination || ""}
        </Text>
      </View>
      <View style={[styles.statusBadge, { borderColor: `${colors[request.status]}55` }]}>
        <View style={[styles.statusDot, { backgroundColor: colors[request.status] }]} />
        <Text style={[styles.statusText, { color: colors[request.status] }]}>{request.status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050507" },
  content: { paddingHorizontal: 20, paddingTop: 58, paddingBottom: 45 },
  header: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 28 },
  backButton: { width: 42, height: 42, borderRadius: 14, borderWidth: 1, borderColor: "#292735", backgroundColor: "#111017", alignItems: "center", justifyContent: "center" },
  eyebrow: { fontFamily: "DMSans_600SemiBold", fontSize: 10, letterSpacing: 2, color: "#777482" },
  title: { fontFamily: "DMSans_700Bold", fontSize: 30, color: "#fff", marginTop: 4 },
  heroCard: { borderRadius: 26, borderWidth: 1, borderColor: "#2b273c", padding: 22, marginBottom: 30 },
  heroIcon: { width: 54, height: 54, borderRadius: 17, backgroundColor: "#2a244b", alignItems: "center", justifyContent: "center", marginBottom: 17 },
  heroTitle: { fontFamily: "DMSans_700Bold", fontSize: 22, color: "#fff" },
  heroText: { fontFamily: "DMSans_400Regular", fontSize: 12, lineHeight: 19, color: "#898694", marginTop: 8, marginBottom: 22 },
  label: { fontFamily: "DMSans_600SemiBold", fontSize: 10, letterSpacing: 1.5, color: "#777482", marginBottom: 8 },
  input: { height: 54, borderRadius: 16, borderWidth: 1, borderColor: "#302d3d", backgroundColor: "#0b0a10", paddingHorizontal: 17, color: "#fff", fontFamily: "DMSans_600SemiBold", fontSize: 15, letterSpacing: 2 },
  primaryButton: { marginTop: 14, borderRadius: 16, overflow: "hidden" },
  primaryGradient: { minHeight: 54, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 9 },
  primaryText: { fontFamily: "DMSans_600SemiBold", color: "#fff", fontSize: 13 },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  sectionTitle: { fontFamily: "DMSans_700Bold", fontSize: 18, color: "#fff" },
  linkText: { fontFamily: "DMSans_600SemiBold", fontSize: 12, color: "#aaa2ff" },
  loadingCard: { height: 100, borderRadius: 20, backgroundColor: "#101016", borderWidth: 1, borderColor: "#272532", alignItems: "center", justifyContent: "center" },
  emptyCard: { borderRadius: 20, borderWidth: 1, borderColor: "#272532", backgroundColor: "#101016", padding: 24, alignItems: "center" },
  emptyTitle: { fontFamily: "DMSans_600SemiBold", fontSize: 14, color: "#fff", marginTop: 10 },
  emptyText: { fontFamily: "DMSans_400Regular", fontSize: 11, color: "#777482", textAlign: "center", marginTop: 5 },
  requestCard: { minHeight: 76, borderRadius: 19, borderWidth: 1, borderColor: "#272532", backgroundColor: "#101016", padding: 12, flexDirection: "row", alignItems: "center", marginBottom: 10 },
  requestIcon: { width: 45, height: 45, borderRadius: 14, backgroundColor: "#1b1830", alignItems: "center", justifyContent: "center" },
  requestInfo: { flex: 1, marginHorizontal: 12 },
  requestTitle: { fontFamily: "DMSans_600SemiBold", fontSize: 13, color: "#fff" },
  requestRoute: { fontFamily: "DMSans_400Regular", fontSize: 10, color: "#777482", marginTop: 4 },
  statusBadge: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 8, paddingVertical: 6, borderRadius: 10, borderWidth: 1 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontFamily: "DMSans_600SemiBold", fontSize: 9 },
});
