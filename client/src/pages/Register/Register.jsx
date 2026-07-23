import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaAt
} from "react-icons/fa";

import GlassCard from "../../components/ui/GlassCard";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

import { registerUser } from "../../api/authApi";

const Register = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();

    const password = watch("password");

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

    return (

        <div className="relative min-h-screen bg-[#09090B] flex items-center justify-center p-6">

            <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-600/20 blur-[150px]" />

            <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-cyan-500/20 blur-[150px]" />

            <GlassCard className="w-full max-w-lg relative z-10">

                <h1 className="text-4xl font-bold text-white">

                    Create Account

                </h1>

                <p className="text-zinc-400 mt-2">

                    Start your next adventure today.

                </p>

                <form

                    onSubmit={handleSubmit(onSubmit)}

                    className="space-y-5 mt-8"

                >

                    <Input
                        label="Name"
                        icon={<FaUser />}
                        placeholder="Full Name"
                        error={errors.name?.message}
                        {...register("name", {
                            required: "Name is required",
                            minLength: {
                                value: 3,
                                message: "Name must be at least 3 characters"
                            }
                        })}
                    />

                    <Input
                        label="Username"
                        icon={<FaAt />}
                        placeholder="Username"
                        error={errors.username?.message}
                        {...register("username", {
                            required: "Username is required",
                            minLength: {
                                value: 3,
                                message: "Username must be at least 3 characters"
                            }
                        })}
                    />

                    <Input
                        label="Email"
                        icon={<FaEnvelope />}
                        placeholder="Email"
                        error={errors.email?.message}
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^\S+@\S+\.\S+$/,
                                message: "Enter a valid email"
                            }
                        })}
                    />

                    <Input
                        type="password"
                        label="Password"
                        icon={<FaLock />}
                        placeholder="Password"
                        error={errors.password?.message}
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters"
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

                    <div className="text-xs text-zinc-400 leading-6 -mt-2">

                        Password must contain:

                        <ul className="list-disc ml-5 mt-2">

                            <li>Minimum 8 characters</li>

                            <li>At least one uppercase letter (A-Z)</li>

                            <li>At least one lowercase letter (a-z)</li>

                            <li>At least one number (0-9)</li>

                        </ul>

                    </div>

                    <Input
                        type="password"
                        label="Confirm Password"
                        icon={<FaLock />}
                        placeholder="Confirm Password"
                        error={errors.confirmPassword?.message}
                        {...register("confirmPassword", {
                            required: "Confirm your password",
                            validate: value =>
                                value === password ||
                                "Passwords do not match"
                        })}
                    />

                    <Button
                        loading={loading}
                        className="w-full"
                        type="submit"
                    >
                        Create Account
                    </Button>

                </form>

                <div className="mt-8 text-center">

                    <span className="text-zinc-500">

                        Already have an account?

                    </span>

                    <Link
                        to="/login"
                        className="ml-2 text-indigo-400 hover:text-indigo-300"
                    >
                        Login
                    </Link>

                </div>

            </GlassCard>

        </div>

    );

};

export default Register;