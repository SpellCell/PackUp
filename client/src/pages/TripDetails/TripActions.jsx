import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    UserPlus,
    LogOut,
    Pencil,
    Trash2,
    Loader2
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import {
    leaveTrip,
    deleteTrip
} from "../../api/tripApi";

const TripActions = ({ trip, refreshTrip }) => {

    const { user } = useAuth();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const isOwner =
        trip.createdBy?._id === user?._id;

    const isParticipant =
        trip.participants.some(
            participant => participant._id === user?._id
        );

    const handleLeave = async () => {

        try {

            setLoading(true);

            await leaveTrip(trip._id);

            await refreshTrip();

        }

        catch (error) {

            console.log(error);

            alert(

                error.response?.data?.message ||

                "Unable to leave trip."

            );

        }

        finally {

            setLoading(false);

        }

    };

    const handleDelete = async () => {

        const confirmDelete = window.confirm(

            "Delete this trip permanently?"

        );

        if (!confirmDelete) return;

        try {

            setLoading(true);

            await deleteTrip(trip._id);

            navigate("/dashboard");

        }

        catch (error) {

            console.log(error);

            alert(

                error.response?.data?.message ||

                "Unable to delete trip."

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <section>

            <h2 className="text-2xl font-bold mb-6">

                Trip Actions

            </h2>

            <div className="flex flex-wrap gap-4">

                {

                    isOwner ?

                    (

                        <>

                            <button

                                onClick={() =>

                                    navigate(`/edit-trip/${trip._id}`)

                                }

                                className="
                                    flex
                                    items-center
                                    gap-2
                                    rounded-2xl
                                    bg-indigo-600
                                    hover:bg-indigo-500
                                    px-6
                                    py-4
                                    font-semibold
                                    transition
                                "

                            >

                                <Pencil size={18} />

                                Edit Trip

                            </button>

                            <button

                                disabled={loading}

                                onClick={handleDelete}

                                className="
                                    flex
                                    items-center
                                    gap-2
                                    rounded-2xl
                                    bg-red-600
                                    hover:bg-red-500
                                    px-6
                                    py-4
                                    font-semibold
                                    transition
                                "

                            >

                                {

                                    loading ?

                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />

                                    :

                                    <Trash2 size={18} />

                                }

                                Delete Trip

                            </button>

                        </>

                    )

                    :

                    isParticipant ?

                    (

                        <button

                            disabled={loading}

                            onClick={handleLeave}

                            className="
                                flex
                                items-center
                                gap-2
                                rounded-2xl
                                bg-red-600
                                hover:bg-red-500
                                px-8
                                py-4
                                font-semibold
                                transition
                            "

                        >

                            {

                                loading ?

                                <Loader2
                                    size={18}
                                    className="animate-spin"
                                />

                                :

                                <LogOut size={18} />

                            }

                            Leave Trip

                        </button>

                    )

                    :

                    (

                        <button

                            onClick={() => navigate("/join-trip")}

                            className="
                                flex
                                items-center
                                gap-2
                                rounded-2xl
                                bg-green-600
                                hover:bg-green-500
                                px-8
                                py-4
                                font-semibold
                                transition
                            "

                        >

                            <UserPlus size={18} />

                            Request to Join

                        </button>

                    )

                }

            </div>

            {

                !isOwner && !isParticipant && (

                    <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">

                        <h3 className="font-semibold">

                            This trip requires organizer approval

                        </h3>

                        <p className="text-zinc-400 mt-2">

                            Ask the organizer for the Trip Code and submit a join request.
                            You will become a participant only after the organizer approves your request.

                        </p>

                    </div>

                )

            }

        </section>

    );

};

export default TripActions;