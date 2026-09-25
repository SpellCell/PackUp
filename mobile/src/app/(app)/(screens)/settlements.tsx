import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCallback, useState } from "react";

import AnimatedDoodles from "../../../components/AnimatedDoodles";
import { useAuth } from "../../../context/AuthContext";
import {
  getTripSettlements,
  markSettlementPaid,
  Settlement,
} from "../../../services/expenseService";

function formatAmount(amount: number) {
  return `₹${Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(date?: string | null) {
  if (!date) {
    return "";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Settlements() {
  const { token, user } = useAuth();
  const { tripId } = useLocalSearchParams<{
    tripId: string;
  }>();

  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);

  const loadSettlements = useCallback(
    async (showLoader = true) => {
      if (!token || !tripId) {
        setLoading(false);
        return;
      }

      if (showLoader) {
        setLoading(true);
      }

      try {
        const response = await getTripSettlements(
          token,
          tripId
        );

        setSettlements(
          response.settlements || []
        );
      } catch (error) {
        console.log(
          "Failed to load settlements:",
          error
        );

        if (showLoader) {
          Alert.alert(
            "Couldn't load settlements",
            error instanceof Error
              ? error.message
              : "Something went wrong."
          );
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [token, tripId]
  );

  useFocusEffect(
    useCallback(() => {
      loadSettlements(false);
    }, [loadSettlements])
  );

  async function handleRefresh() {
    setRefreshing(true);
    await loadSettlements(false);
  }

  function isCurrentUser(id?: string) {
    if (!id || !user) {
      return false;
    }

    return (
      id === user.id ||
      id === (user as any)._id
    );
  }

  async function handleMarkPaid(
    settlement: Settlement
  ) {
    if (!token || !tripId) {
      return;
    }

    if (!isCurrentUser(settlement.from?._id)) {
      Alert.alert(
        "Not available",
        "Only the person who owes the money can mark this settlement as paid."
      );
      return;
    }

    if (settlement.status === "Paid") {
      return;
    }

    Alert.alert(
      "Mark as paid?",
      `Mark ${formatAmount(
        settlement.amount
      )} owed to ${
        settlement.to?.name ||
        settlement.to?.username ||
        "this member"
      } as paid?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Mark as Paid",
          onPress: async () => {
            try {
              setPayingId(settlement._id);

              await markSettlementPaid(
                token,
                tripId,
                settlement._id
              );

              setSettlements((current) =>
                current.map((item) =>
                  item._id === settlement._id
                    ? {
                        ...item,
                        status: "Paid",
                        paidAt:
                          new Date().toISOString(),
                      }
                    : item
                )
              );
            } catch (error) {
              Alert.alert(
                "Couldn't update settlement",
                error instanceof Error
                  ? error.message
                  : "Something went wrong."
              );
            } finally {
              setPayingId(null);
            }
          },
        },
      ]
    );
  }

  const pendingSettlements = settlements.filter(
    (settlement) =>
      settlement.status === "Pending"
  );

  const paidSettlements = settlements.filter(
    (settlement) =>
      settlement.status === "Paid"
  );

  const pendingAmount = pendingSettlements.reduce(
    (total, settlement) =>
      total + Number(settlement.amount || 0),
    0
  );

  const youOwe = pendingSettlements
    .filter((settlement) =>
      isCurrentUser(settlement.from?._id)
    )
    .reduce(
      (total, settlement) =>
        total + Number(settlement.amount || 0),
      0
    );

  const owedToYou = pendingSettlements
    .filter((settlement) =>
      isCurrentUser(settlement.to?._id)
    )
    .reduce(
      (total, settlement) =>
        total + Number(settlement.amount || 0),
      0
    );

  function renderSettlement(
    settlement: Settlement
  ) {
    const isOwedByYou = isCurrentUser(
      settlement.from?._id
    );

    const isPaid = settlement.status === "Paid";
    const isPaying = payingId === settlement._id;

    const fromName = isCurrentUser(
      settlement.from?._id
    )
      ? "You"
      : settlement.from?.name ||
        settlement.from?.username ||
        "Member";

    const toName = isCurrentUser(
      settlement.to?._id
    )
      ? "You"
      : settlement.to?.name ||
        settlement.to?.username ||
        "Member";

    return (
      <View
        key={settlement._id}
        style={[
          styles.settlementCard,
          isPaid && styles.paidCard,
        ]}
      >
        <View style={styles.peopleRow}>
          <View style={styles.person}>
            <View
              style={[
                styles.avatar,
                isOwedByYou &&
                  styles.youAvatar,
              ]}
            >
              <Text style={styles.avatarText}>
                {fromName
                  .charAt(0)
                  .toUpperCase()}
              </Text>
            </View>

            <View style={styles.personInfo}>
              <Text style={styles.personLabel}>
                FROM
              </Text>

              <Text
                style={styles.personName}
                numberOfLines={1}
              >
                {fromName}
              </Text>
            </View>
          </View>

          <View style={styles.arrowBox}>
            <Feather
              name="arrow-right"
              size={17}
              color={
                isPaid
                  ? "#54d68c"
                  : "#aaa2ff"
              }
            />
          </View>

          <View
            style={[
              styles.person,
              styles.toPerson,
            ]}
          >
            <View
              style={[
                styles.avatar,
                isCurrentUser(
                  settlement.to?._id
                ) && styles.youAvatar,
              ]}
            >
              <Text style={styles.avatarText}>
                {toName
                  .charAt(0)
                  .toUpperCase()}
              </Text>
            </View>

            <View style={styles.personInfo}>
              <Text style={styles.personLabel}>
                TO
              </Text>

              <Text
                style={styles.personName}
                numberOfLines={1}
              >
                {toName}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.amountRow}>
          <View>
            <Text style={styles.amountLabel}>
              AMOUNT
            </Text>

            <Text
              style={[
                styles.amount,
                isPaid && styles.paidAmount,
              ]}
            >
              {formatAmount(
                settlement.amount
              )}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              isPaid
                ? styles.paidBadge
                : styles.pendingBadge,
            ]}
          >
            <Ionicons
              name={
                isPaid
                  ? "checkmark-circle"
                  : "time-outline"
              }
              size={13}
              color={
                isPaid
                  ? "#54d68c"
                  : "#aaa2ff"
              }
            />

            <Text
              style={[
                styles.statusText,
                isPaid
                  ? styles.paidStatusText
                  : styles.pendingStatusText,
              ]}
            >
              {isPaid ? "Paid" : "Pending"}
            </Text>
          </View>
        </View>

        {isPaid ? (
          <Text style={styles.paidDate}>
            Paid
            {settlement.paidAt
              ? ` on ${formatDate(
                  settlement.paidAt
                )}`
              : ""}
          </Text>
        ) : isOwedByYou ? (
          <TouchableOpacity
            style={styles.payButton}
            activeOpacity={0.85}
            disabled={isPaying}
            onPress={() =>
              handleMarkPaid(settlement)
            }
          >
            {isPaying ? (
              <ActivityIndicator
                size="small"
                color="#ffffff"
              />
            ) : (
              <>
                <Ionicons
                  name="checkmark"
                  size={17}
                  color="#ffffff"
                />

                <Text style={styles.payButtonText}>
                  Mark as Paid
                </Text>
              </>
            )}
          </TouchableOpacity>
        ) : (
          <Text style={styles.waitingText}>
            Waiting for the payer to mark this
            settlement as paid.
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          "#08080d",
          "#0c0b14",
          "#050507",
        ]}
        style={StyleSheet.absoluteFill}
      />

      <AnimatedDoodles />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#aaa2ff"
            colors={["#aaa2ff"]}
          />
        }
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={() => router.back()}
          >
            <Feather
              name="arrow-left"
              size={21}
              color="#ffffff"
            />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>
              TRIP MONEY
            </Text>

            <Text style={styles.title}>
              Settlements
            </Text>

            <Text style={styles.subtitle}>
              See who owes whom
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="swap-horizontal-outline"
              size={21}
              color="#aaa2ff"
            />
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator
              size="large"
              color="#aaa2ff"
            />

            <Text style={styles.loadingText}>
              Calculating settlements...
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.summaryCard}>
              <LinearGradient
                colors={[
                  "#19162b",
                  "#100f18",
                ]}
                style={styles.summaryGradient}
              >
                <Text style={styles.summaryLabel}>
                  PENDING SETTLEMENTS
                </Text>

                <Text style={styles.totalAmount}>
                  {formatAmount(pendingAmount)}
                </Text>

                <Text style={styles.summaryDescription}>
                  {pendingSettlements.length === 0
                    ? "Everything is settled."
                    : `${pendingSettlements.length} payment${
                        pendingSettlements.length ===
                        1
                          ? ""
                          : "s"
                      } still pending`}
                </Text>

                <View style={styles.summaryDivider} />

                <View style={styles.summaryStats}>
                  <View style={styles.stat}>
                    <Text style={styles.statValue}>
                      {formatAmount(youOwe)}
                    </Text>

                    <Text style={styles.statLabel}>
                      You owe
                    </Text>
                  </View>

                  <View style={styles.statDivider} />

                  <View style={styles.stat}>
                    <Text style={styles.statValue}>
                      {formatAmount(owedToYou)}
                    </Text>

                    <Text style={styles.statLabel}>
                      Owed to you
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </View>

            {settlements.length === 0 ? (
              <View style={styles.emptyCard}>
                <View style={styles.emptyIcon}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={30}
                    color="#54d68c"
                  />
                </View>

                <Text style={styles.emptyTitle}>
                  All settled
                </Text>

                <Text style={styles.emptyText}>
                  There are no settlement payments
                  to show for this trip yet.
                </Text>
              </View>
            ) : (
              <>
                {pendingSettlements.length > 0 && (
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <View>
                        <Text style={styles.sectionTitle}>
                          Pending
                        </Text>

                        <Text
                          style={
                            styles.sectionSubtitle
                          }
                        >
                          Payments that still need to
                          be completed
                        </Text>
                      </View>

                      <View
                        style={styles.countBadge}
                      >
                        <Text
                          style={styles.countText}
                        >
                          {pendingSettlements.length}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.list}>
                      {pendingSettlements.map(
                        renderSettlement
                      )}
                    </View>
                  </View>
                )}

                {paidSettlements.length > 0 && (
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <View>
                        <Text style={styles.sectionTitle}>
                          Paid
                        </Text>

                        <Text
                          style={
                            styles.sectionSubtitle
                          }
                        >
                          Completed settlement payments
                        </Text>
                      </View>

                      <View
                        style={styles.paidCountBadge}
                      >
                        <Text
                          style={styles.paidCountText}
                        >
                          {paidSettlements.length}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.list}>
                      {paidSettlements.map(
                        renderSettlement
                      )}
                    </View>
                  </View>
                )}
              </>
            )}
          </>
        )}

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
    paddingTop: 58,
    paddingHorizontal: 18,
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#101016",
    borderWidth: 1,
    borderColor: "#24232d",
    alignItems: "center",
    justifyContent: "center",
  },

  headerText: {
    flex: 1,
    marginLeft: 13,
  },

  eyebrow: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 9,
    letterSpacing: 2,
    color: "#777482",
    marginBottom: 3,
  },

  title: {
    fontFamily: "DMSans_700Bold",
    fontSize: 27,
    color: "#ffffff",
  },

  subtitle: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: "#777482",
    marginTop: 2,
  },

  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#12101c",
    borderWidth: 1,
    borderColor: "#2a263b",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingCard: {
    minHeight: 260,
    borderRadius: 22,
    backgroundColor: "#101016",
    borderWidth: 1,
    borderColor: "#24232d",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
    color: "#777482",
    marginTop: 12,
  },

  summaryCard: {
    borderRadius: 23,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#28243a",
    marginBottom: 27,
  },

  summaryGradient: {
    padding: 19,
  },

  summaryLabel: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 9,
    letterSpacing: 1.8,
    color: "#777482",
    marginBottom: 6,
  },

  totalAmount: {
    fontFamily: "DMSans_700Bold",
    fontSize: 30,
    color: "#ffffff",
  },

  summaryDescription: {
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    color: "#777482",
    marginTop: 4,
  },

  summaryDivider: {
    height: 1,
    backgroundColor: "#28253a",
    marginVertical: 17,
  },

  summaryStats: {
    flexDirection: "row",
    alignItems: "center",
  },

  stat: {
    flex: 1,
  },

  statValue: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: "#ffffff",
  },

  statLabel: {
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    color: "#777482",
    marginTop: 3,
  },

  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#28253a",
    marginHorizontal: 15,
  },

  section: {
    marginBottom: 27,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 13,
  },

  sectionTitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 16,
    color: "#ffffff",
  },

  sectionSubtitle: {
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    color: "#666372",
    marginTop: 3,
  },

  countBadge: {
    minWidth: 30,
    height: 30,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: "#171526",
    borderWidth: 1,
    borderColor: "#29263b",
    alignItems: "center",
    justifyContent: "center",
  },

  countText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
    color: "#aaa2ff",
  },

  paidCountBadge: {
    minWidth: 30,
    height: 30,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: "#102219",
    borderWidth: 1,
    borderColor: "#1d3d2a",
    alignItems: "center",
    justifyContent: "center",
  },

  paidCountText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
    color: "#54d68c",
  },

  list: {
    gap: 11,
  },

  settlementCard: {
    backgroundColor: "#101016",
    borderWidth: 1,
    borderColor: "#24232d",
    borderRadius: 20,
    padding: 15,
  },

  paidCard: {
    borderColor: "#1d3428",
    backgroundColor: "#0d1511",
  },

  peopleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  person: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 0,
  },

  toPerson: {
    justifyContent: "flex-end",
  },

  avatar: {
    width: 37,
    height: 37,
    borderRadius: 13,
    backgroundColor: "#1d1b27",
    borderWidth: 1,
    borderColor: "#302c3e",
    alignItems: "center",
    justifyContent: "center",
  },

  youAvatar: {
    backgroundColor: "#211d3a",
    borderColor: "#48406c",
  },

  avatarText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 12,
    color: "#aaa2ff",
  },

  personInfo: {
    flex: 1,
    marginLeft: 8,
    minWidth: 0,
  },

  personLabel: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 7,
    letterSpacing: 1.3,
    color: "#5f5c68",
    marginBottom: 2,
  },

  personName: {
    fontFamily: "DMSans_500Medium",
    fontSize: 11,
    color: "#ffffff",
  },

  arrowBox: {
    width: 31,
    height: 31,
    borderRadius: 11,
    backgroundColor: "#181624",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },

  cardDivider: {
    height: 1,
    backgroundColor: "#24222c",
    marginVertical: 14,
  },

  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  amountLabel: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 8,
    letterSpacing: 1.5,
    color: "#5f5c68",
    marginBottom: 3,
  },

  amount: {
    fontFamily: "DMSans_700Bold",
    fontSize: 20,
    color: "#ffffff",
  },

  paidAmount: {
    color: "#54d68c",
  },

  statusBadge: {
    minHeight: 30,
    paddingHorizontal: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  pendingBadge: {
    backgroundColor: "#19172a",
    borderWidth: 1,
    borderColor: "#302c49",
  },

  paidBadge: {
    backgroundColor: "#102219",
    borderWidth: 1,
    borderColor: "#1d3d2a",
  },

  statusText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 9,
  },

  pendingStatusText: {
    color: "#aaa2ff",
  },

  paidStatusText: {
    color: "#54d68c",
  },

  payButton: {
    height: 43,
    borderRadius: 13,
    backgroundColor: "#7f76ed",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 14,
  },

  payButtonText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 12,
    color: "#ffffff",
  },

  waitingText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 9,
    lineHeight: 14,
    color: "#666372",
    marginTop: 13,
  },

  paidDate: {
    fontFamily: "DMSans_400Regular",
    fontSize: 9,
    color: "#5e806b",
    marginTop: 11,
  },

  emptyCard: {
    borderRadius: 22,
    backgroundColor: "#101016",
    borderWidth: 1,
    borderColor: "#24232d",
    padding: 28,
    alignItems: "center",
  },

  emptyIcon: {
    width: 59,
    height: 59,
    borderRadius: 19,
    backgroundColor: "#122219",
    borderWidth: 1,
    borderColor: "#1d3d2a",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  emptyTitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 17,
    color: "#ffffff",
  },

  emptyText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    lineHeight: 17,
    color: "#777482",
    textAlign: "center",
    marginTop: 7,
    maxWidth: 280,
  },

  bottomSpace: {
    height: 45,
  },
});
