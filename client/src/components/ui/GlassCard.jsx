import { motion } from "framer-motion";

const GlassCard = ({ children, className = "" }) => {

    return (

        <motion.div

            initial={{
                opacity: 0,
                y: 30
            }}

            animate={{
                opacity: 1,
                y: 0
            }}

            transition={{
                duration: .5
            }}

            className={`
                rounded-[32px]
                border
                border-white/10
                bg-white/5
                backdrop-blur-2xl
                shadow-[0_0_60px_rgba(0,0,0,.3)]
                p-8
                ${className}
            `}
        >

            {children}

        </motion.div>

    );

};

export default GlassCard;