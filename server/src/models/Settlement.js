import mongoose from "mongoose";

const settlementSchema = new mongoose.Schema(
    {
        trip: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip",
            required: true
        },
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        amount: {
            type: Number,
            required: true,
            min: 0.01
        },
        status: {
            type: String,
            enum: [
                "Pending",
                "Paid"
            ],
            default: "Pending"
        },
        paidAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Settlement = mongoose.model(
    "Settlement",
    settlementSchema
);

export default Settlement;