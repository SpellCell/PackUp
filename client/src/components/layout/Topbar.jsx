import { motion } from "framer-motion";
import {
    Search,
    Bell,
    ChevronDown,
    Menu,
    Settings
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const Topbar = () => {

    const { user } = useAuth();

    return (

        <header className="sticky top-0 z-40 h-20 border-b border-zinc-800 bg-[#09090B]/80 backdrop-blur-xl">

            <div className="h-full px-8 flex items-center justify-between">

                {/* Left */}

                <div className="flex items-center gap-5">

                    <button className="lg:hidden p-2 rounded-xl hover:bg-zinc-800 transition">

                        <Menu size={22} />

                    </button>

                    <motion.div

                        whileFocus={{
                            scale: 1.02
                        }}

                        className="
                            hidden
                            md:flex
                            items-center
                            w-[420px]
                            rounded-2xl
                            border
                            border-zinc-800
                            bg-zinc-900
                            px-5
                            py-3
                            transition
                            focus-within:border-indigo-500
                            focus-within:ring-2
                            focus-within:ring-indigo-500/20
                        "

                    >

                        <Search
                            size={18}
                            className="text-zinc-500"
                        />

                        <input

                            type="text"

                            placeholder="Search trips, cities, travelers..."

                            className="
                                ml-3
                                flex-1
                                bg-transparent
                                text-sm
                                outline-none
                                placeholder:text-zinc-500
                            "

                        />

                    </motion.div>

                </div>

                {/* Right */}

                <div className="flex items-center gap-3">

                    <button

                        className="
                            relative
                            h-11
                            w-11
                            rounded-2xl
                            bg-zinc-900
                            border
                            border-zinc-800
                            flex
                            items-center
                            justify-center
                            hover:border-indigo-500
                            transition
                        "

                    >

                        <Bell size={19} />

                        <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 border border-zinc-900"></span>

                    </button>

                    <button

                        className="
                            h-11
                            w-11
                            rounded-2xl
                            bg-zinc-900
                            border
                            border-zinc-800
                            flex
                            items-center
                            justify-center
                            hover:border-indigo-500
                            transition
                        "

                    >

                        <Settings size={18} />

                    </button>

                    <motion.div

                        whileHover={{
                            scale: 1.02
                        }}

                        className="
                            flex
                            items-center
                            gap-3
                            rounded-2xl
                            border
                            border-zinc-800
                            bg-zinc-900
                            px-3
                            py-2
                            cursor-pointer
                        "

                    >

                        <img

                            src={
                                user?.profileImage ||
                                `https://ui-avatars.com/api/?name=${user?.name}&background=6366f1&color=fff`
                            }

                            alt="Profile"

                            className="
                                h-11
                                w-11
                                rounded-full
                                border-2
                                border-indigo-500
                            "

                        />

                        <div className="hidden md:block">

                            <h3 className="font-semibold leading-none">

                                {user?.name}

                            </h3>

                            <p className="text-sm text-zinc-500 mt-1">

                                @{user?.username}

                            </p>

                        </div>

                        <ChevronDown
                            size={18}
                            className="text-zinc-500"
                        />

                    </motion.div>

                </div>

            </div>

        </header>

    );

};

export default Topbar;