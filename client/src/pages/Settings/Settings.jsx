import { motion } from "framer-motion";
import {
    ArrowLeft,
    Bell,
    Briefcase,
    ChevronRight,
    LogOut,
    ShieldCheck,
    User,
    Settings as SettingsIcon,
    Moon,
    MessageCircle,
    UserPlus
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import AppLayout from "../../components/layout/AppLayout";
import { useAuth } from "../../context/AuthContext";

const Settings = () => {
    const navigate = useNavigate();

    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <AppLayout>

            <div className="relative mx-auto w-full max-w-[1500px] overflow-hidden pb-12">

                {/* Background */}

                <div className="pointer-events-none absolute inset-0 overflow-hidden">

                    <motion.div
                        animate={{
                            rotate: [0, 360]
                        }}
                        transition={{
                            duration: 45,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute right-[4%] top-[5%] text-indigo-300/[0.04]"
                    >
                        <SettingsIcon
                            size={125}
                            strokeWidth={1}
                        />
                    </motion.div>

                    <motion.div
                        animate={{
                            x: [0, 15, 0],
                            y: [0, -10, 0]
                        }}
                        transition={{
                            duration: 9,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute left-[3%] bottom-[10%] text-cyan-300/[0.035]"
                    >
                        <Moon
                            size={100}
                            strokeWidth={1}
                        />
                    </motion.div>

                    <Bell
                        size={18}
                        className="absolute left-[27%] top-[20%] text-indigo-300/[0.07]"
                    />

                    <ShieldCheck
                        size={18}
                        className="absolute right-[28%] top-[32%] text-emerald-300/[0.06]"
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
                                <span className="h-px w-5 bg-indigo-500" />

                                <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-indigo-400">
                                    Preferences
                                </span>
                            </div>

                            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                                Settings
                            </h1>

                            <p className="mt-1.5 text-xs text-zinc-600 sm:text-sm">
                                Manage your PackUP experience.
                            </p>

                        </div>

                    </motion.div>

                    {/* Settings cards */}

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                        <SettingCard
                            icon={User}
                            title="Profile"
                            subtitle="Manage your account"
                            color="text-pink-300"
                            bg="bg-pink-500/10"
                            onClick={() => navigate("/profile")}
                        />

                        <SettingCard
                            icon={Bell}
                            title="Notifications"
                            subtitle="View your updates"
                            color="text-indigo-300"
                            bg="bg-indigo-500/10"
                            onClick={() => navigate("/notifications")}
                        />

                        <SettingCard
                            icon={Briefcase}
                            title="My Trips"
                            subtitle="Manage your journeys"
                            color="text-emerald-300"
                            bg="bg-emerald-500/10"
                            onClick={() => navigate("/my-trips")}
                        />

                        <SettingCard
                            icon={MessageCircle}
                            title="Chats"
                            subtitle="Your conversations"
                            color="text-cyan-300"
                            bg="bg-cyan-500/10"
                            onClick={() => navigate("/chat")}
                        />

                        <SettingCard
                            icon={UserPlus}
                            title="Join Requests"
                            subtitle="Manage requests"
                            color="text-amber-300"
                            bg="bg-amber-500/10"
                            onClick={() => navigate("/join-requests")}
                        />

                        <SettingCard
                            icon={ShieldCheck}
                            title="Security"
                            subtitle="Account protection"
                            color="text-violet-300"
                            bg="bg-violet-500/10"
                            status="Protected"
                        />

                    </div>

                    {/* Preferences */}

                    <section className="mt-8">

                        <div className="mb-4">

                            <div className="mb-1.5 flex items-center gap-2">
                                <span className="h-px w-5 bg-cyan-500" />

                                <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-cyan-400">
                                    Preferences
                                </span>
                            </div>

                            <h2 className="text-xl font-bold tracking-tight text-white">
                                App Experience
                            </h2>

                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                            <PreferenceCard
                                icon={Moon}
                                title="Appearance"
                                description="PackUP currently uses dark mode."
                                status="Dark"
                            />

                            <PreferenceCard
                                icon={ShieldCheck}
                                title="Account Protection"
                                description="Your account is protected by authentication."
                                status="Active"
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

const SettingCard = ({
    icon: Icon,
    title,
    subtitle,
    color,
    bg,
    onClick,
    status
}) => {
    return (
        <motion.button
            initial={{
                opacity: 0,
                y: 10
            }}
            animate={{
                opacity: 1,
                y: 0
            }}
            whileHover={{
                y: -4
            }}
            whileTap={{
                scale: 0.98
            }}
            onClick={onClick}
            className="
                group
                relative
                h-[155px]
                overflow-hidden
                rounded-[22px]
                border
                border-white/[0.07]
                bg-[#111116]
                p-5
                text-left
                transition-all
                duration-300
                hover:border-white/[0.14]
            "
        >

            <div className="pointer-events-none absolute -right-9 -top-9 h-24 w-24 rounded-full bg-indigo-500/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className={`absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-xl ${bg}`}>
                <Icon
                    size={20}
                    className={color}
                />
            </div>

            <span className="absolute right-5 top-6 text-[9px] font-medium tracking-[0.15em] text-zinc-700">
                →
            </span>

            <div className="absolute bottom-5 left-5 right-5">

                <p className="text-sm font-bold text-white">
                    {title}
                </p>

                <p className="mt-1 truncate text-[10px] text-zinc-600">
                    {subtitle}
                </p>

                {status && (
                    <span className="mt-2 inline-flex rounded-md bg-emerald-500/10 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-emerald-300">
                        {status}
                    </span>
                )}

            </div>

        </motion.button>
    );
};

const PreferenceCard = ({
    icon: Icon,
    title,
    description,
    status
}) => {
    return (
        <div
            className="
                relative
                h-[120px]
                overflow-hidden
                rounded-[20px]
                border
                border-white/[0.07]
                bg-[#111116]
                p-5
            "
        >

            <div className="flex h-full items-start gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-zinc-400">
                    <Icon size={18} />
                </div>

                <div className="min-w-0 flex-1">

                    <div className="flex items-center justify-between gap-3">

                        <p className="text-sm font-bold text-white">
                            {title}
                        </p>

                        <span className="shrink-0 rounded-md bg-white/[0.04] px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-500">
                            {status}
                        </span>

                    </div>

                    <p className="mt-2 max-w-md text-[10px] leading-5 text-zinc-600">
                        {description}
                    </p>

                </div>

            </div>

        </div>
    );
};

export default Settings;