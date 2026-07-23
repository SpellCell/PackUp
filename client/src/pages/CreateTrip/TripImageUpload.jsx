import { ImagePlus, X } from "lucide-react";
import { motion } from "framer-motion";

const TripImageUpload = ({ image, setImage }) => {

    const handleChange = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setImage(file);

    };

    return (

        <div>

            <label className="block text-sm font-medium text-zinc-300 mb-4">

                Cover Image

            </label>

            {

                image ?

                    <motion.div

                        initial={{ opacity: 0 }}

                        animate={{ opacity: 1 }}

                        className="relative rounded-3xl overflow-hidden border border-zinc-800"

                    >

                        <img

                            src={URL.createObjectURL(image)}

                            alt="preview"

                            className="w-full h-72 object-cover"

                        />

                        <button

                            type="button"

                            onClick={() => setImage(null)}

                            className="absolute top-4 right-4 bg-red-500 p-2 rounded-full"

                        >

                            <X size={18} />

                        </button>

                    </motion.div>

                    :

                    <label

                        className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-700 rounded-3xl h-72 cursor-pointer hover:border-indigo-500 transition"

                    >

                        <ImagePlus

                            size={50}

                            className="text-zinc-500"

                        />

                        <p className="mt-4 text-zinc-400">

                            Click to upload trip cover

                        </p>

                        <p className="text-xs text-zinc-600 mt-2">

                            PNG, JPG or WEBP

                        </p>

                        <input

                            type="file"

                            accept="image/*"

                            hidden

                            onChange={handleChange}

                        />

                    </label>

            }

        </div>

    );

};

export default TripImageUpload;