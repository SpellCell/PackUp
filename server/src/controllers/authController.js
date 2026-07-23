import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import generateOTP from "../utils/generateOTP.js";
import { sendEmail } from "../services/emailServices.js";
import bcrypt from "bcrypt";


export const register = async (req, res) => {
    try {

        const {
            name,
            username,
            email,
            password
        } = req.body;

        // Check required fields
        if (!name || !username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check email
        const emailExists = await User.findOne({ email });

        if (emailExists) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        // Check username
        const usernameExists = await User.findOne({ username });

        if (usernameExists) {
            return res.status(400).json({
                success: false,
                message: "Username already taken"
            });
        }

        // Create User
        const user = await User.create({
            name,
            username,
            email,
            password
        });
        const otp = generateOTP();

user.verificationOTP = otp;
user.verificationOTPExpires = Date.now() + 10 * 60 * 1000;

await user.save();

await sendEmail({
    to: user.email,
    username: user.name,
    subject: "Verify Your Email",
    heading: "Welcome to PackUP 🎉",
    message: `
        Thanks for joining PackUP!

        <br><br>

        Your verification code is:

        <h1 style="color:#2563eb;">
            ${otp}
        </h1>

        This OTP will expire in 10 minutes.
    `
});

        res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            data: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {

    console.error("REGISTER ERROR");
    console.error(error);

    res.status(500).json({
        success: false,
        message: error.message,
        errors: error.errors
    });

}
};

// TOKEN
export const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required"
            });
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }
        if (!user.isVerified) {
    return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in."
    });
}

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

export const getMe = async (req, res) => {

    res.status(200).json({
        success: true,
        user: req.user
    });

};


// verification otp
export const sendVerificationOTP = async (req, res) => {

    try {

        const { email } = req.body;

        if (!email) {

            return res.status(400).json({

                success: false,

                message: "Email is required"

            });

        }

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found"

            });

        }

        if (user.isVerified) {

            return res.status(400).json({

                success: false,

                message: "Email already verified"

            });

        }

        const otp = generateOTP();

        user.verificationOTP = otp;

        user.verificationOTPExpires = Date.now() + 10 * 60 * 1000;

        await user.save();

        await sendEmail({

            to: user.email,

            username: user.name,

            subject: "Verify Your Email",

            heading: "Verification Code",

            message: `
                Your new verification code is:

                <br><br>

                <h1 style="color:#2563eb;">
                    ${otp}
                </h1>

                This OTP expires in 10 minutes.
            `

        });

        res.status(200).json({

            success: true,

            message: "Verification OTP sent successfully"

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

// verify
export const verifyEmail = async (req, res) => {

    try {

        const { email, otp } = req.body;

        if (!email || !otp) {

            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });

        }

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        if (user.isVerified) {

            return res.status(400).json({
                success: false,
                message: "Email already verified"
            });

        }

        if (

            user.verificationOTP !== otp ||

            user.verificationOTPExpires < Date.now()

        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid or Expired OTP"
            });

        }

        user.isVerified = true;

        user.verificationOTP = "";

        user.verificationOTPExpires = null;

        await user.save();

        res.status(200).json({

            success: true,

            message: "Email verified successfully"

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

// bcrypt otp
export const forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        const otp = generateOTP();

        const hashedOTP = await bcrypt.hash(otp, 10);

        user.resetOTP = hashedOTP;

        user.resetOTPExpires = Date.now() + 10 * 60 * 1000;

        await user.save();

        await sendEmail({

            to: user.email,

            username: user.name,

            subject: "Reset Your Password",

            heading: "Password Reset Request",

            message: `
                We received a request to reset your password.

                <br><br>

                Your OTP is:

                <h1 style="color:#dc2626;">
                    ${otp}
                </h1>

                This OTP will expire in 10 minutes.

                <br><br>

                If you didn't request this,
                you can safely ignore this email.
            `

        });

        res.status(200).json({

            success: true,

            message: "Password reset OTP sent successfully"

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};


// reset pass

export const resetPassword = async (req, res) => {

    try {

        const {

            email,

            otp,

            newPassword

        } = req.body;

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found"

            });

        }

        if (

            !user.resetOTP ||

            user.resetOTPExpires < Date.now()

        ) {

            return res.status(400).json({

                success: false,

                message: "OTP has expired"

            });

        }

        const isMatch = await bcrypt.compare(

            otp,

            user.resetOTP

        );

        if (!isMatch) {

            return res.status(400).json({

                success: false,

                message: "Invalid OTP"

            });

        }

        user.password = newPassword;

        user.resetOTP = "";

        user.resetOTPExpires = null;

        await user.save();

        res.status(200).json({

            success: true,

            message: "Password reset successfully"

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};



