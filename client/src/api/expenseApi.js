import API from "./axios";

/**
 * Add Expense
 */
export const addExpense = (tripId, expenseData) =>
    API.post(
        `/expenses/${tripId}`,
        expenseData
    );

/**
 * Get Trip Expenses
 */
export const getTripExpenses = (tripId) =>
    API.get(
        `/expenses/${tripId}`
    );

/**
 * Delete Expense
 */
export const deleteExpense = (
    tripId,
    expenseId
) =>
    API.delete(
        `/expenses/${tripId}/${expenseId}`
    );

/**
 * Get Trip Balances
 */
export const getTripBalances = (tripId) =>
    API.get(
        `/expenses/${tripId}/balance`
    );

/**
 * Get Settlement Suggestions
 */
export const getSettlementSuggestions = (tripId) =>
    API.get(
        `/expenses/${tripId}/settlements`
    );