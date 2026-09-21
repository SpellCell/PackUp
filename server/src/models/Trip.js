import mongoose from "mongoose";
import User from "./User.js";

const generateTripCode = () => {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let code = "PKU-";

    for (let i = 0; i < 6; i++) {
        code += chars.charAt(
            Math.floor(Math.random() * chars.length)
        );
    }

    return code;
};

const tripSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Trip title is required"],
            trim: true
        },

        tripCode: {
            type: String,
            unique: true,
            uppercase: true,
            immutable: true,
            index: true
        },

        source: {
            type: String,
            required: true,
            trim: true
        },

        destination: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            maxlength: 1000
        },

        coverImage: {
            type: String,
            default: ""
        },

        coverImagePublicId: {
            type: String,
            default: ""
        },

        startDate: {
            type: Date,
            required: true
        },

        endDate: {
            type: Date,
            required: true
        },

        budget: {
            type: Number,
            required: true
        },

        maxMembers: {
            type: Number,
            required: true,
            min: 2
        },

        currentMembers: {
            type: Number,
            default: 1,
            min: 1
        },

        tripType: {
            type: String,
            enum: [
                "Adventure",
                "Road Trip",
                "Backpacking",
                "Camping",
                "Trekking",
                "Beach",
                "Family",
                "Business",
                "Solo",
                "Other"
            ],
            default: "Other"
        },

        status: {
            type: String,
            enum: [
                "Open",
                "Full",
                "Completed",
                "Cancelled"
            ],
            default: "Open"
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
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

tripSchema.pre("validate", async function () {
    try {
        if (!this.tripCode) {
            this.tripCode = generateTripCode();
        }

        if (!this.createdBy) {
            return;
        }

        if (!Array.isArray(this.participants)) {
            this.participants = [];
        }

        const organizerId =
            this.createdBy.toString();

        const uniqueParticipantIds = [
            ...new Set(
                this.participants.map(
                    participant =>
                        participant.toString()
                )
            )
        ];

        const cleanedParticipantIds =
            uniqueParticipantIds.filter(
                participantId =>
                    participantId !== organizerId
            );

        const validUsers = await User.find({
            _id: {
                $in: cleanedParticipantIds
            }
        }).select("_id");

        const validUserIds = new Set(
            validUsers.map(
                user => user._id.toString()
            )
        );

        const invalidUserIds =
            cleanedParticipantIds.filter(
                participantId =>
                    !validUserIds.has(
                        participantId
                    )
            );

        if (invalidUserIds.length > 0) {
            throw new Error(
                "Trip contains one or more invalid participant users."
            );
        }

        this.participants =
            cleanedParticipantIds.map(
                participantId =>
                    new mongoose.Types.ObjectId(
                        participantId
                    )
            );

        this.currentMembers =
            this.participants.length + 1;

        if (
            this.currentMembers >=
            this.maxMembers
        ) {
            this.status = "Full";
        } else if (
            this.status === "Full"
        ) {
            this.status = "Open";
        }
    } catch (error) {
        throw error;
    }
});

const Trip = mongoose.model(
    "Trip",
    tripSchema
);

export default Trip;