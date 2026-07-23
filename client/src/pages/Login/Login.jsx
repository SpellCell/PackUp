import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaEnvelope, FaLock } from "react-icons/fa";

import GlassCard from "../../components/ui/GlassCard";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

const Login = () => {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [loading, setLoading] = useState(false);

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

        <div className="relative min-h-screen bg-[#09090B] flex items-center justify-center p-6">

            <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-600/20 blur-[150px]" />

            <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-cyan-500/20 blur-[150px]" />

            <GlassCard className="w-full max-w-md relative z-10">

                <h1 className="text-4xl font-bold text-white">

                    Welcome Back

                </h1>

                <p className="text-zinc-400 mt-2">

                    Continue your next adventure.

                </p>

                <form

                    onSubmit={handleSubmit(onSubmit)}

                    className="space-y-6 mt-8"

                >

                    <Input

                        label="Email"

                        icon={<FaEnvelope />}

                        placeholder="Enter your email"

                        error={errors.email?.message}

                        {...register("email", {

                            required: "Email is required"

                        })}

                    />

                    <Input

                        label="Password"

                        type="password"

                        icon={<FaLock />}

                        placeholder="Enter password"

                        error={errors.password?.message}

                        {...register("password", {

                            required: "Password is required"

                        })}

                    />

                    <Button

                        loading={loading}

                        className="w-full"

                        type="submit"

                    >

                        Login

                    </Button>

                </form>

                <div className="mt-8 text-center">

                    <Link

                        className="text-indigo-400"

                        to="/register"

                    >

                        Create an account

                    </Link>

                </div>

            </GlassCard>

        </div>

    );

};

export default Login;