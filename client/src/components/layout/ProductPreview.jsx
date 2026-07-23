import { motion } from "framer-motion";
import {
    FaComments,
    FaWallet,
    FaBell,
    FaPlaneDeparture
} from "react-icons/fa";

const cards = [

    {
        icon: <FaComments />,
        title: "Trip Chat",
        value: "12 New Messages"
    },

    {
        icon: <FaWallet />,
        title: "Expense Split",
        value: "₹2,350 Pending"
    },

    {
        icon: <FaBell />,
        title: "Notifications",
        value: "4 Updates"
    },

    {
        icon: <FaPlaneDeparture />,
        title: "Upcoming Trip",
        value: "Goa • Tomorrow"
    }

];

const ProductPreview = () => {

    return (

        <section className="py-40 px-6 relative overflow-hidden">

            <div className="max-w-7xl mx-auto">

                <motion.div

                    initial={{ opacity:0 }}

                    whileInView={{ opacity:1 }}

                    viewport={{ once:true }}

                    className="text-center"

                >

                    <h2 className="text-5xl font-bold">

                        See

                        <span className="text-indigo-500">

                            {" "}PackUP

                        </span>

                        {" "}In Action

                    </h2>

                    <p className="text-zinc-400 mt-6 text-xl">

                        A single place to plan,
                        chat,
                        split expenses,
                        and travel together.

                    </p>

                </motion.div>

                <motion.div

                    whileHover={{
                        rotateX:6,
                        rotateY:-6,
                        scale:1.02
                    }}

                    transition={{
                        type:"spring",
                        stiffness:120
                    }}

                    className="
                        mt-20
                        rounded-[36px]
                        border
                        border-zinc-800
                        bg-gradient-to-br
                        from-zinc-900
                        to-zinc-950
                        p-10
                        shadow-[0_20px_80px_rgba(79,70,229,0.25)]
                    "

                >

                    <div className="flex justify-between items-center">

                        <h3 className="text-3xl font-bold">

                            Dashboard

                        </h3>

                        <span className="text-green-400">

                            ● Online

                        </span>

                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mt-10">

                        {

                            cards.map((card,index)=>(

                                <motion.div

                                    key={index}

                                    whileHover={{
                                        scale:1.04
                                    }}

                                    className="
                                        rounded-3xl
                                        bg-white/5
                                        p-6
                                        border
                                        border-zinc-800
                                    "

                                >

                                    <div className="text-indigo-500 text-3xl">

                                        {card.icon}

                                    </div>

                                    <h4 className="mt-4 text-xl font-semibold">

                                        {card.title}

                                    </h4>

                                    <p className="text-zinc-400 mt-2">

                                        {card.value}

                                    </p>

                                </motion.div>

                            ))

                        }

                    </div>

                </motion.div>

            </div>

        </section>

    );

};

export default ProductPreview;