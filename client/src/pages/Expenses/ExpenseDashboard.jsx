import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
    ArrowLeft,
    Wallet,
    Users,
    ArrowRight,
    Plus,
    Receipt,
    TrendingUp,
    TrendingDown,
    CheckCircle,
    Clock
} from "lucide-react";

import AppLayout from "../../components/layout/AppLayout";
import GlassCard from "../../components/ui/GlassCard";

import { getTripById } from "../../api/tripApi";

import {
    getTripExpenses,
    getTripBalances
} from "../../api/expenseApi";

import {
    getTripSettlements,
    markSettlementPaid
} from "../../api/settlementApi";

import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";

import { useAuth } from "../../context/AuthContext";

const ExpenseDashboard = () => {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [trip, setTrip] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [balances, setBalances] = useState([]);
    const [settlements, setSettlements] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [showExpenseForm, setShowExpenseForm] =
        useState(false);

    const [payingSettlementId, setPayingSettlementId] =
        useState(null);

    useEffect(() => {
        fetchExpenseData();
    }, [tripId]);

    const fetchExpenseData = async () => {
        try {
            setLoading(true);

            const tripResponse =
                await getTripById(tripId);

            setTrip(
                tripResponse.data.trip
            );

            const expenseResponse =
                await getTripExpenses(
                    tripId
                );

            setExpenses(
                expenseResponse.data.expenses ||
                []
            );

            try {
                const balanceResponse =
                    await getTripBalances(
                        tripId
                    );

                setBalances(
                    balanceResponse.data.balances ||
                    []
                );
            } catch (error) {
                console.log(
                    "Balance loading error:",
                    error
                );

                setBalances([]);
            }

            try {
                const settlementResponse =
                    await getTripSettlements(
                        tripId
                    );

                setSettlements(
                    settlementResponse.data.settlements ||
                    []
                );
            } catch (error) {
                console.log(
                    "Settlement loading error:",
                    error
                );

                setSettlements([]);
            }
        } catch (error) {
            console.log(error);

            toast.error(
                error.response?.data?.message ||
                "Unable to load expense data."
            );

            setTrip(null);
        } finally {
            setLoading(false);
        }
    };

    const handleExpenseAdded = async () => {
        await fetchExpenseData();
    };

    const handleSettlementPaid = async (
        settlementId
    ) => {
        try {
            setPayingSettlementId(
                settlementId
            );

            const { data } =
                await markSettlementPaid(
                    tripId,
                    settlementId
                );

            toast.success(
                data.message ||
                "Settlement marked as paid."
            );

            await fetchExpenseData();
        } catch (error) {
            console.log(error);

            toast.error(
                error.response?.data?.message ||
                "Unable to mark settlement as paid."
            );
        } finally {
            setPayingSettlementId(null);
        }
    };

    const totalExpenses =
        expenses.reduce(
            (total, expense) =>
                total +
                Number(
                    expense.amount || 0
                ),
            0
        );

    const currentUserBalance =
        balances.find(
            person =>
                person.user?._id ===
                user?._id
        );

    const netBalance =
        currentUserBalance?.balance || 0;

    const youAreOwed =
        netBalance > 0
            ? netBalance
            : 0;

    const youOwe =
        netBalance < 0
            ? Math.abs(netBalance)
            : 0;

    const pendingSettlements =
        settlements.filter(
            settlement =>
                settlement.status ===
                "Pending"
        );

    const paidSettlements =
        settlements.filter(
            settlement =>
                settlement.status ===
                "Paid"
        );

    if (loading) {
        return (
            <AppLayout>
                <div className="max-w-6xl mx-auto">
                    <GlassCard className="p-10 text-center">
                        <p className="text-zinc-500">
                            Loading expense dashboard...
                        </p>
                    </GlassCard>
                </div>
            </AppLayout>
        );
    }

    if (!trip) {
        return (
            <AppLayout>
                <div className="max-w-6xl mx-auto">
                    <GlassCard className="p-10 text-center">

                        <h2 className="text-2xl font-bold">
                            Trip Not Found
                        </h2>

                        <button
                            onClick={() =>
                                navigate(
                                    "/expenses"
                                )
                            }
                            className="mt-5 text-indigo-400"
                        >
                            Back to Expenses
                        </button>

                    </GlassCard>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>

            <div className="max-w-6xl mx-auto space-y-8">

                <button
                    onClick={() =>
                        navigate(
                            "/expenses"
                        )
                    }
                    className="flex items-center gap-2 text-zinc-500 hover:text-white transition"
                >
                    <ArrowLeft size={18} />
                    Back to Expenses
                </button>

                <div>

                    <h1 className="text-5xl font-bold">
                        {trip.title}
                    </h1>

                    <p className="mt-3 text-zinc-500">
                        {trip.source}
                        {" → "}
                        {trip.destination}
                    </p>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                    <GlassCard className="p-6">

                        <div className="flex items-center gap-3">

                            <div className="h-11 w-11 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                <Wallet
                                    size={21}
                                    className="text-indigo-400"
                                />
                            </div>

                            <div>

                                <p className="text-sm text-zinc-500">
                                    Total Expenses
                                </p>

                                <h2 className="text-xl font-bold">
                                    ₹
                                    {totalExpenses.toFixed(
                                        2
                                    )}
                                </h2>

                            </div>

                        </div>

                    </GlassCard>

                    <GlassCard className="p-6">

                        <div className="flex items-center gap-3">

                            <div className="h-11 w-11 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                <Users
                                    size={21}
                                    className="text-indigo-400"
                                />
                            </div>

                            <div>

                                <p className="text-sm text-zinc-500">
                                    Members
                                </p>

                                <h2 className="text-xl font-bold">
                                    {(trip.participants?.length || 0) + 1}
                                </h2>

                            </div>

                        </div>

                    </GlassCard>

                    <GlassCard className="p-6">

                        <div className="flex items-center gap-3">

                            <div className="h-11 w-11 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                <Receipt
                                    size={21}
                                    className="text-indigo-400"
                                />
                            </div>

                            <div>

                                <p className="text-sm text-zinc-500">
                                    Expense Records
                                </p>

                                <h2 className="text-xl font-bold">
                                    {expenses.length}
                                </h2>

                            </div>

                        </div>

                    </GlassCard>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                    <GlassCard className="p-6">

                        <div className="flex items-center gap-4">

                            <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                                <TrendingUp
                                    size={22}
                                    className="text-green-400"
                                />
                            </div>

                            <div>

                                <p className="text-sm text-zinc-500">
                                    You Are Owed
                                </p>

                                <h2 className="text-2xl font-bold text-green-400">
                                    ₹
                                    {youAreOwed.toFixed(
                                        2
                                    )}
                                </h2>

                            </div>

                        </div>

                    </GlassCard>

                    <GlassCard className="p-6">

                        <div className="flex items-center gap-4">

                            <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                                <TrendingDown
                                    size={22}
                                    className="text-red-400"
                                />
                            </div>

                            <div>

                                <p className="text-sm text-zinc-500">
                                    You Owe
                                </p>

                                <h2 className="text-2xl font-bold text-red-400">
                                    ₹
                                    {youOwe.toFixed(
                                        2
                                    )}
                                </h2>

                            </div>

                        </div>

                    </GlassCard>

                    <GlassCard className="p-6">

                        <div className="flex items-center gap-4">

                            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                <Wallet
                                    size={22}
                                    className="text-indigo-400"
                                />
                            </div>

                            <div>

                                <p className="text-sm text-zinc-500">
                                    Net Balance
                                </p>

                                <h2
                                    className={`text-2xl font-bold ${
                                        netBalance > 0
                                            ? "text-green-400"
                                            : netBalance < 0
                                            ? "text-red-400"
                                            : "text-zinc-400"
                                    }`}
                                >
                                    {netBalance > 0
                                        ? "+"
                                        : ""}
                                    ₹
                                    {Math.abs(
                                        netBalance
                                    ).toFixed(
                                        2
                                    )}
                                </h2>

                            </div>

                        </div>

                    </GlassCard>

                </div>

                {showExpenseForm ? (
                    <ExpenseForm
                        trip={trip}
                        onExpenseAdded={
                            handleExpenseAdded
                        }
                        onClose={() =>
                            setShowExpenseForm(
                                false
                            )
                        }
                    />
                ) : (
                    <GlassCard className="p-8">

                        <div className="flex items-center justify-between gap-4">

                            <div>

                                <h2 className="text-2xl font-bold">
                                    Add Expense
                                </h2>

                                <p className="text-zinc-500 mt-2">
                                    Record a shared trip expense.
                                </p>

                            </div>

                            <button
                                onClick={() =>
                                    setShowExpenseForm(
                                        true
                                    )
                                }
                                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold hover:bg-indigo-500 transition"
                            >
                                <Plus size={18} />
                                Add Expense
                            </button>

                        </div>

                    </GlassCard>
                )}

                <GlassCard className="p-8">

                    <div className="flex items-center gap-3 mb-6">

                        <Receipt size={22} />

                        <h2 className="text-2xl font-bold">
                            Expense History
                        </h2>

                    </div>

                    <ExpenseList
                        expenses={expenses}
                        tripId={tripId}
                        onExpenseDeleted={
                            handleExpenseAdded
                        }
                    />

                </GlassCard>

                <GlassCard className="p-8">

                    <div className="flex items-center gap-3 mb-6">

                        <Users size={22} />

                        <h2 className="text-2xl font-bold">
                            Member Balances
                        </h2>

                    </div>

                    {balances.length === 0 ? (
                        <p className="text-zinc-500">
                            No expenses recorded yet.
                        </p>
                    ) : (
                        <div className="space-y-4">

                            {balances.map(
                                person => (
                                    <div
                                        key={
                                            person.user
                                                ._id
                                        }
                                        className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
                                    >

                                        <div className="flex items-center gap-3">

                                            <img
                                                src={
                                                    person
                                                        .user
                                                        .profileImage ||
                                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                        person
                                                            .user
                                                            .name
                                                    )}`
                                                }
                                                alt={
                                                    person
                                                        .user
                                                        .name
                                                }
                                                className="h-10 w-10 rounded-full"
                                            />

                                            <div>

                                                <p className="font-semibold">
                                                    {
                                                        person
                                                            .user
                                                            .name
                                                    }
                                                </p>

                                                <p className="text-sm text-zinc-500">
                                                    @
                                                    {
                                                        person
                                                            .user
                                                            .username
                                                    }
                                                </p>

                                            </div>

                                        </div>

                                        <div className="text-right">

                                            <p
                                                className={`font-bold ${
                                                    person.balance >
                                                    0
                                                        ? "text-green-400"
                                                        : person.balance <
                                                          0
                                                        ? "text-red-400"
                                                        : "text-zinc-400"
                                                }`}
                                            >
                                                {person.balance >
                                                0
                                                    ? "+"
                                                    : ""}
                                                ₹
                                                {Math.abs(
                                                    person.balance
                                                ).toFixed(
                                                    2
                                                )}
                                            </p>

                                            <p className="text-xs text-zinc-600 mt-1">
                                                {person.balance >
                                                0
                                                    ? "is owed"
                                                    : person.balance <
                                                      0
                                                    ? "owes"
                                                    : "settled"}
                                            </p>

                                        </div>

                                    </div>
                                )
                            )}

                        </div>
                    )}

                </GlassCard>

                <GlassCard className="p-8">

                    <div className="flex items-center justify-between mb-6">

                        <div className="flex items-center gap-3">

                            <ArrowRight size={22} />

                            <h2 className="text-2xl font-bold">
                                Settlements
                            </h2>

                        </div>

                        {pendingSettlements.length >
                            0 && (
                            <span className="text-sm text-yellow-400">
                                {
                                    pendingSettlements.length
                                }{" "}
                                pending
                            </span>
                        )}

                    </div>

                    {settlements.length === 0 ? (
                        <p className="text-zinc-500">
                            No settlements required.
                        </p>
                    ) : (
                        <div className="space-y-4">

                            {settlements.map(
                                settlement => {

                                    const isPayer =
                                        settlement
                                            .from
                                            ?._id ===
                                        user?._id;

                                    const isPaid =
                                        settlement.status ===
                                        "Paid";

                                    const isPaying =
                                        payingSettlementId ===
                                        settlement._id;

                                    return (
                                        <div
                                            key={
                                                settlement._id
                                            }
                                            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
                                        >

                                            <div className="flex items-center justify-between gap-5">

                                                <div className="flex items-center gap-4">

                                                    <div className="h-11 w-11 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                                        {isPaid ? (
                                                            <CheckCircle
                                                                size={
                                                                    20
                                                                }
                                                                className="text-green-400"
                                                            />
                                                        ) : (
                                                            <Clock
                                                                size={
                                                                    20
                                                                }
                                                                className="text-yellow-400"
                                                            />
                                                        )}
                                                    </div>

                                                    <div>

                                                        <p className="font-semibold">
                                                            {
                                                                settlement
                                                                    .from
                                                                    ?.name
                                                            }
                                                        </p>

                                                        <p className="text-sm text-zinc-500 mt-1">
                                                            {isPaid
                                                                ? "paid"
                                                                : "needs to pay"}
                                                        </p>

                                                    </div>

                                                </div>

                                                <ArrowRight
                                                    size={
                                                        20
                                                    }
                                                    className="text-zinc-600"
                                                />

                                                <div>

                                                    <p className="font-semibold">
                                                        {
                                                            settlement
                                                                .to
                                                                ?.name
                                                        }
                                                    </p>

                                                    <p className="text-sm text-zinc-500 mt-1">
                                                        {
                                                            settlement
                                                                .to
                                                                ?.username
                                                        }
                                                    </p>

                                                </div>

                                                <div className="text-right ml-auto">

                                                    <p className="text-xl font-bold">
                                                        ₹
                                                        {Number(
                                                            settlement.amount
                                                        ).toFixed(
                                                            2
                                                        )}
                                                    </p>

                                                    {isPaid ? (
                                                        <p className="text-sm text-green-400 mt-1">
                                                            ✓ Paid
                                                        </p>
                                                    ) : isPayer ? (
                                                        <button
                                                            disabled={
                                                                isPaying
                                                            }
                                                            onClick={() =>
                                                                handleSettlementPaid(
                                                                    settlement._id
                                                                )
                                                            }
                                                            className="mt-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold hover:bg-green-500 disabled:opacity-50 transition"
                                                        >
                                                            {isPaying
                                                                ? "Updating..."
                                                                : "Mark as Paid"}
                                                        </button>
                                                    ) : (
                                                        <p className="text-xs text-yellow-400 mt-1">
                                                            Awaiting payment
                                                        </p>
                                                    )}

                                                </div>

                                            </div>

                                            {isPaid &&
                                                settlement.paidAt && (
                                                    <p className="text-xs text-zinc-600 mt-4 pt-4 border-t border-zinc-800">
                                                        Paid on{" "}
                                                        {new Date(
                                                            settlement.paidAt
                                                        ).toLocaleString()}
                                                    </p>
                                                )}

                                        </div>
                                    );
                                }
                            )}

                        </div>
                    )}

                </GlassCard>

            </div>

        </AppLayout>
    );
};

export default ExpenseDashboard;