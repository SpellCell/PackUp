import { motion } from "framer-motion";
import { ArrowUpRight, Compass } from "lucide-react";
import { useNavigate } from "react-router-dom";

import TripCard from "../trips/TripCard";

const RecentTrips = ({ trips = [] }) => {
    const navigate = useNavigate();

    if (!trips.length) {
        return (
            <section>

                <div className="mb-5">

                    <div className="mb-2 flex items-center gap-2">
                        <span className="h-px w-6 bg-indigo-500" />

                        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-indigo-400">
                            Your Adventures
                        </span>
                    </div>

                    <h2 className="text-2xl font-bold tracking-tight text-white">
                        Recent Trips
                    </h2>

                </div>

                <div className="relative overflow-hidden rounded-[26px] border border-white/[0.07] bg-[#111116] px-6 py-14 text-center">

                    <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-indigo-500/[0.07] blur-3xl" />

                    <motion.div
                        animate={{
                            y: [0, -6, 0],
                            rotate: [0, 3, 0]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300"
                    >
                        <Compass size={26} />
                    </motion.div>

                    <h3 className="relative mt-5 text-lg font-bold text-white">
                        Your next adventure starts here.
                    </h3>

                    <p className="relative mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
                        Create your first trip and start bringing your
                        travel crew together.
                    </p>

                    <button
                        onClick={() => navigate("/create-trip")}
                        className="relative mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
                    >
                        Create your first trip
                        <ArrowUpRight size={15} />
                    </button>

                </div>

            </section>
        );
    }

    return (
        <section>

            <div className="mb-5 flex items-end justify-between gap-4">

                <div>

                    <div className="mb-2 flex items-center gap-2">
                        <span className="h-px w-6 bg-indigo-500" />

                        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-indigo-400">
                            Your Adventures
                        </span>
                    </div>

                    <h2 className="text-2xl font-bold tracking-tight text-white">
                        Recent Trips
                    </h2>

                </div>

                <button
                    onClick={() => navigate("/explore")}
                    className="hidden items-center gap-1.5 text-xs font-medium text-zinc-500 transition hover:text-white sm:flex"
                >
                    Explore trips
                    <ArrowUpRight size={14} />
                </button>

            </div>

            <div className="grid gap-5 xl:grid-cols-2">

                {trips
                    .slice(0, 4)
                    .map((trip, index) => (
                        <motion.div
                            key={trip._id}
                            initial={{
                                opacity: 0,
                                y: 15
                            }}
                            animate={{
                                opacity: 1,
                                y: 0
                            }}
                            transition={{
                                duration: 0.45,
                                delay: index * 0.08
                            }}
                        >
                            <TripCard trip={trip} />
                        </motion.div>
                    ))}

            </div>

        </section>
    );
};

export default RecentTrips;