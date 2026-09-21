import { useState } from "react";
import toast from "react-hot-toast";
import { X, Plus } from "lucide-react";

import GlassCard from "../../components/ui/GlassCard";
import { addExpense } from "../../api/expenseApi";

const categories = [
    "Food",
    "Transport",
    "Hotel",
    "Fuel",
    "Shopping",
    "Tickets",
    "Other"
];

const ExpenseForm = ({
    trip,
    onExpenseAdded,
    onClose
}) => {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Other");
    const [selectedParticipants, setSelectedParticipants] =
        useState([]);
    const [loading, setLoading] = useState(false);

    const organizer = trip.createdBy;

    const members = [
        ...(organizer ? [organizer] : []),
        ...(trip.participants || [])
    ].filter(
        (member, index, array) =>
            member?._id &&
            array.findIndex(
                item => item?._id === member._id
            ) === index
    );

    const toggleParticipant = (userId) => {
        setSelectedParticipants(previous =>
            previous.includes(userId)
                ? previous.filter(
                    id => id !== userId
                )
                : [...previous, userId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!description.trim()) {
            toast.error(
                "Please enter an expense description."
            );
            return;
        }

        if (!amount || Number(amount) <= 0) {
            toast.error(
                "Please enter a valid amount."
            );
            return;
        }

        if (selectedParticipants.length === 0) {
            toast.error(
                "Select at least one participant."
            );
            return;
        }

        try {
            setLoading(true);

            const { data } = await addExpense(
                trip._id,
                {
                    description:
                        description.trim(),
                    amount: Number(amount),
                    category,
                    participants:
                        selectedParticipants
                }
            );

            toast.success(
                data.message ||
                "Expense added successfully."
            );

            setDescription("");
            setAmount("");
            setCategory("Other");
            setSelectedParticipants([]);

            if (onExpenseAdded) {
                await onExpenseAdded();
            }

            if (onClose) {
                onClose();
            }
        } catch (error) {
            console.log(error);

            toast.error(
                error.response?.data?.message ||
                "Unable to add expense."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <GlassCard className="p-8">

            <div className="flex items-center justify-between mb-8">

                <div>
                    <h2 className="text-2xl font-bold">
                        Add Expense
                    </h2>

                    <p className="text-zinc-500 mt-2">
                        Record an expense and split it between trip members.
                    </p>
                </div>

                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-10 w-10 rounded-xl border border-zinc-800 bg-zinc-900 flex items-center justify-center hover:border-zinc-600 transition"
                    >
                        <X size={18} />
                    </button>
                )}

            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >

                <div>
                    <label className="block text-sm mb-2">
                        Description
                    </label>

                    <input
                        type="text"
                        value={description}
                        onChange={e =>
                            setDescription(
                                e.target.value
                            )
                        }
                        placeholder="e.g. Hotel booking"
                        className="w-full rounded-2xl bg-zinc-900 border border-zinc-800 px-5 py-4 outline-none focus:border-indigo-500 transition"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div>
                        <label className="block text-sm mb-2">
                            Amount
                        </label>

                        <input
                            type="number"
                            min="1"
                            step="0.01"
                            value={amount}
                            onChange={e =>
                                setAmount(
                                    e.target.value
                                )
                            }
                            placeholder="₹ 0.00"
                            className="w-full rounded-2xl bg-zinc-900 border border-zinc-800 px-5 py-4 outline-none focus:border-indigo-500 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-2">
                            Category
                        </label>

                        <select
                            value={category}
                            onChange={e =>
                                setCategory(
                                    e.target.value
                                )
                            }
                            className="w-full rounded-2xl bg-zinc-900 border border-zinc-800 px-5 py-4 outline-none focus:border-indigo-500 transition"
                        >
                            {categories.map(item => (
                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>

                <div>

                    <div className="mb-4">

                        <label className="block text-sm">
                            Split Between
                        </label>

                        <p className="text-sm text-zinc-500 mt-1">
                            Select everyone who shares this expense.
                        </p>

                    </div>

                    <div className="space-y-3">

                        {members.length === 0 ? (
                            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-center text-zinc-500">
                                No trip members found.
                            </div>
                        ) : (
                            members.map(user => {

                                const selected =
                                    selectedParticipants.includes(
                                        user._id
                                    );

                                const isOrganizer =
                                    user._id ===
                                    trip.createdBy?._id;

                                return (
                                    <button
                                        key={user._id}
                                        type="button"
                                        onClick={() =>
                                            toggleParticipant(
                                                user._id
                                            )
                                        }
                                        className={`w-full flex items-center justify-between rounded-2xl border p-4 transition ${
                                            selected
                                                ? "border-indigo-500 bg-indigo-500/10"
                                                : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                                        }`}
                                    >

                                        <div className="flex items-center gap-3">

                                            <img
                                                src={
                                                    user.profileImage ||
                                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                        user.name || "User"
                                                    )}`
                                                }
                                                alt={
                                                    user.name
                                                }
                                                className="h-10 w-10 rounded-full"
                                            />

                                            <div className="text-left">

                                                <div className="flex items-center gap-2">

                                                    <p className="font-semibold">
                                                        {user.name}
                                                    </p>

                                                    {isOrganizer && (
                                                        <span className="text-xs rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 text-indigo-400">
                                                            Organizer
                                                        </span>
                                                    )}

                                                </div>

                                                <p className="text-sm text-zinc-500">
                                                    @{user.username}
                                                </p>

                                            </div>

                                        </div>

                                        <div
                                            className={`h-5 w-5 rounded-md border flex items-center justify-center ${
                                                selected
                                                    ? "bg-indigo-600 border-indigo-600"
                                                    : "border-zinc-700"
                                            }`}
                                        >
                                            {selected && (
                                                <span className="text-xs text-white">
                                                    ✓
                                                </span>
                                            )}
                                        </div>

                                    </button>
                                );
                            })
                        )}

                    </div>

                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-4 font-semibold hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    <Plus size={18} />

                    {loading
                        ? "Adding Expense..."
                        : "Add Expense"}
                </button>

            </form>

        </GlassCard>
    );
};

export default ExpenseForm;