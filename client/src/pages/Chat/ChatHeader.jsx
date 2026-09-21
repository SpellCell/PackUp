import { motion } from "framer-motion";
import {
    MapPin,
    Users,
    Plane
} from "lucide-react";

const ChatHeader = ({ trip, onlineUsers = [] }) => {
    const creatorId = trip.createdBy?._id
        ? String(trip.createdBy._id)
        : trip.createdBy
            ? String(trip.createdBy)
            : null;

    const isOnline = creatorId
        ? onlineUsers.some(
            (userId) => String(userId) === creatorId
        )
        : false;

    return (
        <div className="relative flex min-h-[78px] shrink-0 items-center justify-between border-b border-white/[0.07] px-4 sm:px-5">

            <div className="pointer-events-none absolute right-[15%] top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-indigo-500/[0.035] blur-3xl" />

            <div className="relative flex min-w-0 items-center gap-3">

                {trip.coverImage ? (
                    <img
                        src={trip.coverImage}
                        alt={trip.title}
                        className="h-11 w-11 shrink-0 rounded-xl object-cover ring-1 ring-white/[0.08]"
                    />
                ) : (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
                        <Plane
                            size={19}
                            className="rotate-45"
                        />
                    </div>
                )}

                <div className="min-w-0">

                    <h2 className="truncate text-sm font-bold text-white sm:text-base">
                        {trip.title}
                    </h2>

                    <div className="mt-1 flex min-w-0 items-center gap-1.5 text-[10px] text-zinc-600">

                        <MapPin
                            size={11}
                            className="shrink-0"
                        />

                        <span className="truncate">
                            {trip.source} → {trip.destination}
                        </span>

                    </div>

                    <div className="mt-1.5 flex items-center gap-1.5">

                        <span
                            className={`h-1.5 w-1.5 rounded-full ${
                                isOnline
                                    ? "bg-emerald-400 shadow-[0_0_7px_rgba(52,211,153,0.7)]"
                                    : "bg-zinc-700"
                            }`}
                        />

                        <span
                            className={`text-[9px] ${
                                isOnline
                                    ? "text-emerald-400"
                                    : "text-zinc-600"
                            }`}
                        >
                            {isOnline
                                ? "Organizer online"
                                : "Organizer offline"}
                        </span>

                    </div>

                </div>

            </div>

            <motion.div
                whileHover={{
                    y: -1
                }}
                className="relative ml-3 flex shrink-0 items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2"
            >

                <Users
                    size={15}
                    className="text-zinc-500"
                />

                <span className="text-[10px] font-semibold text-zinc-400">
                    {trip.currentMembers}/{trip.maxMembers}
                </span>

            </motion.div>

        </div>
    );
};

export default ChatHeader;