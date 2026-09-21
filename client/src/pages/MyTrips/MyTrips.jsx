import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Briefcase,
    Compass,
    MapPin,
    Navigation,
    Plane,
    Sparkles,
    Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import AppLayout from "../../components/layout/AppLayout";
import { getMyTrips } from "../../api/tripApi";

import CreatedTrips from "./CreatedTrips";
import JoinedTrips from "./JoinedTrips";
import EmptyState from "./EmptyState";

const MyTrips = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [createdTrips, setCreatedTrips] = useState([]);
    const [joinedTrips, setJoinedTrips] = useState([]);
    const [activeTab, setActiveTab] = useState("created");

    useEffect(() => {
        fetchTrips();
    }, []);

    const fetchTrips = async () => {
        try {
            const { data } = await getMyTrips();

            setCreatedTrips(data.createdTrips || []);
            setJoinedTrips(data.joinedTrips || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const totalTrips = createdTrips.length + joinedTrips.length;

    const activeTrips = useMemo(() => {
        return activeTab === "created"
            ? createdTrips
            : joinedTrips;
    }, [activeTab, createdTrips, joinedTrips]);

    if (loading) {
        return (
            <AppLayout>
                <div className="flex min-h-[65vh] items-center justify-center">
                    <motion.div
                        animate={{
                            opacity: [0.35, 1, 0.35]
                        }}
                        transition={{
                            duration: 1.4,
                            repeat: Infinity
                        }}
                        className="flex items-center gap-3 text-sm text-zinc-500"
                    >
                        <Plane
                            size={18}
                            className="text-indigo-400"
                        />
                        Preparing your journeys...
                    </motion.div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="relative mx-auto w-full max-w-[1500px] overflow-hidden pb-12">

                <div className="pointer-events-none absolute inset-0 overflow-hidden">

                    <motion.div
                        animate={{
                            x: [0, 18, 0],
                            y: [0, -12, 0],
                            rotate: [-5, 2, -5]
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute right-[4%] top-[5%] text-indigo-300/[0.045]"
                    >
                        <Plane
                            size={120}
                            strokeWidth={1}
                        />
                    </motion.div>

                    <motion.div
                        animate={{
                            y: [0, -10, 0]
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute left-[2%] top-[40%] text-indigo-300/[0.035]"
                    >
                        <Compass
                            size={125}
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
                        className="absolute right-[2%] top-[60%] text-cyan-300/[0.035]"
                    >
                        <Navigation
                            size={100}
                            strokeWidth={1}
                        />
                    </motion.div>

                    <MapPin
                        size={18}
                        className="absolute left-[27%] top-[20%] text-indigo-300/[0.07]"
                    />

                    <Sparkles
                        size={18}
                        className="absolute right-[28%] top-[31%] text-cyan-300/[0.07]"
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

                        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                            <div>

                                <div className="mb-1.5 flex items-center gap-2">
                                    <span className="h-px w-5 bg-indigo-500" />

                                    <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-indigo-400">
                                        Your Adventures
                                    </span>
                                </div>

                                <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                                    My Trips
                                </h1>

                                <p className="mt-1.5 text-xs text-zinc-600 sm:text-sm">
                                    Your journeys, crews and adventures.
                                </p>

                            </div>

                            <div className="flex gap-2">

                                <button
                                    onClick={() => navigate("/explore")}
                                    className="inline-flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2.5 text-xs font-semibold text-zinc-400 transition hover:border-white/[0.13] hover:bg-white/[0.05] hover:text-white"
                                >
                                    <Compass size={15} />
                                    Explore
                                </button>

                                <button
                                    onClick={() => navigate("/create-trip")}
                                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/10 transition hover:bg-indigo-400"
                                >
                                    <Plane size={15} />
                                    Create Trip
                                </button>

                            </div>

                        </div>

                    </motion.div>

                    {/* Stats */}

                    <section className="mb-8">

                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-4">

                            {/* Created */}

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
                                    delay: 0
                                }}
                                whileHover={{
                                    y: -4
                                }}
                                className="
                                    group
                                    relative
                                    h-[175px]
                                    overflow-hidden
                                    rounded-[22px]
                                    border
                                    border-white/[0.07]
                                    bg-[#111116]
                                    transition-all
                                    duration-300
                                    hover:border-white/[0.14]
                                "
                                style={{
                                    boxSizing: "border-box",
                                    padding: "24px"
                                }}
                            >

                                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-indigo-500/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                <div
                                    className="
                                        absolute
                                        left-6
                                        top-6
                                        z-10
                                        flex
                                        h-11
                                        w-11
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-indigo-500/10
                                        text-indigo-300
                                    "
                                >
                                    <Briefcase size={21} />
                                </div>

                                <span
                                    className="
                                        absolute
                                        right-6
                                        top-7
                                        z-10
                                        text-[9px]
                                        font-medium
                                        tracking-[0.15em]
                                        text-zinc-700
                                    "
                                >
                                    01
                                </span>

                                <div
                                    className="
                                        absolute
                                        bottom-6
                                        left-6
                                        right-6
                                        z-10
                                    "
                                >

                                    <p
                                        className="
                                            text-3xl
                                            font-black
                                            leading-none
                                            tracking-tight
                                            text-white
                                        "
                                    >
                                        {createdTrips.length}
                                    </p>

                                    <p
                                        className="
                                            mt-2
                                            text-[10px]
                                            font-semibold
                                            uppercase
                                            tracking-[0.12em]
                                            text-zinc-500
                                        "
                                    >
                                        Trips Created
                                    </p>

                                </div>

                            </motion.div>

                            {/* Joined */}

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
                                    delay: 0.07
                                }}
                                whileHover={{
                                    y: -4
                                }}
                                className="
                                    group
                                    relative
                                    h-[175px]
                                    overflow-hidden
                                    rounded-[22px]
                                    border
                                    border-white/[0.07]
                                    bg-[#111116]
                                    transition-all
                                    duration-300
                                    hover:border-white/[0.14]
                                "
                                style={{
                                    boxSizing: "border-box",
                                    padding: "24px"
                                }}
                            >

                                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-500/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                <div
                                    className="
                                        absolute
                                        left-6
                                        top-6
                                        z-10
                                        flex
                                        h-11
                                        w-11
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-cyan-500/10
                                        text-cyan-300
                                    "
                                >
                                    <Users size={21} />
                                </div>

                                <span
                                    className="
                                        absolute
                                        right-6
                                        top-7
                                        z-10
                                        text-[9px]
                                        font-medium
                                        tracking-[0.15em]
                                        text-zinc-700
                                    "
                                >
                                    02
                                </span>

                                <div
                                    className="
                                        absolute
                                        bottom-6
                                        left-6
                                        right-6
                                        z-10
                                    "
                                >

                                    <p
                                        className="
                                            text-3xl
                                            font-black
                                            leading-none
                                            tracking-tight
                                            text-white
                                        "
                                    >
                                        {joinedTrips.length}
                                    </p>

                                    <p
                                        className="
                                            mt-2
                                            text-[10px]
                                            font-semibold
                                            uppercase
                                            tracking-[0.12em]
                                            text-zinc-500
                                        "
                                    >
                                        Trips Joined
                                    </p>

                                </div>

                            </motion.div>

                            {/* Total */}

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
                                    delay: 0.14
                                }}
                                whileHover={{
                                    y: -4
                                }}
                                className="
                                    group
                                    relative
                                    col-span-2
                                    h-[175px]
                                    overflow-hidden
                                    rounded-[22px]
                                    border
                                    border-white/[0.07]
                                    bg-[#111116]
                                    transition-all
                                    duration-300
                                    hover:border-white/[0.14]
                                    md:col-span-1
                                "
                                style={{
                                    boxSizing: "border-box",
                                    padding: "24px"
                                }}
                            >

                                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-500/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                <div
                                    className="
                                        absolute
                                        left-6
                                        top-6
                                        z-10
                                        flex
                                        h-11
                                        w-11
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-emerald-500/10
                                        text-emerald-300
                                    "
                                >
                                    <Compass size={21} />
                                </div>

                                <span
                                    className="
                                        absolute
                                        right-6
                                        top-7
                                        z-10
                                        text-[9px]
                                        font-medium
                                        tracking-[0.15em]
                                        text-zinc-700
                                    "
                                >
                                    03
                                </span>

                                <div
                                    className="
                                        absolute
                                        bottom-6
                                        left-6
                                        right-6
                                        z-10
                                    "
                                >

                                    <p
                                        className="
                                            text-3xl
                                            font-black
                                            leading-none
                                            tracking-tight
                                            text-white
                                        "
                                    >
                                        {totalTrips}
                                    </p>

                                    <p
                                        className="
                                            mt-2
                                            text-[10px]
                                            font-semibold
                                            uppercase
                                            tracking-[0.12em]
                                            text-zinc-500
                                        "
                                    >
                                        Total Journeys
                                    </p>

                                </div>

                            </motion.div>

                        </div>

                    </section>

                    {/* Tabs */}

                    <section className="mb-7">

                        <div className="flex w-fit rounded-xl border border-white/[0.07] bg-[#111116] p-1">

                            <button
                                onClick={() => setActiveTab("created")}
                                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition ${
                                    activeTab === "created"
                                        ? "bg-indigo-500 text-white"
                                        : "text-zinc-500 hover:text-white"
                                }`}
                            >
                                <Briefcase size={14} />
                                Created
                                <span className="opacity-60">
                                    {createdTrips.length}
                                </span>
                            </button>

                            <button
                                onClick={() => setActiveTab("joined")}
                                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition ${
                                    activeTab === "joined"
                                        ? "bg-cyan-500 text-white"
                                        : "text-zinc-500 hover:text-white"
                                }`}
                            >
                                <Users size={14} />
                                Joined
                                <span className="opacity-60">
                                    {joinedTrips.length}
                                </span>
                            </button>

                        </div>

                    </section>

                    {totalTrips === 0 ? (
                        <EmptyState />
                    ) : activeTab === "created" ? (
                        <CreatedTrips trips={activeTrips} />
                    ) : (
                        <JoinedTrips trips={activeTrips} />
                    )}

                </div>

            </div>
        </AppLayout>
    );
};

export default MyTrips;