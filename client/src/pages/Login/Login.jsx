import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
    ArrowRight,
    Bike,
    Compass,
    Eye,
    EyeOff,
    Map,
    Mountain,
    Navigation,
    Plane,
    Sparkles
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import "./Login.css";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = async (values) => {
        try {
            setLoading(true);

            await login(values);

            toast.success("Welcome Back ✈️");

            navigate("/dashboard");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Login Failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="login-background">

                <div className="login-glow login-glow-one" />
                <div className="login-glow login-glow-two" />
                <div className="login-glow login-glow-three" />

                <div className="login-grid" />

                <div className="login-stars">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                </div>

                <div className="login-mountains">
                    <div className="mountain mountain-one" />
                    <div className="mountain mountain-two" />
                    <div className="mountain mountain-three" />
                </div>

            </div>

            <div className="travel-doodles">

                <div className="travel-doodle doodle-compass">
                    <Compass
                        size={42}
                        strokeWidth={1.3}
                    />
                </div>

                <div className="travel-doodle doodle-plane">
                    <Plane
                        size={34}
                        strokeWidth={1.4}
                    />
                </div>

                <div className="travel-doodle doodle-mountain">
                    <Mountain
                        size={48}
                        strokeWidth={1.2}
                    />
                </div>

                <div className="travel-doodle doodle-map">
                    <Map
                        size={40}
                        strokeWidth={1.3}
                    />
                </div>

                <div className="travel-doodle doodle-navigation">
                    <Navigation
                        size={32}
                        strokeWidth={1.3}
                    />
                </div>

                <div className="travel-doodle doodle-sparkle">
                    <Sparkles
                        size={27}
                        strokeWidth={1.3}
                    />
                </div>

                <div className="cyclist-route">

                    <div className="route-line" />

                    <div className="cyclist">
                        <Bike
                            size={44}
                            strokeWidth={1.35}
                        />
                    </div>

                </div>

                <div className="travel-sticker sticker-adventure">
                    <span>GO</span>
                    <small>EXPLORE</small>
                </div>

            </div>

            <Link
                to="/"
                className="login-brand"
            >
                <span className="login-brand-mark">
                    P
                </span>

                <span className="login-brand-name">
                    PackUP
                </span>
            </Link>

            <main className="login-main">

                <div className="login-content">

                    <div className="login-intro">

                        <span className="login-eyebrow">
                            <span className="eyebrow-dot" />
                            YOUR JOURNEY CONTINUES
                        </span>

                        <h1>
                            Welcome
                            <span>back.</span>
                        </h1>

                        <p>
                            Pick up where you left off
                            and continue your next adventure.
                        </p>

                    </div>

                    <div className="login-card">

                        <div className="login-card-glow" />

                        <div className="login-card-top">

                            <div>

                                <span className="login-card-label">
                                    SIGN IN
                                </span>

                                <h2>
                                    Let's get moving.
                                </h2>

                            </div>

                            <div className="login-card-icon">

                                <Navigation
                                    size={20}
                                />

                            </div>

                        </div>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="login-form"
                        >

                            <div className="login-field">

                                <label htmlFor="email">
                                    Email address
                                </label>

                                <div
                                    className={
                                        errors.email
                                            ? "login-input-wrapper error"
                                            : "login-input-wrapper"
                                    }
                                >

                                    <span className="login-input-icon">

                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >

                                            <path
                                                d="M4 6H20C21.1 6 22 6.9 22 8V16C22 17.1 21.1 18 20 18H4C2.9 18 2 17.1 2 16V8C2 6.9 2.9 6 4 6Z"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                            />

                                            <path
                                                d="M22 8L12 13L2 8"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                            />

                                        </svg>

                                    </span>

                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        {...register("email", {
                                            required:
                                                "Email is required"
                                        })}
                                    />

                                </div>

                                {errors.email && (
                                    <span className="login-error">
                                        {errors.email.message}
                                    </span>
                                )}

                            </div>

                            <div className="login-field">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <div
                                    className={
                                        errors.password
                                            ? "login-input-wrapper error"
                                            : "login-input-wrapper"
                                    }
                                >

                                    <span className="login-input-icon">

                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >

                                            <rect
                                                x="5"
                                                y="10"
                                                width="14"
                                                height="10"
                                                rx="2"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                            />

                                            <path
                                                d="M8 10V7C8 4.79 9.79 3 12 3C14.21 3 16 4.79 16 7V10"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                            />

                                        </svg>

                                    </span>

                                    <input
                                        id="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        {...register("password", {
                                            required:
                                                "Password is required"
                                        })}
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
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
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}

                                    </button>

                                </div>

                                {errors.password && (
                                    <span className="login-error">
                                        {errors.password.message}
                                    </span>
                                )}

                            </div>

                            <button
                                type="submit"
                                className={
                                    loading
                                        ? "login-submit loading"
                                        : "login-submit"
                                }
                                disabled={loading}
                            >

                                {loading ? (
                                    <>
                                        <span className="login-spinner" />
                                        Signing you in...
                                    </>
                                ) : (
                                    <>
                                        <span>
                                            Start Exploring
                                        </span>

                                        <ArrowRight
                                            size={18}
                                        />
                                    </>
                                )}

                            </button>

                        </form>

                        <div className="login-register">

                            <span>
                                New to PackUP?
                            </span>

                            <Link to="/register">

                                Create an account

                                <ArrowRight
                                    size={14}
                                />

                            </Link>

                        </div>

                    </div>

                    <div className="login-footer-note">

                        <span>
                            <Sparkles size={13} />
                            Built for people who'd rather be somewhere else.
                        </span>

                    </div>

                </div>

            </main>

        </div>
    );
};

export default Login;