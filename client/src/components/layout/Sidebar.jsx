import { AnimatePresence, motion } from "framer-motion";
import {
    LayoutDashboard,
    Compass,
    PlusCircle,
    Briefcase,
    MessageCircle,
    Wallet,
    Bell,
    User,
    Settings,
    LogOut,
    Plane,
    UserPlus,
    X
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const menu = [
    {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard"
    },
    {
        name: "Explore Trips",
        icon: Compass,
        path: "/explore"
    },
    {
        name: "Create Trip",
        icon: PlusCircle,
        path: "/create-trip"
    },
    {
        name: "My Trips",
        icon: Briefcase,
        path: "/my-trips"
    },
    {
        name: "Join Requests",
        icon: UserPlus,
        path: "/join-requests"
    },
    {
        name: "Chats",
        icon: MessageCircle,
        path: "/chat"
    },
    {
        name: "Expenses",
        icon: Wallet,
        path: "/expenses"
    },
    {
        name: "Notifications",
        icon: Bell,
        path: "/notifications"
    },
    {
        name: "Profile",
        icon: User,
        path: "/profile"
    },
    {
        name: "Settings",
        icon: Settings,
        path: "/settings"
    }
];

const Sidebar = ({ open, onClose }) => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        onClose();
        logout();
    };

    const profileImage =
        user?.profileImage ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user?.name || "Traveler"
        )}&background=635bff&color=fff&bold=true`;

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-[3px]"
                    />

                    <motion.aside
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30
                        }}
                        className="fixed left-0 top-0 bottom-0 z-[100] flex w-[280px] max-w-[86vw] flex-col overflow-hidden border-r border-white/[0.08] bg-[#0B0B10] shadow-[20px_0_70px_rgba(0,0,0,0.45)]"
                    >
                        <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-5">

                            <NavLink
                                to="/dashboard"
                                onClick={onClose}
                                className="flex items-center gap-3"
                            >
                                <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-gradient-to-br from-indigo-600 to-cyan-500 shadow-lg shadow-indigo-600/20">
                                    <Plane
                                        size={21}
                                        className="rotate-45 text-white"
                                    />
                                </div>

                                <div>
                                    <h1 className="text-[25px] font-black tracking-tight leading-none">
                                        Pack<span className="text-indigo-400">UP</span>
                                    </h1>

                                    <p className="mt-1 text-[10px] font-medium tracking-[0.18em] text-zinc-500 uppercase">
                                        Travel Together
                                    </p>
                                </div>
                            </NavLink>

                            <button
                                onClick={onClose}
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-zinc-500 transition hover:border-white/[0.12] hover:bg-white/[0.07] hover:text-white"
                            >
                                <X size={17} />
                            </button>

                        </div>

                        <div className="px-3 pt-5 pb-3">
                            <p className="px-3 pb-3 text-[9px] font-bold uppercase tracking-[0.22em] text-zinc-600">
                                Workspace
                            </p>
                        </div>

                        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-5">

                            {menu.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={onClose}
                                        className="block"
                                    >
                                        {({ isActive }) => {
                                            const containerClass = isActive
                                                ? "group relative flex items-center gap-3 rounded-xl px-3.5 py-3 transition-all bg-indigo-500/10 text-white"
                                                : "group relative flex items-center gap-3 rounded-xl px-3.5 py-3 transition-all text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200";

                                            const iconClass = isActive
                                                ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition bg-indigo-500/15 text-indigo-300"
                                                : "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition bg-transparent text-zinc-500";

                                            return (
                                                <motion.div
                                                    whileHover={{ x: 3 }}
                                                    transition={{ duration: 0.15 }}
                                                    className={containerClass}
                                                >

                                                    {isActive && (
                                                        <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.7)]" />
                                                    )}

                                                    <span className={iconClass}>
                                                        <Icon size={18} />
                                                    </span>

                                                    <span className="text-[13px] font-medium">
                                                        {item.name}
                                                    </span>

                                                </motion.div>
                                            );
                                        }}
                                    </NavLink>
                                );
                            })}

                        </nav>

                        <div className="border-t border-white/[0.07] p-4">

                            <NavLink
                                to="/profile"
                                onClick={onClose}
                                className="flex items-center gap-3 rounded-xl p-2.5 transition hover:bg-white/[0.04]"
                            >
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="h-10 w-10 shrink-0 rounded-full border border-indigo-400/50"
                                />

                                <div className="min-w-0 flex-1">

                                    <p className="truncate text-sm font-semibold text-white">
                                        {user?.name || "Traveler"}
                                    </p>

                                    <p className="truncate text-[11px] text-zinc-500">
                                        @{user?.username || "traveler"}
                                    </p>

                                </div>
                            </NavLink>

                            <button
                                onClick={handleLogout}
                                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/10 bg-red-500/[0.06] px-4 py-2.5 text-xs font-semibold text-red-400 transition hover:border-red-500/20 hover:bg-red-500/10"
                            >
                                <LogOut size={15} />
                                Logout
                            </button>

                        </div>

                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
};

export default Sidebar;