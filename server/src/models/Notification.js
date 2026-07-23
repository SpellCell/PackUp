import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        trip: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip"
        },

        type: {
            type: String,
            enum: [
                "JOIN_REQUEST",
                "REQUEST_ACCEPTED",
                "REQUEST_REJECTED",
                "NEW_MESSAGE",
                "TRIP_UPDATED",
                "TRIP_CANCELLED"
            ],
            required: true
        },

        title: {
            type: String,
            required: true
        },

        message: {
            type: String,
            required: true
        },

        isRead: {
            type: Boolean,
            default: false
        }

    },
    {
        timestamps: true
    }
);

const Notification = mongoose.model(
    "Notification",
    notificationSchema
);

export default Notification;