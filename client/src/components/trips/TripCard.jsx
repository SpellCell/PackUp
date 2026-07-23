import { motion } from "framer-motion";
import {
    CalendarDays,
    MapPin,
    Users,
    Wallet,
    ArrowRight
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const TripCard = ({ trip }) => {

    const navigate = useNavigate();

    return (

        <motion.article

            whileHover={{
                y: -8
            }}

            transition={{
                duration: .25
            }}

            className="
                group
                overflow-hidden
                rounded-[28px]
                border
                border-zinc-800
                bg-zinc-900
                shadow-xl
                hover:border-indigo-500/40
                transition-all
            "

        >

            {/* Cover */}

            <div className="relative h-64 overflow-hidden">

                {

                    trip.coverImage ? (

                        <img

                            src={trip.coverImage}

                            alt={trip.title}

                            className="
                                h-full
                                w-full
                                object-cover
                                transition-transform
                                duration-500
                                group-hover:scale-105
                            "

                        />

                    ) : (

                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-700 via-indigo-600 to-cyan-600">

                            <span className="text-6xl">

                                ✈️

                            </span>

                        </div>

                    )

                }

                {/* Overlay */}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Badge */}

                <div className="absolute top-5 left-5">

                    <span className="rounded-full bg-white/10 backdrop-blur-xl px-4 py-2 text-xs font-semibold border border-white/20">

                        {trip.tripType}

                    </span>

                </div>

            </div>

            {/* Body */}

            <div className="p-6">

                <h2 className="text-2xl font-bold">

                    {trip.title}

                </h2>

                <div className="mt-3 flex items-center gap-2 text-zinc-400">

                    <MapPin size={17} />

                    <span className="text-sm">

                        {trip.source} → {trip.destination}

                    </span>

                </div>

                {/* Info */}

                <div className="mt-6 grid grid-cols-3 gap-4">

                    <div>

                        <CalendarDays
                            size={18}
                            className="text-indigo-400 mb-2"
                        />

                        <p className="text-xs text-zinc-500">

                            Date

                        </p>

                        <p className="text-sm font-medium">

                            {

                                new Date(

                                    trip.startDate

                                ).toLocaleDateString()

                            }

                        </p>

                    </div>

                    <div>

                        <Users
                            size={18}
                            className="text-cyan-400 mb-2"
                        />

                        <p className="text-xs text-zinc-500">

                            Members

                        </p>

                        <p className="text-sm font-medium">

                            {trip.currentMembers}/{trip.maxMembers}

                        </p>

                    </div>

                    <div>

                        <Wallet
                            size={18}
                            className="text-green-400 mb-2"
                        />

                        <p className="text-xs text-zinc-500">

                            Budget

                        </p>

                        <p className="text-sm font-medium">

                            ₹{trip.budget}

                        </p>

                    </div>

                </div>

                <div className="mt-7 flex items-center justify-between">

                    <div>

                        <p className="text-xs text-zinc-500">

                            Created by

                        </p>

                        <p className="font-semibold mt-1">

                            {trip.createdBy?.name || "You"}

                        </p>

                    </div>

                    <button

                        onClick={() =>
                            navigate(`/trips/${trip._id}`)
                        }

                        className="
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-indigo-600
                            px-5
                            py-3
                            font-medium
                            hover:bg-indigo-500
                            transition
                        "

                    >

                        View Details

                        <ArrowRight size={17} />

                    </button>

                </div>

            </div>

        </motion.article>

    );

};

export default TripCard;