import API from "./axios";

export const registerUser = (data) =>
    API.post("/auth/register", data);

export const loginUser = (data) =>
    API.post("/auth/login", data);

// Current Logged In User
export const getMe = () =>
    API.get("/auth/me");

// Email Verification
export const sendVerificationOTP = (email) =>
    API.post("/auth/send-verification-otp", { email });

export const resendOTP = (email) =>
    API.post("/auth/send-verification-otp", { email });

export const verifyEmail = (data) =>
    API.post("/auth/verify-email", data);

// Password
export const forgotPassword = (email) =>
    API.post("/auth/forgot-password", { email });

export const resetPassword = (data) =>
    API.post("/auth/reset-password", data);