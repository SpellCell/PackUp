import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
    getProfile,
    updateProfile,getUserById,uploadAvatar
} from "../controllers/userController.js";
import upload from "../middleware/uploadMiddleware.js";
import validate from "../middleware/validate.js";
import {
    updateProfileValidator
} from "../validators/userValidator.js";



const router = express.Router();

router.get("/profile", protect, getProfile);

//router.put("/profile", protect, updateProfile);

router.put(
    "/upload-avatar",
    protect,
    upload.single("avatar"),
    uploadAvatar
);


router.get("/:id", getUserById);

router.put(
    "/profile",
    protect,
    updateProfileValidator,
    validate,
    updateProfile
);

export default router;