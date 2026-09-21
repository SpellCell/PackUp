import { motion } from "framer-motion";

const themes = {
    indigo: {
        icon: "bg-indigo-500/10 text-indigo-300",
        glow: "bg-indigo-500/10",
        line: "bg-indigo-400"
    },
    cyan: {
        icon: "bg-cyan-500/10 text-cyan-300",
        glow: "bg-cyan-500/10",
        line: "bg-cyan-400"
    },
    green: {
        icon: "bg-emerald-500/10 text-emerald-300",
        glow: "bg-emerald-500/10",
        line: "bg-emerald-400"
    },
    yellow: {
        icon: "bg-amber-500/10 text-amber-300",
        glow: "bg-amber-500/10",
        line: "bg-amber-400"
    }
};

const StatCard = ({
    title,
    value,
    icon,
    color = "indigo",
    index = 0
}) => {
    const theme = themes[color] || themes.indigo;

    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 12
            }}
            animate={{
                opacity: 1,
                y: 0
            }}
            transition={{
                duration: 0.4,
                delay: index * 0.07
            }}
            whileHover={{
                y: -4
            }}
            className="
                group
                relative
                h-[175px]
                overflow-hidden
                rounded-[22px]
                border
                border-white/[0.07]
                bg-[#111116]
                transition-all
                duration-300
                hover:border-white/[0.14]
            "
            style={{
                boxSizing: "border-box",
                padding: "24px"
            }}
        >

            {/* Background glow */}

            <div
                className={`
                    pointer-events-none
                    absolute
                    -right-10
                    -top-10
                    h-28
                    w-28
                    rounded-full
                    blur-3xl
                    opacity-0
                    transition-opacity
                    duration-500
                    group-hover:opacity-100
                    ${theme.glow}
                `}
            />

            {/* Icon */}

            <div
                className={`
                    absolute
                    left-6
                    top-6
                    z-10
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    ${theme.icon}
                `}
            >
                {icon}
            </div>

            {/* Number */}

            <span
                className="
                    absolute
                    right-6
                    top-7
                    z-10
                    text-[9px]
                    font-medium
                    tracking-[0.15em]
                    text-zinc-700
                "
            >
                0{index + 1}
            </span>

            {/* Bottom content */}

            <div
                className="
                    absolute
                    bottom-6
                    left-6
                    right-6
                    z-10
                "
            >

                <div className="flex items-end justify-between gap-3">

                    <span
                        className="
                            min-w-0
                            truncate
                            text-3xl
                            font-black
                            leading-none
                            tracking-tight
                            text-white
                        "
                    >
                        {value}
                    </span>

                    <span
                        className={`
                            mb-1
                            h-1.5
                            w-1.5
                            shrink-0
                            rounded-full
                            opacity-60
                            ${theme.line}
                        `}
                    />

                </div>

                <p
                    className="
                        mt-2
                        truncate
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.12em]
                        text-zinc-500
                    "
                >
                    {title}
                </p>

            </div>

        </motion.div>
    );
};

export default StatCard;