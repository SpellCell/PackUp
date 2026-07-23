import mongoose from "mongoose";

// ==========================
// Generate Trip Code
// Example: PKU-8F4KQ2
// ==========================

const generateTripCode = () => {

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

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

        // ==========================
        // Unique Trip Code
        // ==========================

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
            default: 1
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

// ==========================
// Auto Generate Unique Trip Code
// ==========================

tripSchema.pre("validate", async function () {

    if (!this.isNew || this.tripCode) {

        return;

    }

    let unique = false;

    while (!unique) {

        const code = generateTripCode();

        const existingTrip = await mongoose.models.Trip.findOne({

            tripCode: code

        });

        if (!existingTrip) {

            this.tripCode = code;

            unique = true;

        }

    }

});

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;