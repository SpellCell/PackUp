import Expense from "../models/Expense.js";
import Trip from "../models/Trip.js";
import { createNotification } from "../services/notificationService.js";

const getId = value => {
    if (!value) {
        return null;
    }

    if (value._id) {
        return value._id.toString();
    }

    return value.toString();
};

const checkTripParticipant = (trip, userId) => {
    const userIdString = getId(userId);

    const organizerId = getId(
        trip.createdBy
    );

    if (organizerId === userIdString) {
        return true;
    }

    return trip.participants.some(
        participant =>
            getId(participant) === userIdString
    );
};

const getTripMemberIds = trip => {
    const members = new Set();

    const organizerId = getId(
        trip.createdBy
    );

    if (organizerId) {
        members.add(organizerId);
    }

    trip.participants.forEach(participant => {
        const participantId =
            getId(participant);

        if (participantId) {
            members.add(participantId);
        }
    });

    return [...members];
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

export const addExpense = async (
    req,
    res
) => {
    try {
        const {
            description,
            amount,
            category,
            participants
        } = req.body;

        const trip =
            await Trip.findById(
                req.params.tripId
            );

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip Not Found"
            });
        }

        if (
            !checkTripParticipant(
                trip,
                req.user._id
            )
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Only Trip Members Can Add Expenses"
            });
        }

        if (
            !description ||
            !description.trim()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Expense description is required"
            });
        }

        if (
            !amount ||
            Number(amount) <= 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Expense amount must be greater than 0"
            });
        }

        if (
            !participants ||
            participants.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Please select at least one participant"
            });
        }

        const uniqueParticipants = [
            ...new Set(
                participants.map(id =>
                    id.toString()
                )
            )
        ];

        const tripMembers =
            getTripMemberIds(trip);

        const invalidParticipants =
            uniqueParticipants.filter(
                id =>
                    !tripMembers.includes(id)
            );

        if (
            invalidParticipants.length > 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "One or more selected participants are not part of this trip"
            });
        }

        const expense =
            await Expense.create({
                trip: trip._id,
                paidBy: req.user._id,
                description:
                    description.trim(),
                amount: Number(amount),
                category:
                    category || "Other",
                participants:
                    uniqueParticipants
            });

        const populatedExpense =
            await Expense.findById(
                expense._id
            )
                .populate(
                    "paidBy",
                    "name username profileImage"
                )
                .populate(
                    "participants",
                    "name username profileImage"
                );

        const recipients =
            uniqueParticipants.filter(
                id =>
                    id !==
                    req.user._id.toString()
            );

        await Promise.all(
            recipients.map(userId =>
                createNotification({
                    recipient: userId,
                    sender: req.user._id,
                    trip: trip._id,
                    type: "TRIP_UPDATED",
                    title:
                        "New Expense Added",
                    message:
                        `${req.user.name} added "${description.trim()}" expense of ₹${Number(amount).toFixed(2)} to ${trip.title}.`
                })
            )
        );

        return res.status(201).json({
            success: true,
            message:
                "Expense Added Successfully",
            expense: populatedExpense
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

export const getTripExpenses = async (
    req,
    res
) => {
    try {
        const trip =
            await Trip.findById(
                req.params.tripId
            );

        if (!trip) {
            return res.status(404).json({
                success: false,
                message:
                    "Trip Not Found"
            });
        }

        if (
            !checkTripParticipant(
                trip,
                req.user._id
            )
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Only Trip Members Can View Expenses"
            });
        }

        const expenses =
            await Expense.find({
                trip: trip._id
            })
                .populate(
                    "paidBy",
                    "name username profileImage"
                )
                .populate(
                    "participants",
                    "name username profileImage"
                )
                .sort({
                    createdAt: -1
                });

        return res.status(200).json({
            success: true,
            expenses
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

export const deleteExpense = async (
    req,
    res
) => {
    try {
        const expense =
            await Expense.findById(
                req.params.expenseId
            );

        if (!expense) {
            return res.status(404).json({
                success: false,
                message:
                    "Expense Not Found"
            });
        }

        const trip =
            await Trip.findById(
                expense.trip
            );

        if (!trip) {
            return res.status(404).json({
                success: false,
                message:
                    "Trip Not Found"
            });
        }

        if (
            !checkTripParticipant(
                trip,
                req.user._id
            )
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Only Trip Members Can Manage Expenses"
            });
        }

        if (
            getId(expense.paidBy) !==
            getId(req.user._id)
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Only the person who paid can delete this expense"
            });
        }

        await expense.deleteOne();

        return res.status(200).json({
            success: true,
            message:
                "Expense Deleted Successfully"
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

export const getTripBalances = async (
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
            !checkTripParticipant(
                trip,
                req.user._id
            )
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Only Trip Members Can View Balances"
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

        const result =
            Object.values(
                balances
            ).map(person => ({
                ...person,
                balance: Number(
                    person.balance.toFixed(2)
                )
            }));

        return res.status(200).json({
            success: true,
            balances: result
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

export const getSettlementSuggestions =
    async (req, res) => {
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
                !checkTripParticipant(
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

            const creditors = [];
            const debtors = [];

            Object.values(
                balances
            ).forEach(person => {
                if (
                    person.balance > 0.01
                ) {
                    creditors.push({
                        ...person,
                        balance: Number(
                            person.balance.toFixed(
                                2
                            )
                        )
                    });
                }

                if (
                    person.balance < -0.01
                ) {
                    debtors.push({
                        ...person,
                        balance: Number(
                            person.balance.toFixed(
                                2
                            )
                        )
                    });
                }
            });

            const settlements = [];

            let i = 0;
            let j = 0;

            while (
                i < debtors.length &&
                j < creditors.length
            ) {
                const debtor =
                    debtors[i];

                const creditor =
                    creditors[j];

                const amount =
                    Math.min(
                        Math.abs(
                            debtor.balance
                        ),
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
                    Math.abs(
                        debtor.balance
                    ) < 0.01
                ) {
                    i++;
                }

                if (
                    Math.abs(
                        creditor.balance
                    ) < 0.01
                ) {
                    j++;
                }
            }

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