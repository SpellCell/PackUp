import { apiRequest } from "../api/api";

export type ExpenseUser = {
  _id: string;
  name: string;
  username: string;
  profileImage?: string;
};

export type Expense = {
  _id: string;
  trip: string;
  paidBy: ExpenseUser;
  description: string;
  amount: number;
  category:
    | "Food"
    | "Transport"
    | "Hotel"
    | "Fuel"
    | "Shopping"
    | "Tickets"
    | "Other";
  participants: ExpenseUser[];
  createdAt: string;
  updatedAt?: string;
};

export type Balance = {
  user: ExpenseUser;
  balance: number;
};

export type Settlement = {
  _id: string;
  trip: string;
  from: ExpenseUser;
  to: ExpenseUser;
  amount: number;
  status: "Pending" | "Paid";
  paidAt?: string | null;
  createdAt: string;
  updatedAt?: string;
};

export type AddExpenseData = {
  description: string;
  amount: number;
  category:
    | "Food"
    | "Transport"
    | "Hotel"
    | "Fuel"
    | "Shopping"
    | "Tickets"
    | "Other";
  participants: string[];
};

export async function getTripExpenses(
  token: string,
  tripId: string
) {
  return apiRequest(`/api/expenses/${tripId}`, {
    method: "GET",
    token,
  });
}

export async function addExpense(
  token: string,
  tripId: string,
  expenseData: AddExpenseData
) {
  return apiRequest(`/api/expenses/${tripId}`, {
    method: "POST",
    token,
    body: expenseData,
  });
}

export async function deleteExpense(
  token: string,
  tripId: string,
  expenseId: string
) {
  return apiRequest(
    `/api/expenses/${tripId}/${expenseId}`,
    {
      method: "DELETE",
      token,
    }
  );
}

export async function getTripBalances(
  token: string,
  tripId: string
) {
  return apiRequest(
    `/api/expenses/${tripId}/balance`,
    {
      method: "GET",
      token,
    }
  );
}

export async function getTripExpenseSettlements(
  token: string,
  tripId: string
) {
  return apiRequest(
    `/api/expenses/${tripId}/settlements`,
    {
      method: "GET",
      token,
    }
  );
}

export async function getTripSettlements(
  token: string,
  tripId: string
) {
  return apiRequest(
    `/api/settlements/${tripId}`,
    {
      method: "GET",
      token,
    }
  );
}

export async function markSettlementPaid(
  token: string,
  tripId: string,
  settlementId: string
) {
  return apiRequest(
    `/api/settlements/${tripId}/${settlementId}/pay`,
    {
      method: "PUT",
      token,
    }
  );
}