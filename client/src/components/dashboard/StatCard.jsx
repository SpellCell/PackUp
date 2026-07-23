import { motion } from "framer-motion";

const StatCard = ({
    title,
    value,
    icon,
    color = "text-indigo-400"
}) => {

    return (

        <motion.div

            whileHover={{
                y: -5
            }}

            transition={{
                duration: .2
            }}

            className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border
                border-zinc-800
                bg-zinc-900
                p-6
                hover:border-indigo-500/40
                transition-all
            "

        >

            {/* Glow */}

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-indigo-500/5 via-transparent to-cyan-500/5" />

            <div className="relative z-10">

                <div

                    className={`
                        w-14
                        h-14
                        rounded-2xl
                        bg-zinc-800
                        flex
                        items-center
                        justify-center
                        ${color}
                    `}

                >

                    {icon}

                </div>

                <h2 className="mt-6 text-4xl font-black tracking-tight">

                    {value}

                </h2>

                <p className="mt-2 text-sm text-zinc-400 font-medium">

                    {title}

                </p>

            </div>

        </motion.div>

    );

};

export default StatCard;