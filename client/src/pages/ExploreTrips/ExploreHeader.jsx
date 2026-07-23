import { motion } from "framer-motion";
import { Compass } from "lucide-react";

const ExploreHeader = () => {

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
                duration: .45
            }}

            className="
                relative
                overflow-hidden
                rounded-[30px]
                border
                border-zinc-800
                bg-gradient-to-br
                from-zinc-900
                via-zinc-900
                to-cyan-950/30
                p-8
            "

        >

            {/* Glow */}

            <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

            <div className="relative z-10 flex items-center justify-between">

                <div>

                    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2">

                        <Compass
                            size={15}
                            className="text-cyan-400"
                        />

                        <span className="text-sm text-cyan-300">

                            Explore

                        </span>

                    </div>

                    <h1 className="mt-5 text-5xl font-black">

                        Explore Trips

                    </h1>

                    <p className="mt-4 max-w-2xl text-zinc-400 leading-7">

                        Discover amazing adventures created by travelers
                        around the world. Join a trip or find inspiration
                        for your next journey.

                    </p>

                </div>

                <div className="hidden xl:flex items-center justify-center h-36 w-36 rounded-full bg-cyan-500/10 border border-cyan-500/20">

                    <Compass

                        size={58}

                        className="text-cyan-400"

                    />

                </div>

            </div>

        </motion.section>

    );

};

export default ExploreHeader;