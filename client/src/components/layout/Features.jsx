import { motion } from "framer-motion";
import {
    FaRoute,
    FaWallet,
    FaComments,
    FaUsers
} from "react-icons/fa";

const features = [

    {
        icon: <FaRoute />,
        title: "Smart Trip Planning",
        description:
            "Create and organize trips effortlessly with destinations, budgets, and members."
    },

    {
        icon: <FaWallet />,
        title: "Expense Split",
        description:
            "Automatically split expenses and settle balances without confusion."
    },

    {
        icon: <FaComments />,
        title: "Real-Time Chat",
        description:
            "Stay connected with your travel group using live chat powered by Socket.IO."
    },

    {
        icon: <FaUsers />,
        title: "Find Travel Buddies",
        description:
            "Meet like-minded travelers and join exciting adventures together."
    }

];

const Features = () => {

    return (

        <section
            id="features"
            className="relative py-32 px-6"
        >

            <div className="max-w-7xl mx-auto">

                <motion.h2

                    initial={{ opacity: 0, y: 40 }}

                    whileInView={{ opacity: 1, y: 0 }}

                    viewport={{ once: true }}

                    className="text-5xl font-bold text-center"

                >

                    Why Choose

                    <span className="text-indigo-500">

                        {" "}PackUP

                    </span>

                </motion.h2>

                <p className="text-zinc-400 text-center mt-6 max-w-2xl mx-auto">

                    Everything you need to plan,
                    organize and enjoy group travel
                    in one modern platform.

                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">

                    {

                        features.map((feature, index) => (

                            <motion.div

                                key={index}

                                whileHover={{
                                    y: -10,
                                    scale: 1.03
                                }}

                                transition={{
                                    type: "spring",
                                    stiffness: 250
                                }}

                                className="
                                    group
                                    rounded-3xl
                                    border
                                    border-zinc-800
                                    bg-white/5
                                    backdrop-blur-xl
                                    p-8
                                    transition-all
                                    duration-300
                                    hover:border-indigo-500
                                    hover:shadow-[0_0_30px_rgba(79,70,229,0.25)]
                                "

                            >

                                <div
                                    className="
                                        text-4xl
                                        text-indigo-500
                                        transition-transform
                                        duration-300
                                        group-hover:rotate-12
                                    "
                                >

                                    {feature.icon}

                                </div>

                                <h3 className="mt-6 text-2xl font-semibold">

                                    {feature.title}

                                </h3>

                                <p className="mt-4 text-zinc-400 leading-7">

                                    {feature.description}

                                </p>

                            </motion.div>

                        ))

                    }

                </div>

            </div>

        </section>

    );

};

export default Features;