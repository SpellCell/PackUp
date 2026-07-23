import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(

    {

        trip: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip",
            required: true
        },

        paidBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        amount: {
            type: Number,
            required: true,
            min: 1
        },

        category: {
            type: String,
            enum: [
                "Food",
                "Transport",
                "Hotel",
                "Fuel",
                "Shopping",
                "Tickets",
                "Other"
            ],
            default: "Other"
        },

        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]

    },

    {
        timestamps: true
    }

);

const Expense = mongoose.model(
    "Expense",
    expenseSchema
);

export default Expense;