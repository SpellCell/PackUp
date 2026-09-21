import { motion } from "framer-motion";
import {
    ArrowLeft,
    Briefcase,
    CalendarDays,
    ChevronRight,
    LogOut,
    Mail,
    Plane,
    Settings,
    ShieldCheck,
    User,
    Bell,
    Compass,
    MapPin
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import AppLayout from "../../components/layout/AppLayout";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
    const navigate = useNavigate();

    const { user, logout } = useAuth();

    const profileImage =
        user?.profileImage ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user?.name || "Traveler"
        )}&background=635bff&color=fff&bold=true`;

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <AppLayout>

            <div className="relative mx-auto w-full max-w-[1500px] overflow-hidden pb-12">

                {/* Background travel elements */}

                <div className="pointer-events-none absolute inset-0 overflow-hidden">

                    <motion.div
                        animate={{
                            x: [0, 18, 0],
                            y: [0, -10, 0],
                            rotate: [-5, 2, -5]
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute right-[5%] top-[5%] text-pink-300/[0.04]"
                    >
                        <Plane
                            size={120}
                            strokeWidth={1}
                        />
                    </motion.div>

                    <motion.div
                        animate={{
                            rotate: [0, 360]
                        }}
                        transition={{
                            duration: 45,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute left-[2%] top-[45%] text-indigo-300/[0.035]"
                    >
                        <Compass
                            size={120}
                            strokeWidth={1}
                        />
                    </motion.div>

                    <MapPin
                        size={18}
                        className="absolute right-[28%] top-[27%] text-pink-300/[0.07]"
                    />

                    <CalendarDays
                        size={18}
                        className="absolute left-[25%] bottom-[15%] text-indigo-300/[0.06]"
                    />

                </div>

                <div className="relative z-10">

                    {/* Header */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 12
                        }}
                        animate={{
                            opacity: 1,
                            y: 0
                        }}
                        transition={{
                            duration: 0.4
                        }}
                        className="mb-8"
                    >

                        <button
                            onClick={() => navigate("/dashboard")}
                            className="mb-5 inline-flex items-center gap-2 text-xs font-medium text-zinc-500 transition hover:text-white"
                        >
                            <ArrowLeft size={14} />
                            Back to dashboard
                        </button>

                        <div>

                            <div className="mb-1.5 flex items-center gap-2">
                                <span className="h-px w-5 bg-pink-500" />

                                <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-pink-300">
                                    Your Account
                                </span>
                            </div>

                            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                                Profile
                            </h1>

                            <p className="mt-1.5 text-xs text-zinc-600 sm:text-sm">
                                Your identity inside PackUP.
                            </p>

                        </div>

                    </motion.div>

                    {/* Main grid */}

                    <div className="grid gap-4 lg:grid-cols-[280px_1fr]">

                        {/* Profile identity card */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 12
                            }}
                            animate={{
                                opacity: 1,
                                y: 0
                            }}
                            transition={{
                                duration: 0.4,
                                delay: 0.05
                            }}
                            whileHover={{
                                y: -3
                            }}
                            className="
                                group
                                relative
                                h-[280px]
                                overflow-hidden
                                rounded-[22px]
                                border
                                border-white/[0.07]
                                bg-[#111116]
                                p-6
                                transition-all
                                duration-300
                                hover:border-white/[0.14]
                            "
                        >

                            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-pink-500/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                            <div className="relative flex h-full flex-col items-center text-center">

                                <div className="relative">

                                    <img
                                        src={profileImage}
                                        alt="Profile"
                                        className="h-20 w-20 rounded-[20px] border border-pink-400/30 object-cover"
                                    />

                                    <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#111116] bg-emerald-400">
                                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                    </span>

                                </div>

                                <h2 className="mt-4 max-w-full truncate text-lg font-bold text-white">
                                    {user?.name || "Traveler"}
                                </h2>

                                <p className="mt-0.5 max-w-full truncate text-xs text-zinc-600">
                                    @{user?.username || "traveler"}
                                </p>

                                <div className="mt-auto flex items-center gap-2 rounded-xl bg-pink-500/10 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.12em] text-pink-300">
                                    <ShieldCheck size={13} />
                                    {user?.role || "Traveler"}
                                </div>

                            </div>

                        </motion.div>

                        {/* Information cards */}

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 12
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0
                                }}
                                transition={{
                                    duration: 0.4,
                                    delay: 0.1
                                }}
                                whileHover={{
                                    y: -3
                                }}
                                className="
                                    group
                                    relative
                                    h-[132px]
                                    overflow-hidden
                                    rounded-[20px]
                                    border
                                    border-white/[0.07]
                                    bg-[#111116]
                                    p-5
                                    transition-all
                                    duration-300
                                    hover:border-white/[0.14]
                                "
                            >

                                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-indigo-500/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
                                    <User size={19} />
                                </div>

                                <div className="absolute bottom-5 left-5 right-5">
                                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-zinc-600">
                                        Full Name
                                    </p>

                                    <p className="mt-1 truncate text-sm font-semibold text-white">
                                        {user?.name || "Not provided"}
                                    </p>
                                </div>

                            </motion.div>

                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 12
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0
                                }}
                                transition={{
                                    duration: 0.4,
                                    delay: 0.15
                                }}
                                whileHover={{
                                    y: -3
                                }}
                                className="
                                    group
                                    relative
                                    h-[132px]
                                    overflow-hidden
                                    rounded-[20px]
                                    border
                                    border-white/[0.07]
                                    bg-[#111116]
                                    p-5
                                    transition-all
                                    duration-300
                                    hover:border-white/[0.14]
                                "
                            >

                                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-500/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300">
                                    <Mail size={19} />
                                </div>

                                <div className="absolute bottom-5 left-5 right-5">
                                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-zinc-600">
                                        Email
                                    </p>

                                    <p className="mt-1 truncate text-sm font-semibold text-white">
                                        {user?.email || "Not provided"}
                                    </p>
                                </div>

                            </motion.div>

                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 12
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0
                                }}
                                transition={{
                                    duration: 0.4,
                                    delay: 0.2
                                }}
                                whileHover={{
                                    y: -3
                                }}
                                className="
                                    group
                                    relative
                                    h-[132px]
                                    overflow-hidden
                                    rounded-[20px]
                                    border
                                    border-white/[0.07]
                                    bg-[#111116]
                                    p-5
                                    transition-all
                                    duration-300
                                    hover:border-white/[0.14]
                                "
                            >

                                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-500/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
                                    <Briefcase size={19} />
                                </div>

                                <div className="absolute bottom-5 left-5 right-5">
                                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-zinc-600">
                                        Account
                                    </p>

                                    <p className="mt-1 truncate text-sm font-semibold text-white">
                                        Active
                                    </p>
                                </div>

                            </motion.div>

                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 12
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0
                                }}
                                transition={{
                                    duration: 0.4,
                                    delay: 0.25
                                }}
                                whileHover={{
                                    y: -3
                                }}
                                className="
                                    group
                                    relative
                                    h-[132px]
                                    overflow-hidden
                                    rounded-[20px]
                                    border
                                    border-white/[0.07]
                                    bg-[#111116]
                                    p-5
                                    transition-all
                                    duration-300
                                    hover:border-white/[0.14]
                                "
                            >

                                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-500/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-300">
                                    <ShieldCheck size={19} />
                                </div>

                                <div className="absolute bottom-5 left-5 right-5">
                                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-zinc-600">
                                        Security
                                    </p>

                                    <p className="mt-1 truncate text-sm font-semibold text-white">
                                        Protected
                                    </p>
                                </div>

                            </motion.div>

                        </div>

                    </div>

                    {/* Quick links */}

                    <section className="mt-8">

                        <div className="mb-4">

                            <div className="mb-1.5 flex items-center gap-2">
                                <span className="h-px w-5 bg-indigo-500" />

                                <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-indigo-400">
                                    Shortcuts
                                </span>
                            </div>

                            <h2 className="text-xl font-bold tracking-tight text-white">
                                Account Actions
                            </h2>

                        </div>

                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">

                            <ProfileAction
                                icon={Briefcase}
                                title="My Trips"
                                subtitle="Your journeys"
                                color="text-indigo-300"
                                bg="bg-indigo-500/10"
                                onClick={() => navigate("/my-trips")}
                            />

                            <ProfileAction
                                icon={Bell}
                                title="Notifications"
                                subtitle="Your updates"
                                color="text-cyan-300"
                                bg="bg-cyan-500/10"
                                onClick={() => navigate("/notifications")}
                            />

                            <ProfileAction
                                icon={Settings}
                                title="Settings"
                                subtitle="Preferences"
                                color="text-pink-300"
                                bg="bg-pink-500/10"
                                onClick={() => navigate("/settings")}
                            />

                            <ProfileAction
                                icon={Compass}
                                title="Explore"
                                subtitle="Find adventures"
                                color="text-emerald-300"
                                bg="bg-emerald-500/10"
                                onClick={() => navigate("/explore")}
                            />

                        </div>

                    </section>

                    {/* Logout */}

                    <motion.button
                        whileHover={{
                            y: -2
                        }}
                        whileTap={{
                            scale: 0.98
                        }}
                        onClick={handleLogout}
                        className="
                            mt-5
                            flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-[18px]
                            border
                            border-red-500/10
                            bg-red-500/[0.035]
                            px-4
                            py-3
                            text-xs
                            font-semibold
                            text-red-400
                            transition
                            hover:border-red-500/20
                            hover:bg-red-500/[0.07]
                        "
                    >
                        <LogOut size={15} />
                        Sign out of PackUP
                    </motion.button>

                </div>

            </div>

        </AppLayout>
    );
};

const ProfileAction = ({
    icon: Icon,
    title,
    subtitle,
    color,
    bg,
    onClick
}) => {
    return (
        <motion.button
            whileHover={{
                y: -3
            }}
            whileTap={{
                scale: 0.98
            }}
            onClick={onClick}
            className="
                group
                relative
                h-[105px]
                overflow-hidden
                rounded-[20px]
                border
                border-white/[0.07]
                bg-[#111116]
                p-4
                text-left
                transition-all
                duration-300
                hover:border-white/[0.14]
                hover:bg-[#14141a]
            "
        >

            <div className="pointer-events-none absolute -right-7 -top-7 h-20 w-20 rounded-full bg-indigo-500/[0.06] blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className={`relative flex h-9 w-9 items-center justify-center rounded-xl ${bg}`}>
                <Icon
                    size={18}
                    className={color}
                />
            </div>

            <div className="absolute bottom-4 left-4 right-4">
                <p className="truncate text-xs font-bold text-white">
                    {title}
                </p>

                <p className="mt-0.5 truncate text-[9px] text-zinc-600">
                    {subtitle}
                </p>
            </div>

            <ChevronRight
                size={13}
                className="absolute right-4 top-4 text-zinc-700 transition group-hover:translate-x-0.5 group-hover:text-zinc-400"
            />

        </motion.button>
    );
};

export default Profile;