import { motion } from "framer-motion";
import {
    Plus,
    Compass,
    Sparkles,
    MapPinned,
    Plane,
    ArrowUpRight
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const DashboardHeader = ({ user }) => {
    const navigate = useNavigate();

    const hour = new Date().getHours();

    let greeting = "Good Evening";

    if (hour < 12) {
        greeting = "Good Morning";
    } else if (hour < 18) {
        greeting = "Good Afternoon";
    }

    return (
        <motion.section
            initial={{
                opacity: 0,
                y: 15
            }}
            animate={{
                opacity: 1,
                y: 0
            }}
            transition={{
                duration: 0.5
            }}
            className="relative min-h-[285px] overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#101016]"
        >

            {/* Ambient glows */}

            <div className="pointer-events-none absolute -right-24 -top-32 h-[360px] w-[360px] rounded-full bg-indigo-600/[0.12] blur-[90px]" />

            <div className="pointer-events-none absolute -bottom-32 left-[20%] h-[250px] w-[250px] rounded-full bg-cyan-500/[0.045] blur-[80px]" />

            {/* Route */}

            <svg
                className="pointer-events-none absolute right-0 top-0 h-full w-[48%] opacity-[0.14]"
                viewBox="0 0 500 285"
                fill="none"
            >
                <path
                    d="M40 220 C120 160 150 250 225 175 C295 105 340 150 455 55"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeDasharray="5 8"
                    className="text-indigo-300"
                />

                <circle
                    cx="40"
                    cy="220"
                    r="4"
                    className="fill-indigo-300"
                />

                <circle
                    cx="455"
                    cy="55"
                    r="4"
                    className="fill-cyan-300"
                />
            </svg>

            {/* Floating plane */}

            <motion.div
                animate={{
                    x: [0, 12, 0],
                    y: [0, -7, 0],
                    rotate: [-7, -2, -7]
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="pointer-events-none absolute right-[16%] top-[18%] text-indigo-300/[0.18]"
            >
                <Plane
                    size={50}
                    strokeWidth={1.2}
                />
            </motion.div>

            {/* Content */}

            <div className="relative z-10 flex min-h-[285px] flex-col justify-between p-6 sm:p-8 lg:p-9">

                <div>

                    <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/15 bg-indigo-500/[0.07] px-3 py-1.5">

                        <Sparkles
                            size={12}
                            className="text-indigo-300"
                        />

                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-300">
                            {greeting}
                        </span>

                    </div>

                    <h1 className="mt-5 text-4xl font-black tracking-[-0.045em] text-white sm:text-5xl">
                        Welcome back,
                    </h1>

                    <h2 className="mt-0.5 text-4xl font-black tracking-[-0.045em] text-indigo-400 sm:text-5xl">
                        {user?.name || "Traveler"}.
                    </h2>

                    <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-500">
                        Plan the next escape, bring your people together,
                        and keep every part of the journey in one place.
                    </p>

                </div>

                <div className="mt-6 flex flex-wrap gap-2.5">

                    <motion.button
                        whileHover={{
                            y: -2
                        }}
                        whileTap={{
                            scale: 0.98
                        }}
                        onClick={() => navigate("/create-trip")}
                        className="group flex h-10 items-center gap-2 rounded-xl bg-indigo-500 px-4 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400"
                    >
                        <Plus size={15} />

                        Create Trip

                        <ArrowUpRight
                            size={14}
                            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                    </motion.button>

                    <motion.button
                        whileHover={{
                            y: -2
                        }}
                        whileTap={{
                            scale: 0.98
                        }}
                        onClick={() => navigate("/explore")}
                        className="flex h-10 items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.03] px-4 text-xs font-bold text-zinc-200 transition hover:border-white/[0.16] hover:bg-white/[0.06]"
                    >
                        <Compass
                            size={15}
                            className="text-cyan-400"
                        />

                        Explore Trips
                    </motion.button>

                </div>

            </div>

            {/* Destination marker */}

            <motion.div
                animate={{
                    y: [0, -6, 0]
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute bottom-8 right-8 hidden h-24 w-24 items-center justify-center rounded-full border border-indigo-400/10 bg-indigo-500/[0.025] lg:flex"
            >
                <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full border border-indigo-400/10">
                    <MapPinned
                        size={31}
                        strokeWidth={1.3}
                        className="text-indigo-300/60"
                    />
                </div>
            </motion.div>

        </motion.section>
    );
};

export default DashboardHeader;