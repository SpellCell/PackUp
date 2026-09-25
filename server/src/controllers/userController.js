import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";

// ===========================================
// Get Logged In User Profile
// ===========================================

export const getProfile = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id);

    if (!user) {

        const error = new Error("User Not Found");
        error.statusCode = 404;
        throw error;

    }

    res.status(200).json({

        success: true,

        user

    });

});

// ===========================================
// Update Profile
// ===========================================

export const updateProfile = asyncHandler(async (req, res) => {

    const {
        name,
        username,
        bio,
        gender,
        dateOfBirth,
        interests,
        skills,
        instagram,
        linkedin
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {

        const error = new Error("User Not Found");
        error.statusCode = 404;
        throw error;

    }

    if (username !== undefined) {

        const normalizedUsername = username.trim().toLowerCase();

        if (normalizedUsername !== user.username) {

            const usernameExists = await User.findOne({
                username: normalizedUsername,
                _id: { $ne: user._id }
            });

            if (usernameExists) {

                const error = new Error("Username already taken");
                error.statusCode = 400;
                throw error;

            }

            user.username = normalizedUsername;

        }

    }

    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (gender !== undefined) user.gender = gender;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (interests !== undefined) user.interests = interests;
    if (skills !== undefined) user.skills = skills;
    if (instagram !== undefined) user.instagram = instagram;
    if (linkedin !== undefined) user.linkedin = linkedin;

    await user.save();

    res.status(200).json({

        success: true,

        message: "Profile Updated Successfully",

        user

    });

});

// ===========================================
// Change Password
// ===========================================

export const changePassword = asyncHandler(async (req, res) => {

    const {
        currentPassword,
        newPassword
    } = req.body;

    if (!currentPassword || !newPassword) {

        const error = new Error(
            "Current password and new password are required"
        );
        error.statusCode = 400;
        throw error;

    }

    if (newPassword.length < 8) {

        const error = new Error(
            "New password must be at least 8 characters"
        );
        error.statusCode = 400;
        throw error;

    }

    if (!/[A-Z]/.test(newPassword)) {

        const error = new Error(
            "New password must contain at least one uppercase letter"
        );
        error.statusCode = 400;
        throw error;

    }

    if (!/[a-z]/.test(newPassword)) {

        const error = new Error(
            "New password must contain at least one lowercase letter"
        );
        error.statusCode = 400;
        throw error;

    }

    if (!/[0-9]/.test(newPassword)) {

        const error = new Error(
            "New password must contain at least one number"
        );
        error.statusCode = 400;
        throw error;

    }

    if (currentPassword === newPassword) {

        const error = new Error(
            "New password must be different from your current password"
        );
        error.statusCode = 400;
        throw error;

    }

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {

        const error = new Error("User Not Found");
        error.statusCode = 404;
        throw error;

    }

    const passwordMatches =
        await bcrypt.compare(
            currentPassword,
            user.password
        );

    if (!passwordMatches) {

        const error = new Error(
            "Current password is incorrect"
        );
        error.statusCode = 400;
        throw error;

    }

    user.password = newPassword;

    await user.save();

    res.status(200).json({

        success: true,

        message: "Password changed successfully"

    });

});

// ===========================================
// Get User By ID
// ===========================================

export const getUserById = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id)
        .select("-password");

    if (!user) {

        const error = new Error("User Not Found");
        error.statusCode = 404;
        throw error;

    }

    res.status(200).json({

        success: true,

        user

    });

});

// ===========================================
// Upload Avatar
// ===========================================

export const uploadAvatar = asyncHandler(async (req, res) => {

    if (!req.file) {

        const error = new Error("Please upload an image");
        error.statusCode = 400;
        throw error;

    }

    const user = await User.findById(req.user._id);

    if (!user) {

        const error = new Error("User Not Found");
        error.statusCode = 404;
        throw error;

    }

    user.profileImage = req.file.path;
    user.profileImagePublicId = req.file.filename;

    await user.save();

    res.status(200).json({

        success: true,

        message: "Profile Image Uploaded Successfully",

        profileImage: user.profileImage,

        user

    });

});
