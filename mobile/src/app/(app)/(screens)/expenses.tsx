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
  deleteExpense,
  Expense,
  getTripExpenses,
} from "../../../services/expenseService";
import { getTripById, Trip } from "../../../services/authService";

function formatAmount(amount: number) {
  return `₹${Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(date: string) {
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

function getCategoryIcon(category: Expense["category"]) {
  switch (category) {
    case "Food":
      return "restaurant-outline";
    case "Transport":
      return "car-outline";
    case "Hotel":
      return "bed-outline";
    case "Fuel":
      return "flame-outline";
    case "Shopping":
      return "bag-handle-outline";
    case "Tickets":
      return "ticket-outline";
    default:
      return "receipt-outline";
  }
}

export default function Expenses() {
  const { token, user } = useAuth();
  const { tripId } = useLocalSearchParams<{
    tripId: string;
  }>();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadExpenses = useCallback(
    async (showLoader = true) => {
      if (!token || !tripId) {
        setLoading(false);
        return;
      }

      if (showLoader) {
        setLoading(true);
      }

      try {
        const [tripResponse, expenseResponse] =
          await Promise.all([
            getTripById(token, tripId),
            getTripExpenses(token, tripId),
          ]);

        setTrip(tripResponse.trip);
        setExpenses(expenseResponse.expenses || []);
      } catch (error) {
        console.log("Failed to load expenses:", error);

        if (showLoader) {
          Alert.alert(
            "Couldn't load expenses",
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
      loadExpenses(false);
    }, [loadExpenses])
  );

  async function handleRefresh() {
    setRefreshing(true);
    await loadExpenses(false);
  }

  function openAddExpense() {
    router.push({
      pathname: "/(app)/(screens)/add-expense",
      params: {
        tripId,
      },
    });
  }

  function openSettlements() {
    router.push({
      pathname: "/(app)/(screens)/settlements",
      params: {
        tripId,
      },
    });
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

  async function handleDelete(expense: Expense) {
    if (!token || !tripId) {
      return;
    }

    if (!isCurrentUser(expense.paidBy?._id)) {
      Alert.alert(
        "Can't delete expense",
        "Only the person who paid can delete this expense."
      );
      return;
    }

    Alert.alert(
      "Delete expense?",
      `Delete "${expense.description}" from the trip expenses?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setDeletingId(expense._id);

              await deleteExpense(
                token,
                tripId,
                expense._id
              );

              setExpenses((current) =>
                current.filter(
                  (item) => item._id !== expense._id
                )
              );
            } catch (error) {
              Alert.alert(
                "Couldn't delete expense",
                error instanceof Error
                  ? error.message
                  : "Something went wrong."
              );
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  }

  const totalSpent = expenses.reduce(
    (total, expense) =>
      total + Number(expense.amount || 0),
    0
  );

  const expenseCount = expenses.length;

  const currentUserPaid = expenses
    .filter((expense) =>
      isCurrentUser(expense.paidBy?._id)
    )
    .reduce(
      (total, expense) =>
        total + Number(expense.amount || 0),
      0
    );

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
              Expenses
            </Text>

            {trip?.title ? (
              <Text
                style={styles.subtitle}
                numberOfLines={1}
              >
                {trip.title}
              </Text>
            ) : null}
          </View>

          <TouchableOpacity
            style={styles.headerAction}
            activeOpacity={0.8}
            onPress={openSettlements}
          >
            <Ionicons
              name="swap-horizontal-outline"
              size={20}
              color="#aaa2ff"
            />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator
              size="large"
              color="#aaa2ff"
            />

            <Text style={styles.loadingText}>
              Loading expenses...
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
                <View style={styles.summaryTop}>
                  <View>
                    <Text style={styles.summaryLabel}>
                      TOTAL SPENT
                    </Text>

                    <Text style={styles.totalAmount}>
                      {formatAmount(totalSpent)}
                    </Text>
                  </View>

                  <View style={styles.walletIcon}>
                    <Ionicons
                      name="wallet-outline"
                      size={25}
                      color="#aaa2ff"
                    />
                  </View>
                </View>

                <View style={styles.summaryDivider} />

                <View style={styles.summaryStats}>
                  <View style={styles.stat}>
                    <Text style={styles.statValue}>
                      {expenseCount}
                    </Text>

                    <Text style={styles.statLabel}>
                      {expenseCount === 1
                        ? "Expense"
                        : "Expenses"}
                    </Text>
                  </View>

                  <View style={styles.statDivider} />

                  <View style={styles.stat}>
                    <Text style={styles.statValue}>
                      {formatAmount(currentUserPaid)}
                    </Text>

                    <Text style={styles.statLabel}>
                      You paid
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.addButton}
                activeOpacity={0.85}
                onPress={openAddExpense}
              >
                <Ionicons
                  name="add"
                  size={20}
                  color="#ffffff"
                />

                <Text style={styles.addButtonText}>
                  Add Expense
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.settlementButton}
                activeOpacity={0.85}
                onPress={openSettlements}
              >
                <Ionicons
                  name="swap-horizontal-outline"
                  size={19}
                  color="#aaa2ff"
                />

                <Text style={styles.settlementButtonText}>
                  Settle
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>
                  Recent expenses
                </Text>

                <Text style={styles.sectionSubtitle}>
                  Keep every trip payment in one place
                </Text>
              </View>

              <View style={styles.countBadge}>
                <Text style={styles.countText}>
                  {expenseCount}
                </Text>
              </View>
            </View>

            {expenses.length === 0 ? (
              <View style={styles.emptyCard}>
                <View style={styles.emptyIcon}>
                  <Ionicons
                    name="receipt-outline"
                    size={29}
                    color="#aaa2ff"
                  />
                </View>

                <Text style={styles.emptyTitle}>
                  No expenses yet
                </Text>

                <Text style={styles.emptyText}>
                  Add your first trip expense and
                  start keeping track of shared
                  spending.
                </Text>

                <TouchableOpacity
                  style={styles.emptyButton}
                  activeOpacity={0.85}
                  onPress={openAddExpense}
                >
                  <Ionicons
                    name="add"
                    size={18}
                    color="#ffffff"
                  />

                  <Text style={styles.emptyButtonText}>
                    Add first expense
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.expenseList}>
                {expenses.map((expense) => {
                  const canDelete = isCurrentUser(
                    expense.paidBy?._id
                  );

                  const isDeleting =
                    deletingId === expense._id;

                  return (
                    <View
                      key={expense._id}
                      style={styles.expenseCard}
                    >
                      <View style={styles.expenseIcon}>
                        <Ionicons
                          name={
                            getCategoryIcon(
                              expense.category
                            ) as any
                          }
                          size={21}
                          color="#aaa2ff"
                        />
                      </View>

                      <View style={styles.expenseInfo}>
                        <Text
                          style={styles.expenseTitle}
                          numberOfLines={1}
                        >
                          {expense.description}
                        </Text>

                        <View style={styles.metaRow}>
                          <Text style={styles.category}>
                            {expense.category}
                          </Text>

                          <View style={styles.dot} />

                          <Text
                            style={styles.date}
                          >
                            {formatDate(
                              expense.createdAt
                            )}
                          </Text>
                        </View>

                        <View style={styles.paidRow}>
                          <Ionicons
                            name="person-outline"
                            size={12}
                            color="#777482"
                          />

                          <Text
                            style={styles.paidText}
                            numberOfLines={1}
                          >
                            Paid by{" "}
                            {isCurrentUser(
                              expense.paidBy?._id
                            )
                              ? "you"
                              : expense.paidBy?.name ||
                                expense.paidBy?.username ||
                                "member"}
                          </Text>
                        </View>

                        <Text
                          style={styles.participantText}
                          numberOfLines={1}
                        >
                          {expense.participants?.length || 0}{" "}
                          participant
                          {(expense.participants?.length || 0) ===
                          1
                            ? ""
                            : "s"}
                        </Text>
                      </View>

                      <View style={styles.expenseRight}>
                        <Text style={styles.expenseAmount}>
                          {formatAmount(expense.amount)}
                        </Text>

                        {canDelete && (
                          <TouchableOpacity
                            style={styles.deleteButton}
                            activeOpacity={0.8}
                            disabled={isDeleting}
                            onPress={() =>
                              handleDelete(expense)
                            }
                          >
                            {isDeleting ? (
                              <ActivityIndicator
                                size="small"
                                color="#ff6b6b"
                              />
                            ) : (
                              <Feather
                                name="trash-2"
                                size={15}
                                color="#ff6b6b"
                              />
                            )}
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            {expenses.length > 0 && (
              <TouchableOpacity
                style={styles.bottomSettlement}
                activeOpacity={0.85}
                onPress={openSettlements}
              >
                <View style={styles.bottomSettlementIcon}>
                  <Ionicons
                    name="swap-horizontal-outline"
                    size={21}
                    color="#aaa2ff"
                  />
                </View>

                <View style={styles.bottomSettlementInfo}>
                  <Text style={styles.bottomSettlementTitle}>
                    View settlements
                  </Text>

                  <Text style={styles.bottomSettlementSubtitle}>
                    See who owes whom and mark payments
                  </Text>
                </View>

                <Feather
                  name="chevron-right"
                  size={19}
                  color="#666372"
                />
              </TouchableOpacity>
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

  headerAction: {
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
    marginBottom: 14,
  },

  summaryGradient: {
    padding: 18,
  },

  summaryTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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

  walletIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#211d38",
    alignItems: "center",
    justifyContent: "center",
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

  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 27,
  },

  addButton: {
    flex: 1,
    minHeight: 49,
    borderRadius: 16,
    backgroundColor: "#7f76ed",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  addButtonText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: "#ffffff",
  },

  settlementButton: {
    minHeight: 49,
    paddingHorizontal: 17,
    borderRadius: 16,
    backgroundColor: "#151321",
    borderWidth: 1,
    borderColor: "#2c2840",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  settlementButtonText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 12,
    color: "#aaa2ff",
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

  emptyCard: {
    borderRadius: 22,
    backgroundColor: "#101016",
    borderWidth: 1,
    borderColor: "#24232d",
    padding: 28,
    alignItems: "center",
  },

  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: 19,
    backgroundColor: "#181624",
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
    maxWidth: 270,
  },

  emptyButton: {
    marginTop: 18,
    minHeight: 44,
    paddingHorizontal: 17,
    borderRadius: 14,
    backgroundColor: "#7f76ed",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  emptyButtonText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 12,
    color: "#ffffff",
  },

  expenseList: {
    gap: 10,
  },

  expenseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#101016",
    borderWidth: 1,
    borderColor: "#24232d",
    borderRadius: 19,
    padding: 13,
  },

  expenseIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#181624",
    alignItems: "center",
    justifyContent: "center",
  },

  expenseInfo: {
    flex: 1,
    marginLeft: 12,
    minWidth: 0,
  },

  expenseTitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: "#ffffff",
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  category: {
    fontFamily: "DMSans_500Medium",
    fontSize: 9,
    color: "#aaa2ff",
  },

  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#55525f",
    marginHorizontal: 6,
  },

  date: {
    fontFamily: "DMSans_400Regular",
    fontSize: 9,
    color: "#666372",
  },

  paidRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  paidText: {
    flex: 1,
    fontFamily: "DMSans_400Regular",
    fontSize: 9,
    color: "#777482",
    marginLeft: 4,
  },

  participantText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 9,
    color: "#5f5c68",
    marginTop: 3,
  },

  expenseRight: {
    alignItems: "flex-end",
    marginLeft: 8,
  },

  expenseAmount: {
    fontFamily: "DMSans_700Bold",
    fontSize: 13,
    color: "#ffffff",
  },

  deleteButton: {
    width: 29,
    height: 29,
    borderRadius: 10,
    backgroundColor: "#211419",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  bottomSettlement: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#101016",
    borderWidth: 1,
    borderColor: "#24232d",
    borderRadius: 19,
    padding: 14,
    marginTop: 17,
  },

  bottomSettlementIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#181624",
    alignItems: "center",
    justifyContent: "center",
  },

  bottomSettlementInfo: {
    flex: 1,
    marginLeft: 12,
  },

  bottomSettlementTitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: "#ffffff",
  },

  bottomSettlementSubtitle: {
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    color: "#777482",
    marginTop: 4,
  },

  bottomSpace: {
    height: 45,
  },
});
