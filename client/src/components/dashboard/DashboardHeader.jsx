import { motion } from "framer-motion";
import {
    Plus,
    Compass,
    Sparkles,
    MapPinned
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

const DashboardHeader = ({ user }) => {

    const navigate = useNavigate();

    const hour = new Date().getHours();

    let greeting = "Good Evening";

    if (hour < 12) greeting = "Good Morning";
    else if (hour < 18) greeting = "Good Afternoon";

    return (

        <motion.section

            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}

            transition={{ duration: .5 }}

            className="
                relative
                overflow-hidden
                rounded-[32px]
                border
                border-zinc-800
                bg-gradient-to-br
                from-zinc-900
                via-zinc-900
                to-indigo-950/30
                p-8
            "

        >

            {/* Glow */}

            <div className="absolute -top-32 -right-20 h-80 w-80 rounded-full bg-indigo-600/15 blur-3xl" />

            <div className="absolute bottom-0 left-0 h-52 w-52 rounded-full bg-cyan-500/10 blur-3xl" />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">

                {/* Left */}

                <div className="max-w-3xl">

                    <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-2">

                        <Sparkles
                            size={15}
                            className="text-indigo-400"
                        />

                        <span className="text-sm text-indigo-300 font-medium">

                            {greeting}

                        </span>

                    </div>

                    <h1 className="mt-5 text-4xl md:text-5xl font-black leading-tight">

                        Welcome back,

                    </h1>

                    <h2 className="text-5xl md:text-6xl font-black text-indigo-500 mt-1">

                        {user?.name || "Traveler"}

                    </h2>

                    <p className="mt-5 text-zinc-400 text-lg max-w-2xl leading-8">

                        Discover incredible destinations, travel with amazing people,
                        split expenses effortlessly and keep every trip organized
                        in one place.

                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">

                        <Button

                            leftIcon={<Plus size={18} />}

                            onClick={() => navigate("/create-trip")}

                        >

                            Create Trip

                        </Button>

                        <Button

                            variant="outline"

                            leftIcon={<Compass size={18} />}

                            onClick={() => navigate("/explore")}

                        >

                            Explore Trips

                        </Button>

                    </div>

                </div>

                {/* Right */}

                <motion.div

                    animate={{
                        y: [0, -10, 0]
                    }}

                    transition={{
                        repeat: Infinity,
                        duration: 5
                    }}

                    className="
                        hidden
                        xl:flex
                        items-center
                        justify-center
                        h-44
                        w-44
                        rounded-full
                        bg-gradient-to-br
                        from-indigo-500/20
                        to-cyan-500/20
                        border
                        border-indigo-500/20
                    "

                >

                    <MapPinned
                        size={70}
                        className="text-indigo-400"
                    />

                </motion.div>

            </div>

        </motion.section>

    );

};

export default DashboardHeader;