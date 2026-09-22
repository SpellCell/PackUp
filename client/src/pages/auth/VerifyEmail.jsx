import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    ArrowRight,
    Car,
    Compass,
    Map,
    Mountain,
    Navigation,
    Plane,
    ShieldCheck,
    Sparkles
} from "lucide-react";

import { verifyEmail, resendOTP } from "../../api/authApi";
import "./VerifyEmail.css";

const VerifyEmail = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || "";

    const [otp, setOtp] = useState([
        "",
        "",
        "",
        "",
        "",
        ""
    ]);

    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(60);

    const inputRefs = useRef([]);

    useEffect(() => {

        if (!email) {
            navigate("/register");
        }

    }, [email, navigate]);

    useEffect(() => {

        if (timer <= 0) {
            return;
        }

        const interval = setInterval(() => {

            setTimer(previous => previous - 1);

        }, 1000);

        return () => clearInterval(interval);

    }, [timer]);

    const submit = async (code = otp.join("")) => {

        if (code.length !== 6) {

            toast.error("Enter complete OTP");

            return;
        }

        try {

            setLoading(true);

            await verifyEmail({
                email,
                otp: code
            });

            toast.success(
                "Email Verified Successfully 🎉"
            );

            navigate("/login");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Verification Failed"
            );

        } finally {

            setLoading(false);

        }

    };

    const handleChange = (value, index) => {

        if (!/^\d?$/.test(value)) {
            return;
        }

        const newOtp = [...otp];

        newOtp[index] = value;

        setOtp(newOtp);

        if (
            value &&
            index < 5
        ) {

            inputRefs.current[
                index + 1
            ]?.focus();

        }

        const code = newOtp.join("");

        if (
            code.length === 6 &&
            !code.includes("")
        ) {

            setTimeout(() => {
                submit(code);
            }, 150);

        }

    };

    const handleKeyDown = (event, index) => {

        if (
            event.key === "Backspace" &&
            !otp[index] &&
            index > 0
        ) {

            inputRefs.current[
                index - 1
            ]?.focus();

        }

    };

    const handlePaste = (event) => {

        event.preventDefault();

        const pasted = event.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 6);

        if (pasted.length !== 6) {
            return;
        }

        const digits = pasted.split("");

        setOtp(digits);

        inputRefs.current[5]?.focus();

        setTimeout(() => {
            submit(pasted);
        }, 150);

    };

    const handleResend = async () => {

        try {

            await resendOTP(email);

            toast.success(
                "New OTP sent successfully."
            );

            setOtp([
                "",
                "",
                "",
                "",
                "",
                ""
            ]);

            setTimer(60);

            setTimeout(() => {
                inputRefs.current[0]?.focus();
            }, 50);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to resend OTP"
            );

        }

    };

    return (

        <div className="verify-page">

            <div className="verify-background">

                <div className="verify-glow verify-glow-one" />

                <div className="verify-glow verify-glow-two" />

                <div className="verify-glow verify-glow-three" />

                <div className="verify-grid" />

                <div className="verify-stars">

                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />

                </div>

                <div className="verify-mountains">

                    <div className="verify-mountain verify-mountain-one" />

                    <div className="verify-mountain verify-mountain-two" />

                    <div className="verify-mountain verify-mountain-three" />

                </div>

            </div>

            <div className="verify-doodles">

                <div className="verify-doodle verify-doodle-compass">

                    <Compass
                        size={42}
                        strokeWidth={1.3}
                    />

                </div>

                <div className="verify-doodle verify-doodle-plane">

                    <Plane
                        size={34}
                        strokeWidth={1.4}
                    />

                </div>

                <div className="verify-doodle verify-doodle-mountain">

                    <Mountain
                        size={48}
                        strokeWidth={1.2}
                    />

                </div>

                <div className="verify-doodle verify-doodle-map">

                    <Map
                        size={40}
                        strokeWidth={1.3}
                    />

                </div>

                <div className="verify-doodle verify-doodle-navigation">

                    <Navigation
                        size={32}
                        strokeWidth={1.3}
                    />

                </div>

                <div className="verify-doodle verify-doodle-sparkle">

                    <Sparkles
                        size={27}
                        strokeWidth={1.3}
                    />

                </div>

                <div className="verify-car-route">

                    <div className="verify-route-line" />

                    <motion.div
                        className="verify-car"
                        initial={{
                            left: "-70px"
                        }}
                        animate={{
                            left: [
                                "-70px",
                                "18%",
                                "38%",
                                "60%",
                                "82%",
                                "calc(100% + 70px)"
                            ],
                            y: [
                                0,
                                -5,
                                1,
                                -4,
                                1,
                                -2
                            ],
                            rotate: [
                                -2,
                                1,
                                -1,
                                1,
                                -1,
                                0
                            ]
                        }}
                        transition={{
                            duration: 14,
                            repeat: Infinity,
                            ease: "linear",
                            times: [
                                0,
                                0.2,
                                0.4,
                                0.6,
                                0.8,
                                1
                            ]
                        }}
                    >

                        <Car
                            size={48}
                            strokeWidth={1.35}
                        />

                    </motion.div>

                </div>

                <div className="verify-sticker">

                    <span>
                        GO
                    </span>

                    <small>
                        ADVENTURE
                    </small>

                </div>

            </div>

            <Link
                to="/"
                className="verify-brand"
            >

                <span className="verify-brand-mark">
                    P
                </span>

                <span className="verify-brand-name">
                    PackUP
                </span>

            </Link>

            <main className="verify-main">

                <motion.div
                    className="verify-content"
                    initial={{
                        opacity: 0,
                        y: 25
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    transition={{
                        duration: 0.65,
                        ease: "easeOut"
                    }}
                >

                    <div className="verify-intro">

                        <span className="verify-eyebrow">

                            <span className="verify-eyebrow-dot" />

                            ONE LAST STEP

                        </span>

                        <h1>
                            Verify
                            <span>
                                your journey.
                            </span>
                        </h1>

                        <p>
                            Confirm your email and get
                            ready for your next adventure.
                        </p>

                    </div>

                    <div className="verify-card">

                        <div className="verify-card-glow" />

                        <div className="verify-card-top">

                            <div>

                                <span className="verify-card-label">
                                    EMAIL VERIFICATION
                                </span>

                                <h2>
                                    Let's make it official.
                                </h2>

                            </div>

                            <div className="verify-card-icon">

                                <ShieldCheck
                                    size={21}
                                />

                            </div>

                        </div>

                        <div className="verify-message">

                            <p>
                                Enter the 6-digit code
                                we've sent to
                            </p>

                            <span>
                                {email}
                            </span>

                        </div>

                        <div
                            className="verify-otp"
                            onPaste={handlePaste}
                        >

                            {otp.map(
                                (digit, index) => (

                                    <motion.input
                                        key={index}
                                        ref={element => {
                                            inputRefs.current[
                                                index
                                            ] = element;
                                        }}
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete={
                                            index === 0
                                                ? "one-time-code"
                                                : "off"
                                        }
                                        maxLength={1}
                                        value={digit}
                                        aria-label={
                                            `OTP digit ${index + 1}`
                                        }
                                        onChange={event =>
                                            handleChange(
                                                event.target.value,
                                                index
                                            )
                                        }
                                        onKeyDown={event =>
                                            handleKeyDown(
                                                event,
                                                index
                                            )
                                        }
                                        whileFocus={{
                                            y: -3
                                        }}
                                        className={
                                            digit
                                                ? "verify-otp-input filled"
                                                : "verify-otp-input"
                                        }
                                    />

                                )
                            )}

                        </div>

                        <button
                            type="button"
                            className={
                                loading
                                    ? "verify-submit loading"
                                    : "verify-submit"
                            }
                            disabled={loading}
                            onClick={() => submit()}
                        >

                            {loading ? (

                                <>
                                    <span className="verify-spinner" />

                                    Verifying your email...
                                </>

                            ) : (

                                <>

                                    <span>
                                        Verify Email
                                    </span>

                                    <ArrowRight
                                        size={18}
                                    />

                                </>

                            )}

                        </button>

                        <div className="verify-resend">

                            {timer > 0 ? (

                                <p>

                                    Didn't receive the code?

                                    <span>
                                        Resend in {timer}s
                                    </span>

                                </p>

                            ) : (

                                <button
                                    type="button"
                                    onClick={handleResend}
                                >

                                    Didn't receive the code?

                                    <span>
                                        Resend OTP
                                    </span>

                                    <ArrowRight
                                        size={14}
                                    />

                                </button>

                            )}

                        </div>

                        <div className="verify-divider">

                            <span />

                            <ShieldCheck
                                size={14}
                            />

                            <span />

                        </div>

                        <p className="verify-security">

                            Your verification code is
                            secure and can only be used
                            for this account.

                        </p>

                    </div>

                    <div className="verify-footer">

                        <span>

                            <Sparkles
                                size={13}
                            />

                            Almost there. Your adventure
                            is waiting.

                        </span>

                    </div>

                </motion.div>

            </main>

        </div>
    );
};

export default VerifyEmail;