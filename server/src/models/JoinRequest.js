import mongoose from "mongoose";

const joinRequestSchema = new mongoose.Schema(
    {
        trip: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip",
            required: true
        },

        requester: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {
            type: String,
            enum: ["Pending", "Accepted", "Rejected"],
            default: "Pending"
        },

        message: {
            type: String,
            default: ""
        }

    },
    {
        timestamps: true
    }
);

const JoinRequest = mongoose.model("JoinRequest", joinRequestSchema);

export default JoinRequest;