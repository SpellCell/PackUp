import { motion } from "framer-motion";
import {
    Plus,
    Compass,
    Map,
    User,
    ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const actions = [
    {
        title: "Create Trip",
        icon: Plus,
        color: "text-indigo-400",
        route: "/create-trip"
    },
    {
        title: "Explore Trips",
        icon: Compass,
        color: "text-cyan-400",
        route: "/explore"
    },
    {
        title: "My Trips",
        icon: Map,
        color: "text-green-400",
        route: "/my-trips"
    },
    {
        title: "Profile",
        icon: User,
        color: "text-pink-400",
        route: "/profile"
    }
];

const QuickActions = () => {

    const navigate = useNavigate();

    return (

        <section>

            <h2 className="text-2xl font-bold mb-6">

                Quick Actions

            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

                {actions.map((action) => {

                    const Icon = action.icon;

                    return (

                        <motion.button
                            key={action.title}
                            whileHover={{
                                y: -5,
                                scale: 1.02
                            }}
                            whileTap={{
                                scale: 0.98
                            }}
                            transition={{
                                duration: 0.2
                            }}
                            onClick={() => navigate(action.route)}
                            className="
                                group
                                w-full
                                rounded-2xl
                                border
                                border-zinc-800
                                bg-zinc-900
                                px-5
                                py-5
                                hover:border-indigo-500
                                hover:bg-zinc-800/70
                                transition-all
                                duration-300
                            "
                        >

                            <div className="flex items-center justify-between">

                                <div className="flex items-center gap-4">

                                    <div
                                        className="
                                            w-11
                                            h-11
                                            rounded-xl
                                            bg-zinc-800
                                            flex
                                            items-center
                                            justify-center
                                            group-hover:scale-110
                                            transition-transform
                                        "
                                    >

                                        <Icon
                                            size={22}
                                            strokeWidth={2.5}
                                            className={action.color}
                                        />

                                    </div>

                                    <span className="text-lg font-semibold text-white">

                                        {action.title}

                                    </span>

                                </div>

                                <ChevronRight
                                    size={18}
                                    className="
                                        text-zinc-500
                                        group-hover:text-indigo-400
                                        group-hover:translate-x-1
                                        transition-all
                                    "
                                />

                            </div>

                        </motion.button>

                    );

                })}

            </div>

        </section>

    );

};

export default QuickActions;