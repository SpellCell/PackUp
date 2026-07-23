import express from "express";
import { register, login,getMe,sendVerificationOTP,verifyEmail,forgotPassword,resetPassword } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import {
    registerValidator,
    loginValidator
} from "../validators/authValidator.js";
const router = express.Router();

//router.post("/register", register);
router.post(
    "/register",
    registerValidator,
    validate,
    register
);

//router.post("/login", login);
router.post(
    "/login",
    loginValidator,
    validate,
    login
);
router.get("/me", protect, getMe);

router.post(
    "/send-verification-otp",
    sendVerificationOTP
);

router.post(
    "/verify-email",
    verifyEmail
);

router.post(
    "/forgot-password",
    forgotPassword
);

router.post(
    "/reset-password",
    resetPassword
);




export default router;