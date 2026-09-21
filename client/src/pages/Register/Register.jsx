import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
    ArrowRight,
    AtSign,
    Check,
    Eye,
    EyeOff,
    Mail,
    Navigation,
    ShieldCheck,
    Sparkles,
    UserRound
} from "lucide-react";

import { registerUser } from "../../api/authApi";
import "./Register.css";

const Register = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();

    const password = watch("password", "");

    const onSubmit = async (values) => {
        try {
            setLoading(true);

            await registerUser(values);

            toast.success(
                "Account created successfully! Please verify your email."
            );

            navigate("/verify-email", {
                state: {
                    email: values.email
                }
            });
        } catch (error) {
            const data = error.response?.data;

            if (data?.errors?.length) {
                toast.error(data.errors[0].msg);
            } else {
                toast.error(
                    data?.message || "Registration Failed"
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const passwordRules = [
        {
            label: "8+ characters",
            valid: password.length >= 8
        },
        {
            label: "Uppercase letter",
            valid: /[A-Z]/.test(password)
        },
        {
            label: "Lowercase letter",
            valid: /[a-z]/.test(password)
        },
        {
            label: "Number",
            valid: /[0-9]/.test(password)
        }
    ];

    return (
        <div className="register-page">

            {/* ========================================
                BACKGROUND
            ======================================== */}

            <div className="register-background">

                <div className="register-glow register-glow-one" />
                <div className="register-glow register-glow-two" />
                <div className="register-glow register-glow-three" />

                <div className="register-grid" />

                <div className="register-stars">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                </div>

                <div className="register-mountains">
                    <div className="register-mountain register-mountain-one" />
                    <div className="register-mountain register-mountain-two" />
                    <div className="register-mountain register-mountain-three" />
                </div>

            </div>

            {/* ========================================
                TRAVEL DOODLES
            ======================================== */}

            <div className="register-doodles">

                <div className="register-doodle register-compass">
                    <Navigation
                        size={42}
                        strokeWidth={1.3}
                    />
                </div>

                <div className="register-doodle register-plane">
                    <svg
                        width="38"
                        height="38"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M22 2L11 13"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                        />
                        <path
                            d="M22 2L15 22L11 13L2 9L22 2Z"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                <div className="register-doodle register-sparkle">
                    <Sparkles
                        size={28}
                        strokeWidth={1.25}
                    />
                </div>

                <div className="register-doodle register-map">
                    <svg
                        width="44"
                        height="44"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M9 18L3 21V6L9 3L15 6L21 3V18L15 21L9 18Z"
                            stroke="currentColor"
                            strokeWidth="1.3"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M9 3V18"
                            stroke="currentColor"
                            strokeWidth="1.3"
                        />
                        <path
                            d="M15 6V21"
                            stroke="currentColor"
                            strokeWidth="1.3"
                        />
                    </svg>
                </div>

                <div className="register-doodle register-mountain-doodle">
                    <svg
                        width="58"
                        height="45"
                        viewBox="0 0 58 45"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M2 41L21 9L31 25L38 15L56 41"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M17 15L21 9L25 15"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                {/* CYCLIST */}

                <div className="register-cyclist-route">

                    <div className="register-route-line" />

                    <div className="register-cyclist">
                        <svg
                            width="48"
                            height="38"
                            viewBox="0 0 48 38"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle
                                cx="11"
                                cy="28"
                                r="7"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />

                            <circle
                                cx="38"
                                cy="28"
                                r="7"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />

                            <path
                                d="M11 28L19 15L27 28L38 28L27 28L22 18H31"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            <circle
                                cx="24"
                                cy="9"
                                r="3"
                                stroke="currentColor"
                                strokeWidth="1.4"
                            />

                            <path
                                d="M24 12L20 17L27 18"
                                stroke="currentColor"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                        </svg>
                    </div>

                </div>

                <div className="register-travel-sticker">
                    <span>GO</span>
                    <small>EXPLORE</small>
                </div>

            </div>

            {/* ========================================
                BRAND
            ======================================== */}

            <Link
                to="/"
                className="register-brand"
            >

                <span className="register-brand-mark">
                    P
                </span>

                <span className="register-brand-name">
                    PackUP
                </span>

            </Link>

            {/* ========================================
                MAIN
            ======================================== */}

            <main className="register-main">

                <div className="register-content">

                    {/* INTRO */}

                    <div className="register-intro">

                        <span className="register-eyebrow">

                            <span className="register-eyebrow-dot" />

                            START YOUR JOURNEY

                        </span>

                        <h1>
                            Create
                            <span>
                                your account.
                            </span>
                        </h1>

                        <p>
                            One account. Every adventure.
                            Bring your people together and
                            start planning.
                        </p>

                    </div>

                    {/* ========================================
                        CARD
                    ======================================== */}

                    <div className="register-card">

                        <div className="register-card-glow" />

                        <div className="register-card-header">

                            <div>

                                <span className="register-card-label">
                                    GET STARTED
                                </span>

                                <h2>
                                    Join PackUP.
                                </h2>

                            </div>

                            <div className="register-card-icon">

                                <Navigation
                                    size={20}
                                />

                            </div>

                        </div>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="register-form"
                        >

                            {/* NAME */}

                            <div className="register-field">

                                <label htmlFor="name">
                                    Full name
                                </label>

                                <div
                                    className={
                                        errors.name
                                            ? "register-input-wrapper error"
                                            : "register-input-wrapper"
                                    }
                                >

                                    <span className="register-input-icon">
                                        <UserRound size={17} />
                                    </span>

                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="Your full name"
                                        autoComplete="name"
                                        {...register("name", {
                                            required:
                                                "Name is required",
                                            minLength: {
                                                value: 3,
                                                message:
                                                    "Name must be at least 3 characters"
                                            }
                                        })}
                                    />

                                </div>

                                {errors.name && (
                                    <span className="register-error">
                                        {errors.name.message}
                                    </span>
                                )}

                            </div>

                            {/* USERNAME */}

                            <div className="register-field">

                                <label htmlFor="username">
                                    Username
                                </label>

                                <div
                                    className={
                                        errors.username
                                            ? "register-input-wrapper error"
                                            : "register-input-wrapper"
                                    }
                                >

                                    <span className="register-input-icon">
                                        <AtSign size={17} />
                                    </span>

                                    <input
                                        id="username"
                                        type="text"
                                        placeholder="Choose a username"
                                        autoComplete="username"
                                        {...register("username", {
                                            required:
                                                "Username is required",
                                            minLength: {
                                                value: 3,
                                                message:
                                                    "Username must be at least 3 characters"
                                            }
                                        })}
                                    />

                                </div>

                                {errors.username && (
                                    <span className="register-error">
                                        {errors.username.message}
                                    </span>
                                )}

                            </div>

                            {/* EMAIL */}

                            <div className="register-field">

                                <label htmlFor="email">
                                    Email address
                                </label>

                                <div
                                    className={
                                        errors.email
                                            ? "register-input-wrapper error"
                                            : "register-input-wrapper"
                                    }
                                >

                                    <span className="register-input-icon">
                                        <Mail size={17} />
                                    </span>

                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        {...register("email", {
                                            required:
                                                "Email is required",
                                            pattern: {
                                                value:
                                                    /^\S+@\S+\.\S+$/,
                                                message:
                                                    "Enter a valid email"
                                            }
                                        })}
                                    />

                                </div>

                                {errors.email && (
                                    <span className="register-error">
                                        {errors.email.message}
                                    </span>
                                )}

                            </div>

                            {/* PASSWORD */}

                            <div className="register-field">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <div
                                    className={
                                        errors.password
                                            ? "register-input-wrapper error"
                                            : "register-input-wrapper"
                                    }
                                >

                                    <span className="register-input-icon">
                                        <ShieldCheck size={17} />
                                    </span>

                                    <input
                                        id="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Create a strong password"
                                        autoComplete="new-password"
                                        {...register("password", {
                                            required:
                                                "Password is required",
                                            minLength: {
                                                value: 8,
                                                message:
                                                    "Password must be at least 8 characters"
                                            },
                                            validate: {
                                                uppercase: value =>
                                                    /[A-Z]/.test(value) ||
                                                    "Password must contain at least one uppercase letter",

                                                lowercase: value =>
                                                    /[a-z]/.test(value) ||
                                                    "Password must contain at least one lowercase letter",

                                                number: value =>
                                                    /[0-9]/.test(value) ||
                                                    "Password must contain at least one number"
                                            }
                                        })}
                                    />

                                    <button
                                        type="button"
                                        className="register-password-toggle"
                                        onClick={() =>
                                            setShowPassword(
                                                previous =>
                                                    !previous
                                            )
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >

                                        {showPassword ? (
                                            <EyeOff size={17} />
                                        ) : (
                                            <Eye size={17} />
                                        )}

                                    </button>

                                </div>

                                {/* PASSWORD RULES */}

                                <div className="password-rules">

                                    {passwordRules.map(
                                        (rule) => (
                                            <div
                                                key={rule.label}
                                                className={
                                                    rule.valid
                                                        ? "password-rule valid"
                                                        : "password-rule"
                                                }
                                            >

                                                <span className="rule-icon">

                                                    <Check
                                                        size={10}
                                                    />

                                                </span>

                                                <span>
                                                    {rule.label}
                                                </span>

                                            </div>
                                        )
                                    )}

                                </div>

                                {errors.password && (
                                    <span className="register-error">
                                        {errors.password.message}
                                    </span>
                                )}

                            </div>

                            {/* CONFIRM PASSWORD */}

                            <div className="register-field">

                                <label htmlFor="confirmPassword">
                                    Confirm password
                                </label>

                                <div
                                    className={
                                        errors.confirmPassword
                                            ? "register-input-wrapper error"
                                            : "register-input-wrapper"
                                    }
                                >

                                    <span className="register-input-icon">
                                        <ShieldCheck size={17} />
                                    </span>

                                    <input
                                        id="confirmPassword"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Confirm your password"
                                        autoComplete="new-password"
                                        {...register(
                                            "confirmPassword",
                                            {
                                                required:
                                                    "Confirm your password",
                                                validate: value =>
                                                    value === password ||
                                                    "Passwords do not match"
                                            }
                                        )}
                                    />

                                    <button
                                        type="button"
                                        className="register-password-toggle"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                previous =>
                                                    !previous
                                            )
                                        }
                                        aria-label={
                                            showConfirmPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >

                                        {showConfirmPassword ? (
                                            <EyeOff size={17} />
                                        ) : (
                                            <Eye size={17} />
                                        )}

                                    </button>

                                </div>

                                {errors.confirmPassword && (
                                    <span className="register-error">
                                        {
                                            errors
                                                .confirmPassword
                                                .message
                                        }
                                    </span>
                                )}

                            </div>

                            {/* SUBMIT */}

                            <button
                                type="submit"
                                className={
                                    loading
                                        ? "register-submit loading"
                                        : "register-submit"
                                }
                                disabled={loading}
                            >

                                {loading ? (
                                    <>
                                        <span className="register-spinner" />
                                        Creating your account...
                                    </>
                                ) : (
                                    <>
                                        <span>
                                            Create Account
                                        </span>

                                        <ArrowRight
                                            size={18}
                                        />
                                    </>
                                )}

                            </button>

                        </form>

                        {/* LOGIN */}

                        <div className="register-login">

                            <span>
                                Already have an account?
                            </span>

                            <Link to="/login">

                                Sign in

                                <ArrowRight
                                    size={14}
                                />

                            </Link>

                        </div>

                    </div>

                    {/* FOOTER NOTE */}

                    <div className="register-footer-note">

                        <span>

                            <Sparkles size={13} />

                            Your next adventure starts here.

                        </span>

                    </div>

                </div>

            </main>

        </div>
    );
};

export default Register;