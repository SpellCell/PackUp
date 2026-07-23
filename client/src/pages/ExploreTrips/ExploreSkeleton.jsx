import { motion } from "framer-motion";

const SkeletonCard = () => (

    <motion.div

        animate={{
            opacity: [0.4, 0.8, 0.4]
        }}

        transition={{
            repeat: Infinity,
            duration: 1.3
        }}

        className="
            overflow-hidden
            rounded-3xl
            border
            border-zinc-800
            bg-zinc-900
        "

    >

        {/* Image */}

        <div className="h-64 bg-zinc-800" />

        {/* Content */}

        <div className="space-y-4 p-6">

            <div className="h-6 w-40 rounded bg-zinc-800" />

            <div className="h-4 w-60 rounded bg-zinc-800" />

            <div className="grid grid-cols-3 gap-4 pt-2">

                <div className="h-14 rounded-xl bg-zinc-800" />

                <div className="h-14 rounded-xl bg-zinc-800" />

                <div className="h-14 rounded-xl bg-zinc-800" />

            </div>

            <div className="flex justify-between items-center pt-3">

                <div className="space-y-2">

                    <div className="h-3 w-24 rounded bg-zinc-800" />

                    <div className="h-4 w-32 rounded bg-zinc-800" />

                </div>

                <div className="h-11 w-36 rounded-xl bg-zinc-800" />

            </div>

        </div>

    </motion.div>

);

const ExploreSkeleton = () => {

    return (

        <div className="grid gap-8 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">

            {

                Array.from({ length: 6 }).map((_, index) => (

                    <SkeletonCard

                        key={index}

                    />

                ))

            }

        </div>

    );

};

export default ExploreSkeleton;