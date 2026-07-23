import { MapPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmptyState = () => {

    const navigate = useNavigate();

    return (

        <div className="
            rounded-3xl
            border
            border-dashed
            border-zinc-700
            bg-zinc-900
            p-16
            text-center
        ">

            <div className="
                mx-auto
                flex
                h-24
                w-24
                items-center
                justify-center
                rounded-full
                bg-indigo-500/10
                text-indigo-400
            ">

                <MapPlus size={42} />

            </div>

            <h2 className="mt-8 text-3xl font-bold">

                No Trips Yet

            </h2>

            <p className="mt-4 text-zinc-400 max-w-xl mx-auto">

                You haven't created or joined any trips yet.
                Start your first adventure and invite your friends to travel together.

            </p>

            <button

                onClick={() => navigate("/create-trip")}

                className="
                    mt-10
                    rounded-2xl
                    bg-indigo-600
                    px-8
                    py-4
                    font-semibold
                    hover:bg-indigo-500
                    transition
                "

            >

                Create Your First Trip

            </button>

        </div>

    );

};

export default EmptyState;