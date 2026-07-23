import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import GlassCard from "../../components/ui/GlassCard";
import Button from "../../components/ui/Button";
import { verifyEmail, resendOTP } from "../../api/authApi";

const VerifyEmail = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || "";

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(60);

    const inputRefs = useRef([]);

    useEffect(() => {

        if (!email) {

            navigate("/register");

        }

    }, [email, navigate]);

    useEffect(() => {

        if (timer <= 0) return;

        const interval = setInterval(() => {

            setTimer(prev => prev - 1);

        }, 1000);

        return () => clearInterval(interval);

    }, [timer]);

    const submit = async (code = otp.join("")) => {

        if (code.length !== 6) {

            return toast.error("Enter complete OTP");

        }

        try {

            setLoading(true);

            await verifyEmail({

                email,

                otp: code

            });

            toast.success("Email Verified Successfully 🎉");

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

        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];

        newOtp[index] = value;

        setOtp(newOtp);

        if (value && index < 5) {

            inputRefs.current[index + 1]?.focus();

        }

        const code = newOtp.join("");

        if (code.length === 6 && !code.includes("")) {

            setTimeout(() => {

                submit(code);

            }, 150);

        }

    };

    const handleKeyDown = (e, index) => {

        if (

            e.key === "Backspace" &&

            !otp[index] &&

            index > 0

        ) {

            inputRefs.current[index - 1]?.focus();

        }

    };

    const handlePaste = (e) => {

        e.preventDefault();

        const pasted = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 6);

        if (pasted.length !== 6) return;

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

            toast.success("New OTP sent successfully.");

            setOtp(["", "", "", "", "", ""]);

            setTimer(60);

            inputRefs.current[0]?.focus();

        } catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Failed to resend OTP"

            );

        }

    };

    return (

        <div className="min-h-screen bg-[#09090B] flex justify-center items-center p-6">

            <motion.div

                initial={{ opacity: 0, scale: 0.9 }}

                animate={{ opacity: 1, scale: 1 }}

            >

                <GlassCard className="max-w-lg w-full">

                    <h1 className="text-4xl font-bold text-white">

                        Verify Email

                    </h1>

                    <p className="text-zinc-400 mt-3">

                        Enter the 6-digit code sent to

                    </p>

                    <p className="text-indigo-400 mt-1 break-all">

                        {email}

                    </p>

                    <div className="flex justify-center gap-3 mt-8">

                        {

                            otp.map((digit, index) => (

                                <input

                                    key={index}

                                    ref={el => inputRefs.current[index] = el}

                                    maxLength={1}

                                    value={digit}

                                    onChange={(e) =>
                                        handleChange(
                                            e.target.value,
                                            index
                                        )
                                    }

                                    onKeyDown={(e) =>
                                        handleKeyDown(
                                            e,
                                            index
                                        )
                                    }

                                    onPaste={handlePaste}

                                    className="w-14 h-16 rounded-xl text-center text-2xl font-semibold bg-zinc-900 border border-zinc-700 text-white outline-none focus:border-indigo-500 transition"

                                />

                            ))

                        }

                    </div>

                    <Button

                        className="w-full mt-8"

                        loading={loading}

                        onClick={() => submit()}

                    >

                        Verify Email

                    </Button>

                    <div className="text-center mt-6">

                        {

                            timer > 0

                                ?

                                <p className="text-zinc-500">

                                    Resend OTP in <span className="text-indigo-400">{timer}s</span>

                                </p>

                                :

                                <button

                                    onClick={handleResend}

                                    className="text-indigo-400 hover:text-indigo-300 transition"

                                >

                                    Resend OTP

                                </button>

                        }

                    </div>

                </GlassCard>

            </motion.div>

        </div>

    );

};

export default VerifyEmail;