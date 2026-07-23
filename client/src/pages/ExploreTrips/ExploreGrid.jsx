import { motion } from "framer-motion";

const ExploreGrid = ({ children }) => {

    return (

        <motion.section

            initial={{
                opacity: 0
            }}

            animate={{
                opacity: 1
            }}

            transition={{
                duration: .35
            }}

            className="
                grid
                gap-8
                grid-cols-1
                lg:grid-cols-2
                2xl:grid-cols-3
            "

        >

            {children}

        </motion.section>

    );

};

export default ExploreGrid;