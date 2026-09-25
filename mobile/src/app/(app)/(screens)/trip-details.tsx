import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import * as Clipboard from "expo-clipboard";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { apiRequest } from "../../../api/api";
import {
  getTripById,
  Trip,
} from "../../../services/authService";

export default function TripDetails() {
  const { token, user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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
      setTrip(response.trip);
    } catch (error) {
      Alert.alert(
        "Couldn't load trip",
        error instanceof Error
          ? error.message
          : "Something went wrong.",
        [
          {
            text: "Go back",
            onPress: () => router.back(),
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  }

  function formatDate(date: string) {
    if (!date) return "Not set";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function isOwner() {
    if (!trip?.createdBy || !user) {
      return false;
    }

    return (
      trip.createdBy._id === user.id ||
      trip.createdBy._id === (user as any)._id
    );
  }

  async function handleCopyCode() {
    if (!trip?.tripCode) {
      return;
    }

    try {
      await Clipboard.setStringAsync(trip.tripCode);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      Alert.alert(
        "Couldn't copy",
        "Unable to copy the trip code."
      );
    }
  }

  async function handleShareCode() {
    if (!trip?.tripCode) {
      return;
    }

    try {
      await Share.share({
        title: `Join ${trip.title}`,
        message:
          `Join my PackUP trip "${trip.title}"!\n\n` +
          `Trip code: ${trip.tripCode}\n\n` +
          `Open PackUP and use this code to request to join the trip.`,
      });
    } catch (error) {
      console.log("Share failed:", error);
    }
  }

  const owner = isOwner();

  function openEditTrip() {
    if (!trip) return;
    router.push({
      pathname: "/(app)/(screens)/edit-trip",
      params: { id: trip._id },
    });
  }

  async function handleLeaveTrip() {
    if (!token || !trip) return;

    Alert.alert(
      "Leave trip?",
      `You will leave "${trip.title}" and lose access to its chat.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: async () => {
            try {
              setActionLoading("leave");
              await apiRequest(`/api/trips/${trip._id}/leave`, {
                method: "PUT",
                token,
              });
              Alert.alert("Trip left", "You have left the trip successfully.", [
                { text: "OK", onPress: () => router.back() },
              ]);
            } catch (error) {
              Alert.alert(
                "Couldn't leave trip",
                error instanceof Error ? error.message : "Something went wrong."
              );
            } finally {
              setActionLoading(null);
            }
          },
        },
      ]
    );
  }

  async function handleRemoveParticipant(
    participantId: string,
    participantName: string
  ) {
    if (!token || !trip || !owner) return;

    Alert.alert(
      "Remove member?",
      `Remove ${participantName} from "${trip.title}"? They will lose access to the trip and its chat.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              setActionLoading(`remove-${participantId}`);
              await apiRequest(
                `/api/trips/${trip._id}/members/${participantId}`,
                { method: "DELETE", token }
              );
              setTrip((current) => {
                if (!current) return current;
                return {
                  ...current,
                  participants: (current.participants || []).filter(
                    (participant) => participant._id !== participantId
                  ),
                  currentMembers: Math.max(1, current.currentMembers - 1),
                  status: current.status === "Full" ? "Open" : current.status,
                };
              });
              Alert.alert(
                "Member removed",
                `${participantName} has been removed from the trip.`
              );
            } catch (error) {
              Alert.alert(
                "Couldn't remove member",
                error instanceof Error ? error.message : "Something went wrong."
              );
            } finally {
              setActionLoading(null);
            }
          },
        },
      ]
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator
          size="large"
          color="#9188ff"
        />

        <Text style={styles.loadingText}>
          Loading trip...
        </Text>
      </View>
    );
  }

  if (!trip) {
    return null;
  }

  const hasCoverImage =
    !!trip.coverImage &&
    trip.coverImage.trim().length > 0;

  const participants = trip.participants || [];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#08080d", "#0c0b14", "#050507"]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.topBar}>
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

          <Text style={styles.topTitle}>
            Trip Details
          </Text>

          <View style={styles.topSpacer} />
        </View>

        <View style={styles.hero}>
          {hasCoverImage ? (
            <ImageBackground
              source={{ uri: trip.coverImage }}
              style={styles.heroImage}
              imageStyle={styles.heroImageStyle}
            >
              <LinearGradient
                colors={[
                  "rgba(8,7,15,0.18)",
                  "rgba(8,7,15,0.55)",
                  "rgba(8,7,15,0.97)",
                ]}
                style={styles.heroOverlay}
              >
                <HeroContent trip={trip} />
              </LinearGradient>
            </ImageBackground>
          ) : (
            <LinearGradient
              colors={["#211c3d", "#151229", "#0e0d15"]}
              style={styles.heroGradient}
            >
              <HeroContent trip={trip} />
            </LinearGradient>
          )}
        </View>

        <Text style={styles.sectionTitle}>
          Trip information
        </Text>

        <View style={styles.infoGrid}>
          <InfoCard
            icon="calendar-outline"
            title="Start date"
            value={formatDate(trip.startDate)}
          />

          <InfoCard
            icon="calendar-outline"
            title="End date"
            value={formatDate(trip.endDate)}
          />

          <InfoCard
            icon="cash-outline"
            title="Budget"
            value={`₹${trip.budget}`}
          />

          <InfoCard
            icon="people-outline"
            title="Members"
            value={`${trip.currentMembers}/${trip.maxMembers}`}
          />
        </View>

        <TouchableOpacity
          style={styles.expensesButton}
          activeOpacity={0.85}
          onPress={() =>
            router.push({
              pathname: "/(app)/(screens)/expenses",
              params: { tripId: trip._id },
            })
          }
        >
          <View style={styles.expensesButtonIcon}>
            <Ionicons name="wallet-outline" size={22} color="#aaa2ff" />
          </View>

          <View style={styles.expensesButtonInfo}>
            <Text style={styles.expensesButtonTitle}>Trip Expenses</Text>
            <Text style={styles.expensesButtonSubtitle}>
              Track spending and split expenses
            </Text>
          </View>

          <Feather name="chevron-right" size={19} color="#666372" />
        </TouchableOpacity>

        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>
            About this trip
          </Text>

          <Text style={styles.description}>
            {trip.description || "No description added."}
          </Text>

          <View style={styles.typeRow}>
            <View style={styles.typeIcon}>
              <MaterialCommunityIcons
                name="bag-suitcase-outline"
                size={19}
                color="#aaa2ff"
              />
            </View>

            <View>
              <Text style={styles.metaLabel}>
                Trip type
              </Text>

              <Text style={styles.metaValue}>
                {trip.tripType}
              </Text>
            </View>
          </View>
        </View>

        {trip.tripCode && (
          <View style={styles.codeCard}>
            <View style={styles.codeTop}>
              <View style={styles.codeIcon}>
                <Feather
                  name="hash"
                  size={21}
                  color="#8de7ff"
                />
              </View>

              <View style={styles.codeInfo}>
                <Text style={styles.codeLabel}>
                  {owner
                    ? "YOUR TRIP CODE"
                    : "TRIP CODE"}
                </Text>

                <Text style={styles.code}>
                  {trip.tripCode}
                </Text>

                <Text style={styles.codeHint}>
                  {owner
                    ? "Share this code with people you want to invite."
                    : "Use this code to identify the trip."}
                </Text>
              </View>
            </View>

            <View style={styles.codeActions}>
              <TouchableOpacity
                style={styles.copyButton}
                activeOpacity={0.8}
                onPress={handleCopyCode}
              >
                <Feather
                  name={copied ? "check" : "copy"}
                  size={16}
                  color="#aaa2ff"
                />

                <Text style={styles.copyButtonText}>
                  {copied ? "Copied!" : "Copy Code"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareButton}
                activeOpacity={0.8}
                onPress={handleShareCode}
              >
                <Feather
                  name="share-2"
                  size={16}
                  color="#ffffff"
                />

                <Text style={styles.shareButtonText}>
                  Share Code
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <Text style={styles.sectionTitle}>
          Organizer
        </Text>

        <View style={styles.organizerCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {trip.createdBy?.name
                ?.charAt(0)
                .toUpperCase() || "?"}
            </Text>
          </View>

          <View style={styles.organizerInfo}>
            <Text style={styles.organizerName}>
              {trip.createdBy?.name || "Unknown"}
            </Text>

            <Text style={styles.organizerUsername}>
              @{trip.createdBy?.username || "user"}
            </Text>
          </View>

          <Ionicons
            name="shield-checkmark-outline"
            size={22}
            color="#9188ff"
          />
        </View>

        <Text style={styles.sectionTitle}>
          Participants
        </Text>

        <View style={styles.participantsCard}>
          {participants.length > 0 ? (
            participants.map((participant) => (
              <View
                key={participant._id}
                style={styles.participant}
              >
                <View style={styles.smallAvatar}>
                  <Text style={styles.smallAvatarText}>
                    {participant.name
                      ?.charAt(0)
                      .toUpperCase() || "?"}
                  </Text>
                </View>

                <View style={styles.participantInfo}>
                  <Text style={styles.participantName}>
                    {participant.name}
                  </Text>

                  <Text style={styles.participantUsername}>
                    @{participant.username}
                  </Text>
                </View>

                {participant._id ===
                  trip.createdBy?._id ? (
                  <View style={styles.organizerBadge}>
                    <Text style={styles.organizerBadgeText}>
                      Organizer
                    </Text>
                  </View>
                ) : owner ? (
                  <TouchableOpacity
                    style={styles.removeButton}
                    activeOpacity={0.8}
                    disabled={actionLoading === `remove-${participant._id}`}
                    onPress={() =>
                      handleRemoveParticipant(
                        participant._id,
                        participant.name || "this member"
                      )
                    }
                  >
                    {actionLoading === `remove-${participant._id}` ? (
                      <ActivityIndicator size="small" color="#ff8f9b" />
                    ) : (
                      <Feather name="user-x" size={15} color="#ff8f9b" />
                    )}
                  </TouchableOpacity>
                ) : null}
              </View>
            ))
          ) : trip.currentMembers > 1 ? (
            <View style={styles.participantFallback}>
              <View style={styles.fallbackIcon}>
                <Ionicons
                  name="people-outline"
                  size={22}
                  color="#aaa2ff"
                />
              </View>

              <View style={styles.fallbackInfo}>
                <Text style={styles.fallbackTitle}>
                  {trip.currentMembers - 1} other{" "}
                  {trip.currentMembers - 1 === 1
                    ? "member"
                    : "members"}
                </Text>

                <Text style={styles.fallbackText}>
                  Member details are loading from the server.
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.noParticipants}>
              You are the only member of this trip.
            </Text>
          )}
        </View>

        {!owner && (
          <View style={styles.actionsCard}>
            <Text style={styles.actionsTitle}>Trip actions</Text>
            <Text style={styles.actionsHint}>
              Leaving this trip removes you from the member list and its chat.
            </Text>
            <TouchableOpacity
              style={styles.leaveButton}
              activeOpacity={0.8}
              disabled={actionLoading === "leave"}
              onPress={handleLeaveTrip}
            >
              {actionLoading === "leave" ? (
                <ActivityIndicator size="small" color="#ff8f9b" />
              ) : (
                <Feather name="log-out" size={17} color="#ff8f9b" />
              )}
              <Text style={styles.leaveButtonText}>Leave Trip</Text>
            </TouchableOpacity>
          </View>
        )}

        {owner && (
          <View style={styles.actionsCard}>
            <Text style={styles.actionsTitle}>Organizer controls</Text>
            <Text style={styles.actionsHint}>
              Manage your trip details and participants from here.
            </Text>

            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.8}
              onPress={openEditTrip}
            >
              <View style={styles.actionButtonIcon}>
                <Feather name="edit-3" size={17} color="#aaa2ff" />
              </View>

              <View style={styles.actionButtonInfo}>
                <Text style={styles.actionButtonTitle}>Edit Trip</Text>
                <Text style={styles.actionButtonText}>
                  Update trip information and cover image
                </Text>
              </View>

              <Feather name="chevron-right" size={18} color="#666372" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

function HeroContent({
  trip,
}: {
  trip: Trip;
}) {
  return (
    <>
      <View style={styles.heroIcon}>
        <Ionicons
          name="airplane-outline"
          size={34}
          color="#aaa2ff"
        />
      </View>

      <View style={styles.statusBadge}>
        <View style={styles.statusDot} />

        <Text style={styles.statusText}>
          {trip.status}
        </Text>
      </View>

      <Text style={styles.title}>
        {trip.title}
      </Text>

      <View style={styles.route}>
        <View style={styles.routePoint}>
          <View style={styles.locationDot} />

          <Text
            style={styles.locationText}
            numberOfLines={1}
          >
            {trip.source}
          </Text>
        </View>

        <View style={styles.routeLine} />

        <View style={styles.routePoint}>
          <View style={styles.destinationDot} />

          <Text
            style={styles.locationText}
            numberOfLines={1}
          >
            {trip.destination}
          </Text>
        </View>
      </View>
    </>
  );
}

function InfoCard({
  icon,
  title,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
}) {
  return (
    <View style={styles.infoCard}>
      <View style={styles.infoIcon}>
        <Ionicons
          name={icon}
          size={19}
          color="#aaa2ff"
        />
      </View>

      <Text style={styles.infoLabel}>
        {title}
      </Text>

      <Text
        style={styles.infoValue}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050507",
  },

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
  actionButton: {
  flexDirection: "row",
  alignItems: "center",
  padding: 15,
  borderRadius: 18,
  backgroundColor: "#101016",
  borderWidth: 1,
  borderColor: "#24232d",
  marginBottom: 12,
},

actionButtonIcon: {
  width: 42,
  height: 42,
  borderRadius: 14,
  backgroundColor: "#181624",
  alignItems: "center",
  justifyContent: "center",
},

actionButtonInfo: {
  flex: 1,
  marginLeft: 12,
},

actionButtonTitle: {
  fontFamily: "DMSans_600SemiBold",
  fontSize: 14,
  color: "#ffffff",
},

actionButtonText: {
  fontFamily: "DMSans_400Regular",
  fontSize: 10,
  color: "#666372",
  marginTop: 3,
},

  topTitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 16,
    color: "#ffffff",
  },

  topSpacer: {
    width: 44,
  },

  hero: {
    borderRadius: 26,
    overflow: "hidden",
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "#2a2541",
  },

  heroGradient: {
    minHeight: 330,
    padding: 23,
  },

  heroImage: {
    minHeight: 330,
  },

  heroImageStyle: {
    borderRadius: 26,
  },

  heroOverlay: {
    flex: 1,
    minHeight: 330,
    padding: 23,
    justifyContent: "flex-end",
  },

  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: 19,
    backgroundColor: "#302951",
    alignItems: "center",
    justifyContent: "center",
  },

  statusBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#151b18",
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#72d59b",
  },

  statusText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 10,
    color: "#8bd8aa",
  },

  title: {
    fontFamily: "DMSans_700Bold",
    fontSize: 28,
    lineHeight: 34,
    color: "#ffffff",
    marginTop: 17,
  },

  route: {
    marginTop: 20,
  },

  routePoint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  locationDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#aaa2ff",
  },

  destinationDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#8de7ff",
  },

  locationText: {
    flex: 1,
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
    color: "#d4d1dc",
  },

  routeLine: {
    width: 1,
    height: 15,
    backgroundColor: "#4b4659",
    marginLeft: 4,
    marginVertical: 2,
  },

  sectionTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 19,
    color: "#ffffff",
    marginBottom: 14,
  },

  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 11,
    marginBottom: 28,
  },

  infoCard: {
    width: "48%",
    minHeight: 105,
    padding: 14,
    borderRadius: 19,
    backgroundColor: "#101016",
    borderWidth: 1,
    borderColor: "#24232d",
  },

  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: "#181624",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  infoLabel: {
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    color: "#666372",
  },

  infoValue: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: "#ffffff",
    marginTop: 3,
  },

  expensesButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#101016",
    borderWidth: 1,
    borderColor: "#24232d",
    borderRadius: 19,
    padding: 14,
    marginBottom: 28,
  },

  expensesButtonIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#181624",
    alignItems: "center",
    justifyContent: "center",
  },

  expensesButtonInfo: {
    flex: 1,
    marginLeft: 12,
  },

  expensesButtonTitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: "#ffffff",
  },

  expensesButtonSubtitle: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: "#777482",
    marginTop: 4,
  },

  detailCard: {
    padding: 19,
    borderRadius: 22,
    backgroundColor: "#101016",
    borderWidth: 1,
    borderColor: "#24232d",
    marginBottom: 16,
  },

  detailTitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 16,
    color: "#ffffff",
  },

  description: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    lineHeight: 19,
    color: "#85818f",
    marginTop: 9,
  },

  typeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 19,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#24232d",
  },

  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#181624",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  metaLabel: {
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    color: "#666372",
  },

  metaValue: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: "#ffffff",
    marginTop: 2,
  },

  codeCard: {
    padding: 17,
    borderRadius: 20,
    backgroundColor: "#11161a",
    borderWidth: 1,
    borderColor: "#26323a",
    marginBottom: 28,
  },

  codeTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  codeIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#172027",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  codeInfo: {
    flex: 1,
  },

  codeLabel: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 9,
    letterSpacing: 1.5,
    color: "#68727a",
  },

  code: {
    fontFamily: "DMSans_700Bold",
    fontSize: 18,
    letterSpacing: 2,
    color: "#8de7ff",
    marginTop: 2,
  },

  codeHint: {
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    color: "#68727a",
    marginTop: 3,
  },

  codeActions: {
    flexDirection: "row",
    gap: 9,
    marginTop: 16,
  },

  copyButton: {
    flex: 1,
    height: 44,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#302d3d",
    backgroundColor: "#181624",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  copyButtonText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
    color: "#aaa2ff",
  },

  shareButton: {
    flex: 1,
    height: 44,
    borderRadius: 13,
    backgroundColor: "#7168df",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  shareButtonText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
    color: "#ffffff",
  },

  organizerCard: {
    minHeight: 72,
    padding: 13,
    borderRadius: 19,
    backgroundColor: "#101016",
    borderWidth: 1,
    borderColor: "#24232d",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#302951",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontFamily: "DMSans_700Bold",
    fontSize: 17,
    color: "#aaa2ff",
  },

  organizerInfo: {
    flex: 1,
    marginLeft: 12,
  },

  organizerName: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: "#ffffff",
  },

  organizerUsername: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: "#777482",
    marginTop: 3,
  },

  participantsCard: {
    borderRadius: 21,
    backgroundColor: "#101016",
    borderWidth: 1,
    borderColor: "#24232d",
    padding: 13,
  },

  participant: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 58,
  },

  smallAvatar: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#181624",
    alignItems: "center",
    justifyContent: "center",
  },

  smallAvatarText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: "#aaa2ff",
  },

  participantInfo: {
    flex: 1,
    marginLeft: 11,
  },

  participantName: {
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
    color: "#ffffff",
  },

  participantUsername: {
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    color: "#666372",
    marginTop: 2,
  },

  organizerBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 9,
    backgroundColor: "#19172a",
  },

  organizerBadgeText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 9,
    color: "#aaa2ff",
  },

  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: "#25171c",
    borderWidth: 1,
    borderColor: "#3a2229",
    alignItems: "center",
    justifyContent: "center",
  },

  actionsCard: {
    marginTop: 20,
    padding: 18,
    borderRadius: 21,
    backgroundColor: "#101016",
    borderWidth: 1,
    borderColor: "#24232d",
  },

  actionsTitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 15,
    color: "#ffffff",
  },

  actionsHint: {
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    lineHeight: 16,
    color: "#666372",
    marginTop: 6,
  },

  leaveButton: {
    height: 45,
    borderRadius: 13,
    backgroundColor: "#25171c",
    borderWidth: 1,
    borderColor: "#3a2229",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 14,
  },

  leaveButtonText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
    color: "#ff8f9b",
  },

  participantFallback: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
  },

  fallbackIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#181624",
    alignItems: "center",
    justifyContent: "center",
  },

  fallbackInfo: {
    flex: 1,
    marginLeft: 11,
  },

  fallbackTitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: "#ffffff",
  },

  fallbackText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    color: "#666372",
    marginTop: 3,
  },

  noParticipants: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: "#666372",
    paddingVertical: 12,
  },

  bottomSpace: {
    height: 20,
  },
});