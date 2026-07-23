import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        trip: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip",
            required: true
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000
        },

        messageType: {
            type: String,
            enum: ["text", "image"],
            default: "text"
        }

    },
    {
        timestamps: true
    }
);

const Message = mongoose.model("Message", chatSchema);

export default Message;