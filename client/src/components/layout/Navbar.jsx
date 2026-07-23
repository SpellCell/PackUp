import { motion } from "framer-motion";
import { FaMountain } from "react-icons/fa6";
import Button from "../ui/Button";

const Navbar = () => {

    return (

        <motion.nav

            initial={{ y: -80 }}

            animate={{ y: 0 }}

            transition={{ duration: 0.6 }}

            className="
                fixed
                top-0
                left-0
                right-0
                z-50
                backdrop-blur-xl
                bg-black/30
                border-b
                border-zinc-800
            "

        >

            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                <div className="flex items-center gap-3">

                    <FaMountain className="text-indigo-500 text-3xl"/>

                    <span className="text-2xl font-bold">

                        PackUP

                    </span>

                </div>

                <div className="hidden md:flex gap-8 text-zinc-300">

                    <a href="#features">Features</a>

                    <a href="#how">How It Works</a>

                    <a href="#about">About</a>

                </div>

                <div className="flex gap-3">

                    <Button variant="outline">

                        Login

                    </Button>

                    <Button>

                        Register

                    </Button>

                </div>

            </div>

        </motion.nav>

    );

};

export default Navbar;