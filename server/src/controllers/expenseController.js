import Expense from "../models/Expense.js";
import Trip from "../models/Trip.js";

export const addExpense = async (req, res) => {

    try {

        const {
            description,
            amount,
            category,
            participants
        } = req.body;

        const trip = await Trip.findById(req.params.tripId);

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip Not Found"
            });
        }

        // Only trip members can add expenses
        const isParticipant = trip.participants.some(
            participant =>
                participant.toString() === req.user._id.toString()
        );

        if (!isParticipant) {
            return res.status(403).json({
                success: false,
                message: "Only Trip Members Can Add Expenses"
            });
        }

        // At least one participant
        if (!participants || participants.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please select at least one participant"
            });
        }

        // Verify every participant belongs to the trip
        const tripMembers = trip.participants.map(id => id.toString());

        const invalidParticipants = participants.filter(
            id => !tripMembers.includes(id)
        );

        if (invalidParticipants.length > 0) {
            return res.status(400).json({
                success: false,
                message: "One or more selected participants are not part of this trip"
            });
        }

        const expense = await Expense.create({

            trip: trip._id,

            paidBy: req.user._id,

            description,

            amount,

            category,

            participants

        });

        res.status(201).json({

            success: true,

            message: "Expense Added Successfully",

            expense

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

export const getTripBalances = async (req, res) => {

    try {

        const trip = await Trip.findById(req.params.tripId)
            .populate(
                "participants",
                "name username profileImage"
            );

        if (!trip) {

            return res.status(404).json({

                success: false,

                message: "Trip Not Found"

            });

        }

        const expenses = await Expense.find({

            trip: trip._id

        });

        const balances = {};

        // Initialize every participant balance

        trip.participants.forEach(user => {

            balances[user._id.toString()] = {

                user,

                balance: 0

            };

        });

        // Calculate balances

        expenses.forEach(expense => {

            const share =
                expense.amount / expense.participants.length;

            // Person who paid

            balances[expense.paidBy.toString()].balance +=

                expense.amount - share;

            // Others

            expense.participants.forEach(participant => {

                if (
                    participant.toString() !==
                    expense.paidBy.toString()
                ) {

                    balances[
                        participant.toString()
                    ].balance -= share;

                }

            });

        });

        res.status(200).json({

            success: true,

            balances: Object.values(balances)

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

export const getSettlementSuggestions = async (req, res) => {

    try {

        const trip = await Trip.findById(req.params.tripId)
            .populate(
                "participants",
                "name username profileImage"
            );

        if (!trip) {

            return res.status(404).json({
                success: false,
                message: "Trip Not Found"
            });

        }

        const expenses = await Expense.find({
            trip: trip._id
        });

        const balances = {};

        trip.participants.forEach(user => {

            balances[user._id.toString()] = {

                user,

                balance: 0

            };

        });

        expenses.forEach(expense => {

            const share =
                expense.amount / expense.participants.length;

            balances[
                expense.paidBy.toString()
            ].balance += expense.amount - share;

            expense.participants.forEach(participant => {

                if (
                    participant.toString() !==
                    expense.paidBy.toString()
                ) {

                    balances[
                        participant.toString()
                    ].balance -= share;

                }

            });

        });

        const creditors = [];

        const debtors = [];

        Object.values(balances).forEach(person => {

            if (person.balance > 0.01) {

                creditors.push(person);

            }

            if (person.balance < -0.01) {

                debtors.push(person);

            }

        });

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

                amount: Number(amount.toFixed(2))

            });

            debtor.balance += amount;

            creditor.balance -= amount;

            if (
                Math.abs(debtor.balance) < 0.01
            ) {
                i++;
            }

            if (
                creditor.balance < 0.01
            ) {
                j++;
            }

        }

        res.status(200).json({

            success: true,

            settlements

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};