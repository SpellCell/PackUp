import { motion } from "framer-motion";
import {
    Search,
    Bell,
    ChevronDown,
    Menu,
    Settings
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/socketContext";

const Topbar = ({ onMenuClick }) => {
    const { user } = useAuth();

    const {
        notifications,
        connected
    } = useSocket();

    const navigate = useNavigate();

    const unreadCount = notifications.length;

    const profileImage =
        user?.profileImage ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user?.name || "Traveler"
        )}&background=635bff&color=fff&bold=true`;

    return (
        <header className="sticky top-0 z-40 h-[68px] border-b border-white/[0.06] bg-[#09090B]/85 backdrop-blur-xl">

            <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

                <div className="flex min-w-0 items-center gap-3">

                    <motion.button
                        whileTap={{
                            scale: 0.94
                        }}
                        onClick={onMenuClick}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-400 transition hover:border-indigo-400/30 hover:bg-white/[0.06] hover:text-white"
                        aria-label="Open navigation"
                    >
                        <Menu size={19} />
                    </motion.button>

                    <div className="hidden h-7 w-px bg-white/[0.07] md:block" />

                    <div className="hidden w-[320px] items-center rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 py-2.5 transition focus-within:border-indigo-500/40 md:flex lg:w-[390px]">

                        <Search
                            size={16}
                            className="shrink-0 text-zinc-600"
                        />

                        <input
                            type="text"
                            placeholder="Search trips, cities, travelers..."
                            className="ml-2.5 min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-zinc-600"
                        />

                        <span className="hidden rounded-md border border-white/[0.06] px-1.5 py-0.5 text-[9px] text-zinc-700 lg:block">
                            /
                        </span>

                    </div>

                </div>

                <div className="flex shrink-0 items-center gap-2">

                    <button
                        onClick={() => navigate("/notifications")}
                        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-zinc-400 transition hover:border-indigo-400/30 hover:bg-white/[0.06] hover:text-white"
                    >
                        <Bell size={18} />

                        {unreadCount > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-[#09090B] bg-red-500 px-1 text-[8px] font-bold text-white">
                                {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                        )}
                    </button>

                    <div
                        title={
                            connected
                                ? "Real-time notifications connected"
                                : "Real-time notifications disconnected"
                        }
                        className={`hidden h-1.5 w-1.5 rounded-full sm:block ${
                            connected
                                ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]"
                                : "bg-zinc-700"
                        }`}
                    />

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="hidden h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-zinc-400 transition hover:border-indigo-400/30 hover:bg-white/[0.06] hover:text-white sm:flex"
                        title="Dashboard"
                    >
                        <Settings size={17} />
                    </button>

                    <motion.button
                        whileHover={{
                            y: -1
                        }}
                        onClick={() => navigate("/dashboard")}
                        className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.025] px-2 py-1.5 transition hover:border-white/[0.13] hover:bg-white/[0.05]"
                    >

                        <img
                            src={profileImage}
                            alt="Profile"
                            className="h-8 w-8 rounded-full border border-indigo-400/50"
                        />

                        <div className="hidden text-left md:block">

                            <p className="max-w-[100px] truncate text-xs font-semibold text-white">
                                {user?.name || "Traveler"}
                            </p>

                            <p className="mt-0.5 max-w-[100px] truncate text-[10px] text-zinc-600">
                                @{user?.username || "traveler"}
                            </p>

                        </div>

                        <ChevronDown
                            size={15}
                            className="hidden text-zinc-600 md:block"
                        />

                    </motion.button>

                </div>

            </div>

        </header>
    );
};

export default Topbar;