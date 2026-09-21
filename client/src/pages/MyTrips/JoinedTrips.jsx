import { motion } from "framer-motion";
import {
    Compass,
    Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import TripCard from "../../components/trips/TripCard";

const JoinedTrips = ({ trips = [] }) => {
    const navigate = useNavigate();

    if (trips.length === 0) {
        return (
            <section>

                <div className="mb-4">

                    <div className="mb-1.5 flex items-center gap-2">
                        <span className="h-px w-5 bg-cyan-500" />

                        <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-cyan-400">
                            Your Crew
                        </span>
                    </div>

                    <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                        Joined Trips
                    </h2>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

                    <motion.div
                        whileHover={{
                            y: -4
                        }}
                        className="group relative h-[190px] overflow-hidden rounded-[22px] border border-white/[0.07] bg-[#111116] p-5 transition-all duration-300 hover:border-white/[0.14]"
                    >

                        <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-500/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                        <div className="relative flex h-full flex-col items-center justify-center text-center">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300">
                                <Users size={21} />
                            </div>

                            <h3 className="mt-4 text-sm font-bold text-white">
                                No joined trips
                            </h3>

                            <p className="mt-1 max-w-[230px] text-[11px] leading-5 text-zinc-600">
                                Find your next adventure with other travelers.
                            </p>

                            <button
                                onClick={() => navigate("/explore")}
                                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3.5 py-2 text-[10px] font-semibold text-white transition hover:bg-cyan-400"
                            >
                                <Compass size={13} />
                                Explore Trips
                            </button>

                        </div>

                    </motion.div>

                </div>

            </section>
        );
    }

    return (
        <section>

            <div className="mb-4">

                <div className="mb-1.5 flex items-center gap-2">
                    <span className="h-px w-5 bg-cyan-500" />

                    <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-cyan-400">
                        Your Crew
                    </span>
                </div>

                <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                    Joined Trips
                </h2>

                <p className="mt-1 text-xs text-zinc-600">
                    {trips.length} trip
                    {trips.length !== 1 ? "s" : ""} joined
                </p>

            </div>

            <div className="grid gap-4 xl:grid-cols-2">

                {trips.map((trip, index) => (
                    <motion.div
                        key={trip._id}
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
                            delay: index * 0.06
                        }}
                    >
                        <TripCard trip={trip} />
                    </motion.div>
                ))}

            </div>

        </section>
    );
};

export default JoinedTrips;