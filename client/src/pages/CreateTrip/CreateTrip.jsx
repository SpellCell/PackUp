import { motion } from "framer-motion";
import AppLayout from "../../components/layout/AppLayout";
import TripForm from "./TripForm";

const CreateTrip = () => {

    return (

        <AppLayout>

            <motion.div

                initial={{ opacity: 0, y: 30 }}

                animate={{ opacity: 1, y: 0 }}

                transition={{ duration: 0.5 }}

                className="max-w-6xl mx-auto"

            >

                <div className="mb-10">

                    <h1 className="text-5xl font-bold">

                        ✈️ Create New Adventure

                    </h1>

                    <p className="text-zinc-400 mt-4 text-lg">

                        Fill in your trip details and find amazing travel partners.

                    </p>

                </div>

                <TripForm />

            </motion.div>

        </AppLayout>

    );

};

export default CreateTrip;