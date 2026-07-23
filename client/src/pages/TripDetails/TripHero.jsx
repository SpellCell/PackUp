import { ArrowLeft, MapPin, Copy, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";

const TripHero = ({ trip }) => {

    const navigate = useNavigate();

    const [copied, setCopied] = useState(false);

    const copyTripCode = async () => {

        try {

            await navigator.clipboard.writeText(trip.tripCode);

            setCopied(true);

            toast.success("Trip code copied!");

            setTimeout(() => {

                setCopied(false);

            }, 2000);

        }

        catch (error) {

            toast.error("Unable to copy trip code.");

        }

    };

    return (

        <motion.section

            initial={{
                opacity: 0,
                y: 20
            }}

            animate={{
                opacity: 1,
                y: 0
            }}

            transition={{
                duration: .4
            }}

            className="space-y-6"

        >

            {/* Back Button */}

            <button

                onClick={() => navigate(-1)}

                className="
                    flex
                    items-center
                    gap-2
                    text-zinc-400
                    hover:text-white
                    transition
                "

            >

                <ArrowLeft size={18} />

                Back

            </button>

            {/* Cover */}

            <div className="relative overflow-hidden rounded-3xl border border-zinc-800">

                {

                    trip.coverImage ?

                        (

                            <img

                                src={trip.coverImage}

                                alt={trip.title}

                                className="w-full h-[420px] object-cover"

                            />

                        )

                        :

                        (

                            <div className="h-[420px] bg-gradient-to-br from-indigo-700 via-indigo-600 to-cyan-600 flex items-center justify-center">

                                <span className="text-8xl">

                                    ✈️

                                </span>

                            </div>

                        )

                }

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute top-6 left-6">

                    <span className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold">

                        {trip.tripType}

                    </span>

                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8">

                    <h1 className="text-5xl font-black">

                        {trip.title}

                    </h1>

                    <div className="flex items-center gap-2 mt-4 text-zinc-300">

                        <MapPin size={18} />

                        <span>

                            {trip.source} → {trip.destination}

                        </span>

                    </div>

                </div>

            </div>

            {/* Organizer */}

            <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-6">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                    <div>

                        <p className="text-sm text-zinc-500">

                            Organized By

                        </p>

                        <div className="flex items-center gap-4 mt-5">

                            <img

                                src={
                                    trip.createdBy?.profileImage ||

                                    `https://ui-avatars.com/api/?name=${trip.createdBy?.name}&background=6366f1&color=fff`
                                }

                                alt={trip.createdBy?.name}

                                className="w-16 h-16 rounded-full border-2 border-indigo-500"

                            />

                            <div>

                                <h2 className="text-xl font-bold">

                                    {trip.createdBy?.name}

                                </h2>

                                <p className="text-zinc-400">

                                    @{trip.createdBy?.username}

                                </p>

                            </div>

                        </div>

                    </div>

                    {/* Trip Code */}

                    <div className="rounded-2xl bg-zinc-800 border border-zinc-700 p-5 min-w-[280px]">

                        <p className="text-sm text-zinc-500">

                            Trip Code

                        </p>

                        <div className="flex items-center justify-between mt-3">

                            <span className="text-xl font-bold tracking-[0.25em] text-indigo-400">

                                {trip.tripCode}

                            </span>

                            <button

                                onClick={copyTripCode}

                                className="
                                    flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    bg-indigo-600
                                    hover:bg-indigo-500
                                    px-4
                                    py-2
                                    transition
                                "

                            >

                                {

                                    copied ?

                                        <Check size={18} />

                                        :

                                        <Copy size={18} />

                                }

                                {

                                    copied ?

                                        "Copied"

                                        :

                                        "Copy"

                                }

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </motion.section>

    );

};

export default TripHero;