import { motion } from "framer-motion";

const FloatingCard = ({ title, location, top, left }) => {

    return (

        <motion.div

            animate={{
                y: [0, -15, 0]
            }}

            transition={{
                repeat: Infinity,
                duration: 5,
                ease: "easeInOut"
            }}

            className="
                absolute
                bg-white/10
                backdrop-blur-xl
                border
                border-white/10
                rounded-3xl
                p-4
                shadow-2xl
            "

            style={{
                top,
                left
            }}

        >

            <h3 className="font-semibold">

                {title}

            </h3>

            <p className="text-sm text-zinc-400">

                {location}

            </p>

        </motion.div>

    );

};

export default FloatingCard;