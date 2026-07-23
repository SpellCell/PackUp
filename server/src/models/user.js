import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: 3,
            maxlength: 50
        },

        username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    lowercase: true,
    trim: true,
    minlength: 3,
    maxlength: 20
},

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
            select: false
        },

        profileImage: {
            type: String,
            default:
                ""
        },
        profileImagePublicId: {
        type: String,
        default: ""
        },

        bio: {
            type: String,
            default: "",
            maxlength: 300
        },

        gender: {
            type: String,
            enum: ["Male", "Female", "Other"]
        },

        dateOfBirth: {
            type: Date
        },

        interests: {
            type: [String],
            default: []
        },

        skills: {
            type: [String],
            default: []
        },

        instagram: {
            type: String,
            default: ""
        },

        linkedin: {
            type: String,
            default: ""
        },

        tripsCreated: {
            type: Number,
            default: 0
        },

        tripsJoined: {
            type: Number,
            default: 0
        },

        rating: {
            type: Number,
            default: 5
        },

        isVerified: {
    type: Boolean,
    default: false
},

verificationOTP: {
    type: String,
    default: ""
},

verificationOTPExpires: {
    type: Date,
    default: null
},

resetOTP: {
    type: String,
    default: ""
},

resetOTPExpires: {
    type: Date,
    default: null
}
    },
    {
        timestamps: true
    }
);


// Hash Password Before Saving
userSchema.pre("save", async function () {

    if (!this.isModified("password")) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 10);

});


// Compare Password
userSchema.methods.comparePassword = async function (password) {

    return await bcrypt.compare(password, this.password);

};

const User = mongoose.model("User", userSchema);

export default User;

