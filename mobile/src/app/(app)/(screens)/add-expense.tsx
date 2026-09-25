import React, { useCallback, useState } from "react";
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
//import { Stack, useLocalSearchParams, useRouter } from "expo-router";
//import { Ionicons } from "@expo/vector-icons";
//import { useFocusEffect } from "@react-navigation/native";
import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../../../context/AuthContext";
import {
  addExpense,
  ExpenseUser,
} from "../../../services/expenseService";
import { apiRequest } from "../../../api/api";

const CATEGORIES = [
  "Food",
  "Transport",
  "Hotel",
  "Fuel",
  "Shopping",
  "Tickets",
  "Other",
];

type TripResponse = {
  trip?: {
    participants?: ExpenseUser[];
    organizer?: ExpenseUser;
    createdBy?: ExpenseUser;
  };
};

export default function AddExpenseScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    tripId?: string;
  }>();

  const { token, user } = useAuth();
  const tripId = String(params.tripId || "");

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [members, setMembers] = useState<ExpenseUser[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [saving, setSaving] = useState(false);

  const currentUserId = String(
    user?.id || ""
  );

  const loadMembers = useCallback(async () => {
    if (!token || !tripId) return;

    try {
      setLoadingMembers(true);

      const response: TripResponse = await apiRequest(
        `/api/trips/${tripId}`,
        {
          method: "GET",
          token,
        }
      );

      const trip = response?.trip;

      const tripMembers: ExpenseUser[] = [
        ...(trip?.organizer ? [trip.organizer] : []),
        ...(trip?.createdBy ? [trip.createdBy] : []),
        ...(trip?.participants || []),
      ];

      const uniqueMembers = tripMembers.filter(
        (member, index, array) =>
          member?._id &&
          array.findIndex(
            (item) => item?._id === member._id
          ) === index
      );

      setMembers(uniqueMembers);

      setSelectedMembers(
        uniqueMembers
          .map((member) => member._id)
          .filter((id) => id === currentUserId)
      );
    } catch (error: any) {
      Alert.alert(
        "Unable to load members",
        error?.message ||
          "Could not load trip members."
      );
    } finally {
      setLoadingMembers(false);
    }
  }, [token, tripId, currentUserId]);

  useFocusEffect(
    useCallback(() => {
      loadMembers();
    }, [loadMembers])
  );

  const toggleMember = (memberId: string) => {
    setSelectedMembers((current) =>
      current.includes(memberId)
        ? current.filter((id) => id !== memberId)
        : [...current, memberId]
    );
  };

  const handleAddExpense = async () => {
    if (!token) {
      Alert.alert(
        "Authentication required",
        "Please log in again."
      );
      return;
    }

    const cleanDescription = description.trim();
    const numericAmount = Number(
      amount.replace(/,/g, "").trim()
    );

    if (!cleanDescription) {
      Alert.alert(
        "Missing description",
        "Enter what the expense was for."
      );
      return;
    }

    if (
      !amount.trim() ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      Alert.alert(
        "Invalid amount",
        "Enter a valid amount greater than ₹0."
      );
      return;
    }

    if (selectedMembers.length === 0) {
      Alert.alert(
        "Select members",
        "Select at least one person for this expense."
      );
      return;
    }

    try {
      setSaving(true);

      await addExpense(token, tripId, {
        description: cleanDescription,
        amount: numericAmount,
        category: category as any,
        participants: selectedMembers,
      });

      Alert.alert(
        "Expense added",
        "The expense has been added to the trip.",
        [
          {
            text: "Done",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        "Unable to add expense",
        error?.message ||
          "Something went wrong while adding the expense."
      );
    } finally {
      setSaving(false);
    }
  };

  if (!tripId) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          Trip information is missing.
        </Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#ffffff"
            />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>
              Add Expense
            </Text>
            <Text style={styles.headerSubtitle}>
              Split it with your trip members
            </Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.label}>
            What did you spend on?
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="receipt-outline"
              size={20}
              color="#77778b"
            />

            <TextInput
              style={styles.input}
              placeholder="e.g. Dinner at the hotel"
              placeholderTextColor="#5e5e70"
              value={description}
              onChangeText={setDescription}
              maxLength={100}
            />
          </View>

          <Text style={styles.label}>
            Amount
          </Text>

          <View style={styles.amountContainer}>
            <Text style={styles.currency}>₹</Text>

            <TextInput
              style={styles.amountInput}
              placeholder="0"
              placeholderTextColor="#5e5e70"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </View>

          <Text style={styles.label}>
            Category
          </Text>

          <View style={styles.categoryGrid}>
            {CATEGORIES.map((item) => {
              const selected = category === item;

              return (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.categoryChip,
                    selected &&
                      styles.categoryChipSelected,
                  ]}
                  onPress={() => setCategory(item)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selected &&
                        styles.categoryTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.memberHeader}>
            <View>
              <Text style={styles.label}>
                Split between
              </Text>

              <Text style={styles.memberHint}>
                Select everyone who shares this expense
              </Text>
            </View>

            {members.length > 0 && (
              <Text style={styles.selectedCount}>
                {selectedMembers.length}/
                {members.length}
              </Text>
            )}
          </View>

          {loadingMembers ? (
            <View style={styles.memberLoading}>
              <ActivityIndicator
                size="small"
                color="#9b8cff"
              />

              <Text style={styles.loadingText}>
                Loading trip members...
              </Text>
            </View>
          ) : members.length === 0 ? (
            <View style={styles.emptyMembers}>
              <Ionicons
                name="people-outline"
                size={26}
                color="#77778b"
              />

              <Text style={styles.emptyMembersText}>
                No trip members found.
              </Text>
            </View>
          ) : (
            <View style={styles.membersList}>
              {members.map((member) => {
                const selected =
                  selectedMembers.includes(
                    member._id
                  );

                const isCurrentUser =
                  member._id === currentUserId;

                return (
                  <TouchableOpacity
                    key={member._id}
                    style={[
                      styles.memberCard,
                      selected &&
                        styles.memberCardSelected,
                    ]}
                    onPress={() =>
                      toggleMember(member._id)
                    }
                    activeOpacity={0.8}
                  >
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {member.name
                          ?.charAt(0)
                          .toUpperCase() || "?"}
                      </Text>
                    </View>

                    <View style={styles.memberInfo}>
                      <Text
                        style={styles.memberName}
                        numberOfLines={1}
                      >
                        {member.name || "Unknown"}
                        {isCurrentUser
                          ? " (You)"
                          : ""}
                      </Text>

                      <Text
                        style={styles.memberUsername}
                        numberOfLines={1}
                      >
                        @{member.username || "user"}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.checkbox,
                        selected &&
                          styles.checkboxSelected,
                      ]}
                    >
                      {selected && (
                        <Ionicons
                          name="checkmark"
                          size={17}
                          color="#ffffff"
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          <View style={styles.infoBox}>
            <Ionicons
              name="information-circle-outline"
              size={19}
              color="#9b8cff"
            />

            <Text style={styles.infoText}>
              The expense is recorded as paid by you.
              Each selected member will receive an
              equal share of the expense.
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.saveButton,
              saving && styles.saveButtonDisabled,
            ]}
            onPress={handleAddExpense}
            disabled={saving}
            activeOpacity={0.85}
          >
            {saving ? (
              <ActivityIndicator
                size="small"
                color="#ffffff"
              />
            ) : (
              <Ionicons
                name="checkmark-circle-outline"
                size={21}
                color="#ffffff"
              />
            )}

            <Text style={styles.saveButtonText}>
              {saving
                ? "Adding Expense..."
                : "Add Expense"}
            </Text>
          </TouchableOpacity>

          <View style={styles.bottomSpace} />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090f",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 58,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#1d1d29",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#15151f",
    alignItems: "center",
    justifyContent: "center",
  },

  headerText: {
    flex: 1,
    marginLeft: 13,
  },

  headerTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
  },

  headerSubtitle: {
    color: "#77778b",
    fontSize: 12,
    marginTop: 3,
  },

  content: {
    padding: 18,
  },

  label: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 9,
  },

  inputContainer: {
    height: 54,
    backgroundColor: "#12121b",
    borderWidth: 1,
    borderColor: "#252533",
    borderRadius: 15,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },

  input: {
    flex: 1,
    color: "#ffffff",
    fontSize: 14,
    marginLeft: 10,
  },

  amountContainer: {
    height: 62,
    backgroundColor: "#12121b",
    borderWidth: 1,
    borderColor: "#252533",
    borderRadius: 15,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },

  currency: {
    color: "#9b8cff",
    fontSize: 25,
    fontWeight: "700",
  },

  amountInput: {
    flex: 1,
    color: "#ffffff",
    fontSize: 25,
    fontWeight: "700",
    marginLeft: 9,
  },

  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
    marginBottom: 24,
  },

  categoryChip: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#15151f",
    borderWidth: 1,
    borderColor: "#252533",
  },

  categoryChipSelected: {
    backgroundColor: "#252044",
    borderColor: "#7669df",
  },

  categoryText: {
    color: "#8c8c9e",
    fontSize: 12,
    fontWeight: "600",
  },

  categoryTextSelected: {
    color: "#dcd8ff",
  },

  memberHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  memberHeaderText: {
    flex: 1,
  },

  memberHint: {
    color: "#666678",
    fontSize: 11,
    marginTop: -3,
    marginBottom: 8,
  },

  selectedCount: {
    color: "#9b8cff",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
  },

  membersList: {
    gap: 9,
  },

  memberCard: {
    minHeight: 68,
    backgroundColor: "#12121b",
    borderWidth: 1,
    borderColor: "#20202d",
    borderRadius: 16,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  memberCardSelected: {
    backgroundColor: "#17152a",
    borderColor: "#554b9d",
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#28243f",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#cfc9ff",
    fontSize: 16,
    fontWeight: "700",
  },

  memberInfo: {
    flex: 1,
    marginLeft: 11,
    marginRight: 10,
  },

  memberName: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },

  memberUsername: {
    color: "#6f6f81",
    fontSize: 11,
    marginTop: 3,
  },

  checkbox: {
    width: 25,
    height: 25,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#3a3a4b",
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxSelected: {
    backgroundColor: "#6557d8",
    borderColor: "#6557d8",
  },

  memberLoading: {
    height: 90,
    backgroundColor: "#12121b",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    color: "#77778b",
    fontSize: 12,
    marginTop: 8,
  },

  emptyMembers: {
    height: 90,
    backgroundColor: "#12121b",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyMembersText: {
    color: "#77778b",
    fontSize: 12,
    marginTop: 7,
  },

  infoBox: {
    flexDirection: "row",
    backgroundColor: "#151329",
    borderWidth: 1,
    borderColor: "#29244b",
    borderRadius: 15,
    padding: 13,
    marginTop: 18,
  },

  infoText: {
    flex: 1,
    color: "#9490ad",
    fontSize: 11,
    lineHeight: 17,
    marginLeft: 9,
  },

  saveButton: {
    height: 54,
    borderRadius: 15,
    backgroundColor: "#6557d8",
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  saveButtonDisabled: {
    opacity: 0.65,
  },

  saveButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },

  centered: {
    flex: 1,
    backgroundColor: "#09090f",
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
  },

  errorText: {
    color: "#ff7777",
    fontSize: 14,
    textAlign: "center",
  },

  bottomSpace: {
    height: 40,
  },
});