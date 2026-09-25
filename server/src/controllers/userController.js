import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

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