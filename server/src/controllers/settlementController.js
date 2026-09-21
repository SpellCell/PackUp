import Settlement from "../models/Settlement.js";
import Trip from "../models/Trip.js";
import Expense from "../models/Expense.js";

const getId = value => {
    if (!value) {
        return null;
    }

    if (value._id) {
        return value._id.toString();
    }

    return value.toString();
};

const checkTripMember = (
    trip,
    userId
) => {
    const id = getId(userId);

    if (
        getId(trip.createdBy) === id
    ) {
        return true;
    }

    return trip.participants.some(
        participant =>
            getId(participant) === id
    );
};

const calculateBalances = (
    trip,
    expenses
) => {
    const balances = {};

    const organizerId =
        getId(trip.createdBy);

    balances[organizerId] = {
        user: trip.createdBy,
        balance: 0
    };

    trip.participants.forEach(
        participant => {
            const participantId =
                getId(participant);

            if (
                !balances[participantId]
            ) {
                balances[participantId] = {
                    user: participant,
                    balance: 0
                };
            }
        }
    );

    expenses.forEach(expense => {
        if (
            !expense.participants ||
            expense.participants.length === 0
        ) {
            return;
        }

        const amount =
            Number(expense.amount);

        const share =
            amount /
            expense.participants.length;

        const payerId =
            getId(expense.paidBy);

        if (!balances[payerId]) {
            return;
        }

        balances[payerId].balance +=
            amount - share;

        expense.participants.forEach(
            participant => {
                const participantId =
                    getId(participant);

                if (
                    participantId !== payerId &&
                    balances[participantId]
                ) {
                    balances[
                        participantId
                    ].balance -= share;
                }
            }
        );
    });

    return balances;
};

const calculateSettlements = balances => {
    const creditors = [];
    const debtors = [];

    Object.values(balances).forEach(
        person => {
            if (
                person.balance > 0.01
            ) {
                creditors.push({
                    ...person,
                    balance: Number(
                        person.balance.toFixed(2)
                    )
                });
            }

            if (
                person.balance < -0.01
            ) {
                debtors.push({
                    ...person,
                    balance: Number(
                        person.balance.toFixed(2)
                    )
                });
            }
        }
    );

    const settlements = [];

    let i = 0;
    let j = 0;

    while (
        i < debtors.length &&
        j < creditors.length
    ) {
        const debtor = debtors[i];
        const creditor = creditors[j];

        const amount = Math.min(
            Math.abs(debtor.balance),
            creditor.balance
        );

        settlements.push({
            from: debtor.user,
            to: creditor.user,
            amount: Number(
                amount.toFixed(2)
            )
        });

        debtor.balance += amount;
        creditor.balance -= amount;

        if (
            Math.abs(debtor.balance) < 0.01
        ) {
            i++;
        }

        if (
            Math.abs(creditor.balance) < 0.01
        ) {
            j++;
        }
    }

    return settlements;
};

const syncPendingSettlements = async (
    trip,
    suggestions
) => {
    const activePairs = new Set();

    for (
        const suggestion of suggestions
    ) {
        const fromId =
            getId(suggestion.from);

        const toId =
            getId(suggestion.to);

        const pairKey =
            `${fromId}_${toId}`;

        activePairs.add(pairKey);

        const existing =
            await Settlement.findOne({
                trip: trip._id,
                from: fromId,
                to: toId,
                status: "Pending"
            });

        if (existing) {
            existing.amount =
                suggestion.amount;

            await existing.save();

            continue;
        }

        await Settlement.create({
            trip: trip._id,
            from: fromId,
            to: toId,
            amount: suggestion.amount,
            status: "Pending"
        });
    }

    const pendingSettlements =
        await Settlement.find({
            trip: trip._id,
            status: "Pending"
        });

    for (
        const settlement of pendingSettlements
    ) {
        const pairKey =
            `${getId(settlement.from)}_${getId(settlement.to)}`;

        if (
            !activePairs.has(pairKey)
        ) {
            await settlement.deleteOne();
        }
    }
};

export const getTripSettlements = async (
    req,
    res
) => {
    try {
        const trip =
            await Trip.findById(
                req.params.tripId
            )
                .populate(
                    "createdBy",
                    "name username profileImage"
                )
                .populate(
                    "participants",
                    "name username profileImage"
                );

        if (!trip) {
            return res.status(404).json({
                success: false,
                message:
                    "Trip Not Found"
            });
        }

        if (
            !checkTripMember(
                trip,
                req.user._id
            )
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Only Trip Members Can View Settlements"
            });
        }

        const expenses =
            await Expense.find({
                trip: trip._id
            });

        const balances =
            calculateBalances(
                trip,
                expenses
            );

        const suggestions =
            calculateSettlements(
                balances
            );

        await syncPendingSettlements(
            trip,
            suggestions
        );

        const settlements =
            await Settlement.find({
                trip: trip._id
            })
                .populate(
                    "from",
                    "name username profileImage"
                )
                .populate(
                    "to",
                    "name username profileImage"
                )
                .sort({
                    createdAt: -1
                });

        return res.status(200).json({
            success: true,
            settlements
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message:
                "Internal Server Error"
        });
    }
};

export const markSettlementPaid = async (
    req,
    res
) => {
    try {
        const {
            tripId,
            settlementId
        } = req.params;

        const settlement =
            await Settlement.findById(
                settlementId
            );

        if (!settlement) {
            return res.status(404).json({
                success: false,
                message:
                    "Settlement Not Found"
            });
        }

        if (
            getId(settlement.trip) !==
            tripId
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Settlement does not belong to this trip"
            });
        }

        const trip =
            await Trip.findById(
                tripId
            );

        if (!trip) {
            return res.status(404).json({
                success: false,
                message:
                    "Trip Not Found"
            });
        }

        if (
            !checkTripMember(
                trip,
                req.user._id
            )
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Only Trip Members Can Manage Settlements"
            });
        }

        if (
            getId(settlement.from) !==
            getId(req.user._id)
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Only the person who owes the money can mark it as paid"
            });
        }

        if (
            settlement.status === "Paid"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Settlement is already marked as paid"
            });
        }

        settlement.status = "Paid";
        settlement.paidAt = new Date();

        await settlement.save();

        const populatedSettlement =
            await Settlement.findById(
                settlement._id
            )
                .populate(
                    "from",
                    "name username profileImage"
                )
                .populate(
                    "to",
                    "name username profileImage"
                );

        return res.status(200).json({
            success: true,
            message:
                "Settlement marked as paid",
            settlement:
                populatedSettlement
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message:
                "Internal Server Error"
        });
    }
};