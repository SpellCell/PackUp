import { motion } from "framer-motion";
import {
    FaArrowRight,
    FaUsers,
    FaComments,
    FaWallet
} from "react-icons/fa";
import Button from "../ui/Button";
import FloatingCard from "../ui/FloatingCard";

const Hero = () => {
    return (
        <section className="relative min-h-screen overflow-hidden flex items-center justify-center px-6">

            {/* Background Gradient */}

            <div className="absolute inset-0 bg-gradient-to-br from-[#09090B] via-[#111827] to-[#09090B]" />

            {/* Glow Effects */}

            <div className="absolute w-[650px] h-[650px] rounded-full bg-indigo-600/20 blur-[180px] -top-60 -left-52" />

            <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/20 blur-[180px] bottom-0 right-0" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px] opacity-30" />

            {/* Floating Cards */}

            <FloatingCard
                title="🏝 Goa"
                location="India"
                top="15%"
                left="8%"
            />

            <FloatingCard
                title="🏔 Manali"
                location="Himachal"
                top="22%"
                left="78%"
            />

            <FloatingCard
                title="🌊 Bali"
                location="Indonesia"
                top="72%"
                left="12%"
            />

            <FloatingCard
                title="🏜 Dubai"
                location="UAE"
                top="68%"
                left="80%"
            />

            {/* Hero Content */}

            <div className="relative z-20 max-w-5xl text-center">

                <motion.div
                    initial={{ opacity: 0, scale: .9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: .6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-lg mb-8"
                >

                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>

                    <span className="text-sm text-zinc-300">
                        Plan • Travel • Split • Chat
                    </span>

                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: .8 }}
                    className="text-6xl md:text-8xl font-extrabold leading-tight"
                >

                    Explore

                    <span className="text-indigo-500">

                        {" "}Together

                    </span>

                    <br />

                    Create

                    <span className="text-cyan-400">

                        {" "}Memories

                    </span>

                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: .35 }}
                    className="mt-8 text-zinc-400 text-xl max-w-3xl mx-auto leading-9"
                >

                    Discover travel partners, organize unforgettable trips,
                    split expenses instantly, and chat in real time—
                    everything you need for the perfect group adventure.

                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: .6 }}
                    className="mt-12 flex flex-wrap justify-center gap-5"
                >

                    <Button>

                        Start Exploring

                        <FaArrowRight className="ml-2 inline"/>

                    </Button>

                    <Button variant="outline">

                        Create Trip

                    </Button>

                </motion.div>

                {/* Stats */}

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: .9 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
                >

                    <div className="rounded-3xl border border-zinc-800 bg-white/5 backdrop-blur-xl p-6">

                        <FaUsers className="text-indigo-400 text-3xl mb-4"/>

                        <h2 className="text-3xl font-bold">

                            10K+

                        </h2>

                        <p className="text-zinc-400">

                            Travelers Connected

                        </p>

                    </div>

                    <div className="rounded-3xl border border-zinc-800 bg-white/5 backdrop-blur-xl p-6">

                        <FaWallet className="text-cyan-400 text-3xl mb-4"/>

                        <h2 className="text-3xl font-bold">

                            Smart Split

                        </h2>

                        <p className="text-zinc-400">

                            No More Expense Confusion

                        </p>

                    </div>

                    <div className="rounded-3xl border border-zinc-800 bg-white/5 backdrop-blur-xl p-6">

                        <FaComments className="text-green-400 text-3xl mb-4"/>

                        <h2 className="text-3xl font-bold">

                            Live Chat

                        </h2>

                        <p className="text-zinc-400">

                            Stay Connected Everywhere

                        </p>

                    </div>

                </motion.div>

            </div>

        </section>
    );
};

export default Hero;