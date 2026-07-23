import { motion } from "framer-motion";
import tripTypes from "../../constants/tripTypes";

const icons = {
    Adventure: "🥾",
    "Road Trip": "🚗",
    Backpacking: "🎒",
    Camping: "🏕️",
    Trekking: "⛰️",
    Beach: "🏖️",
    Family: "👨‍👩‍👧",
    Business: "💼",
    Solo: "🧍",
    Other: "✨"
};

const TripTypeSelector = ({ value, onChange }) => {

    return (

        <div>

            <label className="block text-sm font-medium text-zinc-300 mb-4">

                Trip Type

            </label>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">

                {tripTypes.map((type) => {

                    const active = value === type;

                    return (

                        <motion.button
                            key={type}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            type="button"
                            onClick={() => onChange(type)}
                            className={`
                                rounded-2xl
                                border
                                p-5
                                transition-all
                                duration-300
                                ${
                                    active
                                        ? "border-indigo-500 bg-indigo-600/20 shadow-lg shadow-indigo-600/20"
                                        : "border-zinc-800 bg-zinc-900 hover:border-indigo-500"
                                }
                            `}
                        >

                            <div className="text-3xl">

                                {icons[type]}

                            </div>

                            <p className="mt-3 font-medium">

                                {type}

                            </p>

                        </motion.button>

                    );

                })}

            </div>

        </div>

    );

};

export default TripTypeSelector;