import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    MessageCircle,
    Plane,
    MapPin
} from "lucide-react";

import { getMyTrips } from "../../api/tripApi";

const ChatSidebar = ({ selectedTrip, onSelectTrip }) => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrips();
    }, []);

    const fetchTrips = async () => {
        try {
            const { data } = await getMyTrips();

            const allTrips = [
                ...(data.createdTrips || []),
                ...(data.joinedTrips || [])
            ];

            const uniqueTrips = Array.from(
                new Map(
                    allTrips.map((trip) => [trip._id, trip])
                ).values()
            );

            setTrips(uniqueTrips);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center p-5">
                <motion.div
                    animate={{
                        opacity: [0.35, 1, 0.35]
                    }}
                    transition={{
                        duration: 1.3,
                        repeat: Infinity
                    }}
                    className="flex items-center gap-2 text-xs text-zinc-600"
                >
                    <Plane
                        size={15}
                        className="text-indigo-400"
                    />

                    Loading trips...
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex h-full min-h-0 flex-col">
            <div className="shrink-0 border-b border-white/[0.07] px-4 py-4">
                <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-300">
                        <MessageCircle size={16} />
                    </span>

                    <div>
                        <h2 className="text-sm font-bold text-white">
                            Your Chats
                        </h2>

                        <p className="mt-0.5 text-[9px] text-zinc-600">
                            {trips.length} active trip
                            {trips.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-2">
                {trips.length === 0 ? (
                    <div className="flex h-full items-center justify-center p-5">
                        <div className="text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.03] text-zinc-600">
                                <MessageCircle size={22} />
                            </div>

                            <p className="mt-3 text-xs font-semibold text-zinc-400">
                                No chats yet
                            </p>

                            <p className="mt-1 text-[10px] leading-5 text-zinc-700">
                                Join or create a trip to start chatting.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-1.5">
                        {trips.map((trip, index) => {
                            const isSelected =
                                selectedTrip?._id === trip._id;

                            return (
                                <motion.button
                                    key={trip._id}
                                    initial={{
                                        opacity: 0,
                                        x: -8
                                    }}
                                    animate={{
                                        opacity: 1,
                                        x: 0
                                    }}
                                    transition={{
                                        duration: 0.25,
                                        delay: index * 0.04
                                    }}
                                    whileHover={{
                                        x: 2
                                    }}
                                    onClick={() => onSelectTrip(trip)}
                                    className={`
                                        group
                                        relative
                                        w-full
                                        overflow-hidden
                                        rounded-[16px]
                                        border
                                        p-2.5
                                        text-left
                                        transition-all
                                        duration-200

                                        ${
                                            isSelected
                                                ? "border-indigo-500/20 bg-indigo-500/[0.10]"
                                                : "border-transparent hover:border-white/[0.06] hover:bg-white/[0.035]"
                                        }
                                    `}
                                >
                                    {isSelected && (
                                        <span className="absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-r-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.7)]" />
                                    )}

                                    <div className="flex items-center gap-3">
                                        {trip.coverImage ? (
                                            <img
                                                src={trip.coverImage}
                                                alt={trip.title}
                                                className="h-11 w-11 shrink-0 rounded-xl object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
                                                <Plane
                                                    size={18}
                                                    className="rotate-45"
                                                />
                                            </div>
                                        )}

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <h3
                                                    className={`truncate text-xs font-bold ${
                                                        isSelected
                                                            ? "text-white"
                                                            : "text-zinc-300"
                                                    }`}
                                                >
                                                    {trip.title}
                                                </h3>

                                                {isSelected && (
                                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400 shadow-[0_0_7px_rgba(129,140,248,0.7)]" />
                                                )}
                                            </div>

                                            <div className="mt-1 flex min-w-0 items-center gap-1 text-[9px] text-zinc-600">
                                                <MapPin
                                                    size={10}
                                                    className="shrink-0"
                                                />

                                                <span className="truncate">
                                                    {trip.source} → {trip.destination}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatSidebar;