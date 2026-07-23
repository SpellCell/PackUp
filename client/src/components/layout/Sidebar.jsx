import { motion } from "framer-motion";
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
    Plane
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

const Sidebar = () => {

    const { user, logout } = useAuth();

    return (

        <aside className="hidden lg:flex w-64 h-screen shrink-0 bg-[#0B0B0F] border-r border-zinc-800 flex-col">

            {/* Logo */}

            <div className="px-7 pt-8 pb-7 border-b border-zinc-800">

                <div className="flex items-center gap-3">

                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg">

                        <Plane size={22} className="rotate-45 text-white" />

                    </div>

                    <div>

                        <h1 className="text-3xl font-black tracking-tight">

                            Pack<span className="text-indigo-500">UP</span>

                        </h1>

                        <p className="text-xs text-zinc-500">

                            Travel Together

                        </p>

                    </div>

                </div>

            </div>

            {/* Navigation */}

            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">

                {menu.map((item) => {

                    const Icon = item.icon;

                    return (

                        <NavLink
                            key={item.path}
                            to={item.path}
                        >

                            {({ isActive }) => (

                                <motion.div

                                    whileHover={{
                                        x: 5
                                    }}

                                    transition={{
                                        duration: 0.2
                                    }}

                                    className={`

                                        flex
                                        items-center
                                        gap-4
                                        px-4
                                        py-3
                                        rounded-2xl
                                        transition-all

                                        ${isActive
                                            ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                                            : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                                        }

                                    `}

                                >

                                    <Icon size={20} />

                                    <span className="font-medium">

                                        {item.name}

                                    </span>

                                </motion.div>

                            )}

                        </NavLink>

                    );

                })}

            </nav>

            {/* User */}

            <div className="border-t border-zinc-800 p-5">

                <div className="flex items-center gap-3">

                    <img

                        src={
                            user?.profileImage ||
                            `https://ui-avatars.com/api/?name=${user?.name}&background=6366f1&color=fff`
                        }

                        alt="Profile"

                        className="w-12 h-12 rounded-full border-2 border-indigo-500"

                    />

                    <div className="flex-1 min-w-0">

                        <p className="font-semibold truncate">

                            {user?.name}

                        </p>

                        <p className="text-sm text-zinc-500 truncate">

                            {user?.email}

                        </p>

                    </div>

                </div>

                <button

                    onClick={logout}

                    className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 py-3 text-red-400 hover:bg-red-500/20 transition"

                >

                    <LogOut size={18} />

                    Logout

                </button>

            </div>

        </aside>

    );

};

export default Sidebar;