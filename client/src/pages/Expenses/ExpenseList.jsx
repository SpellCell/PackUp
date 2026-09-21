import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import toast from "react-hot-toast";
import {
    Receipt,
    Users,
    Trash2
} from "lucide-react";

import { deleteExpense } from "../../api/expenseApi";

const ExpenseList = ({
    expenses,
    tripId,
    onExpenseDeleted
}) => {
    const { user } = useAuth();

    const [deletingId, setDeletingId] =
        useState(null);

    const handleDelete = async (expense) => {
        const confirmDelete = window.confirm(
            `Delete "${expense.description}" expense?`
        );

        if (!confirmDelete) {
            return;
        }

        try {
            setDeletingId(expense._id);

            const { data } = await deleteExpense(
                tripId,
                expense._id
            );

            toast.success(
                data.message ||
                "Expense deleted successfully."
            );

            if (onExpenseDeleted) {
                await onExpenseDeleted();
            }
        } catch (error) {
            console.log(error);

            toast.error(
                error.response?.data?.message ||
                "Unable to delete expense."
            );
        } finally {
            setDeletingId(null);
        }
    };

    if (!expenses || expenses.length === 0) {
        return (
            <div className="text-center py-10">

                <Receipt
                    size={40}
                    className="mx-auto text-zinc-600"
                />

                <p className="text-zinc-500 mt-4">
                    No expenses recorded yet.
                </p>

            </div>
        );
    }

    return (
        <div className="space-y-4">

            {expenses.map(expense => {

                const isPayer =
                    expense.paidBy?._id === user?._id;

                const isDeleting =
                    deletingId === expense._id;

                return (
                    <div
                        key={expense._id}
                        className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
                    >

                        <div className="flex items-start justify-between gap-4">

                            <div className="flex items-start gap-4">

                                <div className="h-11 w-11 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">

                                    <Receipt
                                        size={20}
                                        className="text-indigo-400"
                                    />

                                </div>

                                <div>

                                    <h3 className="font-semibold text-lg">
                                        {expense.description}
                                    </h3>

                                    <p className="text-sm text-zinc-500 mt-1">
                                        {expense.category}
                                    </p>

                                    <p className="text-sm text-zinc-500 mt-2">
                                        Paid by{" "}
                                        <span className="text-zinc-300">
                                            {expense.paidBy?.name}
                                        </span>
                                    </p>

                                </div>

                            </div>

                            <div className="text-right">

                                <p className="text-xl font-bold">
                                    ₹
                                    {Number(
                                        expense.amount
                                    ).toFixed(2)}
                                </p>

                                <p className="text-xs text-zinc-500 mt-1">
                                    {new Date(
                                        expense.createdAt
                                    ).toLocaleDateString()}
                                </p>

                                {isPayer && (
                                    <button
                                        type="button"
                                        disabled={isDeleting}
                                        onClick={() =>
                                            handleDelete(
                                                expense
                                            )
                                        }
                                        className="mt-3 flex items-center gap-2 ml-auto text-sm text-red-400 hover:text-red-300 disabled:opacity-50 transition"
                                    >
                                        <Trash2
                                            size={15}
                                        />

                                        {isDeleting
                                            ? "Deleting..."
                                            : "Delete"}
                                    </button>
                                )}

                            </div>

                        </div>

                        <div className="mt-5 pt-4 border-t border-zinc-800">

                            <div className="flex items-center gap-2 text-sm text-zinc-500">

                                <Users size={16} />

                                <span>
                                    Split between{" "}
                                    {expense.participants?.length || 0}{" "}
                                    members
                                </span>

                            </div>

                            <div className="flex flex-wrap gap-2 mt-3">

                                {expense.participants?.map(
                                    participant => (
                                        <span
                                            key={
                                                participant._id
                                            }
                                            className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300"
                                        >
                                            {participant.name}
                                        </span>
                                    )
                                )}

                            </div>

                        </div>

                    </div>
                );
            })}

        </div>
    );
};

export default ExpenseList;