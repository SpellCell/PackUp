import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
    getProfile,
    updateProfile,
    getUserById,
    uploadAvatar,
    changePassword
} from "../controllers/userController.js";
import upload from "../middleware/uploadMiddleware.js";
import validate from "../middleware/validate.js";
import {
    updateProfileValidator
} from "../validators/userValidator.js";

const router = express.Router();

router.get("/profile", protect, getProfile);

router.put(
    "/upload-avatar",
    protect,
    upload.single("avatar"),
    uploadAvatar
);

router.put(
    "/profile",
    protect,
    updateProfileValidator,
    validate,
    updateProfile
);

router.put(
    "/change-password",
    protect,
    changePassword
);

router.get("/:id", getUserById);

export default router;
