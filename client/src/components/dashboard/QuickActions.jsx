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
        subtitle: "Start planning",
        icon: Plus,
        color: "text-indigo-300",
        iconBg: "bg-indigo-500/10",
        route: "/create-trip"
    },
    {
        title: "Explore Trips",
        subtitle: "Find your next",
        icon: Compass,
        color: "text-cyan-300",
        iconBg: "bg-cyan-500/10",
        route: "/explore"
    },
    {
        title: "My Trips",
        subtitle: "Your journeys",
        icon: Map,
        color: "text-emerald-300",
        iconBg: "bg-emerald-500/10",
        route: "/my-trips"
    },
    {
        title: "Profile",
        subtitle: "Your account",
        icon: User,
        color: "text-pink-300",
        iconBg: "bg-pink-500/10",
        route: "/profile"
    }
];

const QuickActions = () => {
    const navigate = useNavigate();

    return (
        <section>

            <div className="mb-4 flex items-end justify-between">

                <div>

                    <div className="mb-1.5 flex items-center gap-2">

                        <span className="h-px w-5 bg-indigo-500" />

                        <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-indigo-400">
                            Shortcuts
                        </span>

                    </div>

                    <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                        Quick Actions
                    </h2>

                </div>

            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">

                {actions.map((action, index) => {
                    const Icon = action.icon;

                    return (
                        <motion.button
                            key={action.title}
                            initial={{
                                opacity: 0,
                                y: 10
                            }}
                            animate={{
                                opacity: 1,
                                y: 0
                            }}
                            transition={{
                                duration: 0.35,
                                delay: index * 0.06
                            }}
                            whileHover={{
                                y: -3
                            }}
                            whileTap={{
                                scale: 0.98
                            }}
                            onClick={() => navigate(action.route)}
                            className="
                                group
                                relative
                                h-[92px]
                                w-full
                                overflow-hidden
                                rounded-[20px]
                                border
                                border-white/[0.07]
                                bg-[#111116]
                                text-left
                                transition-all
                                duration-300
                                hover:border-white/[0.14]
                                hover:bg-[#14141a]
                            "
                        >

                            {/* Subtle hover glow */}

                            <div className="
                                pointer-events-none
                                absolute
                                -right-8
                                -top-8
                                h-20
                                w-20
                                rounded-full
                                bg-indigo-500/[0.06]
                                blur-2xl
                                opacity-0
                                transition-opacity
                                duration-500
                                group-hover:opacity-100
                            " />

                            {/* Icon */}

                            <div
                                className={`
                                    absolute
                                    left-5
                                    top-5
                                    z-10
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-xl
                                    ${action.iconBg}
                                    transition-transform
                                    duration-300
                                    group-hover:scale-105
                                `}
                            >
                                <Icon
                                    size={20}
                                    strokeWidth={2}
                                    className={action.color}
                                />
                            </div>

                            {/* Text */}

                            <div
                                className="
                                    absolute
                                    left-[76px]
                                    top-[22px]
                                    right-10
                                    z-10
                                    min-w-0
                                "
                            >

                                <p className="
                                    truncate
                                    text-sm
                                    font-bold
                                    leading-5
                                    text-white
                                ">
                                    {action.title}
                                </p>

                                <p className="
                                    mt-0.5
                                    truncate
                                    text-[10px]
                                    leading-4
                                    text-zinc-600
                                ">
                                    {action.subtitle}
                                </p>

                            </div>

                            {/* Arrow */}

                            <div
                                className="
                                    absolute
                                    right-5
                                    top-1/2
                                    z-10
                                    -translate-y-1/2
                                    flex
                                    h-7
                                    w-7
                                    items-center
                                    justify-center
                                    rounded-lg
                                    border
                                    border-white/[0.05]
                                    bg-white/[0.02]
                                    text-zinc-600
                                    transition-all
                                    duration-300
                                    group-hover:border-indigo-400/10
                                    group-hover:bg-indigo-500/10
                                    group-hover:text-indigo-300
                                "
                            >
                                <ChevronRight
                                    size={14}
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