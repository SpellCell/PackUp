import { motion } from "framer-motion";
import {
    Compass,
    MapPlus,
    Plus,
    Plane
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmptyState = () => {
    const navigate = useNavigate();

    return (
        <section>

            <div className="mb-4">

                <div className="mb-1.5 flex items-center gap-2">
                    <span className="h-px w-5 bg-indigo-500" />

                    <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-indigo-400">
                        Your Adventures
                    </span>
                </div>

                <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                    Start Your Journey
                </h2>

            </div>

            <motion.div
                initial={{
                    opacity: 0,
                    y: 12
                }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
                className="relative grid overflow-hidden rounded-[22px] border border-white/[0.07] bg-[#111116] p-6 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-6"
            >

                <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl" />

                <motion.div
                    animate={{
                        y: [0, -5, 0],
                        rotate: [0, 3, 0]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300"
                >
                    <MapPlus size={26} />
                </motion.div>

                <div className="relative mt-4 sm:mt-0">

                    <h3 className="text-lg font-bold text-white">
                        Your next adventure starts here.
                    </h3>

                    <p className="mt-1 max-w-xl text-xs leading-5 text-zinc-600">
                        Create your first trip or explore adventures
                        created by other travelers.
                    </p>

                </div>

                <div className="relative mt-5 flex gap-2 sm:mt-0">

                    <button
                        onClick={() => navigate("/create-trip")}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-500 px-4 py-2.5 text-[10px] font-semibold text-white transition hover:bg-indigo-400"
                    >
                        <Plus size={14} />
                        Create
                    </button>

                    <button
                        onClick={() => navigate("/explore")}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2.5 text-[10px] font-semibold text-zinc-400 transition hover:border-white/[0.13] hover:bg-white/[0.05] hover:text-white"
                    >
                        <Compass size={14} />
                        Explore
                    </button>

                </div>

                <div className="pointer-events-none absolute bottom-3 right-[20%] hidden text-indigo-300/[0.035] lg:block">
                    <Plane
                        size={55}
                        strokeWidth={1}
                    />
                </div>

            </motion.div>

        </section>
    );
};

export default EmptyState;